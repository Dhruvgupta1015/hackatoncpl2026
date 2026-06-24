import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useResume } from "@/lib/resumeContext";
import {
  Bell,
  Search,
  TrendingUp,
  Award,
  Brain,
  Zap,
  Activity,
  Sparkles,
  ArrowUpRight,
  Cpu,
  Target,
  Flame,
  CheckCircle2,
} from "lucide-react";

/* ------------------------------- Sub widgets ------------------------------ */

function RingProgress({
  value,
  label,
  color,
  size = 132,
}: {
  value: number;
  label: string;
  color: string;
  size?: number;
}) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="-rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={r} stroke="oklch(0.20 0.03 260 / 6%)" strokeWidth="7" fill="none" />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          stroke={`url(#grad-${label})`}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 10px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl font-bold tracking-tight"
        >
          {value}
          <span className="text-sm text-muted-foreground">%</span>
        </motion.span>
        <span className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}

function SkillBar({ name, value, color }: { name: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground/90">{name}</span>
        <span className="font-mono text-muted-foreground">{value}%</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 14px ${color}` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------- Radar chart ------------------------------ */

const RADAR_SKILLS = [
  { label: "Frontend", value: 88 },
  { label: "Backend", value: 72 },
  { label: "AI / ML", value: 64 },
  { label: "Cloud", value: 55 },
  { label: "DSA", value: 80 },
  { label: "Design", value: 70 },
];

function RadarChart({ skills = RADAR_SKILLS }: { skills?: { label: string; value: number }[] }) {
  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 92;
  const n = skills.length;

  const point = (i: number, value: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (radius * value) / 100;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  };

  const polygon = skills.map((s, i) => point(i, s.value).join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px]">
      <defs>
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.78 0.18 200)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.68 0.22 290)" stopOpacity="0.18" />
        </radialGradient>
      </defs>

      {/* concentric rings */}
      {[0.25, 0.5, 0.75, 1].map((p, idx) => (
        <polygon
          key={idx}
          points={skills.map((_, i) => point(i, p * 100).join(",")).join(" ")}
          fill="none"
          stroke="oklch(1 0 0 / 6%)"
          strokeWidth="1"
        />
      ))}

      {/* spokes */}
      {skills.map((_, i) => {
        const [x, y] = point(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="oklch(1 0 0 / 5%)" />;
      })}

      {/* skill polygon */}
      <motion.polygon
        points={polygon}
        fill="url(#radarFill)"
        stroke="oklch(0.78 0.18 200)"
        strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          transformOrigin: "center",
          filter: "drop-shadow(0 0 12px rgba(6, 182, 212, 0.6))",
        }}
      />

      {/* dots */}
      {skills.map((s, i) => {
        const [x, y] = point(i, s.value);
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="3.5"
            fill="oklch(0.97 0.01 250)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 + i * 0.05 }}
          />
        );
      })}

      {/* labels */}
      {skills.map((s, i) => {
        const [x, y] = point(i, 122);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground/80"
            style={{ fontSize: 10.5, fontWeight: 600 }}
          >
            {s.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ---------------------------- Career readiness ---------------------------- */

function ReadinessMeter({ value = 78 }: { value?: number }) {
  const r = 70;
  const c = Math.PI * r; // half circle
  const offset = c - (value / 100) * c;
  return (
    <div className="relative">
      <svg viewBox="0 0 200 120" className="w-full">
        <defs>
          <linearGradient id="meter" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="oklch(0.78 0.18 200)" />
            <stop offset="50%" stopColor="oklch(0.68 0.22 290)" />
            <stop offset="100%" stopColor="oklch(0.72 0.22 335)" />
          </linearGradient>
        </defs>
        <path
          d="M30,100 A70,70 0 0 1 170,100"
          stroke="oklch(0.20 0.03 260 / 6%)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <motion.path
          d="M30,100 A70,70 0 0 1 170,100"
          stroke="url(#meter)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: "drop-shadow(0 0 14px rgba(168, 85, 247, 0.7))" }}
        />
      </svg>
      <div className="-mt-10 flex flex-col items-center">
        <span className="text-5xl font-bold tracking-tight text-gradient">{value}</span>
        <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Career Readiness Index
        </span>
      </div>
    </div>
  );
}

/* ----------------------------- Activity graph ----------------------------- */

const ACTIVITY = [22, 35, 28, 48, 42, 60, 55, 72, 65, 80, 76, 88];

function ActivityChart() {
  const w = 320;
  const h = 110;
  const step = w / (ACTIVITY.length - 1);
  const max = Math.max(...ACTIVITY);
  const points = ACTIVITY.map((v, i) => [i * step, h - (v / max) * (h - 14) - 6]);

  const path =
    "M" +
    points
      .map(([x, y], i) => {
        if (i === 0) return `${x},${y}`;
        const [px, py] = points[i - 1];
        const mx = (px + x) / 2;
        return `Q${px},${py} ${mx},${(py + y) / 2} T${x},${y}`;
      })
      .join(" ");

  const fill = `${path} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="actFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.22 290)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.68 0.22 290)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="actStroke" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.78 0.18 200)" />
          <stop offset="100%" stopColor="oklch(0.72 0.22 335)" />
        </linearGradient>
      </defs>
      <motion.path
        d={fill}
        fill="url(#actFill)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="url(#actStroke)"
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        style={{ filter: "drop-shadow(0 0 8px rgba(6, 182, 212, 0.6))" }}
      />
      {points.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={i === points.length - 1 ? 4 : 2}
          fill="oklch(0.97 0.01 250)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 + i * 0.04 }}
        />
      ))}
    </svg>
  );
}

