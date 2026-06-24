import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Comprehensive Tech Skills Dictionary categorized by domain
const SKILLS_DATABASE: Record<string, { name: string; domain: string }> = {
  // Frontend
  react: { name: "React", domain: "Frontend" },
  typescript: { name: "TypeScript", domain: "Frontend" },
  javascript: { name: "JavaScript", domain: "Frontend" },
  html: { name: "HTML", domain: "Frontend" },
  css: { name: "CSS", domain: "Frontend" },
  "next.js": { name: "Next.js", domain: "Frontend" },
  nextjs: { name: "Next.js", domain: "Frontend" },
  vite: { name: "Vite", domain: "Frontend" },
  redux: { name: "Redux", domain: "Frontend" },
  tailwindcss: { name: "TailwindCSS", domain: "Frontend" },
  tailwind: { name: "TailwindCSS", domain: "Frontend" },
  graphql: { name: "GraphQL", domain: "Frontend" },
  svelte: { name: "Svelte", domain: "Frontend" },
  vue: { name: "Vue", domain: "Frontend" },
  angular: { name: "Angular", domain: "Frontend" },
  webpack: { name: "Webpack", domain: "Frontend" },
  jest: { name: "Jest", domain: "Frontend" },
  cypress: { name: "Cypress", domain: "Frontend" },

  // Backend
  "node.js": { name: "Node.js", domain: "Backend" },
  nodejs: { name: "Node.js", domain: "Backend" },
  express: { name: "Express", domain: "Backend" },
  nestjs: { name: "NestJS", domain: "Backend" },
  python: { name: "Python", domain: "Backend" },
  django: { name: "Django", domain: "Backend" },
  flask: { name: "Flask", domain: "Backend" },
  go: { name: "Go", domain: "Backend" },
  golang: { name: "Go", domain: "Backend" },
  java: { name: "Java", domain: "Backend" },
  "spring boot": { name: "Spring Boot", domain: "Backend" },
  springboot: { name: "Spring Boot", domain: "Backend" },
  "c#": { name: "C#", domain: "Backend" },
  ".net": { name: ".NET", domain: "Backend" },
  "ruby on rails": { name: "Ruby on Rails", domain: "Backend" },
  rails: { name: "Ruby on Rails", domain: "Backend" },
  sql: { name: "SQL", domain: "Backend" },
  postgresql: { name: "PostgreSQL", domain: "Backend" },
  postgres: { name: "PostgreSQL", domain: "Backend" },
  mysql: { name: "MySQL", domain: "Backend" },
  mongodb: { name: "MongoDB", domain: "Backend" },
  mongo: { name: "MongoDB", domain: "Backend" },
  redis: { name: "Redis", domain: "Backend" },
  prisma: { name: "Prisma", domain: "Backend" },
  mongoose: { name: "Mongoose", domain: "Backend" },

  // AI / ML
  pytorch: { name: "PyTorch", domain: "AI" },
  tensorflow: { name: "TensorFlow", domain: "AI" },
  "machine learning": { name: "Machine Learning", domain: "AI" },
  "deep learning": { name: "Deep Learning", domain: "AI" },
  nlp: { name: "NLP", domain: "AI" },
  llm: { name: "LLM", domain: "AI" },
  rag: { name: "RAG", domain: "AI" },
  langchain: { name: "LangChain", domain: "AI" },
  openai: { name: "OpenAI", domain: "AI" },
  "scikit-learn": { name: "Scikit-Learn", domain: "AI" },
  pandas: { name: "Pandas", domain: "AI" },
  numpy: { name: "NumPy", domain: "AI" },
  keras: { name: "Keras", domain: "AI" },
  "computer vision": { name: "Computer Vision", domain: "AI" },

  // Data Science / Analytics
  tableau: { name: "Tableau", domain: "Data" },
  powerbi: { name: "PowerBI", domain: "Data" },
  excel: { name: "Excel", domain: "Data" },
  matplotlib: { name: "Matplotlib", domain: "Data" },
  seaborn: { name: "Seaborn", domain: "Data" },
  statistics: { name: "Statistics", domain: "Data" },
  analytics: { name: "Data Analytics", domain: "Data" },
  r: { name: "R", domain: "Data" },
 
  // DevOps / Cloud
  aws: { name: "AWS", domain: "Cloud" },
  azure: { name: "Azure", domain: "Cloud" },
  gcp: { name: "GCP", domain: "Cloud" },
  docker: { name: "Docker", domain: "Cloud" },
  kubernetes: { name: "Kubernetes", domain: "Cloud" },
  terraform: { name: "Terraform", domain: "Cloud" },
  "ci/cd": { name: "CI/CD", domain: "Cloud" },
  "github actions": { name: "GitHub Actions", domain: "Cloud" },
  jenkins: { name: "Jenkins", domain: "Cloud" },
  linux: { name: "Linux", domain: "Cloud" },
  nginx: { name: "Nginx", domain: "Cloud" },
  ansible: { name: "Ansible", domain: "Cloud" },
  vercel: { name: "Vercel", domain: "Cloud" },
  netlify: { name: "Netlify", domain: "Cloud" },

  // Mobile
  "react native": { name: "React Native", domain: "Mobile" },
  flutter: { name: "Flutter", domain: "Mobile" },
  swift: { name: "Swift", domain: "Mobile" },
  kotlin: { name: "Kotlin", domain: "Mobile" },
  android: { name: "Android", domain: "Mobile" },
  ios: { name: "iOS", domain: "Mobile" },

  // DSA & Core
  dsa: { name: "DSA", domain: "DSA" },
  "system design": { name: "System Design", domain: "Design" },
  git: { name: "Git", domain: "Cloud" },
  "data structures": { name: "DSA", domain: "DSA" },
  algorithms: { name: "DSA", domain: "DSA" },
};

