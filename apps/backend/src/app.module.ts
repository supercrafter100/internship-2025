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
import { APP_GUARD } from '@nestjs/core'; //its opsional to global level authentication guard
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { KeycloakConfigService } from './keycloak/config/keycloak-config.service';

@Module({
  imports: [PrismaModule, InfluxdbModule, MinioClientModule],
  controllers: [AppController, ProjectController, DevicesController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard, //By default, it will throw a 401 unauthorized when it is unable to verify the JWT token or Bearer header is missing.
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard, //Only controllers annotated with @Resource and methods with @Scopes are handled by this guard
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard, //Permissive by default. Used by controller methods annotated with @Roles
    },
    AppService,
    PrismaService,
    ProjectService,
    DeviceService,
  ],
})
export class AppModule {}
