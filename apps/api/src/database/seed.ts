import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { teams, employee, checkinLogs } from './schema';
import { eq } from 'drizzle-orm';

async function seed() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASS || 'admin',
    database: process.env.DB_NAME || 'hr',
  });

  const db = drizzle(pool);

  try {
    console.log('🟢 Seeding Teams...');

    const insertedTeams = await db
      .insert(teams)
      .values([
        { name: 'Engineering Team', description: 'Handles all software development', team_type: 'Engineering' },
        { name: 'Operations Team', description: 'Manages operations and logistics', team_type: 'Operations' },
        { name: 'Marketing Team', description: 'Responsible for marketing campaigns', team_type: 'Marketing' },
        { name: 'HR Team', description: 'Handles human resources', team_type: 'HR' },
      ])
      .returning(); // Returns full inserted rows including 'id'

    // Safely extract teams by name or index (index is safe here since we control order)
    const engineering = insertedTeams[0]
    const operations = insertedTeams[1]
    const marketing = insertedTeams[2]
    const hr = insertedTeams[3]

    console.log('🟢 Seeding Employees...');

    const insertedEmployees = await db
      .insert(employee)
      .values([
        {
          name: 'Alice Johnson',
          email: 'alice@gmail.com',
          work_email: 'alice@company.com',
          phone: '555-1111',
          teamId: engineering.id,
        },
        {
          name: 'Bob Smith',
          email: 'bob@gmail.com',
          work_email: 'bob@company.com',
          phone: '555-2222',
          teamId: operations.id,
        },
        {
          name: 'Carol Williams',
          email: 'carol@gmail.com',
          work_email: 'carol@company.com',
          phone: '555-3333',
          teamId: marketing.id,
        },
        {
          name: 'Dave Brown',
          email: 'dave@gmail.com',
          work_email: 'dave@company.com',
          phone: '555-4444',
          teamId: hr.id,
        },
      ])
      .returning();

    const alice = insertedEmployees[0];
    const bob = insertedEmployees[1];
    const carol = insertedEmployees[2];
    const dave = insertedEmployees[3];

    console.log('🟢 Updating team leaders...');

    await Promise.all([
      db.update(teams).set({ leaderId: alice.id }).where(eq(teams.id, engineering.id)),
      db.update(teams).set({ leaderId: bob.id }).where(eq(teams.id, operations.id)),
      db.update(teams).set({ leaderId: carol.id }).where(eq(teams.id, marketing.id)),
      db.update(teams).set({ leaderId: dave.id }).where(eq(teams.id, hr.id)),
    ]);

    console.log('🟢 Seeding Check-in Logs...');

    await db.insert(checkinLogs).values([
      { employeeId: alice.id, checkinTime: new Date('2025-12-27T08:00:00Z') },
      { employeeId: bob.id, checkinTime: new Date('2025-12-27T08:15:00Z') },
      { employeeId: carol.id, checkinTime: new Date('2025-12-27T08:30:00Z') },
      { employeeId: dave.id, checkinTime: new Date('2025-12-27T09:00:00Z') },
    ]);

    console.log('✅ Seeding complete!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    throw err; // Re-throw to ensure process exits with error code
  } finally {
    await pool.end();
  }
}

seed().catch(() => process.exit(1));