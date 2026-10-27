export const experience = [
  {
    company: "Alchemy Tech",
    role: "Full Stack Engineer",
    dates: "Oct 2025 – Now",
    now: true,
    groups: [
      {
        title: "Port Community System",
        points: [
          "Multi-tenant NestJS + PostgreSQL backend on AWS RDS serving 5 terminals and 7 participant types.",
          "Custom schema-driven workflow engine for approvals, with full audit history.",
          "Integrated 10 external systems across terminals, customs and other agencies.",
          "Infrastructure as code in Pulumi: ECS Fargate, RDS, SQS/SNS, CloudFront + WAF, Site-to-Site VPN.",
          "4 weeks on-site with the client running UAT, go-live trials and user workshops.",
        ],
      },
      {
        title: "WorkLog",
        points: [
          "Built the first 3 versions of the Next.js web app, deployed on AWS Amplify.",
          "Multi-tenancy in the Electron agent, time tracking with reports, automatic Jira work logs.",
        ],
      },
    ],
  },
  {
    company: "Investis Digital",
    role: "Associate Software Engineer",
    dates: "Jan – Oct 2025",
    groups: [
      {
        points: [
          "Shipped 4+ client projects to production for brands including Vodafone and M&G.",
          "Built 7+ major site components: news centre, results RSS feeds, ticker.",
          "Built 2+ interactive map solutions and 3+ server-side filtering systems.",
        ],
      },
    ],
  },
  {
    company: "PMC Retail",
    role: "Software Engineer Intern",
    dates: "Aug – Dec 2024",
    groups: [
      {
        points: [
          "Angular screens for inventory and order management on Node.js APIs.",
          "Optimised PostgreSQL queries behind product and order listings.",
          "AWS Lambda jobs and S3 storage for product images and report exports.",
        ],
      },
    ],
  },
  {
    company: "Freelance",
    role: "Full-stack Developer & UI/UX",
    dates: "Upwork",
    groups: [
      {
        points: [
          "Turned client briefs into full-stack web apps, from first design to deployment.",
          "UI/UX design and front-end builds for clients worldwide.",
        ],
      },
    ],
  },
];

export type Preview = { kind: "flow" | "cron" | "chat" | "meet" | "bday" | "extension" | "brat" };

export type Project = {
  slug: string;
  title: string;
  description: string;
  platforms: string;
  stack: string;
  preview: Preview;
  href?: string;
};

export const projects: Project[] = [
  {
    slug: "auto-poster",
    title: "Auto-Poster",
    description: "Claude writes, DALL·E illustrates, and it posts to LinkedIn and X every day on its own.",
    platforms: "AI · Cron · Serverless",
    stack: "Python · Claude · DALL·E · Vercel",
    preview: { kind: "cron" },
  },
  {
    slug: "whatsapp-api",
    title: "WhatsApp API",
    description: "Multi-tenant WhatsApp API for sales teams: per-company sessions and roles, the plumbing an AI sales agent plugs into.",
    platforms: "AI sales · API",
    stack: "NestJS · Prisma · JWT · Docker",
    preview: { kind: "chat" },
    href: "https://github.com/Viral-Sachde/multi-tenant-wa-messaging-api",
  },
  {
    slug: "smoothflows",
    title: "Smoothflows",
    description: "Database-driven workflow engine: build and run business workflows with zero code changes.",
    platforms: "Dynamic workflows · Web",
    stack: "NestJS · XState · React · PostgreSQL",
    preview: { kind: "flow" },
    href: "https://smoothflows.vercel.app",
  },
  {
    slug: "room",
    title: "Room",
    description: "A complete meeting app: instant and scheduled calls, recordings and personal rooms.",
    platforms: "Web",
    stack: "Next.js · Stream · Clerk · Tailwind",
    preview: { kind: "meet" },
    href: "https://room-meeting-app.vercel.app",
  },
  {
    slug: "bloop",
    title: "Bloop",
    description: "Never miss a midnight: birthday pings at 12:00 sharp, wishes in five tones, memories from past years.",
    platforms: "iOS · Android",
    stack: "React Native · TypeScript",
    preview: { kind: "bday" },
    href: "https://github.com/Viral-Sachde/bloop-bday",
  },
  {
    slug: "crazy-image-pro",
    title: "Crazy Image Pro",
    description: "Chrome extension that grabs every image on a page, converted and resized the way you want.",
    platforms: "Chrome extension",
    stack: "JavaScript · Chrome APIs",
    preview: { kind: "extension" },
    href: "https://github.com/Viral-Sachde/crazy-image-pro",
  },
  {
    slug: "brat-gen",
    title: "Brat Generator",
    description: "Make images in the brat album look: live canvas preview, word-by-word exports, lyrics search, themes.",
    platforms: "Web",
    stack: "JavaScript · Canvas",
    preview: { kind: "brat" },
    href: "https://github.com/Viral-Sachde/brat-gen",
  },
];

export const stackGroups = [
  { key: "ui", label: "UI", color: "var(--color-blue)", items: ["React", "Next.js", "Vue", "Electron", "React Native", "Tailwind", "Framer Motion"] },
  { key: "api", label: "API", color: "var(--color-green)", items: ["Node.js", "NestJS", "Express", "FastAPI", "GraphQL", "REST", "Workflow engines"] },
  { key: "data", label: "Data", color: "var(--color-blue-deep)", items: ["PostgreSQL", "Prisma", "MongoDB", "MySQL", "Multi-tenancy", "RBAC"] },
  { key: "cloud", label: "Cloud", color: "var(--color-yellow-deep)", items: ["AWS", "Pulumi", "Docker", "ECS Fargate", "Lambda", "CI/CD"] },
  { key: "ai", label: "AI", color: "var(--color-green-deep)", items: ["Claude", "OpenAI", "Gemini", "LangChain", "RAG", "Embeddings"] },
];
