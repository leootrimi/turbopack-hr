import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { teams, employee, jobInfo, compensation, checkinLogs } from './schema';
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
        {
          name: 'Engineering Team',
          description: 'Handles all software development',
          team_type: 'Engineering',
        },
        {
          name: 'Operations Team',
          description: 'Manages operations and logistics',
          team_type: 'Operations',
        },
        {
          name: 'Marketing Team',
          description: 'Responsible for marketing campaigns',
          team_type: 'Marketing',
        },
        {
          name: 'HR Team',
          description: 'Handles human resources',
          team_type: 'HR',
        },
      ])
      .returning();

    const engineering = insertedTeams[0];
    const operations = insertedTeams[1];
    const marketing = insertedTeams[2];
    const hr = insertedTeams[3];

    console.log('🟢 Seeding Employees...');

    const insertedEmployees = await db
      .insert(employee)
      .values([
        {
          firstName: 'Alice',
          lastName: 'Johnson',
          email: 'alice@gmail.com',
          phone: '555-1111',
          personalNumber: 'PN-001',
          address: '123 Engineering St',
          emergencyContact: 'John Johnson',
        },
        {
          firstName: 'Bob',
          lastName: 'Smith',
          email: 'bob@gmail.com',
          phone: '555-2222',
          personalNumber: 'PN-002',
          address: '456 Operations Ave',
          emergencyContact: 'Anna Smith',
        },
        {
          firstName: 'Carol',
          lastName: 'Williams',
          email: 'carol@gmail.com',
          phone: '555-3333',
          personalNumber: 'PN-003',
          address: '789 Marketing Blvd',
          emergencyContact: 'Mark Williams',
        },
        {
          firstName: 'Dave',
          lastName: 'Brown',
          email: 'dave@gmail.com',
          phone: '555-4444',
          personalNumber: 'PN-004',
          address: '101 HR Road',
          emergencyContact: 'Sarah Brown',
        },
      ])
      .returning();

    const alice = insertedEmployees[0];
    const bob = insertedEmployees[1];
    const carol = insertedEmployees[2];
    const dave = insertedEmployees[3];

    console.log('🟢 Seeding Job Info...');

    await db.insert(jobInfo).values([
      {
        employeeId: alice.id,
        jobTitle: 'Software Engineer',
        department: 'Engineering',
        teamId: engineering.id,
        employmentType: 'Full-time',
        startDate: new Date(),
        workLocation: 'Office',
      },
      {
        employeeId: bob.id,
        jobTitle: 'Operations Manager',
        department: 'Operations',
        teamId: operations.id,
        employmentType: 'Full-time',
        startDate: new Date(),
        workLocation: 'Hybrid',
      },
      {
        employeeId: carol.id,
        jobTitle: 'Marketing Specialist',
        department: 'Marketing',
        teamId: marketing.id,
        employmentType: 'Full-time',
        startDate: new Date(),
        workLocation: 'Remote',
      },
      {
        employeeId: dave.id,
        jobTitle: 'HR Manager',
        department: 'HR',
        teamId: hr.id,
        employmentType: 'Full-time',
        startDate: new Date(),
        workLocation: 'Office',
      },
    ]);

    console.log('🟢 Seeding Compensation...');

    await db.insert(compensation).values([
      {
        employeeId: alice.id,
        salaryAmount: 4500,
        salaryType: 'Gross',
        currency: 'EUR',
        paymentFrequency: 'Monthly',
        bankAccount: 'DE123456789',
        bonusEligible: true,
      },
      {
        employeeId: bob.id,
        salaryAmount: 5000,
        salaryType: 'Gross',
        currency: 'EUR',
        paymentFrequency: 'Monthly',
        bankAccount: 'DE987654321',
        bonusEligible: true,
      },
      {
        employeeId: carol.id,
        salaryAmount: 4000,
        salaryType: 'Gross',
        currency: 'EUR',
        paymentFrequency: 'Monthly',
        bankAccount: 'DE111111111',
        bonusEligible: false,
      },
      {
        employeeId: dave.id,
        salaryAmount: 4800,
        salaryType: 'Gross',
        currency: 'EUR',
        paymentFrequency: 'Monthly',
        bankAccount: 'DE222222222',
        bonusEligible: true,
      },
    ]);

    console.log('🟢 Updating Team Leaders...');

    await Promise.all([
      db
        .update(teams)
        .set({ leaderId: alice.id })
        .where(eq(teams.id, engineering.id)),
      db
        .update(teams)
        .set({ leaderId: bob.id })
        .where(eq(teams.id, operations.id)),
      db
        .update(teams)
        .set({ leaderId: carol.id })
        .where(eq(teams.id, marketing.id)),
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
    throw err;
  } finally {
    await pool.end();
  }
}

seed().catch(() => process.exit(1));
