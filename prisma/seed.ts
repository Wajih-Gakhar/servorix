import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Starting Seeding...');

  // 1. Seed Categories
  const categories = [
    { name: 'Barbershop', icon: '💈', description: 'Precision cuts' },
    { name: 'Hair Salon', icon: '✂️', description: 'Styling & color' },
    { name: 'Spa & Massage', icon: '💆‍♀️', description: 'Relaxation' },
    { name: 'Nail Studio', icon: '💅', description: 'Manicures & Pedicures' },
    { name: 'CrossFit', icon: '🏋️‍♂️', description: 'Functional training' },
    { name: 'Yoga Studio', icon: '🧘‍♀️', description: 'Core & mindfulness' },
    { name: 'Boxing', icon: '🥊', description: 'Combat sports' },
    { name: 'Personal Training', icon: '💪', description: 'Performance coaching' },
  ];

  console.log('📦 Seeding Categories...');
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat,
    });
  }

  // 2. Seed Admin User
  console.log('👤 Seeding Admin User...');
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@servorix.com' },
    update: {},
    create: {
      email: 'admin@servorix.com',
      password: adminPassword,
      name: 'Global Administrator',
      role: 'ADMIN',
    },
  });

  // 3. Seed test Customer
  console.log('👤 Seeding Test Customer...');
  const customerPassword = await bcrypt.hash('User@123', 10);
  await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      email: 'customer@test.com',
      password: customerPassword,
      name: 'Test Customer',
      role: 'CUSTOMER',
    },
  });

  console.log('✅ Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
