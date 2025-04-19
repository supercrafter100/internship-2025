import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
// Removed unused import

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Users
  console.log('Creating users...');
  const createdUsers = await Promise.all(
    Array.from({ length: 50 }).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email().toLowerCase(),
          name: faker.person.fullName(),
          providerId: faker.string.nanoid(),
        },
      }),
    ),
  );

  // Specifieke user
  const mathieu = await prisma.user.create({
    data: {
      email: 'mathieu.kervyn@example.com',
      name: 'Mathieu Kervyn',
      providerId: 'dzadazdazdazdaz',
    },
  });

  // Project
  console.log('Creating project...');
  const project = await prisma.project.create({
    data: {
      title: 'B-SaFFeR',
      userId: mathieu.id,
      public: true,
      imgKey:
        'https://www.regenwoudredden.org/photos/article/facebook/fb/nl/murchinson-falls-uganda-1.jpg',
      shortDescription: 'Beschrijving van het project',
      TtnProvider: {
        create: {
          appUrl: 'https://eu1.cloud.thethings.network',
          appId: 'bsaffer-app',
          apiKey: 'ttn-api-key-bsaffer',
        },
      },
    },
  });

  // ProjectUser koppeling
  await prisma.projectUser.create({
    data: {
      projectId: project.id,
      userId: mathieu.id,
      admin: true,
    },
  });

  // Extra projecten
  console.log('Creating extra projects...');
  await Promise.all(
    Array.from({ length: 50 }).map(() => {
      const user = faker.helpers.arrayElement(createdUsers);
      return prisma.project.create({
        data: {
          title: faker.company.name(),
          userId: user.id,
          public: faker.datatype.boolean(),
          imgKey: faker.image.urlPicsumPhotos(),
          shortDescription: faker.lorem.sentence(),
        },
      });
    }),
  );

  // Launchpad en tegel
  const launchpad = await prisma.launchpad.create({
    data: {
      projectId: project.id,
      preset: {},
    },
  });

  await prisma.tile.create({
    data: {
      title: 'Eerste tegel',
      description: 'Beschrijving van de eerste tegel',
      imgKey: 'https://placehold.co/600x400',
      launchpadId: launchpad.id,
    },
  });

  // Dashboard
  await prisma.dashboard.create({
    data: {
      projectId: project.id,
      type: 'STANDARD',
      preset: {},
    },
  });

  // Devices
  console.log('Adding devices...');
  const projectIds = (
    await prisma.project.findMany({ select: { id: true } })
  ).map((p) => p.id);

  await Promise.all(
    Array.from({ length: 150 }).map(async () => {
      const projectId = faker.helpers.arrayElement(projectIds);
      const device = await prisma.device.create({
        data: {
          name: faker.commerce.productName(),
          latitude: faker.number.float({
            min: -90,
            max: 90,
            fractionDigits: 4,
          }),
          longitude: faker.number.float({
            min: -180,
            max: 180,
            fractionDigits: 4,
          }),
          imgKey: faker.image.urlPicsumPhotos(),
          deviceType: 'WIMV1',
          projectId,
          description: faker.lorem.sentence(),
        },
      });

      // DeviceParameters
      await prisma.deviceParameters.createMany({
        data: [
          {
            deviceId: device.id,
            name: 'Parameter 1',
            description: 'Description for parameter 1',
          },
          {
            deviceId: device.id,
            name: 'Parameter 2',
            description: 'Description for parameter 2',
          },
        ],
      });

      // TTN detail
      await prisma.ttnDeviceDetail.create({
        data: {
          deviceId: device.id,
        },
      });
    }),
  );

  // Eén speciale sensor
  await prisma.device.create({
    data: {
      id: 'special-device-uuid',
      name: 'Speciale Sensor',
      latitude: 51.2194,
      longitude: 4.4025,
      imgKey: 'https://placehold.co/600x400',
      deviceType: 'WIMV1',
      projectId: project.id,
      description: 'Deze sensor meet extra parameters.',
      deviceParameters: {
        create: [
          {
            name: 'Waterstand',
            description: 'Gemeten in cm',
          },
          {
            name: 'Temperatuur',
            description: 'Gemeten in °C',
          },
        ],
      },
      videos: {
        create: [
          {
            videoUrl: 'https://example.com/video.mp4',
          },
        ],
      },
      TtnDeviceDetail: {
        create: {},
      },
    },
  });

  console.log('Seeding complete.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
