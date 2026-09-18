import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  constructor(config: ConfigService) {
    this.s3 = new S3Client({ region: config.get("AWS_REGION", "ap-south-1") });
    this.bucket = config.getOrThrow<string>("PROFILE_ASSETS_BUCKET");
  }
  putPrivate(key: string, body: Uint8Array, contentType: string) {
    return this.s3.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: contentType, ServerSideEncryption: "aws:kms" }));
  }
  getPrivate(key: string) { return this.s3.send(new GetObjectCommand({ Bucket: this.bucket, Key: key })); }
}
