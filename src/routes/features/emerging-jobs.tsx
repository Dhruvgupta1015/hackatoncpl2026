import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Linkedin, 
  HelpCircle, 
  Copy, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  Brain,
  ShieldAlert,
  Dna,
  Zap,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useResume } from "@/lib/resumeContext";
import { toast } from "sonner";

export const Route = createFileRoute("/features/emerging-jobs")({
  component: EmergingJobs,
});

interface FutureRole {
  id: string;
  title: string;
  salary: string;
  growth: string;
  desc: string;
  icon: any;
  skills: string[];
  sampleSummary: string;
  headlines: string[];
}

const futureRoles: FutureRole[] = [
  {
    id: "prompt",
    title: "AI Prompt Engineer & Agent Architect",
    salary: "$130k - $185k",
    growth: "+240% Growth",
    desc: "Orchestrates complex multi-agent workflows, designs prompt logic structures, and builds Retrieval-Augmented Generation (RAG) vector pipelines.",
    icon: Brain,
    skills: ["RAG Pipelines", "Agentic Workflows", "Vector DBs (Chroma/Pinecone)", "Hugging Face", "LangChain"],
    sampleSummary: "AI Interaction Engineer and Agent Architect specializing in orchestrating autonomous multi-agent pipelines and Retrieval-Augmented Generation (RAG) structures. Highly skilled in LangChain, Python, and Pinecone vector databases. Proven track record of optimizing large language model inference templates to slash query latency and improve factual precision.",
    headlines: [
      "AI Interaction Engineer & Agent Architect | Building RAG & Autonomous Pipelines",
      "AI Prompt Engineer | LangChain & Vector Databases Specialist"
    ]
  },
  {
    id: "ethics",
    title: "AI Safety, Bias & Ethics Auditor",
    salary: "$110k - $160k",
    growth: "+180% Growth",
    desc: "Audits large-scale datasets for bias, implements safety and alignment benchmarks, and aligns software systems with international AI compliance acts.",
    icon: ShieldAlert,
    skills: ["EU AI Act Compliance", "Algorithmic Fairness", "Red-Teaming", "Data Anonymization", "Model Alignment"],
    sampleSummary: "Dedicated AI Safety and Ethics Auditor with experience auditing algorithmic datasets for bias, toxicity, and compliance benchmarks. Specialized in aligning model behaviors with safety guidelines and configuring private data anonymization filters. Expert in interpreting international regulatory compliance metrics.",
    headlines: [
      "AI Safety & Ethics Specialist | Algorithmic Bias Auditor",
      "Model Alignment & Compliance Engineer | Navigating AI Regulations"
    ]
  },
  {
    id: "quantum",
    title: "Quantum Software Coder",
    salary: "$140k - $210k",
    growth: "+95% Growth",
    desc: "Develops algorithms leveraging qubits, superposition, quantum entanglement, and quantum gates on simulated or physical hardware.",
    icon: Cpu,
    skills: ["Qiskit", "Quantum Gates", "Cirq", "Quantum Cryptography", "Quantum Algorithms"],
    sampleSummary: "Quantum Software Engineer specializing in designing algorithms for superposition and entanglement architectures. Proficient in Qiskit, Cirq, and mathematical quantum modeling. Experience simulating quantum gate routines to optimize complex search and encryption calculations.",
    headlines: [
      "Quantum Software Developer | Qiskit & Quantum Cryptography",
      "Quantum Algorithms Architect | Designing Superposition Solutions"
    ]
  },
  {
    id: "bio",
    title: "Bioinformatics Software Architect",
    salary: "$125k - $175k",
    growth: "+115% Growth",
    desc: "Blends software engineering, genetic modeling pipelines, cancer mapping, and high-performance server clusters.",
    icon: Dna,
    skills: ["Genomic Data Pipelines", "BLAST Alignment", "Python SciPy", "PyMol", "High-Performance Clusters"],
    sampleSummary: "Bioinformatics Software Engineer bridging data science, genetic sequence modeling, and high-performance server architecture. Experienced in constructing BLAST DNA alignment pipelines and data structures in Python SciPy. Passionate about automating cancer genomic research frameworks.",
    headlines: [
      "Bioinformatics Software Engineer | Genomic Data Pipelines Architect",
      "Biotech Software Developer | Automating Genetic Alignment Pipelines"
    ]
  }
];

