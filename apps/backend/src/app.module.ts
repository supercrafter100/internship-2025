import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

import { ProjectController } from './controllers/project/project.controller';
import { ProjectService } from './services/project/project.service';
import { MinioClientModule } from './minio-client/minio-client.module';
import { InfluxdbModule } from './influxdb/influxdb.module';

@Module({
  imports: [PrismaModule, InfluxdbModule, MinioClientModule],
  controllers: [AppController, ProjectController],
  providers: [AppService, PrismaService, ProjectService],
})
export class AppModule {}