// Target Core Competencies per Role
const ROLE_COMPETENCIES: Record<string, string[]> = {
  "Frontend Developer": ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Next.js", "TailwindCSS", "Git"],
  "Backend Developer": ["Node.js", "Express", "SQL", "PostgreSQL", "MongoDB", "Redis", "Docker", "System Design"],
  "Full Stack Developer": ["React", "TypeScript", "Node.js", "MongoDB", "SQL", "Docker", "System Design", "Git"],
  "AI Engineer": ["Python", "Machine Learning", "Deep Learning", "LLM", "RAG", "PyTorch", "OpenAI"],
  "DevOps Engineer": ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "GitHub Actions", "Linux"],
  "Data Analyst": ["SQL", "Python", "Tableau", "Excel", "PowerBI", "Statistics", "Pandas", "Matplotlib"],
  "Mobile Developer": ["React Native", "Flutter", "Swift", "Kotlin", "Git"],
  "Software Engineer": ["JavaScript", "Python", "SQL", "Git", "DSA", "System Design"],
};

export interface SalaryEstimate {
  role: string;
  min: number;
  max: number;
  futureMin: number;
  futureMax: number;
  marketDemand: number;
  matchedSkills: string[];
}

export interface StrengthScores {
  technicalSkills: number;
  experienceQuality: number;
  projectStrength: number;
  resumeCompleteness: number;
}

export interface IndustryReadiness {
  score: number;
  roleName: string;
  standardsMatched: string[];
  improvementAreas: string[];
}

// Helper to calculate role salary dynamically based on role, skills, and experience
export function calculateRoleSalary(roleName: string, expYears: number, detectedSkills: string[]): SalaryEstimate {
  let baseMin = 4;
  let baseMax = 6;
  let roleSkills: string[] = [];
  let demand = 85;

  if (roleName === "Frontend Developer" || roleName === "Frontend") {
    baseMin = 4.5;
    baseMax = 6.5;
    roleSkills = ROLE_COMPETENCIES["Frontend Developer"] || [];
    demand = 84;
  } else if (roleName === "Backend Developer" || roleName === "Backend") {
    baseMin = 5.0;
    baseMax = 7.5;
    roleSkills = ROLE_COMPETENCIES["Backend Developer"] || [];
    demand = 88;
  } else if (roleName === "AI Engineer" || roleName === "AI / ML" || roleName === "AI") {
    baseMin = 7.0;
    baseMax = 11.0;
    roleSkills = ROLE_COMPETENCIES["AI Engineer"] || [];
    demand = 96;
  } else if (roleName === "DevOps Engineer" || roleName === "DevOps") {
    baseMin = 6.0;
    baseMax = 9.0;
    roleSkills = ROLE_COMPETENCIES["DevOps Engineer"] || [];
    demand = 91;
  } else if (roleName === "Data Analyst") {
    baseMin = 4.0;
    baseMax = 6.0;
    roleSkills = ROLE_COMPETENCIES["Data Analyst"] || [];
    demand = 86;
  } else {
    // Fallback to Software Engineer standards
    baseMin = 5.0;
    baseMax = 7.0;
    roleSkills = ROLE_COMPETENCIES["Software Engineer"] || [];
    demand = 85;
  }

  // Experience multiplier
  const expMultiplier = Math.min(10, expYears);
  const expBoosterMin = expMultiplier * 1.5;
  const expBoosterMax = expMultiplier * 2.5;

  // Skills alignment booster
  const matchedRoleSkills = roleSkills.filter(s => detectedSkills.includes(s));
  const skillRatio = roleSkills.length > 0 ? matchedRoleSkills.length / roleSkills.length : 0;
  const skillBooster = skillRatio * 2.5;

  // Premium skills bonus
  const highPayingSkills = ["Next.js", "PyTorch", "Kubernetes", "System Design", "Go", "TensorFlow", "React Native", "Tableau", "PowerBI"];
  const detectedHighPaying = detectedSkills.filter(s => highPayingSkills.includes(s));
  const highPayingBonus = Math.min(3.0, detectedHighPaying.length * 0.6);

  const min = Math.round((baseMin + expBoosterMin + skillBooster + highPayingBonus) * 10) / 10;
  const max = Math.round((baseMax + expBoosterMax + skillBooster + highPayingBonus + 1.0) * 10) / 10;

  // Future estimates (2-3 years projection)
  const futureMin = Math.round(min * 1.8 * 10) / 10;
  const futureMax = Math.round(max * 2.2 * 10) / 10;

  return {
    role: roleName,
    min,
    max,
    futureMin,
    futureMax,
    marketDemand: demand,
    matchedSkills: matchedRoleSkills,
  };
}

export interface ProjectRecommendation {
  title: string;
  description: string;
  impact: string;
}

export interface AtsDetails {
  flaws: string[];
  missingProjects: ProjectRecommendation[];
}

