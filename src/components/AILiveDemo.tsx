import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useResume } from "@/lib/resumeContext";
import {
  Brain,
  FileText,
  Sparkles,
  ScanLine,
  Cpu,
  Target,
  CheckCircle2,
  Zap,
  TrendingUp,
  Upload,
  RotateCcw,
  Loader2,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Stages                                                                    */
/* -------------------------------------------------------------------------- */
const projectDatabase: Record<string, string> = {
  React: "Build a Portfolio Website",
  "Node.js": "Build a REST API Server",
  MongoDB: "Create a Database-driven Blog App",
  TypeScript: "Build a Type-safe Task Manager",
  Git: "Collaborative Open Source Project",
  Python: "Build an AI Chatbot",
  JavaScript: "Build an Interactive Dashboard",
};
type Stage = "idle" | "scanning" | "extracting" | "analyzing" | "scoring" | "complete";

const STAGE_FLOW: { id: Exclude<Stage, "idle">; label: string; icon: typeof Brain; ms: number }[] =
  [
    { id: "scanning", label: "Scanning resume structure", icon: ScanLine, ms: 1800 },
    { id: "extracting", label: "Extracting skills & entities", icon: Sparkles, ms: 2200 },
    { id: "analyzing", label: "Mapping to market demand", icon: Brain, ms: 2400 },
    { id: "scoring", label: "Computing ATS & readiness", icon: Cpu, ms: 1800 },
  ];

const EXTRACTED_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "SQL",
  "System Design",
  "REST APIs",
  "Tailwind",
  "Git",
  "Docker",
  "Problem Solving",
  "Communication",
];
const INSIGHTS = [
  { label: "ATS Compatibility", color: "var(--primary)" },
  { label: "Skill Match Index", color: "var(--secondary)" },
  { label: "Career Readiness", color: "var(--accent)" },
];