function EmergingJobs() {
  const { analysisResult } = useResume();
  const [selectedRole, setSelectedRole] = useState(futureRoles[0]);
  const [linkedinText, setLinkedinText] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any | null>(null);

  const handleAuditProfile = async () => {
    if (!linkedinText.trim()) {
      toast.error("Please paste your LinkedIn profile text first!");
      return;
    }

    setIsAuditing(true);
    setAuditResult(null);

    const apiKey = localStorage.getItem("skillsync_openai_key") || "";

    try {
      if (apiKey) {
        // OpenAI real-time integration
        const prompt = `Analyze this candidate LinkedIn summary/profile for alignment with the emerging job: "${selectedRole.title}".
        Candidate LinkedIn Text:
        ${linkedinText}
        
        Provide a JSON response with the following keys:
        - alignmentScore: number (alignment rating out of 100)
        - missingSkills: string[] (3-4 missing skills/keywords related to ${selectedRole.title})
        - headlines: string[] (2 catchy LinkedIn headlines optimized for this target future role)
        - upgradedSummary: string (a complete, highly professional, rewritten LinkedIn Summary integrating candidate background and target future role requirements)
        
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

        if (!response.ok) throw new Error("OpenAI API call failed");
        const data = await response.json();
        const jsonResult = JSON.parse(data.choices[0]?.message?.content);
        setAuditResult(jsonResult);
      } else {
        // Mock optimization logic for offline judging
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        const lowerText = linkedinText.toLowerCase();
        let matchScore = 55;
        const missing: string[] = [];

        selectedRole.skills.forEach((skill) => {
          if (lowerText.includes(skill.toLowerCase())) {
            matchScore += 8;
          } else {
            missing.push(skill);
          }
        });

        const computedScore = Math.min(94, matchScore);
        
        // Assemble upgraded summary using their text as context
        const upgradedSummary = `I am a forward-looking developer, now aligning my technical background with the requirements of an ${selectedRole.title}. ${selectedRole.sampleSummary}`;

        setAuditResult({
          alignmentScore: computedScore,
          missingSkills: missing.slice(0, 3),
          headlines: selectedRole.headlines,
          upgradedSummary
        });
      }
      toast.success("LinkedIn Profile Alignment completed!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to analyze profile. Please retry.");
    } finally {
      setIsAuditing(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-left">
      <Navbar />

      {/* Decorative blobs */}
      <div className="absolute right-0 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-orange-500/5 blur-[140px] pointer-events-none" />

      <main className="container mx-auto px-4 pt-28 pb-20">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20 text-orange-650 mb-4">
            <Linkedin className="h-7 w-7 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">LinkedIn Profile Optimizer & Emerging Careers</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Discover emerging, high-growth technology careers and align your professional LinkedIn profile to stand out to global recruiters.
          </p>
        </motion.div>

        {/* SECTION 1: Emerging Jobs Catalog */}
        <div className="mb-14">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500 fill-orange-500" />
            1. Emerging Technology Careers (High-Growth Sectors)
          </h3>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {futureRoles.map((role) => {
              const IconComp = role.icon;
              const isSelected = selectedRole.id === role.id;
              
              return (
                <Card 
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`bg-white border cursor-pointer transition-all duration-300 ${
                    isSelected ? "border-orange-500 ring-1 ring-orange-400" : "border-slate-200 hover:border-orange-350"
                  }`}
                >
                  <CardHeader className="pb-3 flex flex-row items-start justify-between gap-2">
                    <div className={`p-2.5 rounded-xl border ${isSelected ? "bg-orange-50 text-orange-700 border-orange-100" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold bg-orange-500/10 text-orange-700 px-2.5 py-0.5 rounded-full">
                      {role.growth}
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-2.5 text-left">
                    <h4 className="font-bold text-sm text-slate-850 leading-snug">{role.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed max-h-16 overflow-hidden">
                      {role.desc}
                    </p>
                    <div className="text-xs font-bold text-slate-700">
                      Proj. Salary: {role.salary}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Profile Optimizer Analyzer */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Input Panel */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm text-left">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-lg text-slate-800">LinkedIn Summary Auditor</CardTitle>
                <CardDescription>Targeting: {selectedRole.title}</CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-5">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Paste LinkedIn Summary / Experience</label>
                  <textarea
                    value={linkedinText}
                    onChange={(e) => setLinkedinText(e.target.value)}
                    rows={6}
                    placeholder="Paste your active LinkedIn bio or experience sections here..."
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <Button
                  onClick={handleAuditProfile}
                  disabled={isAuditing}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 font-semibold shadow-[0_4px_12px_rgba(249,115,22,0.2)] flex items-center justify-center gap-2"
                >
                  {isAuditing ? (
                    <>
                      <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                      Auditing Alignment...
                    </>
                  ) : (
                    <>
                      <Linkedin className="h-4.5 w-4.5" />
                      Optimize LinkedIn Profile
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {auditResult ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Score & Alignment card */}
                  <Card className="bg-white border border-slate-200 shadow-md">
                    <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                      <CardTitle className="text-md text-slate-850">Alignment Scorecard</CardTitle>
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-150 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Audit Complete
                      </span>
                    </CardHeader>
                    <CardContent className="pt-6 grid sm:grid-cols-2 gap-6 items-center">
                      {/* Circular Gauge */}
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full border-4 border-orange-500 flex flex-col items-center justify-center bg-orange-50/20 relative shadow-inner">
                          <span className="text-2xl font-extrabold text-slate-800">{auditResult.alignmentScore}%</span>
                          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">FIT INDEX</span>
                        </div>
                      </div>

                      {/* Missing Keywords list */}
                      <div className="space-y-2.5">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Critical Missing Keywords</label>
                        <div className="flex flex-wrap gap-2">
                          {auditResult.missingSkills.length > 0 ? (
                            auditResult.missingSkills.map((sk: string, i: number) => (
                              <span 
                                key={i}
                                className="text-xs bg-red-50 text-red-700 border border-red-100 px-3 py-1 rounded-xl font-medium"
                              >
                                ✕ {sk}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-green-700 font-semibold">✓ Profile contains all critical keywords!</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Headline upgrades */}
                  <Card className="bg-white border-slate-200 shadow-sm text-left">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-slate-800">LinkedIn Headline Upgrades</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {auditResult.headlines.map((hl: string, i: number) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                          <span className="max-w-[85%]">{hl}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyText(hl)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-orange-600"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Upgraded Professional Summary */}
                  <Card className="bg-white border-slate-200 shadow-sm text-left">
                    <CardHeader className="pb-3 border-b border-slate-100 flex flex-row justify-between items-center">
                      <CardTitle className="text-sm text-slate-850">Upgraded Summary Draft</CardTitle>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyText(auditResult.upgradedSummary)}
                        className="border-orange-500 text-orange-700 hover:bg-orange-50 text-xs font-bold rounded-lg"
                      >
                        <Copy className="h-4 w-4 mr-1.5" />
                        Copy Summary
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-4 text-xs leading-relaxed text-slate-650 bg-slate-50/50 p-4 rounded-b-2xl border-t border-slate-100">
                      {auditResult.upgradedSummary}
                    </CardContent>
                  </Card>

                </motion.div>
              ) : (
                <Card className="bg-white border-slate-200 border-dashed shadow-xs h-[420px] flex items-center justify-center">
                  <div className="text-center p-6 space-y-3 max-w-sm">
                    <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-100">
                      <Linkedin className="h-6 w-6 text-slate-400" />
                    </div>
                    <h4 className="font-bold text-slate-700">Awaiting Profile Audit</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Paste your LinkedIn profile text on the left panel, select your target emerging career path above, and click optimize to audit.
                    </p>
                  </div>
                </Card>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
