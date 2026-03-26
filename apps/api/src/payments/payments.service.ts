import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.provider';
import { payments } from '../database/schema';
import { eq, desc, count, sql } from 'drizzle-orm';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly awsService: AwsService,
  ) {}

  async create(data: {
    amount: string;
    date: string;
    vendor: string;
    category: string;
    description?: string;
    source: 'manual' | 'upload' | 'both';
    status: 'pending' | 'processed' | 'error';
    file?: Express.Multer.File;
  }) {
    let documentUrl: string | undefined;
    let documentName: string | undefined;

    if (data.file) {
      documentName = data.file.originalname;
      const date = new Date();
      const path = `payments/${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      documentUrl = await this.awsService.uploadFile(data.file, path);
    }

    const [newPayment] = await this.drizzleService.db
      .insert(payments)
      .values({
        amount: data.amount,
        date: new Date(data.date),
        vendor: data.vendor,
        category: data.category,
        description: data.description,
        documentName,
        documentUrl,
        source: data.source,
        status: data.status,
      })
      .returning();

    return newPayment;
  }

  async findAll(options: { page: number; limit: number }) {
    const offset = (options.page - 1) * options.limit;

    const [totalRes] = await this.drizzleService.db
      .select({ count: count() })
      .from(payments);

    const data = await this.drizzleService.db
      .select()
      .from(payments)
      .orderBy(desc(payments.date))
      .limit(options.limit)
      .offset(offset);

    return {
      data,
      total: totalRes?.count ?? 0,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil((totalRes?.count ?? 0) / options.limit),
    };
  }
}
