import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password: 'demo1234',
      name: 'Admin',
    },
  });

  // Create demo customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'John Smith',
      email: 'john@example.com',
      phoneNumber: '+1234567890',
      addressStreet: '123 Main Street',
      buildingNumber: 'Suite 4',
      country: 'USA',
      status: 'active',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Sara Khan',
      email: 'sara@example.com',
      phoneNumber: '+9876543210',
      addressStreet: '456 Oak Avenue',
      country: 'Pakistan',
      status: 'active',
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      name: 'Ali Hassan',
      email: 'ali@example.com',
      phoneNumber: '+447911123456',
      addressStreet: '789 Baker Street',
      buildingNumber: 'Flat 2B',
      country: 'UK',
      status: 'active',
    },
  });

  // Create demo items
  await prisma.item.createMany({
    data: [
      { name: 'Web Design', description: 'Custom website design', price: 500, unit: 'project' },
      { name: 'Logo Design', description: 'Brand logo creation', price: 150, unit: 'project' },
      { name: 'Consulting', description: 'Hourly consultation', price: 75, unit: 'hour' },
    ],
  });

  // Create demo invoices
  await prisma.invoice.createMany({
    data: [
      { customerId: customer1.id, status: 'paid', total: 500 },
      { customerId: customer2.id, status: 'pending', total: 150 },
      { customerId: customer3.id, status: 'draft', total: 225 },
    ],
  });

  console.log('Demo data seeded successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());