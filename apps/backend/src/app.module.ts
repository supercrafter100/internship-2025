import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

import { ProjectController } from './controllers/project/project.controller';
import { ProjectService } from './services/project/project.service';
import { MinioClientModule } from './minio-client/minio-client.module';
import { InfluxdbModule } from './influxdb/influxdb.module';
import { DevicesController } from './controllers/device/devices.controller';
import { DeviceService } from './services/device/device.service';
import { AuthModule } from './auth/auth.module';
import { UserService } from './services/user/user.service';
import { UserController } from './controllers/user/user.controller';
import { ApikeyController } from './controllers/apikey/apikey.controller';
import { ApikeyService } from './services/apikey/apikey.service';

@Module({
  imports: [PrismaModule, InfluxdbModule, MinioClientModule, AuthModule],
  controllers: [
    AppController,
    ProjectController,
    DevicesController,
    UserController,
    ApikeyController,
  ],
  providers: [
    AppService,
    PrismaService,
    ProjectService,
    DeviceService,
    UserService,
    ApikeyService,
  ],
})
export class AppModule {}