/* --------------------------------- Main ---------------------------------- */

export function DashboardPreview() {
  const { analysisResult } = useResume();
  const { user } = useAuth();
  const [role, setRole] = useState("Frontend");

  const [pitchCompany, setPitchCompany] = useState("TechNova");
  const [pitchTone, setPitchTone] = useState("Professional");
  const [pitchPlatform, setPitchPlatform] = useState("Email");
  const [copied, setCopied] = useState(false);

  // Sync selected role tab with candidate's actual parsed role
  useEffect(() => {
    if (analysisResult) {
      if (analysisResult.role.includes("Frontend")) {
        setRole("Frontend");
      } else if (analysisResult.role.includes("Backend")) {
        setRole("Backend");
      } else {
        setRole("AI");
      }
    }
  }, [analysisResult]);

  const dashboardData = {
    Frontend: {
      readiness: 82,
      ats: 88,
      strength: 90,
      streak: 21,
      insight: "Master Next.js and TypeScript to unlock more frontend roles.",
      strengthScores: {
        technicalSkills: 88,
        experienceQuality: 75,
        projectStrength: 82,
        resumeCompleteness: 95,
      },
      industryReadiness: {
        score: 82,
        roleName: "Frontend Developer",
        standardsMatched: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Git"],
        improvementAreas: [
          "Master Next.js server side components and App Router to align with modern industry architecture.",
          "Add automated end-to-end testing with Cypress or Playwright to improve delivery confidence.",
        ],
      },
      salaryEstimates: {
        frontend: { role: "Frontend Developer", min: 5.2, max: 7.8, futureMin: 9.4, futureMax: 17.2, marketDemand: 84, matchedSkills: ["React", "TypeScript"] },
        backend: { role: "Backend Developer", min: 4.8, max: 7.2, futureMin: 8.6, futureMax: 15.8, marketDemand: 78, matchedSkills: [] },
        aiml: { role: "AI Engineer", min: 6.5, max: 10.0, futureMin: 11.7, futureMax: 22.0, marketDemand: 82, matchedSkills: [] },
        devops: { role: "DevOps Engineer", min: 5.5, max: 8.5, futureMin: 9.9, futureMax: 18.7, marketDemand: 80, matchedSkills: [] },
        dataanalyst: { role: "Data Analyst", min: 4.2, max: 6.5, futureMin: 7.6, futureMax: 14.3, marketDemand: 74, matchedSkills: [] },
      }
    },
    Backend: {
      readiness: 79,
      ats: 84,
      strength: 87,
      streak: 18,
      insight: "Focus on System Design and Microservices.",
      strengthScores: {
        technicalSkills: 84,
        experienceQuality: 80,
        projectStrength: 85,
        resumeCompleteness: 90,
      },
      industryReadiness: {
        score: 79,
        roleName: "Backend Developer",
        standardsMatched: ["Node.js", "Express", "SQL", "MongoDB", "Git"],
        improvementAreas: [
          "Introduce cache optimization using Redis to improve server-response latency.",
          "Incorporate containerization patterns using Docker and local database compose files.",
        ],
      },
      salaryEstimates: {
        frontend: { role: "Frontend Developer", min: 4.5, max: 6.8, futureMin: 8.1, futureMax: 15.0, marketDemand: 76, matchedSkills: [] },
        backend: { role: "Backend Developer", min: 6.2, max: 9.5, futureMin: 11.2, futureMax: 20.9, marketDemand: 88, matchedSkills: ["Node.js", "Express", "MongoDB"] },
        aiml: { role: "AI Engineer", min: 6.8, max: 10.5, futureMin: 12.2, futureMax: 23.1, marketDemand: 84, matchedSkills: [] },
        devops: { role: "DevOps Engineer", min: 5.8, max: 9.0, futureMin: 10.4, futureMax: 19.8, marketDemand: 82, matchedSkills: [] },
        dataanalyst: { role: "Data Analyst", min: 4.5, max: 7.0, futureMin: 8.1, futureMax: 15.4, marketDemand: 76, matchedSkills: [] },
      }
    },
    AI: {
      readiness: 91,
      ats: 86,
      strength: 94,
      streak: 30,
      insight: "Build RAG and Agentic AI projects for maximum impact.",
      strengthScores: {
        technicalSkills: 92,
        experienceQuality: 88,
        projectStrength: 90,
        resumeCompleteness: 95,
      },
      industryReadiness: {
        score: 91,
        roleName: "AI Engineer",
        standardsMatched: ["Python", "Machine Learning", "Deep Learning", "LLM", "OpenAI"],
        improvementAreas: [
          "Build a RAG pipeline utilizing vector search databases (Chroma/Pinecone) to represent production AI.",
          "Familiarize with model fine-tuning or prompt evaluation frameworks (like LangSmith or Ragas).",
        ],
      },
      salaryEstimates: {
        frontend: { role: "Frontend Developer", min: 4.8, max: 7.2, futureMin: 8.6, futureMax: 15.8, marketDemand: 78, matchedSkills: [] },
        backend: { role: "Backend Developer", min: 5.5, max: 8.5, futureMin: 9.9, futureMax: 18.7, marketDemand: 82, matchedSkills: [] },
        aiml: { role: "AI Engineer", min: 8.5, max: 13.5, futureMin: 15.3, futureMax: 29.7, marketDemand: 97, matchedSkills: ["Python", "Machine Learning", "LLM"] },
        devops: { role: "DevOps Engineer", min: 6.0, max: 9.2, futureMin: 10.8, futureMax: 20.2, marketDemand: 84, matchedSkills: [] },
        dataanalyst: { role: "Data Analyst", min: 5.0, max: 7.8, futureMin: 9.0, futureMax: 17.2, marketDemand: 80, matchedSkills: [] },
      }
    },
  };

  const current = analysisResult
    ? (() => {
        const frontendStandards = ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Next.js", "TailwindCSS", "Git"];
        const backendStandards = ["Node.js", "Express", "SQL", "PostgreSQL", "MongoDB", "Redis", "System Design", "Docker", "Git"];
        const aiStandards = ["Python", "Machine Learning", "PyTorch", "TensorFlow", "LLMs", "Deep Learning", "SQL", "Git", "OpenAI"];

        const activeStandards = role === "Frontend" 
          ? frontendStandards 
          : role === "Backend" 
            ? backendStandards 
            : aiStandards;

        const detected = analysisResult.detectedSkills || [];
        const matched = detected.filter(s => {
          const lowerS = s.toLowerCase();
          return activeStandards.some(std => std.toLowerCase() === lowerS);
        });
        const missing = activeStandards.filter(std => {
          const lowerStd = std.toLowerCase();
          return !detected.some(s => s.toLowerCase() === lowerStd);
        });

        const matchesActiveRole = 
          (role === "Frontend" && analysisResult.role.toLowerCase().includes("frontend")) ||
          (role === "Backend" && analysisResult.role.toLowerCase().includes("backend")) ||
          (role === "AI" && (analysisResult.role.toLowerCase().includes("ai") || analysisResult.role.toLowerCase().includes("ml") || analysisResult.role.toLowerCase().includes("machine") || analysisResult.role.toLowerCase().includes("data")));

        const baseReadiness = Math.max(78, analysisResult.careerReadiness || 82);
        const baseStrength = Math.max(75, analysisResult.skillStrength || 80);
        const baseAts = analysisResult.atsScore || 80;

        let dynamicReadiness = baseReadiness;
        let dynamicStrength = baseStrength;
        let dynamicAts = baseAts;

        if (matchesActiveRole) {
          dynamicReadiness = baseReadiness;
          dynamicStrength = baseStrength;
          dynamicAts = baseAts;
        } else {
          const matchRatio = matched.length / Math.max(1, activeStandards.length);
          dynamicReadiness = Math.round(baseReadiness * (0.35 + 0.35 * matchRatio));
          dynamicStrength = Math.round(baseStrength * (0.30 + 0.40 * matchRatio));
          dynamicAts = Math.round(baseAts * (0.75 + 0.15 * matchRatio));
        }

        const dynamicImprovement = missing.slice(0, 3).map(m => {
          if (role === "Frontend") {
            return `Gain hands-on experience in ${m} architecture workflows to build high-performance client rendering.`;
          } else if (role === "Backend") {
            return `Incorporate production-grade ${m} patterns into your service layer pipelines.`;
          } else {
            return `Master core ${m} libraries and model parameters to construct real-time predictive systems.`;
          }
        });
        if (dynamicImprovement.length === 0) {
          dynamicImprovement.push("Resume is fully aligned with all industry requirements for this role!");
        }

        const roleLabel = role === "Frontend" ? "Frontend Developer" : role === "Backend" ? "Backend Developer" : "AI Engineer";
        const dynamicInsight = matchesActiveRole
          ? (analysisResult.recruiterEvaluation || `Strong credentials identified for ${roleLabel}.`)
          : `${analysisResult.name || "Candidate"} is primarily matched as a ${analysisResult.role || "Developer"}, but can expand into ${roleLabel} by addressing key gaps like ${missing.slice(0, 2).join(" & ")}.`;

        return {
          readiness: dynamicReadiness,
          ats: dynamicAts,
          strength: dynamicStrength,
          streak: 21,
          insight: dynamicInsight,
          strengthScores: {
            technicalSkills: dynamicStrength,
            experienceQuality: matchesActiveRole ? 85 : 55,
            projectStrength: matchesActiveRole ? 80 : 60,
            resumeCompleteness: analysisResult.atsScore || 90,
          },
          industryReadiness: {
            score: dynamicReadiness,
            roleName: roleLabel,
            standardsMatched: matched.length > 0 ? matched : activeStandards.slice(0, 2),
            improvementAreas: dynamicImprovement,
          },
          salaryEstimates: analysisResult.salaryEstimates || {
            frontend: { role: "Frontend Developer", min: 4.5, max: 6.5, futureMin: 8.1, futureMax: 14.3, marketDemand: 84, matchedSkills: [] },
            backend: { role: "Backend Developer", min: 5.0, max: 7.5, futureMin: 9.0, futureMax: 16.5, marketDemand: 88, matchedSkills: [] },
            aiml: { role: "AI Engineer", min: 7.0, max: 11.0, futureMin: 12.6, futureMax: 24.2, marketDemand: 96, matchedSkills: [] },
            devops: { role: "DevOps Engineer", min: 6.0, max: 9.0, futureMin: 10.8, futureMax: 19.8, marketDemand: 91, matchedSkills: [] },
            dataanalyst: { role: "Data Analyst", min: 4.0, max: 6.0, futureMin: 7.2, futureMax: 13.2, marketDemand: 86, matchedSkills: [] },
          }
        };
      })()
    : dashboardData[role as keyof typeof dashboardData];

  const generatedPitch = (() => {
    const candidateName = analysisResult?.name || (user?.name || "Aditya Verma");
    const targetRole = current.industryReadiness.roleName || "Frontend Developer";
    const topSkills = current.industryReadiness.standardsMatched.slice(0, 3).join(", ");
    
    if (pitchPlatform === "Email") {
      if (pitchTone === "Professional") {
        return `Subject: Passionate ${targetRole} looking to contribute at ${pitchCompany}

Dear Hiring Team at ${pitchCompany},

My name is ${candidateName}, and I am a ${targetRole} with strong expertise in ${topSkills}. I have been following ${pitchCompany}'s recent advancements, and I am highly inspired by your team's mission.

I recently evaluated my profile against industry benchmarks and achieved a ${current.readiness}% Industry Readiness match. I have developed projects aligning with enterprise-grade architectures and would love to contribute my technical skills to your team. 

Please find my resume attached. I would appreciate 10 minutes of your time to discuss how my skill set aligns with your current goals.

Best regards,
${candidateName}`;
      } else if (pitchTone === "Casual/Creative") {
        return `Subject: Quick question from a ${targetRole} who loves ${pitchCompany}!

Hi team,

I'll keep this short! I'm ${candidateName}, a ${targetRole} obsessed with building clean interfaces and scalable pipelines. 

I've been tracking ${pitchCompany}'s engineering blog and love the work you guys are doing. My technical stack covers ${topSkills}, and I recently scored a ${current.readiness}% readiness index matching your tech stack. 

Are you open to a quick chat next week? I'd love to share some ideas on how I could help build features at ${pitchCompany}.

Cheers,
${candidateName}`;
      } else {
        return `Subject: ${targetRole} Application - ${candidateName}

Dear Engineering Lead,

I am writing to express my interest in joining ${pitchCompany} as a ${targetRole}. 

Key Qualifications:
- Technical Skills: ${topSkills}
- Industry Standards Match: ${current.readiness}%
- Core Focus: Designing modular workflows and reducing response latencies.

I have attached my resume and would welcome the opportunity to discuss how I can add value to the ${pitchCompany} team.

Sincerely,
${candidateName}`;
      }
    } else if (pitchPlatform === "LinkedIn") {
      if (pitchTone === "Professional") {
        return `Hi there, I hope you're having a great week! I am ${candidateName}, a ${targetRole} specializing in ${topSkills}. I am very interested in engineering opportunities at ${pitchCompany}. I evaluated my profile against your stack and have an active ${current.readiness}% match. I'd love to connect and keep in touch regarding potential openings!`;
      } else if (pitchTone === "Casual/Creative") {
        return `Hey! Love what you guys are building at ${pitchCompany}. I'm a ${targetRole} focusing on ${topSkills} (industry index: ${current.readiness}%). Would love to connect and grab 5 minutes to chat about your engineering culture sometime!`;
      } else {
        return `Hello, I'm ${candidateName}. I'm a ${targetRole} with experience in ${topSkills}. I'm seeking opportunities at ${pitchCompany} and would appreciate connecting to learn more about your active open roles. Thank you!`;
      }
    } else {
      return `Hey! I'm a ${targetRole} specializing in ${topSkills}. I scored a ${current.readiness}% readiness match with ${pitchCompany}'s stack. Are you hiring for any developer roles at the moment? Would love to share my portfolio! - ${candidateName}`;
    }
  })();

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const opportunities = analysisResult
    ? [
        ...(analysisResult.recommendations || []).map((rec) => {
          let type = rec.type;
          let title = rec.title;
          let org = rec.company;
          let match = rec.match;
          let color = "from-cyan-500/20 to-cyan-500/0";
          let chip = "bg-cyan-500/15 text-cyan-300 ring-cyan-400/25";

          if (rec.color.includes("emerald")) {
            color = "from-emerald-500/20 to-emerald-500/0";
            chip = "bg-emerald-500/15 text-emerald-300 ring-emerald-400/25";
          } else if (rec.color.includes("amber")) {
            color = "from-amber-500/20 to-amber-500/0";
            chip = "bg-amber-500/15 text-amber-300 ring-amber-400/25";
          } else if (rec.color.includes("pink") || rec.color.includes("violet")) {
            color = "from-violet-500/20 to-violet-500/0";
            chip = "bg-violet-500/15 text-violet-300 ring-violet-400/25";
          }

          return {
            type,
            title,
            org,
            match,
            color,
            chip,
            link: rec.link,
          };
        }),
        {
          type: "Hackathon",
          title: "SkillSync AI Hackathon 2026",
          org: "SkillSync Community",
          match: Math.min(100, analysisResult.careerReadiness + 3),
          color: "from-pink-500/20 to-pink-500/0",
          chip: "bg-pink-500/15 text-pink-300 ring-pink-400/25",
          link: "https://github.com",
        }
      ]
    : [
        {
          type: "Internship",
          title: "Frontend Developer Intern",
          org: "TechNova",
          match: 96,
          color: "from-cyan-500/20 to-cyan-500/0",
          chip: "bg-cyan-500/15 text-cyan-300 ring-cyan-400/25",
          link: "https://vercel.com/careers",
        },
        {
          type: "Hackathon",
          title: "AI Hackathon 2026",
          org: "Google Devs",
          match: 91,
          color: "from-violet-500/20 to-violet-500/0",
          chip: "bg-violet-500/15 text-violet-300 ring-violet-400/25",
          link: "https://github.com",
        },
        {
          type: "Certification",
          title: "AWS Cloud Practitioner",
          org: "Amazon",
          match: 88,
          color: "from-pink-500/20 to-pink-500/0",
          chip: "bg-pink-500/15 text-pink-300 ring-pink-400/25",
          link: "https://aws.amazon.com",
        },
        {
          type: "Project",
          title: "Open Source Contributor",
          org: "Awesome Projects",
          match: 84,
          color: "from-emerald-500/20 to-emerald-500/0",
          chip: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/25",
          link: "https://github.com",
        },
      ];

  return (
    <section id="dashboard" className="relative py-20 md:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[700px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--gradient-radial-glow)] blur-3xl opacity-30" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Demo Mode alert banner */}
        {!analysisResult && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
              <div className="text-left">
                <h4 className="font-semibold text-amber-300">You are viewing Demo Data</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upload your resume in the Resume Analyzer to decode your actual career profile and unlock personalized insights!
                </p>
              </div>
            </div>
            <Link to="/features/resume-analyzer">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl">
                Upload Resume Now
              </Button>
            </Link>
          </motion.div>
        )}

        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live AI Command Center
          </div>

          <div className="flex justify-center mt-6">
            <div className="bg-slate-100/90 border border-slate-200/60 p-1.5 rounded-2xl flex items-center gap-1 shadow-inner relative">
              {[
                { id: "Frontend", label: "Frontend" },
                { id: "Backend", label: "Backend" },
                { id: "AI", label: "AI / ML" },
              ].map((t) => {
                const active = role === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setRole(t.id)}
                    className={`relative px-6 py-2 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                      active
                        ? "bg-white border border-slate-200/80 text-orange-600 shadow-[0_4px_12px_rgba(249,115,22,0.08)]"
                        : "text-slate-550 hover:text-slate-800 hover:bg-white/40"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          <h2 className="mt-5 text-4xl font-bold md:text-5xl">
            Your Career, <span className="text-gradient">decoded by AI</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A real-time intelligence layer for skills, resumes, opportunities and growth — all in
            one premium dashboard.
          </p>
        </motion.div>

        {/* dashboard frame */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mt-14"
        >
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100/50 p-1 shadow-[var(--shadow-elevated)] backdrop-blur-xl">
            <div className="rounded-[20px] bg-white p-5 md:p-7 border border-slate-100">
              {/* Top bar */}
              <div className="flex items-center justify-between border-b border-slate-250 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--cyan-glow)] to-[var(--violet-glow)] shadow-[0_0_16px_oklch(0.65_0.25_45/30%)]">
                    <Cpu className="h-4 w-4 text-white" />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-850">Welcome back, {user ? user.name : "Aditya"}</h3>
                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      AI engine synced · {analysisResult ? "Active Profile" : "Demo mode"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 md:flex">
                    <Search className="h-3.5 w-3.5" /> Search insights, skills…
                    <kbd className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
                  </div>
                  <button className="relative rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-700 transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm cursor-pointer">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
                  </button>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 ring-2 ring-slate-200 text-xs font-bold text-white uppercase select-none">
                    {analysisResult?.name ? analysisResult.name[0] : "A"}
                  </div>
                </div>
              </div>

              {/* Hero strip: Readiness + key metrics */}
              <div className="mt-6 grid gap-4 lg:grid-cols-5 text-slate-800">
                {/* Industry Readiness Scorecard */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-orange-500/[0.05] via-white to-amber-500/[0.05] p-5 lg:col-span-2 flex flex-col justify-between"
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-secondary/20 blur-3xl opacity-40" />
                  <div>
                    <div className="relative flex items-start justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-semibold">
                          Industry Standard Match
                        </p>
                        <h4 className="mt-1 font-semibold text-slate-800">Industry Readiness</h4>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20">
                        <TrendingUp className="h-3 w-3" /> {current.readiness >= 80 ? "High Match" : "Good Progress"}
                      </span>
                    </div>

                    <div className="relative mt-2 flex justify-center">
                      <ReadinessMeter value={current.readiness} />
                    </div>

                    {/* Standards matched badges */}
                    <div className="relative mt-2 border-t border-slate-200 pt-3">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
                        Standards Matched ({current.industryReadiness.standardsMatched.length})
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {current.industryReadiness.standardsMatched.map((std: string) => (
                          <span key={std} className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[9.5px] font-medium text-cyan-700 ring-1 ring-cyan-500/20">
                            <CheckCircle2 className="h-2.5 w-2.5 text-cyan-650" /> {std}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Improvement areas checklist */}
                  <div className="relative mt-4 border-t border-slate-200 pt-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2">
                      Key Improvement Areas
                    </p>
                    <ul className="space-y-2">
                      {current.industryReadiness.improvementAreas.map((area: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-slate-700 leading-normal">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* 3 stat tiles stacked / grid */}
                <div className="grid gap-4 sm:grid-cols-3 lg:col-span-3 text-slate-800">
                  {[
                    {
                      title: "ATS Resume Score",
                      value: current.ats,
                      label: "Excellent",
                      color: "#ff6b00", // Orange
                      chip: "+18%",
                      icon: Activity,
                    },
                    {
                      title: "Skill Strength",
                      value: current.strength,
                      label: "Strong",
                      color: "#f59e0b", // Amber
                      chip: "+8%",
                      icon: Target,
                    },
                    {
                      title: "Learning Streak",
                      value: current.streak,
                      label: "On Fire",
                      color: "#ea580c", // Red-Orange
                      chip: "27 days",
                      icon: Flame,
                    },
                  ].map((s, i) => (
                    <motion.div
                      key={s.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50/20"
                    >
                      <div
                        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
                        style={{ background: s.color }}
                      />
                      <div className="relative flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-slate-200"
                            style={{ background: `${s.color.replace(")", " / 12%)")}` }}
                          >
                            <s.icon className="h-4 w-4" style={{ color: s.color }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{s.title}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-650">{s.chip}</span>
                      </div>
                      <div className="relative mt-3 flex items-center justify-center">
                        <RingProgress value={s.value} label={s.label} color={s.color} size={120} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mid grid: Radar + Activity + AI panel + Strength Meter */}
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-slate-800">
                {/* Radar */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
                        Skill Radar
                      </p>
                      <h4 className="mt-1 font-semibold text-slate-800">Multi-domain Profile</h4>
                    </div>
                    <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-[10px] font-semibold text-orange-700 ring-1 ring-orange-500/20">
                      6 domains
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-center">
                    <RadarChart skills={analysisResult?.radarSkills} />
                  </div>
                </motion.div>

                {/* Activity + skills */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.08 }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
                        Last 12 weeks
                      </p>
                      <h4 className="mt-1 font-semibold text-slate-850">Growth Velocity</h4>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-gradient-cyan">
                      <ArrowUpRight className="h-3.5 w-3.5 text-orange-600" /> 42% faster
                    </span>
                  </div>
                  <div className="mt-3">
                    <ActivityChart />
                  </div>
                  <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                    {analysisResult ? (
                      analysisResult.detectedSkills.slice(0, 4).map((skill, index) => {
                        const colors = ["oklch(0.65 0.25 45)", "oklch(0.75 0.20 60)", "oklch(0.58 0.24 35)", "oklch(0.85 0.15 75)"];
                        const values = [90, 80, 75, 65];
                        return (
                          <SkillBar
                            key={skill}
                            name={skill}
                            value={values[index] || 60}
                            color={colors[index % colors.length]}
                          />
                        );
                      })
                    ) : (
                      <>
                        <SkillBar name="JavaScript" value={85} color="oklch(0.65 0.25 45)" />
                        <SkillBar name="React" value={75} color="oklch(0.75 0.20 60)" />
                        <SkillBar name="Node.js" value={60} color="oklch(0.58 0.24 35)" />
                        <SkillBar name="System Design" value={42} color="oklch(0.85 0.15 75)" />
                      </>
                    )}
                  </div>
                </motion.div>

                {/* AI insights */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.16 }}
                  className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-orange-500/[0.05] via-white to-amber-500/[0.05] p-5"
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-secondary/20 blur-3xl opacity-40" />
                  <div className="relative flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--cyan-glow)] to-[var(--violet-glow)] shadow-[0_0_18px_oklch(0.65_0.25_45_/_30%)]">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">AI Career Insights</h4>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
                        Powered by SkillSync GPT
                      </p>
                    </div>
                  </div>

                  <p className="relative mt-4 text-sm leading-relaxed text-slate-750 min-h-[70px]">
                    {current.insight}
                  </p>

                  <div className="relative mt-4 space-y-2">
                    {analysisResult ? (
                      analysisResult.suggestions.slice(0, 3).map((sug, i) => (
                        <motion.div
                          key={sug}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.08 }}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="flex-1 text-slate-700 truncate">{sug}</span>
                        </motion.div>
                      ))
                    ) : (
                      [
                        { t: "Add 1 cloud project this month", g: 80 },
                        { t: "Practice 3 system design rounds", g: 55 },
                        { t: "Refine resume keywords for ATS", g: 90 },
                      ].map((a, i) => (
                        <motion.div
                          key={a.t}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.08 }}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="flex-1 text-slate-750">{a.t}</span>
                          <span className="font-mono text-[10px] text-slate-500">{a.g}%</span>
                        </motion.div>
                      ))
                    )}
                  </div>

                  <Link to="/features/roadmap">
                    <button className="relative mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(251,146,60,0.3)] hover:from-orange-600 hover:to-amber-600 transition-all duration-300 active:scale-[0.98] cursor-pointer">
                      <Zap className="h-3.5 w-3.5" /> View AI Learning Roadmap
                    </button>
                  </Link>
                </motion.div>

                {/* AI Resume Strength Meter */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
                          Resume Profile
                        </p>
                        <h4 className="mt-1 font-semibold text-slate-800">AI Resume Strength</h4>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20">
                        Live Analytics
                      </span>
                    </div>

                    <div className="mt-6 space-y-4">
                      {[
                        { name: "Technical Skills", value: current.strengthScores.technicalSkills, color: "oklch(0.65 0.25 45)" },
                        { name: "Experience Quality", value: current.strengthScores.experienceQuality, color: "oklch(0.75 0.20 60)" },
                        { name: "Project Strength", value: current.strengthScores.projectStrength, color: "oklch(0.58 0.24 35)" },
                        { name: "Resume Completeness", value: current.strengthScores.resumeCompleteness, color: "oklch(0.85 0.15 75)" },
                      ].map((bar) => (
                        <div key={bar.name}>
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-700">{bar.name}</span>
                            <span className="font-mono text-slate-500">{bar.value}%</span>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${bar.value}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                              className="h-full rounded-full"
                              style={{ background: bar.color, boxShadow: `0 0 10px ${bar.color}` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-200 pt-4 text-center">
                    <p className="text-xs text-slate-500 leading-normal">
                      Overall Average: <span className="font-bold text-slate-800">
                        {Math.round(
                          (current.strengthScores.technicalSkills +
                            current.strengthScores.experienceQuality +
                            current.strengthScores.projectStrength +
                            current.strengthScores.resumeCompleteness) / 4
                        )}%
                      </span>
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* AI Salary Prediction Engine */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 relative overflow-hidden"
              >
                <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -left-24 -bottom-24 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                      <h4 className="font-semibold text-lg text-slate-800">AI Salary Prediction Engine</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Dynamic LPA estimates comparing five target domains based on your real experience, skills, and market demand.
                    </p>
                  </div>
                  <span className="mt-3 md:mt-0 inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-400/20">
                    Role-Based Multiplier Active
                  </span>
                </div>

                <div className="grid gap-6 lg:grid-cols-5">
                  {/* Left Side: Horizontal salary range bars */}
                  <div className="lg:col-span-3 space-y-5">
                    {[
                      { key: "frontend", label: "Frontend Developer", estimate: current.salaryEstimates.frontend, color: "from-orange-400 to-orange-500" },
                      { key: "backend", label: "Backend Developer", estimate: current.salaryEstimates.backend, color: "from-amber-400 to-amber-500" },
                      { key: "aiml", label: "AI/ML Engineer", estimate: current.salaryEstimates.aiml, color: "from-red-400 to-red-500" },
                      { key: "devops", label: "DevOps Engineer", estimate: current.salaryEstimates.devops, color: "from-orange-500 to-amber-500" },
                      { key: "dataanalyst", label: "Data Analyst", estimate: current.salaryEstimates.dataanalyst, color: "from-amber-500 to-emerald-500" },
                    ].map((row) => {
                      const isCandidateRole =
                        analysisResult
                          ? (row.key === "frontend" && analysisResult.role.includes("Frontend")) ||
                            (row.key === "backend" && analysisResult.role.includes("Backend")) ||
                            (row.key === "aiml" && (analysisResult.role.includes("AI") || analysisResult.role.includes("ML") || analysisResult.role.includes("Machine"))) ||
                            (row.key === "devops" && (analysisResult.role.includes("DevOps") || analysisResult.role.includes("Cloud"))) ||
                            (row.key === "dataanalyst" && analysisResult.role.includes("Data"))
                          : (role === "Frontend" && row.key === "frontend") ||
                            (role === "Backend" && row.key === "backend") ||
                            (role === "AI" && row.key === "aiml");

                      return (
                        <div key={row.key} className={`p-4 rounded-2xl border transition-all duration-300 ${isCandidateRole ? "border-orange-500/40 bg-orange-500/[0.03] shadow-[0_8px_24px_rgba(249,115,22,0.06)] scale-[1.01]" : "border-slate-200 bg-white/40 hover:bg-white/80"}`}>
                          <div className="flex items-center justify-between text-xs font-semibold mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-800 font-bold">{row.label}</span>
                              {isCandidateRole && (
                                <span className="inline-block rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[8.5px] uppercase tracking-wider text-orange-600 font-bold animate-pulse">
                                  Your Match
                                </span>
                              )}
                            </div>
                            <span className="text-slate-850 font-bold font-mono bg-slate-100/80 px-2 py-0.5 rounded border border-slate-200/50">
                              ₹{row.estimate.min}L – ₹{row.estimate.max}L LPA
                            </span>
                          </div>
                          
                          {/* Horizontal slider bar */}
                          <div className="h-3 w-full rounded-full bg-slate-200/60 border border-slate-300/40 shadow-inner relative overflow-visible">
                            {/* Estimated range bar */}
                            <motion.div
                              initial={{ left: "10%", width: 0 }}
                              whileInView={{
                                left: `${Math.max(5, (row.estimate.min / 40) * 100)}%`,
                                width: `${Math.min(85, ((row.estimate.max - row.estimate.min) / 40) * 100)}%`
                              }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                              className={`absolute top-0 bottom-0 rounded-full bg-gradient-to-r ${row.color} shadow-[0_0_8px_rgba(249,115,22,0.25)]`}
                              style={{ opacity: 0.9 }}
                            />
                            {/* Average pointer */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ left: `${Math.min(95, (((row.estimate.min + row.estimate.max) / 2) / 40) * 100)}%`, opacity: 1, scale: 1 }}
                              whileHover={{ scale: 1.25, boxShadow: "0 0 10px rgba(249,115,22,0.4)" }}
                              viewport={{ once: true }}
                              transition={{ type: "spring", stiffness: 150, damping: 12 }}
                              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-white border-2 border-orange-500 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.15)] cursor-pointer z-10"
                              title={`Average: ₹${((row.estimate.min + row.estimate.max) / 2).toFixed(1)} LPA`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                            </motion.div>
                          </div>
                          <div className="flex justify-between text-[9px] text-slate-400 mt-1.5 font-mono font-semibold">
                            <span>₹0 LPA</span>
                            <span>₹20 LPA</span>
                            <span>₹40+ LPA</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Side: Salary drivers & insights */}
                  <div className="lg:col-span-2 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md p-6">
                    <div>
                      <h5 className="font-bold text-sm text-slate-800 border-b border-slate-200/80 pb-3 mb-5 uppercase tracking-wider">
                        Salary Valuation Factors
                      </h5>
                      <div className="space-y-4 text-xs">
                        <div className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-850">Experience Multiplier</span>
                            <p className="text-slate-500 mt-0.5 leading-normal">
                              {analysisResult ? `${analysisResult.recruiterEvaluation.includes("Highly") ? "Senior/Mid" : "Junior"} level years of work experience detected.` : "Standard demo parameters applied."}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0 border border-orange-500/20">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-850">Core Competency Bonuses</span>
                            <p className="text-slate-500 mt-0.5 leading-normal">
                              Matches standard competencies (+0.5L LPA per skill found).
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/20">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-850">High-Value Tech Stack</span>
                            <p className="text-slate-500 mt-0.5 leading-normal">
                              Additions like Next.js, PyTorch, Kubernetes boost min-max salary values.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-slate-200/80 pt-5">
                      <div className="rounded-xl bg-orange-500/[0.03] p-4 border border-orange-500/20 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-16 w-16 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
                        <span className="text-[10px] uppercase tracking-wider text-orange-700 font-bold block">
                          Upskill Target for Salary Increase
                        </span>
                        <p className="text-xs text-slate-750 mt-1.5 leading-relaxed">
                          Acquire <strong>{analysisResult?.missingSkills?.[0] || "Next.js / System Design"}</strong> to expand your eligibility and projected maximum potential to <span className="text-orange-600 font-bold">₹18+ LPA</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Opportunities */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm backdrop-blur-md p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
                    <h4 className="font-semibold text-slate-850">AI-Matched Opportunities</h4>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20">
                      {opportunities.length} active
                    </span>
                  </div>
                  <Link to="/features/recommendations">
                    <button className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-all duration-300 cursor-pointer">
                      View all →
                    </button>
                  </Link>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {opportunities.map((o, i) => (
                    <motion.div
                      key={o.title}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.5 }}
                      whileHover={{ y: -4 }}
                      onClick={() => window.open(o.link, "_blank")}
                      className="group relative overflow-hidden rounded-2xl border border-slate-250 bg-white p-5 transition-all duration-300 hover:border-orange-400 hover:shadow-lg cursor-pointer flex flex-col justify-between min-h-[148px]"
                    >
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                      <div className="relative flex items-center justify-between">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[9.5px] font-bold ring-1 bg-slate-100 text-slate-700 ring-slate-200`}
                        >
                          {o.type}
                        </span>
                        <span className="font-mono text-[10px] text-emerald-700">
                          {o.match}% match
                        </span>
                      </div>
                      <h5 className="relative mt-2 text-sm font-semibold leading-snug text-slate-800">
                        {o.title}
                      </h5>
                      <p className="relative mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <Award className="h-3 w-3 text-orange-500" /> {o.org}
                      </p>
                      <div className="relative mt-3 h-1 overflow-hidden rounded-full bg-slate-200">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${o.match}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: i * 0.08 }}
                          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* AI Cold Outreach & Referral Pitch Generator */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 relative overflow-hidden"
              >
                <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-orange-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -left-24 -bottom-24 h-52 w-52 rounded-full bg-amber-500/10 blur-3xl" />

                <div className="border-b border-slate-200 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-orange-600" />
                    <h4 className="font-semibold text-lg text-slate-800">AI Cold Outreach & Referral Pitch Generator</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Instantly craft personalized messages for hiring leads and engineering managers using your verified SkillSync profile matching.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {/* Left Column: Form Controls */}
                  <div className="md:col-span-1 space-y-4 text-left">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                        Target Company
                      </label>
                      <input
                        type="text"
                        value={pitchCompany}
                        onChange={(e) => setPitchCompany(e.target.value)}
                        placeholder="e.g. TechNova, Google"
                        className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                        Outreach Platform
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {["Email", "LinkedIn", "Twitter"].map((plat) => {
                          const active = pitchPlatform === plat;
                          return (
                            <button
                              key={plat}
                              type="button"
                              onClick={() => setPitchPlatform(plat)}
                              className={`py-2 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                                active
                                  ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              {plat}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                        Pitch Tone
                      </label>
                      <div className="flex flex-col gap-1.5">
                        {["Professional", "Casual/Creative", "Direct"].map((tone) => {
                          const active = pitchTone === tone;
                          return (
                            <button
                              key={tone}
                              type="button"
                              onClick={() => setPitchTone(tone)}
                              className={`w-full py-2 px-3 text-left text-[10px] font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                                active
                                  ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <span>{tone}</span>
                              {active && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Output Message */}
                  <div className="md:col-span-2 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md p-5">
                    <div className="text-left">
                      <div className="flex items-center justify-between border-b border-slate-150 pb-2 mb-3">
                        <span className="text-[10px] uppercase tracking-wider text-slate-550 font-bold block">
                          Generated Pitch Document ({pitchPlatform})
                        </span>
                        <span className="text-[9px] text-emerald-700 font-semibold uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-250">
                          {pitchTone} Tone
                        </span>
                      </div>
                      <textarea
                        readOnly
                        value={generatedPitch}
                        className="w-full h-48 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono leading-relaxed text-slate-800 focus:outline-none resize-none shadow-inner"
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-150 pt-3">
                      <p className="text-[10px] text-slate-400 font-medium">
                        Contains verified {current.readiness}% stack match data.
                      </p>
                      <button
                        onClick={handleCopy}
                        className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold text-white transition-all duration-300 shadow-md cursor-pointer ${
                          copied 
                            ? "bg-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.3)]" 
                            : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-[0_4px_12px_rgba(249,115,22,0.2)]"
                        }`}
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                            Copy Outreach Message
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
