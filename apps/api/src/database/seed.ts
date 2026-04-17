import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';
import {
  teams,
  employee,
  jobInfo,
  compensation,
  checkinLogs,
  purchaseInfo,
  equipment,
  users,
  announcements,
  timeOffBalance,
  meetings,
  meetingParticipants,
  leaveRequests,
  documents,
  payments,
  jobs,
  timeOffTypes,
  jobApplications,
} from './schema';
import { eq } from 'drizzle-orm';

// Helper function to calculate dates relative to now
const getDateWithOffset = (dayOffset: number, hours = 0, minutes = 0): Date => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
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

    console.log('🟢 Seeding Users...');

    const passwordHash = await bcrypt.hash('password123', 10);

    await db.insert(users).values([
      {
        employeeId: alice.id,
        email: alice.email,
        passwordHash,
        role: 'admin',
        isActive: true,
      },
      {
        employeeId: bob.id,
        email: bob.email,
        passwordHash,
        role: 'employee',
        isActive: true,
      },
      {
        employeeId: carol.id,
        email: carol.email,
        passwordHash,
        role: 'employee',
        isActive: true,
      },
      {
        employeeId: dave.id,
        email: dave.email,
        passwordHash,
        role: 'hr',
        isActive: true,
      },
    ]);

    console.log('🟢 Seeding Job Info...');

    await db.insert(jobInfo).values([
      {
        employeeId: alice.id,
        jobTitle: 'Software Engineer',
        department: 'Engineering',
        teamId: engineering.id,
        employmentType: 'Full-time',
        startDate: new Date('2023-01-15'),
        workLocation: 'Office',
      },
      {
        employeeId: bob.id,
        jobTitle: 'Operations Manager',
        department: 'Operations',
        teamId: operations.id,
        employmentType: 'Full-time',
        startDate: new Date('2022-06-01'),
        workLocation: 'Hybrid',
      },
      {
        employeeId: carol.id,
        jobTitle: 'Marketing Specialist',
        department: 'Marketing',
        teamId: marketing.id,
        employmentType: 'Full-time',
        startDate: new Date('2023-09-10'),
        workLocation: 'Remote',
      },
      {
        employeeId: dave.id,
        jobTitle: 'HR Manager',
        department: 'HR',
        teamId: hr.id,
        employmentType: 'Full-time',
        startDate: new Date('2021-03-20'),
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

    console.log('🟢 Seeding Time Off Types...');

    const insertedTimeOffTypes = await db
      .insert(timeOffTypes)
      .values([
        { name: 'Vacation', defaultValue: '20.0', enabled: true },
        { name: 'Sick Leave', defaultValue: '10.0', enabled: true },
        { name: 'Personal Day', defaultValue: '5.0', enabled: true },
        { name: 'Work From Home', defaultValue: '10.0', enabled: true },
        { name: 'Marriage', defaultValue: '5.0', enabled: true },
        { name: 'Bereavement', defaultValue: '5.0', enabled: true },
        { name: 'Unpaid', defaultValue: '5.0', enabled: true },
      ])
      .returning();

    console.log('🟢 Seeding Time Off Balances...');

    const employeeIds = [alice.id, bob.id, carol.id, dave.id];
    const balanceRecords: any[] = [];

    for (const empId of employeeIds) {
      for (const t of insertedTimeOffTypes) {
        balanceRecords.push({
          employeeId: empId,
          timeOffTypeId: t.id,
          total: t.defaultValue,
          used: '0.0', // Could offset manually, but 0.0 is fine for seed.
        });
      }
    }

    await db.insert(timeOffBalance).values(balanceRecords);

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
      { employeeId: alice.id, checkinTime: getDateWithOffset(-1, 8, 0) },
      { employeeId: bob.id, checkinTime: getDateWithOffset(-1, 8, 15) },
      { employeeId: carol.id, checkinTime: getDateWithOffset(-1, 8, 30) },
      { employeeId: dave.id, checkinTime: getDateWithOffset(-1, 9, 0) },
      { employeeId: alice.id, checkinTime: getDateWithOffset(0, 8, 5) },
      { employeeId: bob.id, checkinTime: getDateWithOffset(0, 8, 20) },
    ]);

    console.log('🟢 Seeding Equipment...');

    const [laptop, monitor, phone] = await db
      .insert(equipment)
      .values([
        {
          name: 'MacBook Pro 16',
          category: 'Laptop',
          brand: 'Apple',
          model: 'M2 Pro',
          serialNumber: 'MBP16-001',
          assetTag: 'EQT-1001',
          description: 'Development laptop',
          assignedTo: alice.id,
          location: 'Office',
          notes: 'Assigned to dev team',
          assignmentDate: new Date('2023-01-20'),
        },
        {
          name: 'Dell UltraSharp',
          category: 'Monitor',
          brand: 'Dell',
          model: 'U2723Q',
          serialNumber: 'DLU-001',
          assetTag: 'EQT-1002',
          description: '27-inch 4K monitor',
          location: 'Office',
        },
        {
          name: 'iPhone 15',
          category: 'Phone',
          brand: 'Apple',
          model: 'iPhone 15 Pro',
          serialNumber: 'IP15-001',
          assetTag: 'EQT-1003',
          description: 'Company phone',
          assignedTo: carol.id,
          location: 'Remote',
          assignmentDate: new Date('2023-11-01'),
        },
      ])
      .returning();

    await db.insert(purchaseInfo).values([
      {
        equipmentId: laptop.id,
        purchaseDate: new Date('2025-01-10'),
        purchaseCost: 3500,
        supplier: 'Apple Store',
        warrantyExpiration: new Date('2027-01-10'),
        condition: 'New',
        status: 'Assigned',
      },
      {
        equipmentId: monitor.id,
        purchaseDate: new Date('2025-03-15'),
        purchaseCost: 500,
        supplier: 'Dell',
        warrantyExpiration: new Date('2026-03-15'),
        condition: 'New',
        status: 'Available',
      },
      {
        equipmentId: phone.id,
        purchaseDate: new Date('2025-05-20'),
        purchaseCost: 1200,
        supplier: 'Apple Store',
        warrantyExpiration: new Date('2026-05-20'),
        condition: 'New',
        status: 'Assigned',
      },
    ]);

    console.log('🟢 Seeding Announcements...');

    await db.insert(announcements).values([
      {
        title: 'New HR Tool Launch!',
        body: 'We are incredibly excited to officially roll out the first version of our internal HR Tool. Please feel free to explore the dashboard.',
        tag: 'General',
        pinned: true,
        authorId: dave.id,
      },
      {
        title: 'Q3 Townhall Meeting',
        body: 'Just a reminder that the Q3 remote townhall will take place next Wednesday at 10 AM. Dial-in link will be shared via calendar.',
        tag: 'Event',
        pinned: false,
        authorId: alice.id,
      },
      {
        title: 'Phishing Awareness Training',
        body: 'All employees are required to complete the mandatory IT phishing awareness module before the end of the month. Check your emails.',
        tag: 'IT',
        pinned: true,
        authorId: bob.id,
      },
      {
        title: 'Public Holiday Reminder',
        body: 'Office will be closed this Friday for the public holiday. Enjoy your long weekend!',
        tag: 'HR',
        pinned: false,
        authorId: dave.id,
      },
      {
        title: 'Server Maintenance Window',
        body: 'Downtime expected on Saturday from 2 AM to 4 AM for scheduled infrastructure patching.',
        tag: 'Urgent',
        pinned: false,
        authorId: alice.id,
      },
    ]);

    console.log('🟢 Seeding Meetings (Past & Upcoming)...');

    // Past meetings (completed)
    const pastMeeting1 = (
      await db
        .insert(meetings)
        .values({
          title: 'Q3 Planning Review',
          description: 'Quarterly review of Q3 goals and progress',
          organizerId: alice.id,
          startsAt: getDateWithOffset(-5, 10, 0),
          durationMinutes: 60,
          timezone: 'Europe/Berlin',
          status: 'scheduled',
        })
        .returning()
    )[0];

    const pastMeeting2 = (
      await db
        .insert(meetings)
        .values({
          title: 'Team Standup - Engineering',
          description: 'Daily standup for engineering team',
          organizerId: alice.id,
          startsAt: getDateWithOffset(-2, 9, 30),
          durationMinutes: 30,
          timezone: 'Europe/Berlin',
          status: 'scheduled',
        })
        .returning()
    )[0];

    const pastMeeting3 = (
      await db
        .insert(meetings)
        .values({
          title: 'Operations Budget Meeting',
          description: 'Discuss Q4 budget allocation for operations',
          organizerId: bob.id,
          startsAt: getDateWithOffset(-1, 14, 0),
          durationMinutes: 45,
          timezone: 'Europe/Berlin',
          status: 'scheduled',
        })
        .returning()
    )[0];

    // Upcoming meetings
    const upcomingMeeting1 = (
      await db
        .insert(meetings)
        .values({
          title: 'Team Standup - Engineering',
          description: 'Daily standup for engineering team',
          organizerId: alice.id,
          startsAt: getDateWithOffset(1, 9, 30),
          durationMinutes: 30,
          timezone: 'Europe/Berlin',
          status: 'scheduled',
        })
        .returning()
    )[0];

    const upcomingMeeting2 = (
      await db
        .insert(meetings)
        .values({
          title: 'Client Presentation - Marketing Strategy',
          description: 'Present Q4 marketing strategy to client stakeholders',
          organizerId: carol.id,
          startsAt: getDateWithOffset(2, 11, 0),
          durationMinutes: 90,
          timezone: 'Europe/Berlin',
          status: 'scheduled',
        })
        .returning()
    )[0];

    const upcomingMeeting3 = (
      await db
        .insert(meetings)
        .values({
          title: 'HR Review - Annual Performance',
          description: 'Annual performance review discussion',
          organizerId: dave.id,
          startsAt: getDateWithOffset(2, 14, 0),
          durationMinutes: 60,
          timezone: 'Europe/Berlin',
          status: 'scheduled',
        })
        .returning()
    )[0];

    const canceledMeeting = (
      await db
        .insert(meetings)
        .values({
          title: 'Project Kickoff - Canceled',
          description: 'This meeting was canceled',
          organizerId: alice.id,
          startsAt: getDateWithOffset(1, 15, 0),
          durationMinutes: 120,
          timezone: 'Europe/Berlin',
          status: 'canceled',
        })
        .returning()
    )[0];

    console.log('🟢 Seeding Meeting Participants...');

    await db.insert(meetingParticipants).values([
      // Past meeting 1 participants
      { meetingId: pastMeeting1.id, employeeId: alice.id },
      { meetingId: pastMeeting1.id, employeeId: bob.id },
      { meetingId: pastMeeting1.id, employeeId: carol.id },
      // Past meeting 2 participants
      { meetingId: pastMeeting2.id, employeeId: alice.id },
      { meetingId: pastMeeting2.id, employeeId: bob.id },
      // Past meeting 3 participants
      { meetingId: pastMeeting3.id, employeeId: bob.id },
      { meetingId: pastMeeting3.id, employeeId: alice.id },
      // Upcoming meeting 1 participants
      { meetingId: upcomingMeeting1.id, employeeId: alice.id },
      { meetingId: upcomingMeeting1.id, employeeId: bob.id },
      { meetingId: upcomingMeeting1.id, employeeId: dave.id },
      // Upcoming meeting 2 participants
      { meetingId: upcomingMeeting2.id, employeeId: carol.id },
      { meetingId: upcomingMeeting2.id, employeeId: alice.id },
      { meetingId: upcomingMeeting2.id, employeeId: bob.id },
      // Upcoming meeting 3 participants
      { meetingId: upcomingMeeting3.id, employeeId: dave.id },
      { meetingId: upcomingMeeting3.id, employeeId: alice.id },
      // Canceled meeting participants
      { meetingId: canceledMeeting.id, employeeId: alice.id },
      { meetingId: canceledMeeting.id, employeeId: carol.id },
    ]);

    console.log('🟢 Seeding Leave Requests (Past & Upcoming)...');

    await db.insert(leaveRequests).values([
      {
        employeeId: alice.id,
        type: 'Vacation',
        startDate: getDateWithOffset(-10, 0, 0),
        endDate: getDateWithOffset(-5, 23, 59),
        days: '5.0',
        reason: 'Family vacation to Italy',
        status: 'Approved',
        reviewedById: dave.id,
        managerNote: 'Approved for Q3 vacation',
      },
      {
        employeeId: bob.id,
        type: 'Sick Leave',
        startDate: getDateWithOffset(-3, 0, 0),
        endDate: getDateWithOffset(-1, 23, 59),
        days: '3.0',
        reason: 'Medical appointment and recovery',
        status: 'Approved',
        reviewedById: dave.id,
        managerNote: 'Get well soon!',
      },
      {
        employeeId: carol.id,
        type: 'Work From Home',
        startDate: getDateWithOffset(1, 0, 0),
        endDate: getDateWithOffset(2, 23, 59),
        days: '2.0',
        reason: 'Home office setup day',
        status: 'Pending',
      },
      {
        employeeId: dave.id,
        type: 'Personal Day',
        startDate: getDateWithOffset(5, 0, 0),
        endDate: getDateWithOffset(5, 23, 59),
        days: '1.0',
        reason: 'Personal matters',
        status: 'Pending',
      },
      {
        employeeId: alice.id,
        type: 'Marriage',
        startDate: getDateWithOffset(30, 0, 0),
        endDate: getDateWithOffset(32, 23, 59),
        days: '3.0',
        reason: 'Wedding day and honeymoon preparation',
        status: 'Pending',
      },
      {
        employeeId: bob.id,
        type: 'Bereavement',
        startDate: getDateWithOffset(-7, 0, 0),
        endDate: getDateWithOffset(-4, 23, 59),
        days: '3.0',
        reason: 'Family bereavement',
        status: 'Approved',
        reviewedById: dave.id,
        managerNote: 'Condolences to the family',
      },
    ]);

    console.log('🟢 Seeding Documents...');

    await db.insert(documents).values([
      {
        employeeId: alice.id,
        name: 'Employment Contract',
        type: 'PDF',
        size: '2.4 MB',
        url: '/documents/alice-employment-contract.pdf',
        category: 'contracts',
      },
      {
        employeeId: alice.id,
        name: 'Health Insurance Certificate',
        type: 'PDF',
        size: '1.1 MB',
        url: '/documents/alice-health-insurance.pdf',
        category: 'health',
      },
      {
        employeeId: bob.id,
        name: 'Employment Contract',
        type: 'PDF',
        size: '2.4 MB',
        url: '/documents/bob-employment-contract.pdf',
        category: 'contracts',
      },
      {
        employeeId: bob.id,
        name: 'Additional Training Certificate',
        type: 'PDF',
        size: '0.8 MB',
        url: '/documents/bob-training-certificate.pdf',
        category: 'additional',
      },
      {
        employeeId: carol.id,
        name: 'Employment Contract',
        type: 'PDF',
        size: '2.4 MB',
        url: '/documents/carol-employment-contract.pdf',
        category: 'contracts',
      },
      {
        employeeId: carol.id,
        name: 'Health Insurance Certificate',
        type: 'PDF',
        size: '1.1 MB',
        url: '/documents/carol-health-insurance.pdf',
        category: 'health',
      },
      {
        employeeId: carol.id,
        name: 'Performance Review - Q2 2024',
        type: 'DOCX',
        size: '0.5 MB',
        url: '/documents/carol-performance-review-q2.docx',
        category: 'additional',
      },
      {
        employeeId: dave.id,
        name: 'Employment Contract',
        type: 'PDF',
        size: '2.4 MB',
        url: '/documents/dave-employment-contract.pdf',
        category: 'contracts',
      },
      {
        employeeId: dave.id,
        name: 'Health Insurance Certificate',
        type: 'PDF',
        size: '1.1 MB',
        url: '/documents/dave-health-insurance.pdf',
        category: 'health',
      },
      {
        employeeId: dave.id,
        name: 'HR Manager Certification',
        type: 'PDF',
        size: '3.2 MB',
        url: '/documents/dave-hr-certification.pdf',
        category: 'additional',
      },
    ]);

    console.log('🟢 Seeding Payments...');

    await db.insert(payments).values([
      {
        amount: '5000.00',
        date: getDateWithOffset(-15, 0, 0),
        vendor: 'Office Supplies Co',
        category: 'Supplies',
        description: 'Monthly office supplies including paper, pens, and desk accessories',
        documentName: 'Invoice-OS-2024-12-001.pdf',
        documentUrl: '/invoices/office-supplies-dec.pdf',
        source: 'manual',
        status: 'processed',
      },
      {
        amount: '12000.00',
        date: getDateWithOffset(-10, 0, 0),
        vendor: 'Cloud Services Ltd',
        category: 'IT Services',
        description: 'Monthly cloud infrastructure and services subscription',
        documentName: 'Invoice-CSL-2024-12-001.pdf',
        documentUrl: '/invoices/cloud-services-dec.pdf',
        source: 'upload',
        status: 'processed',
      },
      {
        amount: '3500.00',
        date: getDateWithOffset(-5, 0, 0),
        vendor: 'Training Academy',
        category: 'Employee Development',
        description: 'Employee training program for Q4 2024',
        documentName: 'Invoice-TA-2024-12-001.pdf',
        documentUrl: '/invoices/training-academy-dec.pdf',
        source: 'upload',
        status: 'processed',
      },
      {
        amount: '8500.00',
        date: getDateWithOffset(-2, 0, 0),
        vendor: 'Facility Management Inc',
        category: 'Facilities',
        description: 'Office rent and maintenance for December',
        documentName: 'Invoice-FMI-2024-12-001.pdf',
        documentUrl: '/invoices/facilities-dec.pdf',
        source: 'manual',
        status: 'processed',
      },
      {
        amount: '2200.00',
        date: getDateWithOffset(0, 0, 0),
        vendor: 'Marketing Tools Pro',
        category: 'Marketing',
        description: 'Marketing automation platform subscription',
        documentName: 'Invoice-MTP-2025-01-001.pdf',
        documentUrl: '/invoices/marketing-tools-jan.pdf',
        source: 'upload',
        status: 'pending',
      },
      {
        amount: '4500.00',
        date: getDateWithOffset(1, 0, 0),
        vendor: 'Software Licenses Ltd',
        category: 'Software',
        description: 'Annual software licenses renewal',
        documentName: 'Invoice-SLL-2025-01-001.pdf',
        documentUrl: '/invoices/software-licenses-jan.pdf',
        source: 'manual',
        status: 'pending',
      },
      {
        amount: '1800.00',
        date: getDateWithOffset(3, 0, 0),
        vendor: 'Catering Services',
        category: 'Events',
        description: 'Team lunch catering for team building event',
        documentName: 'Invoice-CS-2025-01-001.pdf',
        documentUrl: '/invoices/catering-jan.pdf',
        source: 'manual',
        status: 'pending',
      },
    ]);

    console.log('🟢 Seeding Job Postings (Open & Closed)...');

    const insertedJobs = await db.insert(jobs).values([
      {
        title: 'Senior Software Engineer',
        department: 'Engineering',
        location: 'Berlin, Germany',
        locationType: 'Hybrid',
        type: 'Full-time',
        salary: '€55,000 - €75,000',
        status: 'Open',
        description:
          'We are looking for an experienced Senior Software Engineer to join our engineering team. You will work on scalable backend systems and contribute to architectural decisions.',
        responsibilities: [
          'Design and implement scalable software solutions',
          'Lead code reviews and mentor junior developers',
          'Collaborate with product and design teams',
          'Participate in architecture discussions',
        ],
        requirements: [
          '5+ years of software development experience',
          'Strong proficiency in backend technologies',
          'Experience with cloud platforms (AWS, GCP, Azure)',
          'Bachelor\'s degree in Computer Science or related field',
        ],
        niceToHave: [
          'Experience with Kubernetes and containerization',
          'Background in system design and architecture',
          'Open source contributions',
        ],
        applicants: 12,
        postedAt: getDateWithOffset(-30, 9, 0),
      },
      {
        title: 'Marketing Manager',
        department: 'Marketing',
        location: 'Berlin, Germany',
        locationType: 'Remote',
        type: 'Full-time',
        salary: '€45,000 - €60,000',
        status: 'Open',
        description:
          'Join our marketing team as a Marketing Manager. You will oversee marketing campaigns, strategy development, and lead a small team of marketing professionals.',
        responsibilities: [
          'Develop and execute marketing strategies',
          'Manage marketing budget and campaigns',
          'Lead marketing team and coordinate with other departments',
          'Analyze marketing metrics and optimize campaigns',
        ],
        requirements: [
          '3+ years of marketing experience',
          'Strong analytical and communication skills',
          'Experience with marketing automation tools',
          'Degree in Marketing, Business or related field',
        ],
        niceToHave: [
          'Experience with SEO and SEM',
          'Knowledge of analytics tools',
          'Track record of successful campaigns',
        ],
        applicants: 8,
        postedAt: getDateWithOffset(-15, 10, 0),
      },
      {
        title: 'Operations Associate',
        department: 'Operations',
        location: 'Munich, Germany',
        locationType: 'Hybrid',
        type: 'Full-time',
        salary: '€30,000 - €40,000',
        status: 'Open',
        description:
          'We are seeking an Operations Associate to support our daily operations. This role involves process optimization, vendor management, and administrative coordination.',
        responsibilities: [
          'Support operational processes and procedures',
          'Manage vendor relationships and contracts',
          'Coordinate logistics and supply chain activities',
          'Prepare operational reports and analysis',
        ],
        requirements: [
          '2+ years of operations or business operations experience',
          'Strong organizational and communication skills',
          'Proficiency with ERP systems',
        ],
        niceToHave: [
          'Lean Six Sigma certification',
          'Experience with SAP',
          'Project management experience',
        ],
        applicants: 5,
        postedAt: getDateWithOffset(-7, 11, 0),
      },
      {
        title: 'Python Developer',
        department: 'Engineering',
        location: 'Remote',
        locationType: 'Remote',
        type: 'Full-time',
        salary: '€50,000 - €70,000',
        status: 'Closed',
        description:
          'We have successfully filled this position. Thank you to all applicants.',
        responsibilities: [],
        requirements: [],
        niceToHave: [],
        applicants: 25,
        postedAt: getDateWithOffset(-60, 8, 0),
        closedAt: getDateWithOffset(-5, 17, 0),
      },
      {
        title: 'UX/UI Designer',
        department: 'Engineering',
        location: 'Berlin, Germany',
        locationType: 'Hybrid',
        type: 'Full-time',
        salary: '€40,000 - €55,000',
        status: 'Open',
        description:
          'We are looking for a talented UX/UI Designer to create intuitive and beautiful user interfaces for our products.',
        responsibilities: [
          'Design user interfaces for web and mobile applications',
          'Conduct user research and usability testing',
          'Create wireframes, mockups, and prototypes',
          'Collaborate with developers and product managers',
        ],
        requirements: [
          '3+ years of UX/UI design experience',
          'Proficiency with design tools (Figma, Adobe XD, etc.)',
          'Strong portfolio demonstrating design skills',
          'Understanding of user-centered design principles',
        ],
        niceToHave: [
          'Experience with design systems',
          'Knowledge of web technologies (HTML, CSS, JavaScript)',
          'Experience with user testing tools',
        ],
        applicants: 15,
        postedAt: getDateWithOffset(-20, 10, 0),
      },
    ]).returning();

    console.log('🟢 Seeding Job Applications...');

    const [seniorSoftwareEngineer, marketingManager, operationsAssociate] = insertedJobs;

    await db.insert(jobApplications).values([
      {
        jobId: seniorSoftwareEngineer.id,
        name: 'Alice Johnson Candidate',
        email: 'alice.candidate@example.com',
        phone: '+1 234 567 8901',
        location: 'Berlin, Germany',
        stage: 'Applied',
        notes: 'Strong backend skills, applied recently.',
      },
      {
        jobId: seniorSoftwareEngineer.id,
        name: 'Bob Smith Candidate',
        email: 'bob.candidate@example.com',
        phone: '+1 234 567 8902',
        location: 'Remote',
        stage: 'Screening',
        notes: 'Good experience, needs a technical test.',
      },
      {
        jobId: marketingManager.id,
        name: 'Carol Davis Candidate',
        email: 'carol.candidate@example.com',
        phone: '+1 234 567 8903',
        location: 'London, UK',
        stage: 'Interview',
        notes: 'Previous PM experience, transitioning to Marketing.',
      },
      {
        jobId: operationsAssociate.id,
        name: 'David Lee Candidate',
        email: 'david.candidate@example.com',
        phone: '+1 234 567 8904',
        location: 'Munich, Germany',
        stage: 'Offer',
        notes: 'Strong candidate, great references.',
      },
      {
        jobId: marketingManager.id,
        name: 'Eva Green Candidate',
        email: 'eva.candidate@example.com',
        phone: '+1 234 567 8905',
        location: 'Berlin, Germany',
        stage: 'Hired',
        notes: 'Accept offer, starting next month.',
      },
      {
        jobId: seniorSoftwareEngineer.id,
        name: 'Frank Miller Candidate',
        email: 'frank.candidate@example.com',
        phone: '+1 234 567 8906',
        location: 'Remote',
        stage: 'Rejected',
        notes: 'Not a good fit at this time.',
      },
    ]);

    console.log('✅ Seeding complete!');
    console.log('📊 Summary:');
    console.log('   - 4 Teams seeded');
    console.log('   - 4 Employees seeded');
    console.log('   - 4 Users seeded');
    console.log('   - 4 Job Info records seeded');
    console.log('   - 4 Compensation records seeded');
    console.log('   - 4 Time Off Balance records seeded');
    console.log('   - 6 Check-in Logs seeded');
    console.log('   - 3 Equipment items seeded with 3 Purchase Info records');
    console.log('   - 5 Announcements seeded');
    console.log('   - 5 Meetings seeded (4 past/upcoming, 1 canceled)');
    console.log('   - 16 Meeting Participants seeded');
    console.log('   - 6 Leave Requests seeded');
    console.log('   - 10 Documents seeded');
    console.log('   - 7 Payments seeded');
    console.log('   - 5 Job Postings seeded (4 open, 1 closed)');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    throw err;
  } finally {
    await pool.end();
  }
}

seed().catch(() => process.exit(1));