const TERMINAL_LINES = [
  "› init skillsync.engine v4.2",
  "› parsing document … OK",
  "› tokenizing 1,284 entities",
  "› running semantic embed (gte-large)",
  "› cross-referencing 12,400 job postings",
  "› computing skill-graph delta",
  "› generating personalized roadmap …",
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function AILiveDemo({ isModal = false }: { isModal?: boolean }) {
  const { analysisResult, analyzeResumeFile, clearAnalysis } = useResume();
  const [resumeName, setResumeName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [status, setStatus] = useState("Awaiting input");
  const [skills, setSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [roadmap, setRoadmap] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("match");

  // Interactive Project Analyzer Engine states
  const [projectTitle, setProjectTitle] = useState("");
  const [projectTech, setProjectTech] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [projectFileName, setProjectFileName] = useState("");
  const [isAnalyzingProject, setIsAnalyzingProject] = useState(false);
  const [projectAnalysisResult, setProjectAnalysisResult] = useState<any>(null);
  const [projectProgress, setProjectProgress] = useState(0);

  const handleProjectAnalysis = async () => {
    if (!projectTitle.trim()) {
      alert("Please enter a project title!");
      return;
    }
    
    setIsAnalyzingProject(true);
    setProjectProgress(0);
    setProjectAnalysisResult(null);

    setTerminalLogs((prev) => [
      ...prev,
      `› Initiating Audit on project: "${projectTitle}"`,
      `› Tech Stack detected: ${projectTech || "Vanilla JS"}`,
      `› Scanning code repository for safety & metrics...`
    ]);

    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProjectProgress(Math.min(95, p));
    }, 85);

    const apiKey = localStorage.getItem("skillsync_openai_key") || "";

    try {
      if (apiKey) {
        const prompt = `Analyze this developer project code/description:
          Project Title: ${projectTitle}
          Tech Stack: ${projectTech}
          Description/Code: ${projectCode}
          
          Provide a JSON response with the following keys:
          - score: number (overall quality score out of 100)
          - maintainability: number (score out of 100)
          - strengths: string[] (2-3 items)
          - improvements: string[] (2-3 actionable code or architecture steps)
          - resumeBullets: string[] (2 copyable, quantified bullet points with numeric metrics starting with strong action verbs)
          
          Do not include markdown tags, return only raw JSON.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!response.ok) throw new Error("OpenAI API call failed.");
        const data = await response.json();
        const jsonResult = JSON.parse(data.choices[0]?.message?.content);
        
        clearInterval(interval);
        setProjectProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setProjectAnalysisResult(jsonResult);
        setTerminalLogs((prev) => [
          ...prev,
          `› Project compilation: SUCCESS`,
          `› Code maintainability score: ${jsonResult.maintainability || 82}%`,
          `› Project audit completed.`
        ]);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        const lowerCode = (projectCode + " " + projectTech).toLowerCase();
        const strengths = ["Clean decoupling of components", "Standard project folder structuring"];
        const improvements = [];
        let score = 75;
        let maintainability = 80;

        if (lowerCode.includes("test") || lowerCode.includes("jest") || lowerCode.includes("vitest")) {
          strengths.push("Automated unit test coverage included");
          score += 8;
        } else {
          improvements.push("Add automated unit/integration tests (Jest/Vitest) to cover edge cases.");
        }

        if (lowerCode.includes("redis") || lowerCode.includes("cache")) {
          strengths.push("Caches heavy endpoints with Redis");
          score += 10;
        } else if (lowerCode.includes("db") || lowerCode.includes("sql") || lowerCode.includes("mongo")) {
          improvements.push("Introduce a caching layer (Redis) to speed up database response latencies.");
        }

        if (lowerCode.includes("jwt") || lowerCode.includes("auth") || lowerCode.includes("bcrypt")) {
          strengths.push("Secure token-based user authentication flow");
          score += 7;
        } else {
          improvements.push("Implement password hashing (bcrypt) and session tokens (JWT) to secure client routes.");
        }

        if (improvements.length === 0) {
          improvements.push("Refine logging middleware using Winston or Morgan for cleaner production analytics.");
        }

        const computedScore = Math.min(96, score);
        const result = {
          score: computedScore,
          maintainability: Math.round(maintainability + (computedScore - 75) * 0.5),
          strengths: strengths.slice(0, 3),
          improvements: improvements.slice(0, 3),
          resumeBullets: [
            `Engineered a scalable ${projectTitle} using ${projectTech || "modern web frameworks"}, improving endpoint response times by 35%.`,
            `Optimized database read-write latency cycles by 40% through structured index mappings and clean connection setups.`
          ]
        };

        clearInterval(interval);
        setProjectProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setProjectAnalysisResult(result);
        setTerminalLogs((prev) => [
          ...prev,
          `› Project compilation: SUCCESS`,
          `› Code maintainability score: ${result.maintainability}%`,
          `› Project audit completed.`
        ]);
      }
    } catch (err: any) {
      clearInterval(interval);
      setTerminalLogs((prev) => [...prev, `› Audit failed: ${err.message}`]);
      alert("Failed to analyze project. Check API Key or try again.");
    } finally {
      setIsAnalyzingProject(false);
    }
  };

  const handleProjectFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Please upload code files smaller than 1MB.");
        return;
      }
      setProjectFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectCode(reader.result as string);
        if (!projectTitle) {
          setProjectTitle(file.name.split(".")[0]);
        }
      };
      reader.readAsText(file);
    }
  };
  const [atsScore, setAtsScore] = useState(0);
  const [jobRole, setJobRole] = useState("");
  const [currentSalary, setCurrentSalary] = useState("");
  const [futureSalary, setFutureSalary] = useState("");
  const [marketDemand, setMarketDemand] = useState(0);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [stage, setStage] = useState<Stage>("idle");
  const [stageIdx, setStageIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [revealedSkills, setRevealedSkills] = useState<string[]>([]);
  const [terminalIdx, setTerminalIdx] = useState(0);
  const [scoreValues, setScoreValues] = useState<number[]>([0, 0, 0]);
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    if (analysisResult && stage === "idle") {
      setResumeName(analysisResult.fileName || "Uploaded Resume");
      setSkills(analysisResult.detectedSkills);
      setMissingSkills(analysisResult.missingSkills);
      setAtsScore(analysisResult.atsScore);
      setJobRole(analysisResult.role);
      setCurrentSalary(analysisResult.currentSalary);
      setFutureSalary(analysisResult.futureSalary);
      setMarketDemand(analysisResult.marketDemand);
      setWeaknesses(analysisResult.weaknesses);
      setSuggestions(analysisResult.suggestions);
      
      const generatedRoadmap = analysisResult.roadmap.map(
        (phase: any) => `${phase.month}: ${phase.title}`
      );
      setRoadmap(generatedRoadmap);
      
      const recommendedProjects = analysisResult.roadmap[0]?.tasks
        .filter((t: any) => t.type === "project")
        .map((t: any) => t.title) || [];
      setProjects(recommendedProjects);
      
      setScoreValues([
        analysisResult.atsScore,
        analysisResult.skillStrength,
        analysisResult.careerReadiness
      ]);
      
      setRevealedSkills(analysisResult.detectedSkills);
      
      setTerminalLogs([
        "› Resume analysis restored from session cache",
        `› Target role detected: ${analysisResult.role}`,
        `› Overall ATS Score computed: ${analysisResult.atsScore}%`,
        "› Analysis complete",
      ]);
      setTerminalIdx(4);
      setStage("complete");
      setProgress(100);
      setIsUploaded(true);
    }
  }, [analysisResult, stage]);
const handleResumeUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setSkills([]);
  setMissingSkills([]);
  setRoadmap([]);
  setProjects([]);
  setAtsScore(0);
  setScoreValues([0, 0, 0]);
  setTerminalLogs([]);
  setResumeText("");

  try {
    setResumeName(file.name);
    setIsUploaded(true);
    setStage("scanning");
    setStageIdx(0);
    setProgress(10);
    setStatus("Scanning Resume...");

    setTerminalLogs([
      "› Resume uploaded successfully",
      "› Initializing PDF/TXT parser...",
    ]);

    // Perform real text extraction and backend analysis
    const result = await analyzeResumeFile(file);

    setResumeText(result.rawText || "Parsed resume text successfully.");
    await new Promise((resolve) => setTimeout(resolve, 800));

    setStatus("Extracting Skills...");
    setProgress(50);
    setStage("extracting");
    setStageIdx(1);

    setTerminalLogs((prev) => [
      ...prev,
      "› Parsing document layout...",
      `› Extracted skills: ${result.detectedSkills.slice(0, 5).join(", ")}...`,
    ]);

    setSkills(result.detectedSkills);
    setMissingSkills(result.missingSkills);

    // Build Roadmap & Projects dynamically from backend results
    const generatedRoadmap = result.roadmap.map(
      (phase: any) => `${phase.month}: ${phase.title}`
    );
    setRoadmap(generatedRoadmap);

    const recommendedProjects = result.roadmap[0]?.tasks
      .filter((t: any) => t.type === "project")
      .map((t: any) => t.title) || [];
    setProjects(recommendedProjects);

    // Set other dynamic values
    setAtsScore(result.atsScore);
    setJobRole(result.role);
    setCurrentSalary(result.currentSalary);
    setFutureSalary(result.futureSalary);
    setMarketDemand(result.marketDemand);
    setWeaknesses(result.weaknesses);
    setSuggestions(result.suggestions);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStatus("Mapping Skills...");
    setProgress(75);
    setStage("analyzing");
    setStageIdx(2);

    setTerminalLogs((prev) => [
      ...prev,
      `› Target role detected: ${result.role}`,
      "› Mapping skills against target role...",
    ]);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStatus("Computing ATS...");
    setStage("scoring");
    setStageIdx(3);
    setProgress(90);

    setTerminalLogs((prev) => [
      ...prev,
      `› Overall ATS Score computed: ${result.atsScore}%`,
      "› Analysis complete",
    ]);

    // Animate the three score cards (ATS, Skill Strength, Career Readiness)
    const scoreValuesList = [
      result.atsScore,
      result.skillStrength,
      result.careerReadiness
    ];
    setScoreValues(scoreValuesList);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setStatus("Analysis Complete");
    setStage("complete");
    setProgress(100);
  } catch (error: any) {
    console.error("ANALYSIS ERROR:", error);
    setStatus("Failed to analyze resume");
    setTerminalLogs((prev) => [
      ...prev,
      `› Error: ${error.message || "Failed to analyze resume"}`,
    ]);
    alert(error.message || "Failed to parse and analyze resume.");
  }
};
 
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

 

  const run = () => {
    if (!isUploaded) return;
    setStatus("Scanning Resume...");
setStage("scanning");
setStageIdx(0);
setProgress(10);
    clearTimers();
    setStage("scanning");
    setStageIdx(0);
    setProgress(0);
    setRevealedSkills([]);
    setTerminalIdx(0);
    setScoreValues([0, 0, 0]);

    // Stage progression
    let acc = 0;
    STAGE_FLOW.forEach((s, i) => {
      acc += s.ms;
      timers.current.push(
        setTimeout(() => {
          if (i + 1 < STAGE_FLOW.length) {
            setStage(STAGE_FLOW[i + 1].id);
            setStageIdx(i + 1);
          } else {
            setStage("complete");
          }
        }, acc),
      );
    });

    // Reveal skills progressively during "extracting" + "analyzing"
    EXTRACTED_SKILLS.forEach((_, i) => {
      timers.current.push(
        setTimeout(
          () => {
            setRevealedSkills((prev) => [...prev, EXTRACTED_SKILLS[i]]);
          },
          1800 + i * 220,
        ),
      );
    });

    // Terminal lines
    TERMINAL_LINES.forEach((_, i) => {
      timers.current.push(setTimeout(() => setTerminalIdx(i + 1), 600 + i * 900));
    });

    // Final scores animate at the "scoring" + complete phase
    const scoreStart = STAGE_FLOW.slice(0, 3).reduce((a, b) => a + b.ms, 0);
    INSIGHTS.forEach((ins, i) => {
  timers.current.push(
    setTimeout(() => {
      let v = 0;

      const target =
        i === 0
          ? atsScore
          : i === 1
          ? Math.min(skills.length * 15, 100)
          : Math.min(atsScore + skills.length * 5, 100);

      const step = () => {
        v = Math.min(target, v + Math.ceil(target / 28));

        setScoreValues((prev) => {
          const next = [...prev];
          next[i] = v;
          return next;
        });

        if (v < target)
          timers.current.push(setTimeout(step, 38));
      };

      step();
    }, scoreStart + i * 250)
  );
});
  };

  const reset = () => {
    clearAnalysis();
    setSkills([]);
    setMissingSkills([]);
    setRoadmap([]);
    setProjects([]);
    setAtsScore(0);
    setScoreValues([0, 0, 0]);
    setTerminalLogs([]);
    setResumeText("");
    clearTimers();
    setStage("idle");
    setStageIdx(0);
    setProgress(0);
    setRevealedSkills([]);
    setTerminalIdx(0);
    setScoreValues([0, 0, 0]);
    setIsUploaded(false); // Reset upload state too
  };

  // Overall progress bar follows current stage timing
  useEffect(() => {
    if (stage === "idle") return;
    if (stage === "complete") {
      setProgress(100);
      return;
    }
    const total = STAGE_FLOW.reduce((a, s) => a + s.ms, 0);
    const done = STAGE_FLOW.slice(0, stageIdx).reduce((a, s) => a + s.ms, 0);
    const current = STAGE_FLOW[stageIdx]?.ms ?? 0;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const local = Math.min(1, (t - start) / current);
      setProgress(Math.min(99, ((done + local * current) / total) * 100));
      if (local < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage, stageIdx]);

  useEffect(() => () => clearTimers(), []);

  const isProcessing = stage !== "idle" && stage !== "complete";
  const currentStageLabel = useMemo(
    () => (stage === "complete" ? "Analysis complete" : (STAGE_FLOW[stageIdx]?.label ?? "")),
    [stage, stageIdx],
  );

  return (
    <section id="ai-demo" className={`relative ${isModal ? "py-0" : "py-12"}`}>
      <div className={isModal ? "w-full" : "container mx-auto max-w-7xl px-4 sm:px-6"}>
        {/* Header */}
        {!isModal && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold tracking-wider text-slate-800 uppercase">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Live AI Engine
            </div>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Watch the <span className="text-gradient">AI engine</span> think
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Drop a resume and see SkillSync perform real-time scanning, skill extraction, and ATS
              scoring — cinematic, transparent, and instant.
            </p>
          </motion.div>
        )}

        {/* Main panel */}
        <motion.div
          initial={isModal ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          whileInView={isModal ? undefined : { opacity: 1, y: 0 }}
          viewport={isModal ? undefined : { once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className={`relative overflow-hidden rounded-3xl border border-slate-200 bg-white/85 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(249,115,22,0.05)] ${isModal ? "mt-2" : "mt-10"}`}
        >
          {/* Ambient gradient layer */}
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
          </div>

          <div className={`relative grid gap-6 ${isModal ? "grid-cols-1 xl:grid-cols-5" : "lg:grid-cols-5"}`}>
            {/* LEFT: Resume scanner */}
            <div className={isModal ? "xl:col-span-2" : "lg:col-span-2"}>
              <ResumeScanner
                skills={skills}
                missingSkills={missingSkills}
                roadmap={roadmap}
                projects={projects}
                stage={stage}
                onRun={run}
                onReset={reset}
                isUploaded={isUploaded}
                resumeName={resumeName}
                resumeText={resumeText}
                handleResumeUpload={handleResumeUpload}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>

            {/* RIGHT: Live processing */}
            <div className={`space-y-5 ${isModal ? "xl:col-span-3" : "lg:col-span-3"}`}>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm backdrop-blur-md p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={stage}
                          initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.6, rotate: 45 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 grid place-items-center rounded-xl bg-orange-500/10 text-primary"
                        >
                          {stage === "complete" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          ) : (
                            <Brain className="h-4 w-4" />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-550">
                        AI status
                      </div>
                      <div className="text-sm font-semibold text-slate-800">
                        {stage === "complete" ? "Analysis Ready" : isProcessing ? "Processing..." : "Awaiting Upload"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wider text-slate-550">
                      Progress
                    </div>
                    <div className="font-mono text-sm font-semibold text-slate-800">
                      {Math.round(progress)}%
                    </div>
                  </div>
                </div>

                <div className="relative mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200/60 shadow-inner">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 shadow-[0_0_12px_rgba(249,115,22,0.4)]"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: "linear" }}
                  />
                  {isProcessing && (
                    <motion.div
                      className="absolute inset-y-0 w-24 rounded-full bg-white/50 blur-md"
                      animate={{ left: ["-10%", "100%"] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </div>

                {/* Stage chips */}
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {STAGE_FLOW.map((s, i) => {
                    const active = stageIdx === i && isProcessing;
                    const done = stage === "complete" || stageIdx > i;
                    const Icon = s.icon;
                    return (
                      <div
                        key={s.id}
                        className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-[11px] font-semibold transition-all duration-300 ${
                          active
                            ? "border-orange-500/50 bg-orange-500/10 text-orange-700 shadow-[0_0_12px_rgba(249,115,22,0.15)] animate-pulse"
                            : done
                              ? "border-emerald-250 bg-emerald-50 text-emerald-800"
                              : "border-slate-200/60 bg-white/40 text-slate-450"
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        ) : active ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-orange-500 shrink-0" />
                        ) : (
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                        )}
                        <span className="truncate">{s.label.split(" ").slice(0, 2).join(" ")}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Salary potential and weaknesses */}
              {isUploaded && stage === "complete" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-orange-500" />
                    <h4 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">Analysis Highlights</h4>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-orange-500/10 bg-orange-500/5 p-3 text-center">
                      <span className="text-[10px] uppercase text-orange-700 font-semibold block">Detected Role</span>
                      <span className="text-xs font-bold text-slate-800 mt-1 block">{jobRole}</span>
                    </div>
                    <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3 text-center">
                      <span className="text-[10px] uppercase text-emerald-700 font-semibold block">Current Potential</span>
                      <span className="text-xs font-bold text-slate-800 mt-1 block">{currentSalary}</span>
                    </div>
                    <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-3 text-center">
                      <span className="text-[10px] uppercase text-blue-700 font-semibold block">Market Demand</span>
                      <span className="text-xs font-bold text-slate-800 mt-1 block">{marketDemand}%</span>
                    </div>
                  </div>
                  
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase text-slate-500 font-semibold block">Resume Weaknesses</span>
                      {weaknesses.length > 0 ? (
                        weaknesses.map((weakness, index) => (
                          <div key={index} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                            ❌ {weakness}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                          ✅ No major weaknesses detected
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase text-slate-500 font-semibold block">Improvement Checklist</span>
                      {suggestions.length > 0 ? (
                        suggestions.map((suggestion, index) => (
                          <div key={index} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                            🎯 {suggestion}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                          ✅ Resume is already optimized
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Two-up: terminal + skills */}
              <div className={`grid gap-5 ${isModal ? "grid-cols-1 sm:grid-cols-2" : "md:grid-cols-2"}`}>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/90 shadow-[0_20px_50px_rgba(249,115,22,0.06)] backdrop-blur-md p-5 font-mono text-[11px] leading-relaxed text-white">
                  <div className="mb-3 flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-550/70 animate-pulse" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-550/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-550/70" />
                      <span className="ml-2 text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                        skillsync.engine v4.2
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded bg-slate-900 px-1.5 py-0.5 text-[8px] font-bold text-orange-550 ring-1 ring-orange-500/20">
                      LIVE SCAN
                    </span>
                  </div>
                  <div className="min-h-[170px] space-y-1 overflow-y-auto max-h-[220px]">
                    {!isUploaded ? (
                      <div className="flex h-[170px] items-center justify-center text-slate-600 text-xs">
                        AI Engine idle — upload resume to start
                      </div>
                    ) : (
                      <>
                        {terminalLogs.map((log, i) => {
                          const isError = log.includes("Error") || log.includes("failed");
                          const isSuccess = log.includes("SUCCESS") || log.includes("ready") || log.includes("complete") || log.includes("ready");
                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                              className={isError ? "text-red-400" : isSuccess ? "text-emerald-400 font-semibold" : "text-orange-400"}
                            >
                              {log}
                            </motion.div>
                          );
                        })}

                        {isProcessing && (
                          <div className="flex items-center gap-1">
                            <span className="text-orange-400/60">›</span>
                            <motion.span
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                              className="inline-block w-1.5 h-3.5 bg-orange-500"
                            />
                          </div>
                        )}

                        {stage === "complete" && (
                          <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className="mt-2 text-emerald-450 font-bold flex items-center gap-1.5"
                          >
                            <span>›</span> ✓ roadmap.json compiled successfully
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Extracted Skills */}
                <div className="rounded-2xl border border-slate-200 bg-white/60 shadow-sm backdrop-blur-md p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 font-bold">
                      <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                      Extracted skills
                    </div>
                    <span className="font-mono text-[10px] text-slate-550 font-semibold">
                      {skills.length}/{skills.length || 0}
                    </span>
                  </div>
                  <div className="flex min-h-[170px] flex-wrap content-start gap-2">
                    {!isUploaded ? (
                      <div className="flex h-[170px] items-center justify-center text-slate-400 text-xs w-full">
                        Upload resume to unlock extracted skills
                      </div>
                    ) : (
                      <>
                        <AnimatePresence>
                          {skills.map((s) => (
                            <motion.span
                              key={s}
                              initial={{ opacity: 0, scale: 0.6, y: 8 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.6 }}
                              transition={{ duration: 0.35 }}
                              className="rounded-full border border-orange-200 bg-orange-50/50 hover:bg-orange-50 hover:border-orange-350 px-3 py-1 text-xs font-semibold text-orange-700 transition-all cursor-default shadow-sm"
                            >
                              {s}
                            </motion.span>
                          ))}
                        </AnimatePresence>

                        {skills.length === 0 && (
                          <p className="text-xs text-slate-400">
                            No skills found in resume
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {activeTab === "match" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="mb-3 text-xs uppercase tracking-wider text-slate-500">
                    Skill Gap Analysis
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {missingSkills.length > 0 ? (
                      missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs text-red-700 font-semibold"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-emerald-700 font-semibold">
                        No major skill gaps found 🎉
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "growth" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 mt-4">
                  <div className="mb-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    AI Roadmap
                  </div>

                  <div className="space-y-2">
                    {roadmap.length > 0 ? (
                      roadmap.map((step, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-orange-200 bg-orange-50/50 px-3 py-2 text-sm text-orange-800 font-medium"
                        >
                          {step}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">
                        Upload resume to generate roadmap
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "engine" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 text-orange-500" />
                      Project Analyzer Engine
                    </div>
                    {projectAnalysisResult && (
                      <button
                        onClick={() => {
                          setProjectAnalysisResult(null);
                          setProjectTitle("");
                          setProjectTech("");
                          setProjectCode("");
                          setProjectFileName("");
                        }}
                        className="text-xs text-orange-650 hover:underline font-semibold cursor-pointer"
                      >
                        Reset / Analyze Another
                      </button>
                    )}
                  </div>

                  {!projectAnalysisResult ? (
                    <div className="space-y-3.5 text-left">
                      <p className="text-xs text-slate-500 leading-normal font-sans">
                        Submit details or upload your code file to test your project quality, missing gaps, and compile ATS-ready copyable resume bullets.
                      </p>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-semibold text-slate-500 block">Project Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Real-Time Chat App with WebSockets"
                          value={projectTitle}
                          onChange={(e) => setProjectTitle(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-semibold text-slate-500 block">Tech Stack (comma-separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. Node.js, Socket.io, React, Redis"
                          value={projectTech}
                          onChange={(e) => setProjectTech(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-semibold text-slate-500 block">Readme Description or Code Snippet</label>
                        <textarea
                          placeholder="Paste index.js, package.json, or readme description here..."
                          value={projectCode}
                          onChange={(e) => setProjectCode(e.target.value)}
                          rows={4}
                          className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <label className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 cursor-pointer shadow-sm">
                          <Upload className="h-3.5 w-3.5 text-slate-500" />
                          Upload Code File
                          <input
                            type="file"
                            accept=".js,.ts,.tsx,.json,.md,.txt,.py"
                            onChange={handleProjectFileUpload}
                            className="hidden"
                          />
                        </label>
                        {projectFileName && (
                          <span className="text-xs text-emerald-700 font-medium truncate max-w-[180px]">
                            ✓ {projectFileName}
                          </span>
                        )}
                      </div>

                      {isAnalyzingProject ? (
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-orange-600 font-semibold animate-pulse">Running Code Audit...</span>
                            <span className="font-mono text-slate-600">{projectProgress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-orange-500 rounded-full"
                              animate={{ width: `${projectProgress}%` }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleProjectAnalysis}
                          className="w-full mt-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-3 shadow-[0_4px_12px_rgba(249,115,22,0.2)] transition-colors cursor-pointer"
                        >
                          Analyze Project
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 text-left">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-orange-500/10 bg-orange-500/5 p-3 text-center">
                          <span className="text-[10px] uppercase text-orange-700 font-semibold block">Quality Score</span>
                          <span className="text-lg font-bold text-orange-600 mt-1 block">{projectAnalysisResult.score}/100</span>
                        </div>
                        <div className="rounded-xl border border-emerald-500/10 bg-emerald-50/5 p-3 text-center">
                          <span className="text-[10px] uppercase text-emerald-700 font-semibold block">Maintainability</span>
                          <span className="text-lg font-bold text-emerald-600 mt-1 block">{projectAnalysisResult.maintainability}%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Project Strengths</h5>
                        <div className="space-y-1.5">
                          {projectAnalysisResult.strengths.map((str: string, index: number) => (
                            <div key={index} className="text-xs text-slate-700 flex items-start gap-1.5">
                              <span className="text-emerald-600 shrink-0 font-bold">✓</span>
                              <span>{str}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Actionable Code Improvements</h5>
                        <div className="space-y-1.5">
                          {projectAnalysisResult.improvements.map((imp: string, index: number) => (
                            <div key={index} className="text-xs text-slate-700 flex items-start gap-1.5">
                              <span className="text-orange-500 shrink-0 font-bold">🎯</span>
                              <span>{imp}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-2 border-t border-slate-200">
                        <div>
                          <h5 className="text-[10px] uppercase font-semibold text-orange-700 tracking-wider">Quantified Resume Bullets</h5>
                          <span className="text-[9px] text-slate-400 block mt-0.5">Copy-paste these directly into your resume's experience section:</span>
                        </div>
                        <div className="space-y-2">
                          {projectAnalysisResult.resumeBullets.map((bullet: string, index: number) => (
                            <div key={index} className="p-3 bg-white border border-slate-200 rounded-xl relative group">
                              <p className="text-xs text-slate-755 pr-12 leading-relaxed font-sans">{bullet}</p>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(bullet);
                                  alert("Copied to clipboard!");
                                }}
                                className="absolute right-2 top-2 px-2 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-[9px] text-slate-600 hover:text-orange-700 rounded transition-all font-semibold cursor-pointer"
                              >
                                Copy
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Social Sharing Section */}
                      <div className="space-y-3 pt-3 border-t border-slate-200">
                        <div>
                          <h5 className="text-[10px] uppercase font-semibold text-orange-700 tracking-wider font-bold">Share Project Audit to Social Media</h5>
                          <span className="text-[9px] text-slate-400 block mt-0.5">Showcase your verified project credentials and scores:</span>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              const shareText = `🚀 I just audited my project "${projectTitle}" on SkillSync AI! 
📊 Score: ${projectAnalysisResult.score}/100 | Maintainability: ${projectAnalysisResult.maintainability}%
💡 Optimized Resume Bullet: "${projectAnalysisResult.resumeBullets[0]}"

Try the AI Project Audit engine at: https://hackatoncpl2026-final.vercel.app`;
                              navigator.clipboard.writeText(shareText);
                              alert("Post template copied to clipboard! Opening LinkedIn share...");
                              window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://hackatoncpl2026-final.vercel.app")}`, '_blank');
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#0077b5] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-sm"
                          >
                            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                            Share on LinkedIn
                          </button>

                          <button
                            onClick={() => {
                              const shareText = `🚀 Just audited my "${projectTitle}" on SkillSync AI!
📊 Quality Score: ${projectAnalysisResult.score}/100 | Maintainability: ${projectAnalysisResult.maintainability}%
🔥 Try the AI Project Audit engine at https://hackatoncpl2026-final.vercel.app #SkillSync #AI`;
                              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#1da1f2] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-sm"
                          >
                            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                            </svg>
                            Post on X / Twitter
                          </button>

                          <button
                            onClick={() => {
                              const shareText = `🚀 Hey, check out my audited project "${projectTitle}" score on SkillSync AI!
📊 Score: ${projectAnalysisResult.score}/100 | Maintainability: ${projectAnalysisResult.maintainability}%
Check your project here: https://hackatoncpl2026-final.vercel.app`;
                              const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
                              window.open(url, '_blank');
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#25d366] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-sm"
                          >
                            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.473 1.452 5.38 1.453 5.485.002 9.948-4.461 9.95-9.95.002-2.66-1.033-5.161-2.909-7.038C17.2 1.745 14.7 .711 12.048.711c-5.49 0-9.953 4.463-9.955 9.953-.002 1.914.501 3.785 1.458 5.388L2.56 21.462l6.087-1.597zM17.96 15.011c-.326-.163-1.933-.953-2.231-1.062-.297-.108-.513-.163-.73.163-.216.324-.838 1.062-1.027 1.28-.188.217-.378.243-.705.08-1.955-.978-3.033-2.484-3.844-3.88-.236-.407-.058-.625.139-.823.177-.178.378-.44.568-.66.19-.22.253-.361.378-.6.127-.242.064-.453-.032-.66-.097-.207-.73-1.764-1.002-2.418-.265-.637-.532-.55-.73-.55-.188-.008-.405-.008-.622-.008-.216 0-.568.082-.865.407-.298.325-1.137 1.112-1.137 2.71 0 1.598 1.163 3.142 1.325 3.358.163.217 2.287 3.493 5.54 4.896.774.333 1.38.533 1.85.682.778.248 1.488.213 2.052.128.626-.094 1.933-.79 2.203-1.55.27-.76.27-1.41.19-1.55-.08-.14-.297-.22-.622-.383z"/>
                            </svg>
                            Share on WhatsApp
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                const shareText = `🚀 Checked out my project "${projectTitle}" audited by SkillSync AI! Score: ${projectAnalysisResult.score}/100, Maintainability: ${projectAnalysisResult.maintainability}%. Check it here: https://hackatoncpl2026-final.vercel.app`;
                                window.open(`https://t.me/share/url?url=${encodeURIComponent("https://hackatoncpl2026-final.vercel.app")}&text=${encodeURIComponent(shareText)}`, '_blank');
                              }}
                              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#0088cc] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-sm"
                            >
                              Telegram
                            </button>
                            <button
                              onClick={() => {
                                const shareText = `🚀 Just audited my "${projectTitle}" on SkillSync AI! Score: ${projectAnalysisResult.score}/100`;
                                window.open(`https://www.reddit.com/submit?title=${encodeURIComponent(`SkillSync AI audited my project score: ${projectAnalysisResult.score}/100`)}&text=${encodeURIComponent(shareText)}`, '_blank');
                              }}
                              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#ff4500] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-sm"
                            >
                              Reddit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Final insights — animated reveal */}
              {!isUploaded ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
                  <div className="text-lg font-semibold text-slate-800">
                    Upload Resume to Generate AI Insights
                  </div>
                  <p className="mt-2 text-sm text-slate-550">
                    ATS score, skill gaps, roadmap, and project recommendations will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-3">
                  {INSIGHTS.map((ins, i) => (
                    <ScoreCard
                      key={ins.label}
                      label={ins.label}
                      value={
                        i === 0
                          ? atsScore
                          : i === 1
                            ? Math.min(skills.length * 15, 100)
                            : Math.min(atsScore + skills.length * 5, 100)
                      }
                      color={i === 0 ? "oklch(0.65 0.25 45)" : i === 1 ? "oklch(0.75 0.20 60)" : "oklch(0.58 0.24 35)"}
                      active={stage === "scoring" || stage === "complete"}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Resume Scanner panel                                                      */
/* -------------------------------------------------------------------------- */

function ResumeScanner({
  stage,
  onRun,
  onReset,
  isUploaded,
  resumeName,
  resumeText,
  handleResumeUpload,
  activeTab,
  setActiveTab,
  skills,
  missingSkills,
  roadmap,
  projects,
}: {
  stage: Stage;
  onRun: () => void;
  onReset: () => void;
  isUploaded: boolean;
  resumeName: string;
  resumeText: string;
  activeTab: string;
  skills: string[];
  missingSkills: string[];
  roadmap: string[];
  projects: string[];
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  handleResumeUpload: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  const scanning = stage !== "idle" && stage !== "complete";

  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 font-semibold">
          <FileText className="h-3.5 w-3.5 text-primary" />
          {isUploaded ? resumeName : "Upload Resume"}
        </div>

        {stage === "complete" ? (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-350 bg-slate-100 hover:bg-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        ) : !isUploaded ? (
          <>
            <label
              htmlFor="resumeUpload"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3.5 py-1.5 text-[11px] font-bold text-white cursor-pointer shadow-[0_4px_12px_rgba(249,115,22,0.2)]"
            >
              <Upload className="h-3 w-3" />
              Upload PDF
            </label>

            <input
              id="resumeUpload"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleResumeUpload}
            />
          </>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-250 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            Resume Ready
          </div>
        )}
      </div>

      {/* Resume mock + scan beam */}
      <div className="relative h-[360px] overflow-hidden rounded-xl border border-slate-200 bg-white p-4 flex flex-col">
        {!isUploaded ? (
          <div className="flex flex-1 items-center justify-center text-slate-400">
            Drag & Drop Resume Here
          </div>
        ) : (
          <div className="space-y-3 text-slate-800 overflow-y-auto max-h-[320px] text-sm leading-relaxed text-left">
            {resumeText ? (
              <pre className="whitespace-pre-wrap font-sans">
                {resumeText.slice(0, 1200)}
              </pre>
            ) : (
              <p>No resume content available</p>
            )}
          </div>
        )}

        {/* Grid overlay during scan */}
        {scanning && (
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(oklch(0.65 0.25 45 / 30%) 1px, transparent 1px), linear-gradient(90deg, oklch(0.65 0.25 45 / 30%) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        )}

        {/* Scan beam */}
        {scanning && (
          <>
            <motion.div
              className="pointer-events-none absolute left-0 right-0 h-24"
              style={{
                background:
                  "linear-gradient(180deg, transparent, oklch(0.65 0.25 45 / 35%), transparent)",
                filter: "blur(2px)",
              }}
              initial={{ top: "-20%" }}
              animate={{ top: ["-20%", "100%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="pointer-events-none absolute left-0 right-0 h-px bg-primary shadow-[0_0_18px_oklch(0.65_0.25_45/100%)]"
              initial={{ top: "-2%" }}
              animate={{ top: ["-2%", "102%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}

        {/* Detection markers */}
        {scanning &&
          [
            { top: "18%", left: "8%" },
            { top: "44%", left: "70%" },
            { top: "62%", left: "20%" },
            { top: "78%", left: "55%" },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute h-3 w-3 rounded-sm border border-orange-500"
              style={p}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.2, 1, 0.8] }}
              transition={{ duration: 1.4, delay: i * 0.35, repeat: Infinity, repeatDelay: 0.6 }}
            />
          ))}

        {/* Complete overlay */}
        {stage === "complete" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 grid place-items-center bg-white/60 backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_4px_16px_oklch(0.65_0.25_45/30%)]">
                <CheckCircle2 className="h-7 w-7" />
              </div>
               <div className="text-sm font-semibold text-slate-800">Analysis Ready</div>
              <div className="text-[11px] text-slate-500 font-medium">
                {skills.length} skills · {missingSkills.length} gaps · {roadmap.length} roadmap generated
              </div>
              <button
                onClick={onReset}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-350 bg-slate-100 hover:bg-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer shadow-sm transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset & Upload New
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Footer meta */}
      {isUploaded && (
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          {[
            { icon: Target, label: "Match", key: "match" },
            { icon: TrendingUp, label: "Growth", key: "growth" },
            { icon: Cpu, label: "Engine", key: "engine" },
          ].map((m) => (
            <button
              key={m.label}
              onClick={() => setActiveTab(m.key)}
              className={`cursor-pointer rounded-xl border p-2.5 transition-all flex flex-col items-center justify-center gap-1 ${
                activeTab === m.key
                  ? "bg-orange-500 border-orange-500 text-white font-semibold"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <m.icon className="h-4 w-4" />
              <p>{m.label}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Animated score card                                                       */
/* -------------------------------------------------------------------------- */

function ScoreCard({
  label,
  value,
  color,
  active,
}: {
  label: string;
  value: number;
  color: string;
  active: boolean;
}) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-5 flex flex-col items-center justify-center text-center shadow-sm"
    >
      <div className="relative flex items-center justify-center h-28 w-28">
        <svg viewBox="0 0 100 100" className="-rotate-90 h-full w-full">
          <circle cx="50" cy="50" r={r} stroke="oklch(0.20 0.03 260 / 5%)" strokeWidth="8" fill="none" />
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            animate={{ strokeDashoffset: active ? offset : c }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tracking-tight text-slate-800">
            {active ? value : 0}
            <span className="text-xs text-slate-500">%</span>
          </span>
        </div>
      </div>
      <span className="mt-3 text-[10px] uppercase font-bold tracking-wider text-slate-500">
        {label}
      </span>
    </motion.div>
  );
}
