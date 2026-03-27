import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

@Injectable()
export class DrizzleService {
  private pool: Pool;
  public db: ReturnType<typeof drizzle>;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASS || 'admin',
      database: process.env.DB_NAME! || 'hr',
    });

    this.db = drizzle(this.pool);
  }
}
