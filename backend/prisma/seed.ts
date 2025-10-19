import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with fake tasks...');

  const TOTAL_TASKS = 100;

  const statuses = ['pending', 'in_progress', 'completed'];

  const tasks = Array.from({ length: TOTAL_TASKS }).map(() => ({
    title: faker.lorem.sentence({ min: 3, max: 6 }),
    description: faker.lorem.paragraph({ min: 1, max: 3 }),
    status: faker.helpers.arrayElement(statuses),
  }));

  await prisma.task.createMany({
    data: tasks,
  });

  console.log(`Successfully created ${TOTAL_TASKS} fake tasks!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