export function calculateAtsDetails(roleName: string, detectedSkills: string[], lowerText: string): AtsDetails {
  const flaws: string[] = [];
  const missingProjects: ProjectRecommendation[] = [];

  // General flaws checks
  if (lowerText.length < 1500) {
    flaws.push("Resume content is short (less than 300 words). Add detail on project outcomes.");
  }
  if (!lowerText.includes("education") && !lowerText.includes("academic")) {
    flaws.push("No clear Education section detected. Relabel education block properly.");
  }
  if (!lowerText.includes("project") && !lowerText.includes("selected works")) {
    flaws.push("No dedicated Projects section found. Add 2-3 technical projects.");
  }
  const numberMatches = lowerText.match(/\d+(%|\+|-|k|lpa|lakhs|%|\s?years)/g) || [];
  if (numberMatches.length < 3) {
    flaws.push("Metrics / quantification details are lacking (under 3 metric terms found). Describe impacts using numbers (e.g., 'reduced runtime by 25%').");
  }
  if (!lowerText.includes("github.com")) {
    flaws.push("GitHub link is missing from the header, which is essential for verification.");
  }
  if (!lowerText.includes("linkedin.com")) {
    flaws.push("LinkedIn profile URL is missing, reducing professional networking strength.");
  }

  // Role-specific projects
  if (roleName === "Frontend Developer" || roleName === "Frontend") {
    missingProjects.push({
      title: "Advanced TanStack SaaS Dashboard",
      description: "Build a real-time analytics dashboard implementing TanStack Start, query state caching, and responsive charts.",
      impact: "Optimized network fetch overhead by 45% and enhanced page loading speed to sub-100ms."
    });
    missingProjects.push({
      title: "Accessible Component Design Library",
      description: "Create an accessible UI kit following WCAG 2.1 specifications with complete keyboard navigation support.",
      impact: "Boosted accessibility compliance score by 35% and increased unit test coverage to 92%."
    });
  } else if (roleName === "Backend Developer" || roleName === "Backend") {
    missingProjects.push({
      title: "High-Throughput Redis Cache Engine",
      description: "Implement a database caching layer utilizing Redis and PostgreSQL write-through cache patterns.",
      impact: "Reduced API response times by 70% and handled peak load of 5,000 requests per second."
    });
    missingProjects.push({
      title: "Dockerized Event Microservice Architecture",
      description: "Design a clean microservice system using Kafka or RabbitMQ, fully containerized via Docker Compose.",
      impact: "Achieved zero downtime deployment configurations and improved message delivery failure tolerance to 99.9%."
    });
  } else if (roleName === "AI Engineer" || roleName === "AI / ML" || roleName === "AI") {
    missingProjects.push({
      title: "LangChain Agentic Assistant with Local Vector Index",
      description: "Build a RAG pipeline utilizing vector similarity search databases (e.g. ChromaDB) and prompt guardrails.",
      impact: "Reduced LLM hallucination rates by 28% and cut context retrieval latency to under 150ms."
    });
    missingProjects.push({
      title: "PyTorch Deep Learning Classifier",
      description: "Train and optimize a custom convolution network on image datasets with precise validation matrix metrics.",
      impact: "Achieved 94.6% classification accuracy and compiled production-ready inference endpoints."
    });
  } else if (roleName === "DevOps Engineer" || roleName === "DevOps") {
    missingProjects.push({
      title: "Multi-Environment Terraform IaC Blueprint",
      description: "Provision automatic cloud resources on AWS using Terraform workspaces and secure state locking.",
      impact: "Reduced infrastructure launch times by 80% and enforced absolute environment isolation rules."
    });
    missingProjects.push({
      title: "GitHub Actions Secure CI/CD Workflow",
      description: "Construct a deploy pipeline integrating container image security scanning (e.g., Trivy) and linting checks.",
      impact: "Prevented 100% of pipeline vulnerability leaks and decreased average deploy times to under 3 minutes."
    });
  } else if (roleName === "Data Analyst") {
    missingProjects.push({
      title: "Interactive Tableau Operations Performance Tracker",
      description: "Build a multi-dimensional corporate database visualizer with Tableau integrating Excel/SQL datasets.",
      impact: "Saved operational reporting preparation times by 12 hours weekly and highlighted 5 actionable bottleneck metrics."
    });
    missingProjects.push({
      title: "Predictive Analytics Model on Customer Churn",
      description: "Conduct predictive exploratory analysis on retail datasets using Pandas, NumPy, and regression models.",
      impact: "Identified key churn variables with 88% precision score, enabling retention campaign planning."
    });
  } else {
    // general software engineer
    missingProjects.push({
      title: "RESTful API Server with Robust Telemetry",
      description: "Develop a clean Node.js / Express backend with logging telemetry and token security.",
      impact: "Achieved 99.9% server up-time statistics and simplified team tracking metrics by 50%."
    });
  }

  // If no flaws were added, add a default helper tip
  if (flaws.length === 0) {
    flaws.push("Review formatting structure: convert paragraph blocks to concise bullet points starting with action verbs.");
  }

  return {
    flaws,
    missingProjects
  };
}

