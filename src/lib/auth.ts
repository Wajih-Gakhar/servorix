import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'super-secret-key-for-salon-app';
const encodedKey = new TextEncoder().encode(secretKey);

const refreshSecretKey = process.env.JWT_REFRESH_SECRET || 'refresh-super-secret-key';
const encodedRefreshKey = new TextEncoder().encode(refreshSecretKey);

export async function signJWT(payload: any, expiresIn = '1h') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encodedKey);
}

export async function signRefreshToken(payload: any, expiresIn = '7d') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encodedRefreshKey);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedRefreshKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string, role: string, refreshTokenStr?: string) {
  const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour for access token
  const session = await signJWT({ userId, role, expiresAt });
  
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });

  if (refreshTokenStr) {
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    cookieStore.set('refresh_token', refreshTokenStr, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: refreshExpiresAt,
      sameSite: 'lax',
      path: '/',
    });
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  cookieStore.delete('refresh_token');
}

export async function getSession(): Promise<{ userId: string, role: string } | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  return (await verifyJWT(session)) as { userId: string, role: string } | null;
}
