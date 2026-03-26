import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class AwsService {
  private s3Client: S3Client;
  private readonly bucketName = 'hr-tool-uploads';

  constructor() {
    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: 'http://localhost:4566',
      forcePathStyle: true,
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });
  }

  async uploadFile(file: Express.Multer.File, path?: string): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const key = path ? `${path}/${fileName}` : fileName;
    
    const parallelUploads3 = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    });

    await parallelUploads3.done();

    // Return the URL (LocalStack style)
    return `http://localhost:4566/${this.bucketName}/${key}`;
  }
}
