import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Upload, FileSearch, CheckCircle, AlertCircle, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState, useRef, useEffect } from "react";
import { useResume } from "@/lib/resumeContext";
import { generatePdfReport } from "@/lib/pdfReport";

export const Route = createFileRoute("/features/resume-analyzer")({
  component: ResumeAnalyzer,
});

function ResumeAnalyzer() {
  const { analysisResult, analyzeResumeFile, clearAnalysis, isLoading, error } = useResume();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (analysisResult) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [analysisResult]);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a resume first!");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate scanning animation
    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      setProgress(Math.min(95, p));
    }, 100);

    try {
      await analyzeResumeFile(selectedFile);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
      }, 400);
    } catch (err: any) {
      clearInterval(interval);
      setIsAnalyzing(false);
      alert(err.message || "Failed to analyze resume. Please try a different PDF or TXT file.");
    }
  };

  const getScoreRating = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 70) return "Average";
    return "Needs Review";
  };

  const activeAtsScore = analysisResult?.atsScore ?? 84;
  const activeSubscores = analysisResult?.subscores ?? { structure: 92, keywords: 76, formatting: 85 };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-20">
        
        {/* Go Back to Home Link */}
        <div className="mb-6 text-left">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-orange-550 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-orange-500/5 blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20 text-orange-600 mb-6">
            <FileSearch className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">AI Resume Analyzer</h1>
          <p className="text-xl text-muted-foreground">
            Upload your resume and let our AI engine analyze it for ATS compatibility, keyword
            optimization, and overall impact.
          </p>
        </motion.div>

        {!showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-background/60 backdrop-blur-xl border-slate-200">
              <CardContent className="pt-6">
                <div
                  className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-orange-500/50 transition-colors cursor-pointer group"
                  onClick={() => {
                    if (!isAnalyzing && !selectedFile) {
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  {isAnalyzing ? (
                    <div className="space-y-6">
                      <div className="mx-auto w-16 h-16 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Analyzing Resume...</h3>
                        <p className="text-muted-foreground text-sm">
                          Extracting skills, experience, and formatting
                        </p>
                      </div>
                      <Progress
                        value={progress}
                        className="h-2 w-full max-w-xs mx-auto bg-slate-100"
                        indicatorColor="bg-orange-500"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground group-hover:text-orange-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Click to upload or drag and drop</h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          PDF or TXT (Max. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.txt"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                          }
                        }}
                      />

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedFile) {
                            handleUpload();
                          } else {
                            fileInputRef.current?.click();
                          }
                        }}
                        className="mt-4 bg-slate-100 hover:bg-slate-200 text-foreground border border-slate-300"
                      >
                        {selectedFile ? selectedFile.name : "Select Resume"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto"
          >
            <div className="md:col-span-1 flex flex-col gap-6">
              <Card className="bg-background/60 backdrop-blur-xl border-slate-200 text-center shadow-sm">
                <CardHeader>
                  <CardTitle>Overall ATS Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative inline-flex items-center justify-center w-40 h-40">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-slate-100"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray="264"
                        strokeDashoffset={264 - (264 * activeAtsScore) / 100}
                        className="text-primary"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-bold text-primary">
                        {activeAtsScore}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                        {getScoreRating(activeAtsScore)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3 text-left">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Format & Structure</span>
                      <span className="font-semibold text-emerald-600">{activeSubscores.structure}/100</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Keyword Optimization</span>
                      <span className="font-semibold text-amber-700">{activeSubscores.keywords}/100</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Action Verbs</span>
                      <span className="font-semibold text-primary">{activeSubscores.formatting}/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Share Card */}
              <Card className="bg-background/60 backdrop-blur-xl border-slate-200 text-left shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold tracking-wider text-orange-700 uppercase">Share Your Score</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">Showcase your resume credentials on social media:</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        const shareText = `🚀 I just audited my resume on SkillSync AI and achieved an ATS Score of ${activeAtsScore}/100! 

🎯 Primary Alignment: ${analysisResult?.role || "Software Engineer"}
🔍 Subscores:
• Format & Structure: ${activeSubscores.structure}/100
• Keyword Optimization: ${activeSubscores.keywords}/100
• Action Verbs: ${activeSubscores.formatting}/100

Optimize your resume & see AI roadmap insights: https://hackatoncpl2026-final.vercel.app`;
                        navigator.clipboard.writeText(shareText);
                        alert("Post draft copied to clipboard! Opening LinkedIn share...");
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
                        const shareText = `🔥 Verified my resume ATS Score: ${activeAtsScore}/100 on SkillSync AI! 
🚀 Alignment: ${analysisResult?.role || "Software Engineer"}
Check your score & get AI roadmap insights: https://hackatoncpl2026-final.vercel.app #SkillSync #Resume`;
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
                        const shareText = `Check out my ATS resume score on SkillSync AI: ${activeAtsScore}/100! Primary Alignment: ${analysisResult?.role || "Software Engineer"}. Audit yours here: https://hackatoncpl2026-final.vercel.app`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
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
                          const shareText = `🚀 Got an ATS score of ${activeAtsScore}/100 on SkillSync AI! Check yours here: https://hackatoncpl2026-final.vercel.app`;
                          window.open(`https://t.me/share/url?url=${encodeURIComponent("https://hackatoncpl2026-final.vercel.app")}&text=${encodeURIComponent(shareText)}`, '_blank');
                        }}
                        className="flex items-center justify-center gap-1 px-2 py-2 bg-[#0088cc] text-white text-[10px] font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-sm"
                      >
                        Telegram
                      </button>
                      <button
                        onClick={() => {
                          const shareText = `🚀 Got an ATS score of ${activeAtsScore}/100 on SkillSync AI! Check yours here: https://hackatoncpl2026-final.vercel.app`;
                          window.open(`https://www.reddit.com/submit?title=${encodeURIComponent(`I scored ${activeAtsScore}/100 on ATS Resume Analyzer!`)}&text=${encodeURIComponent(shareText)}`, '_blank');
                        }}
                        className="flex items-center justify-center gap-1 px-2 py-2 bg-[#ff4500] text-white text-[10px] font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-sm"
                      >
                        Reddit
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="md:col-span-2 bg-background/60 backdrop-blur-xl border-slate-200">
              <CardHeader>
                <CardTitle>Recruiter Evaluation & Feedback</CardTitle>
                <CardDescription>AI-generated breakdown of your credentials and profile alignment</CardDescription>
                <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4 text-sm leading-relaxed text-slate-800">
                  {analysisResult?.recruiterEvaluation || "Analyze a resume to get custom feedback."}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {analysisResult && (
                  <div className="flex gap-4 border-b border-slate-200 pb-4">
                    <div className="mt-1">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-600">Role Alignment: {analysisResult.role}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        We detected primary alignment with {analysisResult.role}. Your main skills found:{" "}
                        {analysisResult.detectedSkills.slice(0, 6).join(", ")}.
                      </p>
                    </div>
                  </div>
                )}

                {analysisResult?.weaknesses.map((weakness, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-600">Identified Weakness</h4>
                      <p className="text-sm text-muted-foreground mt-1">{weakness}</p>
                    </div>
                  </div>
                ))}

                {analysisResult?.suggestions.map((suggestion, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1">
                      <CheckCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Actionable Suggestion</h4>
                      <p className="text-sm text-slate-600 mt-1">{suggestion}</p>
                    </div>
                  </div>
                ))}

                {/* Detailed ATS Flaws & Gaps */}
                {analysisResult?.atsDetails && (
                  <div className="border-t border-slate-200 pt-6 mt-6 space-y-4">
                    <h4 className="font-semibold text-base text-amber-600 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" /> ATS Format Flaws & Gaps
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.atsDetails.flaws.map((flaw, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 leading-normal">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                          <span>{flaw}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Missing Projects */}
                {analysisResult?.atsDetails?.missingProjects && (
                  <div className="border-t border-slate-200 pt-6 mt-6 space-y-4">
                    <h4 className="font-semibold text-base text-primary flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> Recommended Gaps Projects to Add
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      We recommend adding 1-2 of these specialized role projects to address formatting and skill gaps in your profile:
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {analysisResult.atsDetails.missingProjects.map((proj, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">Recommended Project</span>
                            <h5 className="font-semibold text-sm mt-1">{proj.title}</h5>
                            <p className="text-xs text-muted-foreground mt-1.5 leading-normal">{proj.description}</p>
                          </div>
                          <div className="mt-3 bg-slate-50 p-2 rounded-lg text-[11px] border border-slate-200">
                            <span className="text-emerald-700 font-semibold">Quantified Impact Tip:</span> {proj.impact}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6 flex gap-4 border-t border-slate-200">
                  <Button
                    className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-[0_4px_12px_rgba(249,115,22,0.2)] hover:from-orange-600 hover:to-amber-600"
                    onClick={() => {
                      if (analysisResult) {
                        generatePdfReport(analysisResult);
                      } else {
                        alert("No analysis result found.");
                      }
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" /> Download Enhanced Resume Report
                  </Button>
                  <Button variant="outline" className="border-slate-250 hover:bg-slate-100" onClick={() => {
                    clearAnalysis();
                    setSelectedFile(null);
                  }}>
                    Upload Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