// Helper to calculate resume strength scores dynamically
export function calculateStrengthScores(
  detectedSkills: string[],
  role: string,
  expYears: number,
  experienceFound: boolean,
  projectsFound: boolean,
  educationFound: boolean,
  skillsFound: boolean,
  lowerText: string
): StrengthScores {
  // 1. Technical Skills (0-100%)
  const roleSkills = ROLE_COMPETENCIES[role] || ROLE_COMPETENCIES["Software Engineer"];
  const matchedSkills = roleSkills.filter(s => detectedSkills.includes(s));
  const technicalSkills = Math.min(100, Math.round((matchedSkills.length / Math.max(1, roleSkills.length)) * 100));

  // 2. Experience Quality (0-100%)
  let expQuality = experienceFound ? 40 : 0;
  expQuality += Math.min(40, expYears * 10); // +10 points per year of exp, up to 40
  const qualityVerbs = ["led", "spearheaded", "architected", "optimized", "managed", "reduced", "increased"];
  let qualityCount = 0;
  qualityVerbs.forEach(v => {
    if (lowerText.includes(v)) qualityCount++;
  });
  expQuality += Math.min(20, qualityCount * 4); // up to 20 points for quality action verbs
  const experienceQuality = Math.min(100, Math.max(20, expQuality));

  // 3. Project Strength (0-100%)
  let projStrength = projectsFound ? 50 : 20;
  const projectKeywords = ["github", "deploy", "git", "vercel", "heroku", "docker", "optimized"];
  let keywordCount = 0;
  projectKeywords.forEach(k => {
    if (lowerText.includes(k)) keywordCount++;
  });
  projStrength += Math.min(30, keywordCount * 5); // up to 30 points
  const hasNumbers = /\b\d+\b/.test(lowerText);
  if (hasNumbers) projStrength += 10;
  const projectStrength = Math.min(100, projStrength);

  // 4. Resume Completeness (0-100%)
  let completeness = 0;
  if (experienceFound) completeness += 20;
  if (educationFound) completeness += 20;
  if (projectsFound) completeness += 20;
  if (skillsFound) completeness += 20;
  if (lowerText.includes("@")) completeness += 5; // email
  if (/\b\d{10}\b/.test(lowerText) || /phone|contact/.test(lowerText)) completeness += 5; // phone
  if (lowerText.includes("github.com")) completeness += 5;
  if (lowerText.includes("linkedin.com")) completeness += 5;
  const resumeCompleteness = Math.min(100, completeness);

  return {
    technicalSkills,
    experienceQuality,
    projectStrength,
    resumeCompleteness,
  };
}

// Industry Standards and Improvement suggestions per role
export const INDUSTRY_STANDARDS: Record<string, { standards: string[]; improvementTemplates: string[] }> = {
  "Frontend Developer": {
    standards: ["React", "TypeScript", "Next.js", "TailwindCSS", "Git", "Cypress", "GraphQL"],
    improvementTemplates: [
      "Master Next.js server side components and App Router to align with modern industry architecture.",
      "Add automated end-to-end testing with Cypress or Playwright to improve delivery confidence.",
      "Implement deep performance optimization patterns, like dynamic code splitting and image caching."
    ]
  },
  "Backend Developer": {
    standards: ["Node.js", "SQL", "MongoDB", "Redis", "Docker", "System Design", "PostgreSQL"],
    improvementTemplates: [
      "Introduce cache optimization using Redis to improve server-response latency.",
      "Incorporate containerization patterns using Docker and local database compose files.",
      "Demonstrate database replication or complex SQL index optimization concepts."
    ]
  },
  "Full Stack Developer": {
    standards: ["React", "TypeScript", "Node.js", "MongoDB", "SQL", "Docker", "System Design", "Git"],
    improvementTemplates: [
      "Improve architectural balance by implementing clean system-design patterns.",
      "Incorporate end-to-end telemetry and monitoring, like Prometheus/Grafana or basic logging.",
      "Utilize database transactions and migration scripts to build more robust data operations."
    ]
  },
  "AI Engineer": {
    standards: ["Python", "Machine Learning", "Deep Learning", "LLM", "RAG", "PyTorch", "OpenAI", "Pandas"],
    improvementTemplates: [
      "Build a RAG pipeline utilizing vector search databases (Chroma/Pinecone) to represent production AI.",
      "Familiarize with model fine-tuning or prompt evaluation frameworks (like LangSmith or Ragas).",
      "Deploy models to cloud infrastructure using serverless functions or containerized endpoints."
    ]
  },
  "DevOps Engineer": {
    standards: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Jenkins"],
    improvementTemplates: [
      "Implement Infrastructure-as-code files using Terraform to demonstrate environment automation.",
      "Set up strict multi-stage GitHub Actions CI/CD pipelines including linting and security scans.",
      "Familiarize with container orchestration concepts via Kubernetes local deployments (Minikube)."
    ]
  },
  "Data Analyst": {
    standards: ["SQL", "Python", "Tableau", "Excel", "PowerBI", "Statistics", "Pandas"],
    improvementTemplates: [
      "Develop interactive and comprehensive corporate reporting models in Tableau or PowerBI.",
      "Improve database analysis capabilities by mastering complex SQL CTEs and window functions.",
      "Apply statistical hypothesis testing using SciPy/Statsmodels to substantiate your analyses."
    ]
  },
  "Mobile Developer": {
    standards: ["React Native", "Flutter", "Swift", "Kotlin", "Git"],
    improvementTemplates: [
      "Establish deep mobile offline-caching layers using SQLite or local device storage systems.",
      "Implement platform-native custom bindings or clean modular separation in Flutter/Swift.",
      "Introduce automated unit testing and crash monitoring SDK integrations."
    ]
  },
  "Software Engineer": {
    standards: ["JavaScript", "Python", "SQL", "Git", "DSA", "System Design"],
    improvementTemplates: [
      "Improve algorithm optimization metrics by studying advanced data structures and complexity bounds.",
      "Document API schema structures clearly with Swagger/OpenAPI specifications.",
      "Enforce code validation rules by configuring strict ESLint/Prettier workflows in Git hooks."
    ]
  }
};

