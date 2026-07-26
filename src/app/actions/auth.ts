'use server'

import { prisma } from '@/lib/prisma'
import { createSession, deleteSession, getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

function isPasswordValid(password: string): { isValid: boolean; message?: string } {
  if (password.length < 8) return { isValid: false, message: 'Password must be at least 8 characters long.' }
  if (!/[A-Z]/.test(password)) return { isValid: false, message: 'Password must contain at least one uppercase letter.' }
  if (!/[a-z]/.test(password)) return { isValid: false, message: 'Password must contain at least one lowercase letter.' }
  if (!/[0-9]/.test(password)) return { isValid: false, message: 'Password must contain at least one number.' }
  return { isValid: true }
}

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const role = (formData.get('role') as string) || 'CUSTOMER'

  if (!email || !password || !name) {
    return { error: 'Please provide all required fields' }
  }

  const pwdCheck = isPasswordValid(password)
  if (!pwdCheck.isValid) {
    return { error: pwdCheck.message }
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return { error: 'User with this email already exists' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    })
    
    // Import signRefreshToken dynamically or assure it's in scope. We need it from @/lib/auth
    const { signRefreshToken } = await import('@/lib/auth');
    const refreshToken = await signRefreshToken({ userId: user.id });
    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken, refreshTokenExpiry: refreshExpiry }
    });

    await createSession(user.id, user.role, refreshToken)
    return { success: true, user: { id: user.id, name: user.name, role: user.role } }
  } catch (err) {
    console.error(err)
    return { error: 'Failed to register user' }
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Please provide email and password' }
  }

  const user = await prisma.user.findUnique({ where: { email } })
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: 'Invalid email or password' }
  }

  const { signRefreshToken } = await import('@/lib/auth');
  const refreshToken = await signRefreshToken({ userId: user.id });
  const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken, refreshTokenExpiry: refreshExpiry }
  });

  await createSession(user.id, user.role, refreshToken)
  return { success: true, user: { id: user.id, name: user.name, role: user.role } }
}

export async function logoutUser() {
  await deleteSession()
  return { success: true }
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get('email') as string
  if (!email) return { error: 'Please submit a valid email address.' }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    // Return success to explicitly prevent email enumeration dictionary attacks!
    return { success: true, mockToken: null } 
  }

  const token = crypto.randomUUID()
  const expiry = new Date(Date.now() + 3600000) // 1 Hour lifespan

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiry: expiry }
  })

  return { success: true, mockToken: token }
}

export async function executePasswordReset(formData: FormData) {
  const actualToken = formData.get('token') as string
  const password = formData.get('password') as string

  if (!actualToken || !password) return { error: 'Invalid payload execution.' }

  const pwdCheck = isPasswordValid(password)
  if (!pwdCheck.isValid) {
    return { error: pwdCheck.message }
  }

  const user = await prisma.user.findFirst({
    where: { 
      resetToken: actualToken,
      resetTokenExpiry: { gt: new Date() } // Must mathematically not be expired!
    }
  })

  if (!user) return { error: 'Reset token is invalid or has expired.' }

  const hashedPassword = await bcrypt.hash(password, 10)

  // Decouple the reset tokens safely while mutating the master hash
  await prisma.user.update({
    where: { id: user.id },
    data: { 
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    }
  })

  return { success: true }
}

export async function changePassword(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized. Please log in.' }

  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'Please provide all password fields.' }
  }

  if (newPassword !== confirmPassword) {
    return { error: 'New password and confirmation do not match.' }
  }

  const pwdCheck = isPasswordValid(newPassword)
  if (!pwdCheck.isValid) {
    return { error: pwdCheck.message }
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!user) return { error: 'User not found.' }

  const isOldPasswordCorrect = await bcrypt.compare(currentPassword, user.password)
  if (!isOldPasswordCorrect) {
    return { error: 'Standard authentication failed. Current password is incorrect.' }
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: session.userId },
    data: { password: newHashedPassword }
  })

  return { success: true }
}

export async function refreshTokens() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const refreshTokenStr = cookieStore.get('refresh_token')?.value;

  if (!refreshTokenStr) return { error: 'No refresh token available' };

  const { verifyRefreshToken, signRefreshToken, createSession } = await import('@/lib/auth');
  const payload = await verifyRefreshToken(refreshTokenStr);
  
  if (!payload || !payload.userId) return { error: 'Invalid or expired refresh token' };

  const user = await prisma.user.findUnique({ where: { id: payload.userId as string } });
  
  if (!user || user.refreshToken !== refreshTokenStr || !user.refreshTokenExpiry || user.refreshTokenExpiry < new Date()) {
    return { error: 'Refresh token invalid or revoked' };
  }

  const newRefreshToken = await signRefreshToken({ userId: user.id });
  const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: newRefreshToken, refreshTokenExpiry: refreshExpiry }
  });

  await createSession(user.id, user.role, newRefreshToken);
  return { success: true };
}
