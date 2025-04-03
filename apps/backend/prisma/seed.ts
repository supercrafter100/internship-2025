import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  // Create random users

  console.log('Creating users...');
  for (let i = 0; i < 50; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        providerId: faker.string.nanoid(),
      },
    });
  }

  // Maak een specifieke gebruiker aan
  const user = await prisma.user.create({
    data: {
      email: 'mathieu.kervyn@example.com',
      name: 'Mathieu Kervyn',
      providerId: 'dzadazdazdazdaz',
    },
  });

  console.log('Creating projects');
  // Maak een project aan
  const project = await prisma.project.create({
    data: {
      title: 'B-SaFFeR',
      userId: user.id,
      public: true,
      imgKey:
        'https://www.regenwoudredden.org/photos/article/facebook/fb/nl/murchinson-falls-uganda-1.jpg',
      shortDescription: 'Beschrijving van het project',
    },
  });

  for (let i = 0; i < 50; i++) {
    await prisma.project.create({
      data: {
        title: faker.company.name(),
        userId: Math.floor(Math.random() * 50) + 1,
        public: Math.random() > 0.5,
        imgKey: faker.image.urlPicsumPhotos(),
        shortDescription: faker.lorem.sentence(),
      },
    });
  }

  // Koppel de gebruiker aan het project als ADMIN
  await prisma.projectUser.create({
    data: {
      projectId: project.id,
      userId: user.id,
      admin: true,
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
      imgKey: 'https://placehold.co/600x400',
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

  console.log('Adding devices');
  // Voeg een device toe
  for (let i = 0; i < 150; i++) {
    await prisma.device.create({
      data: {
        name: faker.commerce.productName(),
        latitude: faker.location.latitude().toString(),
        longitude: faker.location.longitude().toString(),
        imgKey: faker.image.urlPicsumPhotos(),
        deviceType: 'WIMV1',
        projectId: Math.floor(Math.random() * 50) + 1,
        description: faker.lorem.sentence(),
        deviceParameters: {
          create: [
            {
              name: 'Parameter 1',
              description: 'Description for parameter 1',
            },
            {
              name: 'Parameter 2',
              description: 'Description for parameter 2',
            },
          ],
        },
      },
    });
  }

  const device = await prisma.device.create({
    data: {
      name: 'Sensor 001',
      latitude: '51.2194',
      longitude: '4.4025',
      imgKey: 'https://placehold.co/600x400',
      projectId: project.id,
      deviceType: 'Sensor',
      description: 'Eerste sensor',
      deviceParameters: {
        create: [
          {
            name: 'Temperatuur',
            description: 'Temperatuur in graden Celsius',
          },
          {
            name: 'Luchtvochtigheid',
            description: 'Luchtvochtigheid in procent',
          },
        ],
      },
    },
  });

  // Voeg API sleutels toe
  for (let i = 0; i < 50; i++) {
    await prisma.apiKey.create({
      data: {
        projectId: Math.floor(Math.random() * 50) + 1,
        name: faker.hacker.adjective(),
        key: generateKey(),
      },
    });
  }

  // Voeg een video toe aan het device
  await prisma.video.create({
    data: {
      deviceId: device.id,
      videoUrl: 'https://example.com/video.mp4',
    },
  });

  console.log('Database seeding voltooid!');
}

function generateKey() {
  return randomBytes(32).toString('hex').substring(0, 16);
}

main()
  .catch((error) => {
    console.error('Fout bij seeding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
