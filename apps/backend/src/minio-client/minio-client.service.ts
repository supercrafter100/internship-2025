import { Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { config } from './config';
import { v4 as uuid } from 'uuid';

type MinioFile = {
  name: string;
  size: number;
};

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

  public async uploadDeviceBase64Image(image: string) {
    const buffer = Buffer.from(image.split(',')[1], 'base64');
    const key = `devices/${uuid()}.jpg`;

    await this.client.putObject(config.MINIO_BUCKET, key, buffer);
    return key;
  }

  public async listFiles(directory: string): Promise<MinioFile[]> {
    const stream = this.client.listObjectsV2(
      config.MINIO_BUCKET,
      directory,
      true,
    );
    const files: MinioFile[] = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => {
        if (obj.name) {
          files.push({
            name: obj.name,
            size: obj.size,
          });
        }
      });
      stream.on('error', (err) => {
        reject(err);
      });
      stream.on('end', () => {
        resolve(files);
      });
    });
  }

  public async removeFile(key: string): Promise<void> {
    await this.client.removeObject(config.MINIO_BUCKET, key);
  }
}
