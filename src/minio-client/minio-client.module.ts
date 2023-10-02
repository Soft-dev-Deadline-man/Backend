import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MinioModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        endPoint: configService.get<string>('minio.endpoint'),
        port: configService.get<number>('minio.port'),
        useSSL: configService.get<boolean>('minio.useSSL'),
        accessKey: configService.get<string>('minio.accessKey'),
        secretKey: configService.get<string>('minio.secretKey'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
