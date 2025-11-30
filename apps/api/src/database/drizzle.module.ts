import { Module } from "@nestjs/common";
import { DrizzleService } from "./drizzle.provider";

@Module({
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DrizzleModule {}
