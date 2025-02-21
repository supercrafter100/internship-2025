import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { DevicesModule } from './devices/devices.module';
import { ProjectController } from './controllers/project/project.controller';
import { ProjectService } from './services/project/project.service';

@Module({
  imports: [PrismaModule, DevicesModule],
  controllers: [AppController, ProjectController],
  providers: [AppService, PrismaService, ProjectService],
})
export class AppModule {}
