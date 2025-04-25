import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioModule } from 'nestjs-minio-client';
import { config } from './config';

@Module({
  exports: [MinioClientService],
  providers: [MinioClientService],
  imports: [
    MinioModule.register({
      endPoint: config.MINIO_ENDPOINT,
      useSSL: true,
      accessKey: config.MINIO_ACCESSKEY,
      secretKey: config.MINIO_SECRETKEY,
    }),
  ],
})
export class MinioClientModule {}
