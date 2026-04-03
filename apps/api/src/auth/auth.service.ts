import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as bcrypt from 'bcrypt';
import * as schema from '../database/schema';
import { DrizzleService } from '../database/drizzle.provider';

@Injectable()
export class AuthService {
  constructor(
    private drizzleService: DrizzleService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const userRecords = await this.drizzleService.db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        passwordHash: schema.users.passwordHash,
        role: schema.users.role,
        firstName: schema.employee.firstName,
        lastName: schema.employee.lastName,
      })
      .from(schema.users)
      .leftJoin(schema.employee, eq(schema.users.employeeId, schema.employee.id))
      .where(eq(schema.users.email, email))
      .limit(1);
    const user = userRecords[0];

    if (user && user.passwordHash) {
      const isMatch = await bcrypt.compare(pass, user.passwordHash);
      if (isMatch) {
        const { passwordHash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const fullName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : undefined;
    const payload = { email: user.email, sub: user.id, role: user.role, fullName };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newPayload = {
        email: payload.email,
        sub: payload.sub,
        role: payload.role,
        fullName: payload.fullName,
      };
      return {
        access_token: this.jwtService.sign(newPayload, { expiresIn: '15m' }),
        refresh_token: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
      };
    } catch (e) {
      return null;
    }
  }
}
