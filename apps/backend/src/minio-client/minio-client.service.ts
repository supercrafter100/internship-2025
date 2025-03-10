import { Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { config } from './config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MinioClientService {
  public get client() {
    return this.minio.client;
  }

  constructor(private readonly minio: MinioService) {}

  public async uploadBase64Image(image: string) {
    const buffer = Buffer.from(image.split(',')[1], 'base64');
    const key = `projects/${uuid()}.jpg`;

    await this.client.putObject(config.MINIO_BUCKET, key, buffer);
    return key;
  }
}
