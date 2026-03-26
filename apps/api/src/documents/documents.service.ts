import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.provider';
import { documents } from '../database/schema';
import { eq, and, desc } from 'drizzle-orm';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly awsService: AwsService,
  ) {}

  async upload(
    employeeId: number,
    file: Express.Multer.File,
    category: 'contracts' | 'health' | 'additional' | 'other',
  ) {
    const path = `employees/${employeeId}/${category}`;
    const url = await this.awsService.uploadFile(file, path);

    const [newDoc] = await this.drizzleService.db
      .insert(documents)
      .values({
        employeeId,
        name: file.originalname,
        type: file.mimetype.split('/')[1]?.toUpperCase() || 'FILE',
        size: this.formatBytes(file.size),
        url,
        category,
      })
      .returning();

    return newDoc;
  }

  async findByEmployee(employeeId: number, category?: string) {
    const filters = [eq(documents.employeeId, employeeId)];
    if (category && category !== 'all') {
      filters.push(eq(documents.category, category as any));
    }

    return this.drizzleService.db
      .select()
      .from(documents)
      .where(and(...filters))
      .orderBy(desc(documents.createdAt));
  }

  async remove(id: number) {
    return this.drizzleService.db
      .delete(documents)
      .where(eq(documents.id, id))
      .returning();
  }

  private formatBytes(bytes: number, decimals = 1) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
