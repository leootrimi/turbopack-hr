import "dotenv/config";
import { Client } from "pg";
import { execSync } from "child_process";

async function resetDb() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  console.log("🧨 Dropping public schema...");
  await client.query(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
  `);

  await client.end();

  console.log("📦 Running migrations...");
  execSync("pnpm drizzle-kit migrate", { stdio: "inherit" });

  console.log("✅ Database reset complete");
}

resetDb().catch((err) => {
  console.error("❌ DB reset failed", err);
  process.exit(1);
});
