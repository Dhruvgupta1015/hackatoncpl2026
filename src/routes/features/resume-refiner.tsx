import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  Copy, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle,
  FileText,
  AlertCircle,
  Code2,
  ListRestart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useResume } from "@/lib/resumeContext";
import { toast } from "sonner";

export const Route = createFileRoute("/features/resume-refiner")({
  component: ResumeRefiner,
});

const defaultSampleBullets = `• Worked on the company dashboard using React.
• Was responsible for writing SQL database queries.
• Helped fix bugs in the node backend server to improve api.
• Made the website load faster for users.`;

function ResumeRefiner() {
  const { analysisResult, setAnalysisResult } = useResume();
  
  const [originalBullets, setOriginalBullets] = useState(defaultSampleBullets);
  const [jobDescription, setJobDescription] = useState("");
  const [refineFocus, setRefineFocus] = useState<"metrics" | "verbs" | "ats">("metrics");
  const [isRefining, setIsRefining] = useState(false);
  const [refinedOutput, setRefinedOutput] = useState<any[] | null>(null);

  // Sync sample inputs with uploaded resume suggestions if available
  useEffect(() => {
    if (analysisResult && analysisResult.weaknesses && analysisResult.weaknesses.length > 0) {
      const bulletList = analysisResult.weaknesses.map(w => `• ${w}`).join("\n");
      setOriginalBullets(bulletList);
    }
  }, [analysisResult]);

  const handleRefine = async () => {
    if (!originalBullets.trim()) {
      toast.error("Please enter your original bullet points first!");
      return;
    }

    setIsRefining(true);
    setRefinedOutput(null);

    const apiKey = localStorage.getItem("skillsync_openai_key") || "";

    try {
      if (apiKey) {
        // OpenAI real-time integration
        const prompt = `You are a resume refiner. Refine these resume bullet points targeting a job role with focus on: "${refineFocus}".
        Original Bullets:
        ${originalBullets}
        
        Optional Job Description Context:
        ${jobDescription}

        Provide a JSON response containing an array of objects. Each object must represent a bullet point and have:
        - originalText: the exact original bullet point string
        - refinedText: the refined version containing strong action verbs, and quantified metrics/KPIs (e.g. "Optimized x by 40%")
        - weakPhrase: the weak verb/phrase in original that was replaced (e.g. "Worked on")
        - strongPhrase: the premium replacement verb/phrase (e.g. "Architected")
        - explanation: a short sentence explanation (e.g. "Quantified impact with a specific metrics percentage.")
        
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
        const jsonOutput = JSON.parse(data.choices[0]?.message?.content);
        setRefinedOutput(Array.isArray(jsonOutput) ? jsonOutput : jsonOutput.bullets || []);
      } else {
        // Mock compiler logic for offline presentation
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        const lines = originalBullets.split("\n").filter(l => l.trim().length > 3);
        const resolved: any[] = [];

        const replacements: Record<string, { strong: string; refined: string; explanation: string }> = {
          "worked on": {
            strong: "Spearheaded development of",
            refined: "Spearheaded development of core modular components, improving UI page interaction speeds by 35%.",
            explanation: "Upgraded 'Worked on' with a proactive action verb and quantified performance metrics."
          },
          "responsible for": {
            strong: "Engineered and optimized",
            refined: "Engineered and optimized database relational schemes, cutting slow query search latencies by 55%.",
            explanation: "Replaced passive responsibility indicator with 'Engineered', highlighting direct technical ownership."
          },
          "helped fix": {
            strong: "Systematized debug pipelines for",
            refined: "Systematized debug pipelines, decreasing production backend crash rates by 28%.",
            explanation: "Exchanged collaborative helper tag for operational ownership terminology."
          },
          "made the": {
            strong: "Architected modern caching to make",
            refined: "Architected cache caching layouts, accelerating website page load latencies by 42%.",
            explanation: "Converted generic 'made' to technical architecture verbs."
          }
        };

        lines.forEach((line) => {
          const lower = line.toLowerCase();
          let matched = false;

          for (const key in replacements) {
            if (lower.includes(key)) {
              const cleanedOriginal = line.replace(/^[•\-\*\s]+/, "");
              resolved.push({
                originalText: cleanedOriginal,
                refinedText: replacements[key].refined,
                weakPhrase: key.charAt(0).toUpperCase() + key.slice(1),
                strongPhrase: replacements[key].strong,
                explanation: replacements[key].explanation
              });
              matched = true;
              break;
            }
          }

          if (!matched) {
            // General fallback
            const cleanedOriginal = line.replace(/^[•\-\*\s]+/, "");
            resolved.push({
              originalText: cleanedOriginal,
              refinedText: `Formulated and executed core optimization routines, enhancing system maintainability metrics by 25%.`,
              weakPhrase: "Original formatting",
              strongPhrase: "Formulated and executed",
              explanation: "Added clear metric milestones and operational descriptors."
            });
          }
        });

        setRefinedOutput(resolved);
      }
      toast.success("Resume Refinement Completed!");
    } catch (e) {
      console.error(e);
      toast.error("An error occurred during refinement. Please check your inputs.");
    } finally {
      setIsRefining(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied refined bullet point to clipboard!");
  };

  const syncToProfile = () => {
    if (!refinedOutput || !analysisResult) {
      toast.error("Please refine your bullet points and ensure you have an uploaded profile first!");
      return;
    }

    // Replace context weaknesses with refined bullets
    const refinedStringList = refinedOutput.map(item => item.refinedText);
    setAnalysisResult({
      ...analysisResult,
      weaknesses: refinedStringList,
    });
    toast.success("Refined bullets synced back to your Career Profile!");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-left">
      <Navbar />

      {/* Background radial blobs */}
      <div className="absolute right-0 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-orange-500/5 blur-[140px] pointer-events-none" />

      <main className="container mx-auto px-4 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20 text-orange-650 mb-4">
            <Sparkles className="h-7 w-7 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Side-by-Side Resume Refiner</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Input weak or generic bullet points to optimize them instantly with strong action verbs and quantified impact metrics.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12 max-w-6xl mx-auto items-start">
          
          {/* LEFT: Inputs Panel */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-lg text-slate-800">1. Original Bullet Points</CardTitle>
                <CardDescription>Enter one bullet point per line.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <textarea
                  value={originalBullets}
                  onChange={(e) => setOriginalBullets(e.target.value)}
                  rows={6}
                  placeholder="Paste your weak bullet points here..."
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                />

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Target Focus Mode</label>
                  <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setRefineFocus("metrics")}
                      className={`text-xs py-2 rounded-lg font-semibold transition-all ${
                        refineFocus === "metrics" ? "bg-white text-orange-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Quantify Metrics
                    </button>
                    <button
                      onClick={() => setRefineFocus("verbs")}
                      className={`text-xs py-2 rounded-lg font-semibold transition-all ${
                        refineFocus === "verbs" ? "bg-white text-orange-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Action Verbs
                    </button>
                    <button
                      onClick={() => setRefineFocus("ats")}
                      className={`text-xs py-2 rounded-lg font-semibold transition-all ${
                        refineFocus === "ats" ? "bg-white text-orange-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      ATS Keywords
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Job Description Context (Optional)</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={3}
                    placeholder="Paste target job requirements here to inject context-specific keywords..."
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <Button
                  onClick={handleRefine}
                  disabled={isRefining}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 font-semibold shadow-[0_4px_12px_rgba(249,115,22,0.2)] flex items-center justify-center gap-2"
                >
                  {isRefining ? (
                    <>
                      <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                      Auditing & Refining...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4.5 w-4.5" />
                      Refine Bullet Points
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Comparative Visual Output */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {refinedOutput ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Actions Header */}
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs text-slate-500 font-semibold">
                      Successfully refined {refinedOutput.length} bullet points.
                    </span>
                    {analysisResult && (
                      <Button
                        onClick={syncToProfile}
                        variant="outline"
                        size="sm"
                        className="border-orange-500 text-orange-700 hover:bg-orange-50 font-semibold rounded-lg"
                      >
                        <ListRestart className="h-4 w-4 mr-1.5" />
                        Sync to Dashboard Profile
                      </Button>
                    )}
                  </div>

                  {/* Bullet comparisons list */}
                  <div className="space-y-4">
                    {refinedOutput.map((item, index) => (
                      <Card key={index} className="bg-white border-slate-200 shadow-sm overflow-hidden">
                        <div className="grid md:grid-cols-2 border-b border-slate-100 items-stretch">
                          
                          {/* Original Column */}
                          <div className="p-4 bg-slate-50/40 border-r border-slate-100 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                Before
                              </span>
                              <p className="text-xs text-slate-500 mt-3 font-medium">
                                • {item.originalText}
                              </p>
                            </div>
                            {item.weakPhrase && (
                              <div className="text-[11px] text-red-700 mt-4 font-semibold">
                                Strikethrough phrase: <del className="text-slate-400">{item.weakPhrase}</del>
                              </div>
                            )}
                          </div>

                          {/* Refined Column */}
                          <div className="p-4 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-150 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                Optimized
                              </span>
                              <p className="text-xs text-slate-700 mt-3 font-semibold leading-relaxed">
                                • {item.refinedText}
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-4 border-t border-slate-100 pt-3">
                              <span className="text-[11px] text-green-700 font-bold">
                                Added: {item.strongPhrase}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(item.refinedText)}
                                className="h-7 w-7 p-0 text-slate-400 hover:text-orange-600"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                        </div>
                        
                        {/* Explanation bottom footer */}
                        <div className="bg-orange-50/20 px-4 py-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-650">
                          <HelpCircle className="h-3.5 w-3.5 text-orange-500" />
                          <span className="font-semibold text-slate-500">{item.explanation}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <Card className="bg-white border-slate-200 border-dashed shadow-xs h-[420px] flex items-center justify-center">
                  <div className="text-center p-6 space-y-3 max-w-sm">
                    <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-100">
                      <FileText className="h-6 w-6 text-slate-400" />
                    </div>
                    <h4 className="font-bold text-slate-700">Awaiting refinement data</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Enter raw resume bullet points on the left panel, select your target optimization mode, and click refine to view side-by-side comparative diagnostics.
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
