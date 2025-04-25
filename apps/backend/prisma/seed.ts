import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { randomBytes } from 'crypto';

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
          appId: 'zanzibar-24',
          apiKey:
            'NNSXS.QUZ7SL2PBLPCMWGVSHQDM2KQ4U5BCJC3OF4VK6Q.I6VCSRFZUQSOER3P7AYFGXUK4AF5AEINTZEOE4IFGBEKGMNY73OQ',
          createdByid: mathieu.id,
        },
      },
    },
    include: {
      TtnProvider: true,
    },
  });

  const ttnProvider = project.TtnProvider[0];

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
  const allProjects = await prisma.project.findMany({
    select: { id: true, TtnProvider: { select: { id: true } } },
  });

  await Promise.all(
    Array.from({ length: 150 }).map(async () => {
      const selectedProject = faker.helpers.arrayElement(allProjects);
      const user = faker.helpers.arrayElement(createdUsers);

      const device = await prisma.device.create({
        data: {
          name: faker.commerce.productName(),
          latitude: parseFloat(
            faker.number
              .float({ min: -90, max: 90, fractionDigits: 3 })
              .toFixed(3),
          ),
          longitude: parseFloat(
            faker.number
              .float({ min: -180, max: 180, fractionDigits: 3 })
              .toFixed(3),
          ),
          imgKey: faker.image.urlPicsumPhotos(),
          deviceType: faker.helpers.arrayElement(['sensor', 'camera']),
          projectId: selectedProject.id,
          description: faker.lorem.sentence(),
          createdByid: user.id,
        },
      });

      // deviceParameters
      const paramCount = faker.number.int({ min: 1, max: 5 });
      await Promise.all(
        Array.from({ length: paramCount }).map(() =>
          prisma.deviceParameters.create({
            data: {
              deviceId: device.id,
              name: faker.hacker.noun(),
              description: faker.lorem.sentence(),
            },
          }),
        ),
      );

      // Video
      const videoCount = faker.number.int({ min: 0, max: 3 });
      await Promise.all(
        Array.from({ length: videoCount }).map(() =>
          prisma.video.create({
            data: {
              deviceId: device.id,
              videoUrl: faker.internet.url(),
              recordedAt: faker.date.recent(),
            },
          }),
        ),
      );

      // TtnDeviceDetail
      if (Math.random() > 0.5 && selectedProject.TtnProvider.length > 0) {
        const ttnProvider = faker.helpers.arrayElement(
          selectedProject.TtnProvider,
        );
        await prisma.ttnDeviceDetail.create({
          data: {
            deviceId: device.id,
            ttnProviderId: ttnProvider.id,
            ttnDeviceId: faker.string.alphanumeric(16),
          },
        });
      }
    }),
  );

  console.log('Seeding completed.');
}

function generateKey() {
  return randomBytes(32).toString('hex').substring(0, 16);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