export function calculateIndustryReadiness(role: string, detectedSkills: string[]): IndustryReadiness {
  const meta = INDUSTRY_STANDARDS[role] || INDUSTRY_STANDARDS["Software Engineer"];
  const matched = meta.standards.filter(s => detectedSkills.some(ds => ds.toLowerCase() === s.toLowerCase()));
  const score = Math.min(100, Math.max(30, Math.round((matched.length / meta.standards.length) * 100)));

  const missing = meta.standards.filter(s => !detectedSkills.some(ds => ds.toLowerCase() === s.toLowerCase()));
  const improvementAreas: string[] = [];
  
  if (missing.length > 0) {
    meta.improvementTemplates.forEach((template) => {
      if (improvementAreas.length < 3) {
        improvementAreas.push(template);
      }
    });
  }

  if (improvementAreas.length === 0) {
    improvementAreas.push("Keep track of emerging industry tools and continue building portfolio projects.");
    improvementAreas.push("Incorporate automated testing coverage to maintain code quality standards.");
  }

  return {
    score,
    roleName: role,
    standardsMatched: matched,
    improvementAreas,
  };
}

export const analyzeResumeServer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      text: z.string(),
      fileName: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const text = data.text;
    const lowerText = text.toLowerCase();

    // 1. Extract Contact Info
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const githubRegex = /(github\.com\/[a-zA-Z0-9_-]+)/i;
    const linkedinRegex = /(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i;

    const emailMatch = lowerText.match(emailRegex);
    const phoneMatch = lowerText.match(phoneRegex);
    const githubMatch = lowerText.match(githubRegex);
    const linkedinMatch = lowerText.match(linkedinRegex);

    const email = emailMatch ? emailMatch[0] : "";
    const phone = phoneMatch ? phoneMatch[0] : "";
    const github = githubMatch ? `https://${githubMatch[0]}` : "";
    const linkedin = linkedinMatch ? `https://${linkedinMatch[0]}` : "";

    // Candidate Name extraction heuristic
    let name = "Candidate";
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length > 0) {
      // Find first line that doesn't contain common resume header labels, emails, or phone numbers
      const nameCandidate = lines.find(line => {
        const lowerLine = line.toLowerCase();
        return (
          !lowerLine.includes("resume") &&
          !lowerLine.includes("cv") &&
          !lowerLine.includes("curriculum") &&
          !lowerLine.includes("@") &&
          !lowerLine.match(/\d{4}/) &&
          line.length < 40
        );
      });
      if (nameCandidate) {
        name = nameCandidate;
      } else if (data.fileName) {
        // Fallback to filename prefix
        name = data.fileName.split(".")[0].replace(/[-_]/g, " ");
        // Capitalize words
        name = name.replace(/\b\w/g, c => c.toUpperCase());
      }
    }

    // 2. Extract Skills
    const detectedSkillsSet = new Set<string>();
    const domainCounts: Record<string, number> = {
      Frontend: 0,
      Backend: 0,
      AI: 0,
      Cloud: 0,
      Mobile: 0,
      Data: 0,
      DSA: 0,
      Design: 0,
    };

    // Match keywords against database
    Object.keys(SKILLS_DATABASE).forEach((key) => {
      // Use word boundaries or sub-string match depending on length
      const skillMeta = SKILLS_DATABASE[key];
      let hasSkill = false;

      if (key.length <= 3) {
        // Strict boundary for short skills like Go, SQL, C#, AWS, DSA, NLP
        const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        const regex = new RegExp(`\\b${escapedKey}\\b`, "i");
        hasSkill = regex.test(lowerText);
      } else {
        hasSkill = lowerText.includes(key);
      }

      if (hasSkill) {
        detectedSkillsSet.add(skillMeta.name);
        domainCounts[skillMeta.domain] = (domainCounts[skillMeta.domain] || 0) + 1;
      }
    });

    const detectedSkills = Array.from(detectedSkillsSet);

    // Fallback: If absolutely no skills detected, provide a few standard ones based on text cues
    if (detectedSkills.length === 0) {
      if (lowerText.includes("software") || lowerText.includes("developer")) {
        detectedSkills.push("JavaScript", "Git", "HTML", "CSS");
        domainCounts.Frontend = 3;
        domainCounts.Cloud = 1;
      }
    }

    // 3. Classify Candidate Role
    let role = "Software Engineer";
    let maxCount = 0;
    let primaryDomain = "DSA";

    Object.keys(domainCounts).forEach((domain) => {
      if (domainCounts[domain] > maxCount) {
        maxCount = domainCounts[domain];
        primaryDomain = domain;
      }
    });

    // Heuristics for hybrid profiles
    if (domainCounts.Frontend >= 2 && domainCounts.Backend >= 2) {
      role = "Full Stack Developer";
    } else if (primaryDomain === "Frontend") {
      role = "Frontend Developer";
    } else if (primaryDomain === "Backend") {
      role = "Backend Developer";
    } else if (primaryDomain === "AI") {
      role = "AI Engineer";
    } else if (primaryDomain === "Cloud") {
      role = "DevOps Engineer";
    } else if (primaryDomain === "Mobile") {
      role = "Mobile Developer";
    } else if (primaryDomain === "Data") {
      role = "Data Analyst";
    }

    // 4. Missing Skills & Gaps
    const competencies = ROLE_COMPETENCIES[role] || ROLE_COMPETENCIES["Software Engineer"];
    const missingSkills = competencies.filter(
      (comp) => !detectedSkills.includes(comp)
    );

    // 5. Calculate ATS Score
    // Section Completeness: max 25 points
    let sectionScore = 0;
    const sections = {
      experience: ["experience", "work history", "employment", "professional experience", "internship"],
      education: ["education", "academic", "university", "college", "degree"],
      projects: ["project", "selected works", "academic work", "hackathon"],
      skills: ["skills", "technologies", "key skills", "proficiencies", "expertise"],
    };

    let experienceFound = false;
    let educationFound = false;
    let projectsFound = false;
    let skillsFound = false;

    Object.keys(sections).forEach((sec) => {
      const keywords = sections[sec as keyof typeof sections];
      const found = keywords.some(keyword => lowerText.includes(keyword));
      if (found) {
        sectionScore += 6.25;
        if (sec === "experience") experienceFound = true;
        if (sec === "education") educationFound = true;
        if (sec === "projects") projectsFound = true;
        if (sec === "skills") skillsFound = true;
      }
    });
    sectionScore = Math.min(25, Math.round(sectionScore));

    // Skill Alignment: max 40 points
    const matchedCoreCount = competencies.length - missingSkills.length;
    const skillAlignPercent = competencies.length > 0 ? matchedCoreCount / competencies.length : 1;
    const skillScore = Math.round(skillAlignPercent * 40);

    // Quantification & Formatting: max 20 points
    let quantificationScore = 0;
    // Look for numbers, %, currency signs
    const numberMatches = lowerText.match(/\d+(%|\+|-|k|lpa|lakhs|%|\s?years)/g) || [];
    const metricCount = numberMatches.length;
    quantificationScore += Math.min(10, metricCount * 2); // 2 points per metric, max 10

    // Action verbs
    const actionVerbs = [
      "implemented", "designed", "developed", "optimized", "managed",
      "led", "built", "architected", "spearheaded", "created",
      "reduced", "increased", "resolved", "improved", "launched"
    ];
    let verbCount = 0;
    actionVerbs.forEach(verb => {
      if (lowerText.includes(verb)) verbCount++;
    });
    quantificationScore += Math.min(10, verbCount * 2); // 2 points per action verb, max 10

    // Contact Details: max 15 points
    let contactScore = 0;
    if (email) contactScore += 5;
    if (phone) contactScore += 5;
    if (github) contactScore += 2.5;
    if (linkedin) contactScore += 2.5;

    const atsScore = sectionScore + skillScore + quantificationScore + contactScore;

    // Experience years extraction heuristic (moved early)
    let expYears = 0;
    const expMatches = lowerText.match(/(\d+)\+?\s?years?\s?(of)?\s?exp/i) || lowerText.match(/exp(erience)?:\s?(\d+)/i) || lowerText.match(/(\d+)\+?\s?years?\s?(of)?\s?work/i);
    if (expMatches) {
      const matchedVal = expMatches[1] || expMatches[2];
      expYears = parseInt(matchedVal) || 0;
    }

    // Dynamic Salary Estimates for the 5 target domains
    const frontendSalary = calculateRoleSalary("Frontend Developer", expYears, detectedSkills);
    const backendSalary = calculateRoleSalary("Backend Developer", expYears, detectedSkills);
    const aimlSalary = calculateRoleSalary("AI Engineer", expYears, detectedSkills);
    const devopsSalary = calculateRoleSalary("DevOps Engineer", expYears, detectedSkills);
    const dataanalystSalary = calculateRoleSalary("Data Analyst", expYears, detectedSkills);

    const salaryEstimates = {
      frontend: frontendSalary,
      backend: backendSalary,
      aiml: aimlSalary,
      devops: devopsSalary,
      dataanalyst: dataanalystSalary,
    };

    // Determine current and future salary potentials based on detected role
    let activeEstimate = frontendSalary;
    if (role.includes("Backend")) {
      activeEstimate = backendSalary;
    } else if (role.includes("AI") || role.includes("Machine") || role.includes("ML")) {
      activeEstimate = aimlSalary;
    } else if (role.includes("DevOps") || role.includes("Cloud")) {
      activeEstimate = devopsSalary;
    } else if (role.includes("Data")) {
      activeEstimate = dataanalystSalary;
    } else if (role.includes("Full Stack")) {
      // average of frontend and backend
      activeEstimate = {
        role: "Full Stack Developer",
        min: Math.round(((frontendSalary.min + backendSalary.min) / 2) * 10) / 10,
        max: Math.round(((frontendSalary.max + backendSalary.max) / 2) * 10) / 10,
        futureMin: Math.round(((frontendSalary.futureMin + backendSalary.futureMin) / 2) * 10) / 10,
        futureMax: Math.round(((frontendSalary.futureMax + backendSalary.futureMax) / 2) * 10) / 10,
        marketDemand: 93,
        matchedSkills: [...new Set([...frontendSalary.matchedSkills, ...backendSalary.matchedSkills])]
      };
    } else {
      activeEstimate = calculateRoleSalary(role, expYears, detectedSkills);
    }

    const currentSalary = `₹${activeEstimate.min}–${activeEstimate.max} LPA`;
    const futureSalary = `₹${activeEstimate.futureMin}–${activeEstimate.futureMax} LPA`;
    const marketDemand = activeEstimate.marketDemand;

    // Calculate Resume Strength Scores dynamically
    const strengthScores = calculateStrengthScores(
      detectedSkills,
      role,
      expYears,
      experienceFound,
      projectsFound,
      educationFound,
      skillsFound,
      lowerText
    );

    // Calculate Industry Readiness Score dynamically
    const industryReadiness = calculateIndustryReadiness(role, detectedSkills);

    // Calculate ATS Flaws & Project Recommendations
    const atsDetails = calculateAtsDetails(role, detectedSkills, lowerText);

    // Skill Strength & Career Readiness (aligned with new systems)
    const skillStrength = strengthScores.technicalSkills;
    const careerReadiness = industryReadiness.score;

    // 8. Strengths & Weaknesses Heuristics
    const weaknesses: string[] = [];
    const suggestions: string[] = [];

    if (missingSkills.length > 0) {
      weaknesses.push(`Missing key role competencies: ${missingSkills.slice(0, 3).join(", ")}`);
      suggestions.push(`Acquire and list skills in: ${missingSkills.slice(0, 3).join(", ")}`);
    }
    if (!experienceFound) {
      weaknesses.push("Professional experience section not detected");
      suggestions.push("Create a clear 'Work Experience' or 'Internships' section detailing your history");
    }
    if (!projectsFound) {
      weaknesses.push("Projects section missing or poorly structured");
      suggestions.push("Add a 'Projects' section with 2-3 key technical projects built using your primary stack");
    }
    if (metricCount < 3) {
      weaknesses.push("Lack of quantified achievements (missing numbers, metrics, percentages)");
      suggestions.push("Describe project results using metrics, e.g., 'Optimized page load speed by 35%'");
    }
    if (!github && !linkedin) {
      weaknesses.push("Missing professional profile links (GitHub/LinkedIn)");
      suggestions.push("Add links to your GitHub profile and LinkedIn pages in the header");
    }

    if (weaknesses.length === 0) {
      weaknesses.push("No major weaknesses detected. Keep refining your project depth!");
    }
    if (suggestions.length === 0) {
      suggestions.push("Your resume is well optimized. Tailor it specifically for individual job descriptions.");
    }

    // 9. Recruiter Score & Narrative Evaluation
    const experiencePoints = Math.min(100, expYears * 20 || 30); // 30 starting points for freshers, up to 100 for 5+ years
    const recruiterScore = Math.min(100, Math.round(0.4 * atsScore + 0.3 * skillStrength + 0.3 * experiencePoints));

    let recruiterEvaluation = "";
    if (recruiterScore >= 85) {
      recruiterEvaluation = `Highly Competitive: ${name} exhibits strong alignment as a ${role}. The resume shows excellent skill breadth (${detectedSkills.slice(0, 5).join(", ")}), structured project sections, and strong formatting indicators. Recommended for fast-track interview scheduling.`;
    } else if (recruiterScore >= 70) {
      recruiterEvaluation = `Solid Candidate: ${name} shows solid competency as a ${role} with standard skill sets like ${detectedSkills.slice(0, 3).join(", ")}. There are some missing credentials (e.g. ${missingSkills.slice(0, 2).join(", ") || "Cloud deployment"}), but they possess code-competence. Recommended for technical screening.`;
    } else {
      recruiterEvaluation = `Upskilling Recommended: ${name} has initial coding familiarity, but the profile needs optimization. Key gaps exist in section structure, professional portfolios, or core technologies for a ${role} role. Advise completing targeted roadmap projects first.`;
    }

    // 10. Radar Chart Skills Mapping (value out of 100)
    // We map Candidate strength to categories: Frontend, Backend, AI/ML, Cloud, DSA, Design
    const radarSkills = [
      { label: "Frontend", value: Math.min(100, Math.max(30, (domainCounts.Frontend / 5) * 100)) },
      { label: "Backend", value: Math.min(100, Math.max(30, (domainCounts.Backend / 5) * 100)) },
      { label: "AI / ML", value: Math.min(100, Math.max(30, (domainCounts.AI / 3) * 100)) },
      { label: "Cloud", value: Math.min(100, Math.max(30, (domainCounts.Cloud / 3) * 100)) },
      { label: "DSA", value: Math.min(100, Math.max(30, lowerText.includes("dsa") || lowerText.includes("structures") || lowerText.includes("algorithms") ? 85 : 50)) },
      { label: "Design", value: Math.min(100, Math.max(30, lowerText.includes("system design") || lowerText.includes("architecture") ? 80 : 55)) },
    ];

    // 11. Dynamic Learning Roadmap (3 Months)
    const roadmap = [];
    if (missingSkills.length > 0) {
      // Phase 1: Basic Gaps
      const phase1Skills = missingSkills.slice(0, 2);
      roadmap.push({
        month: "Month 1",
        title: `Core Gaps: ${phase1Skills.join(" & ")}`,
        status: "current",
        tasks: phase1Skills.map(skill => ({
          title: `Master fundamentals of ${skill}`,
          type: "course",
          iconName: "PlayCircle",
        })).concat(phase1Skills.map(skill => ({
          title: `Build a mini project demonstrating ${skill}`,
          type: "project",
          iconName: "Code2",
        }))),
      });

      // Phase 2: Secondary Gaps
      const phase2Skills = missingSkills.slice(2, 4);
      if (phase2Skills.length > 0) {
        roadmap.push({
          month: "Month 2",
          title: `Stack Expansion: ${phase2Skills.join(" & ")}`,
          status: "upcoming",
          tasks: phase2Skills.map(skill => ({
            title: `Learn advanced concepts of ${skill}`,
            type: "course",
            iconName: "PlayCircle",
          })).concat(phase2Skills.map(skill => ({
            title: `Integrate ${skill} into your current codebase`,
            type: "project",
            iconName: "Code2",
          }))),
        });
      } else {
        roadmap.push({
          month: "Month 2",
          title: "System Design & Architecture",
          status: "upcoming",
          tasks: [
            { title: "Study Scalability & System Design Patterns", type: "course", iconName: "PlayCircle" },
            { title: "Architect a scalable microservice concept", type: "project", iconName: "Code2" },
          ],
        });
      }

      // Phase 3: Production Practice
      roadmap.push({
        month: "Month 3",
        title: "Integration & Deployment",
        status: "upcoming",
        tasks: [
          { title: "Containerization & Cloud Deployment (Docker/AWS)", type: "course", iconName: "Award" },
          { title: "Deploy your full-stack app live with CI/CD", type: "project", iconName: "Code2" },
        ],
      });
    } else {
      // Roadmap for someone with no missing skills (Advanced Roadmap)
      roadmap.push({
        month: "Month 1",
        title: "Advanced System Design",
        status: "current",
        tasks: [
          { title: "Read Designing Data-Intensive Applications", type: "course", iconName: "PlayCircle" },
          { title: "Build a highly available distributed cache", type: "project", iconName: "Code2" },
        ],
      });
      roadmap.push({
        month: "Month 2",
        title: "Kubernetes & Cloud Native",
        status: "upcoming",
        tasks: [
          { title: "CKAD Certification Prep", type: "course", iconName: "Award" },
          { title: "Set up a local multi-node Kubernetes cluster", type: "project", iconName: "Code2" },
        ],
      });
      roadmap.push({
        month: "Month 3",
        title: "Security & Observability",
        status: "upcoming",
        tasks: [
          { title: "Implement Prometheus & Grafana Monitoring", type: "project", iconName: "Code2" },
          { title: "Conduct OWASP Top 10 Audit on your apps", type: "course", iconName: "PlayCircle" },
        ],
      });
    }

    // 12. Smart Recommendations
    const recommendations = [];
    const missingOrRoleSkills = missingSkills.length > 0 ? missingSkills : competencies;

    // Recommend Jobs based on detected role
    recommendations.push({
      title: `${role} Opportunity`,
      company: recruiterScore >= 80 ? "Vercel" : "TechNova",
      type: recruiterScore >= 80 ? "Full-Time Job" : "Internship",
      match: recruiterScore,
      iconName: "Briefcase",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      link: "https://vercel.com/careers",
    });

    // Recommend Certification matching missing skill or role
    const certSkill = missingOrRoleSkills[0] || "React";
    let certTitle = `${certSkill} Developer Certificate`;
    let certCompany = "Coursera";
    let certLink = "https://www.coursera.org";

    if (certSkill === "AWS" || certSkill === "Cloud") {
      certTitle = "AWS Certified Cloud Practitioner";
      certCompany = "Amazon";
      certLink = "https://aws.amazon.com/certification/certified-cloud-practitioner/";
    } else if (certSkill === "React" || certSkill === "Frontend") {
      certTitle = "Meta Frontend Developer Certificate";
      certCompany = "Coursera";
      certLink = "https://www.coursera.org/professional-certificates/meta-front-end-developer";
    } else if (certSkill === "Python" || certSkill === "AI" || certSkill === "Machine Learning") {
      certTitle = "Supervised Machine Learning: Regression and Classification";
      certCompany = "DeepLearning.AI";
      certLink = "https://www.coursera.org/learn/machine-learning";
    }

    recommendations.push({
      title: certTitle,
      company: certCompany,
      type: "Certification",
      match: Math.min(99, recruiterScore + 5),
      iconName: "GraduationCap",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      link: certLink,
    });

    // Recommend Open Source Project
    const osSkill = missingOrRoleSkills[1] || missingOrRoleSkills[0] || "TypeScript";
    let osTitle = `${osSkill} Open Source Contribution`;
    let osCompany = "GitHub";
    let osLink = "https://github.com";

    if (osSkill === "TypeScript" || osSkill === "React") {
      osTitle = "React Query Open Source Contribution";
      osCompany = "TanStack";
      osLink = "https://github.com/TanStack/query";
    } else if (osSkill === "Node.js" || osSkill === "Express") {
      osTitle = "Fastify Open Source Issues";
      osCompany = "Fastify Org";
      osLink = "https://github.com/fastify/fastify";
    } else if (osSkill === "Python" || osSkill === "AI") {
      osTitle = "LangChain Agentic Systems Contributions";
      osCompany = "LangChain AI";
      osLink = "https://github.com/langchain-ai/langchain";
    }

    recommendations.push({
      title: osTitle,
      company: osCompany,
      type: "Open Source",
      match: Math.min(95, recruiterScore + 2),
      iconName: "Github",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      link: osLink,
    });

    return {
      name,
      email,
      phone,
      github,
      linkedin,
      role,
      atsScore,
      skillStrength,
      careerReadiness,
      detectedSkills,
      missingSkills,
      weaknesses,
      suggestions,
      currentSalary,
      futureSalary,
      marketDemand,
      roadmap,
      recommendations,
      recruiterScore,
      recruiterEvaluation,
      radarSkills,
      salaryEstimates,
      strengthScores,
      industryReadiness,
      atsDetails,
      subscores: {
        structure: Math.round((sectionScore / 25) * 100),
        keywords: Math.round((skillScore / 40) * 100),
        formatting: Math.round((quantificationScore / 20) * 100),
      },
    };
  });
