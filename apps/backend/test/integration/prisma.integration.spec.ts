// test/integration/prisma.integration.spec.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Prisma integration test', () => {
  beforeAll(async () => {
    // Clear the database before running the tests
    await prisma.device.deleteMany({});
    await prisma.tile.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a user, a project, and a device', async () => {
    const user = await prisma.user.create({
      data: {
        providerId: 'google-oauth2|12345',
        email: 'testuser@example.com',
        name: 'Test User',
      },
    });

    const project = await prisma.project.create({
      data: {
        title: 'Waterdetectie B-SaFFeR',
        shortDescription: 'Testproject voor sensoren',
        userId: user.id,
        public: true,
        imgKey: 'project_image.jpg',
      },
    });

    const device = await prisma.device.create({
      data: {
        deviceType: 'sensor',
        projectId: project.id,
        name: 'Watermeter 1',
        description: 'Sensor op de Dijle',
        latitude: 50.8503,
        longitude: 4.3517,
        imgKey: 'sensor_image.jpg',
        createdByid: user.id,
      },
    });

    const fetchedDevice = await prisma.device.findUnique({
      where: { id: device.id },
      include: { project: true, createdBy: true },
    });

    expect(fetchedDevice?.name).toBe('Watermeter 1');
    expect(fetchedDevice?.project.title).toBe('Waterdetectie B-SaFFeR');
    expect(fetchedDevice?.createdBy?.email).toBe('testuser@example.com');
  });
});
