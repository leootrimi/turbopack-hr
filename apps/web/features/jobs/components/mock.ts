export type JobStatus    = "Open" | "Closed" | "Draft";
export type JobType      = "Full-time" | "Part-time" | "Contract" | "Internship";
export type JobLocation  = "On-site" | "Remote" | "Hybrid";

export interface JobPost {
  id: string;
  title: string;
  department: string;
  location: string;
  locationType: JobLocation;
  type: JobType;
  salary: string;
  status: JobStatus;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  postedAt: Date;
  closedAt?: Date;
  applicants: number;
}

export const DEPARTMENTS = ["Engineering", "Design", "Product", "Sales", "HR", "Finance", "Marketing"];
export const JOB_TYPES: JobType[]     = ["Full-time", "Part-time", "Contract", "Internship"];
export const LOCATION_TYPES: JobLocation[] = ["On-site", "Remote", "Hybrid"];

export const STATUS_CONFIG: Record<JobStatus, { bg: string; text: string; dot: string }> = {
  Open:   { bg: "#f0fdf4", text: "#166534", dot: "#22c55e" },
  Closed: { bg: "#fef2f2", text: "#991b1b", dot: "#ef4444" },
  Draft:  { bg: "#f8fafc", text: "#64748b", dot: "#94a3b8" },
};

export const DEPT_COLORS: Record<string, string> = {
  Engineering: "#6366f1",
  Design:      "#ec4899",
  Product:     "#f59e0b",
  Sales:       "#14b8a6",
  HR:          "#8b5cf6",
  Finance:     "#06b6d4",
  Marketing:   "#f97316",
};

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000);

export const MOCK_JOBS: JobPost[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Belgrade, Serbia",
    locationType: "Hybrid",
    type: "Full-time",
    salary: "€3,500 – €5,000 / mo",
    status: "Open",
    description: "We're looking for a Senior Frontend Engineer to help us build world-class user experiences. You'll work closely with product and design to deliver high-quality, performant interfaces used by thousands of users every day.",
    responsibilities: [
      "Build and maintain scalable frontend applications using React and TypeScript",
      "Collaborate with designers to translate wireframes into polished UIs",
      "Participate in code reviews and mentor junior engineers",
      "Contribute to architecture decisions and technical roadmap",
    ],
    requirements: [
      "5+ years of professional frontend experience",
      "Strong proficiency in React, TypeScript, and modern CSS",
      "Experience with REST APIs and state management (Zustand, Redux, or similar)",
      "Excellent communication skills and ability to work in an agile environment",
    ],
    niceToHave: [
      "Experience with Next.js or similar SSR frameworks",
      "Contributions to open-source projects",
      "Familiarity with design systems and component libraries",
    ],
    postedAt: daysAgo(3),
    applicants: 14,
  },
  {
    id: "2",
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    locationType: "Remote",
    type: "Full-time",
    salary: "€2,800 – €4,000 / mo",
    status: "Open",
    description: "Join our design team and shape the visual language and user experience of our core product. You'll own end-to-end design flows, from discovery to handoff.",
    responsibilities: [
      "Own end-to-end design flows for new product features",
      "Run user research sessions and synthesise insights",
      "Maintain and evolve our design system in Figma",
      "Work closely with engineering to ensure pixel-perfect implementation",
    ],
    requirements: [
      "3+ years of product design experience",
      "Expert in Figma and modern design tooling",
      "Strong portfolio demonstrating end-to-end product thinking",
      "Experience conducting user interviews and usability tests",
    ],
    niceToHave: [
      "Experience designing HR or B2B SaaS products",
      "Basic front-end knowledge (HTML/CSS)",
    ],
    postedAt: daysAgo(7),
    applicants: 22,
  },
  {
    id: "3",
    title: "Sales Account Executive",
    department: "Sales",
    location: "Novi Sad, Serbia",
    locationType: "On-site",
    type: "Full-time",
    salary: "€2,000 – €3,000 + commission",
    status: "Open",
    description: "We're growing our sales team and looking for a driven Account Executive to help us expand our customer base across the region.",
    responsibilities: [
      "Manage a pipeline of inbound and outbound leads",
      "Run product demos and negotiate commercial terms",
      "Collaborate with customer success on onboarding handoffs",
      "Hit and exceed monthly and quarterly revenue targets",
    ],
    requirements: [
      "2+ years of B2B SaaS sales experience",
      "Strong track record of meeting quota",
      "Excellent written and verbal communication in English and Serbian",
      "Comfortable with CRM tools (HubSpot, Salesforce, etc.)",
    ],
    niceToHave: [
      "Experience selling HR or workforce management solutions",
      "Network in the local SMB or enterprise market",
    ],
    postedAt: daysAgo(10),
    applicants: 8,
  },
  {
    id: "4",
    title: "HR Generalist",
    department: "HR",
    location: "Belgrade, Serbia",
    locationType: "Hybrid",
    type: "Full-time",
    salary: "€1,800 – €2,500 / mo",
    status: "Draft",
    description: "We're hiring an HR Generalist to support our growing team with day-to-day HR operations, recruitment coordination, and employee relations.",
    responsibilities: [
      "Coordinate end-to-end recruitment for various roles",
      "Manage onboarding and offboarding processes",
      "Support payroll and benefits administration",
      "Handle employee queries and maintain HR records",
    ],
    requirements: [
      "2+ years of HR generalist experience",
      "Familiarity with Serbian labour law",
      "Strong organisational and communication skills",
      "Experience with HR information systems",
    ],
    niceToHave: [
      "CIPD qualification or equivalent",
      "Experience in a tech startup environment",
    ],
    postedAt: daysAgo(1),
    applicants: 0,
  },
  {
    id: "5",
    title: "Backend Engineer (Node.js)",
    department: "Engineering",
    location: "Remote",
    locationType: "Remote",
    type: "Full-time",
    salary: "€3,000 – €4,500 / mo",
    status: "Closed",
    description: "We were looking for a Backend Engineer to help scale our API infrastructure. This position has been filled.",
    responsibilities: [
      "Design and build robust RESTful APIs",
      "Own database schema design and query optimisation",
      "Implement background jobs and event-driven workflows",
      "Participate in on-call rotation for production systems",
    ],
    requirements: [
      "4+ years of backend experience with Node.js",
      "Strong knowledge of PostgreSQL or similar relational databases",
      "Experience with cloud platforms (AWS or GCP)",
      "Understanding of security best practices",
    ],
    niceToHave: [
      "Experience with Kafka or RabbitMQ",
      "Knowledge of containerisation and Kubernetes",
    ],
    postedAt: daysAgo(60),
    closedAt: daysAgo(5),
    applicants: 37,
  },
  {
    id: "6",
    title: "Marketing Intern",
    department: "Marketing",
    location: "Belgrade, Serbia",
    locationType: "Hybrid",
    type: "Internship",
    salary: "€600 / mo",
    status: "Closed",
    description: "A 3-month marketing internship to support our content and social media activities. This position has now been filled.",
    responsibilities: [
      "Assist with content creation for blog and social media",
      "Help coordinate email marketing campaigns",
      "Track and report on campaign performance metrics",
    ],
    requirements: [
      "Currently studying Marketing, Communications, or related field",
      "Strong written English",
      "Basic knowledge of social media platforms",
    ],
    niceToHave: [
      "Experience with Canva or Adobe Creative Suite",
      "Familiarity with email marketing tools",
    ],
    postedAt: daysAgo(90),
    closedAt: daysAgo(30),
    applicants: 19,
  },
];
