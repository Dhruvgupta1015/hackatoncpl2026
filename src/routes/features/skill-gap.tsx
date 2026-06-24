import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Target, TrendingUp, TrendingDown, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useResume } from "@/lib/resumeContext";

export const Route = createFileRoute("/features/skill-gap")({
  component: SkillGap,
});

const ROLE_COMPETENCIES: Record<string, string[]> = {
  "Frontend Developer": ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Next.js", "TailwindCSS", "Git"],
  "Backend Developer": ["Node.js", "Express", "SQL", "PostgreSQL", "MongoDB", "Redis", "Docker", "System Design"],
  "Full Stack Developer": ["React", "TypeScript", "Node.js", "MongoDB", "SQL", "Docker", "System Design", "Git"],
  "AI Engineer": ["Python", "Machine Learning", "Deep Learning", "LLM", "RAG", "PyTorch", "OpenAI"],
  "DevOps Engineer": ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "GitHub Actions", "Linux"],
  "Mobile Developer": ["React Native", "Flutter", "Swift", "Kotlin", "Git"],
  "Software Engineer": ["JavaScript", "Python", "SQL", "Git", "DSA", "System Design"],
};

function SkillGap() {
  const { analysisResult } = useResume();
  const [selectedRole, setSelectedRole] = useState("Frontend");
  const [showLearningPath, setShowLearningPath] = useState(false);

  const roles = {
    Frontend: [
      { name: "React", level: 85, required: 90 },
      { name: "TypeScript", level: 70, required: 85 },
      { name: "CSS", level: 80, required: 90 },
      { name: "Next.js", level: 50, required: 80 },
    ],

    Backend: [
      { name: "Node.js", level: 60, required: 90 },
      { name: "MongoDB", level: 55, required: 80 },
      { name: "Express", level: 65, required: 85 },
      { name: "System Design", level: 40, required: 75 },
    ],

    AI: [
      { name: "Python", level: 75, required: 90 },
      { name: "Machine Learning", level: 50, required: 85 },
      { name: "Deep Learning", level: 40, required: 80 },
      { name: "Data Science", level: 60, required: 85 },
    ],
  };

  const learningPaths = {
    Frontend: [
      "HTML, CSS, JavaScript fundamentals",
      "React + TypeScript mastery",
      "Next.js + Performance Optimization",
    ],

    Backend: [
      "Node.js fundamentals",
      "Express + REST APIs",
      "MongoDB + Deployment + System Design",
    ],

    AI: [
      "Python + NumPy basics",
      "Machine Learning fundamentals",
      "Deep Learning + Model Deployment",
    ],
  };

  const hasAnalysis = !!analysisResult;
  const targetRoleName = analysisResult ? analysisResult.role : "Senior Full Stack Engineer";

  // Build competencies dynamically if analyzed
  const currentSkills = analysisResult
    ? (ROLE_COMPETENCIES[analysisResult.role] || ROLE_COMPETENCIES["Software Engineer"]).map(skillName => {
        const isDetected = analysisResult.detectedSkills.includes(skillName);
        return {
          name: skillName,
          level: isDetected ? 85 : 35,
          required: 85,
        };
      })
    : roles[selectedRole as keyof typeof roles];

  const currentPath = analysisResult
    ? analysisResult.roadmap.map(phase => {
        const tasksStr = phase.tasks.map(t => t.title).slice(0, 2).join(" & ");
        return `${phase.title}: ${tasksStr}`;
      })
    : learningPaths[selectedRole as keyof typeof learningPaths];

  const criticalGaps = analysisResult
    ? analysisResult.missingSkills.slice(0, 3).map(skill => ({
        name: skill,
        text: `Missing from resume. Crucial for ${analysisResult.role} roles.`,
      }))
    : [
        { name: "System Design", text: "35% below requirement. Crucial for senior roles." },
        { name: "GraphQL", text: "40% below requirement. Often requested by top tech companies." }
      ];

  const strengths = analysisResult
    ? analysisResult.detectedSkills.slice(0, 3).map(skill => ({
        name: skill,
        text: "Detected in your resume! Meets requirement.",
      }))
    : [
        { name: "React Ecosystem", text: "Almost at target level. Keep it up!" }
      ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-20">
        <div className="pointer-events-none absolute right-1/4 top-0 -z-10 h-[600px] w-[800px] rounded-full bg-orange-500/5 blur-[120px]" />

        {/* Demo Mode alert banner */}
        {!analysisResult && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl max-w-6xl mx-auto text-left"
          >
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
              <div className="text-left">
                <h4 className="font-semibold text-amber-300">Viewing Demo Skill Gaps</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upload your resume in the Resume Analyzer to run a customized skill-gap mapping against industry standards!
                </p>
              </div>
            </div>
            <Link to="/features/resume-analyzer">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl">
                Upload Resume
              </Button>
            </Link>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20 text-orange-600 mb-6">
            <Target className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Skill Gap Analysis
          </h1>

          {!analysisResult && (
            <div className="flex justify-center gap-3 mt-6 mb-6">
              <Button 
                onClick={() => setSelectedRole("Frontend")}
                className={selectedRole === "Frontend" ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}
              >
                Frontend
              </Button>

              <Button 
                onClick={() => setSelectedRole("Backend")}
                className={selectedRole === "Backend" ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}
              >
                Backend
              </Button>

              <Button 
                onClick={() => setSelectedRole("AI")}
                className={selectedRole === "AI" ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}
              >
                AI / ML
              </Button>
            </div>
          )}

          <p className="text-xl text-muted-foreground">
            Compare your current skill set against the requirements for your target role:{" "}
            <strong className="text-slate-800">{targetRoleName}</strong>.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2"
          >
            <Card className="bg-white border-slate-200 h-full">
              <CardHeader>
                <CardTitle className="text-slate-800">Skill Alignment Match</CardTitle>
                <CardDescription>Your proficiency vs Market requirement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentSkills.map((skill, index) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="font-semibold text-slate-700 text-sm">{skill.name}</span>
                      <div className="text-xs text-slate-500 flex gap-3">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-orange-500" /> You: {skill.level}%
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-slate-300" /> Req: {skill.required}%
                        </span>
                      </div>
                    </div>
                    <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-slate-200"
                        style={{ width: `${skill.required}%` }}
                      />
                      <div
                        className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-800">Critical Gaps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {criticalGaps.length > 0 ? (
                  criticalGaps.map(gap => (
                    <div key={gap.name} className="flex items-start gap-3">
                      <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg shrink-0">
                        <TrendingDown className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-800">{gap.name}</h4>
                        <p className="text-xs text-slate-550 mt-0.5 leading-normal">
                          {gap.text}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-emerald-700 font-semibold">No critical gaps identified! Excellent profile.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-800">Strengths</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {strengths.length > 0 ? (
                  strengths.map(str => (
                    <div key={str.name} className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg shrink-0">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-800">{str.name}</h4>
                        <p className="text-xs text-slate-550 mt-0.5 leading-normal">
                          {str.text}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Upload resume to identify primary strengths.</p>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={() => setShowLearningPath(true)}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 py-6 font-bold text-base shadow-[0_4px_12px_rgba(249,115,22,0.25)] hover:from-orange-600 hover:to-amber-600 transition-all duration-300"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Generate Learning Path
            </Button>
            
            {showLearningPath && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-orange-600">
                    Personalized Learning Path
                  </h3>
                  <button
                    onClick={() => setShowLearningPath(false)}
                    className="text-slate-400 hover:text-slate-700 transition text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  {currentPath.map((step, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <h4 className="font-semibold text-sm text-slate-850">Phase {idx + 1}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-normal">
                        {step}
                      </p>
                    </div>
                  ))}

                  <div className="rounded-xl bg-orange-500/10 p-4 text-xs space-y-1 text-slate-850 border border-orange-500/20">
                    <p className="font-semibold">
                      ⏱ Estimated Time:{" "}
                      {selectedRole === "Frontend" ? "3 Months" : selectedRole === "Backend" ? "4 Months" : "5 Months"}
                    </p>
                    <p>📈 Difficulty: Intermediate → Advanced</p>
                    <p>🏆 Final Goal: Industry Ready {targetRoleName} Engineer</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
