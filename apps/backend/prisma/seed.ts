import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Maak een gebruiker aan
  const user = await prisma.user.create({
    data: {
      email: 'mathieu.kervyn@example.com',
      name: 'Mathieu Kervyn',
    },
  });

  // Maak een project aan
  const project = await prisma.project.create({
    data: {
      title: 'B-SaFFeR',
      userId: user.id,
      public: true,
    },
  });

  // Koppel de gebruiker aan het project als ADMIN
  await prisma.projectUser.create({
    data: {
      projectId: project.id,
      userId: user.id,
      role: 'ADMIN',
    },
  });

  // Maak een launchpad aan
  const launchpad = await prisma.launchpad.create({
    data: {
      projectId: project.id,
      preset: {},
    },
  });

  // Voeg een tegel toe aan het launchpad
  await prisma.tile.create({
    data: {
      title: 'Eerste tegel',
      description: 'Beschrijving van de eerste tegel',
      img: 'https://placehold.co/600x400',
      launchpadId: launchpad.id,
    },
  });

  // Voeg een dashboard toe
  await prisma.dashboard.create({
    data: {
      projectId: project.id,
      type: 'STANDARD',
      preset: {},
    },
  });

  // Voeg een device toe
  const device = await prisma.device.create({
    data: {
      name: 'Sensor 001',
      latitude: '51.2194',
      longitude: '4.4025',
      image: 'https://placehold.co/600x400',
      projectId: project.id,
      type: 'WIMV1',
      protocol: 'WIFI',
    },
  });

  // Voeg een video toe aan het device
  await prisma.video.create({
    data: {
      deviceId: device.id,
      videoUrl: 'https://example.com/video.mp4',
    },
  });

  console.log('Database seeding voltooid!');
}

main()
  .catch((error) => {
    console.error('Fout bij seeding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
