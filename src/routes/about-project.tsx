import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { HelpCircle, Layers, Cpu, Compass, BookOpen, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/about-project")({
  component: AboutProject,
});

function AboutProject() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-orange-500/30">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-20 max-w-5xl text-left">
        
        {/* Go Back to Home Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-orange-500 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
        
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20 text-orange-600 mb-6">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 md:text-5xl font-display">
            About <span className="text-gradient">SkillSync AI</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            A comprehensive, human-centric career intelligence platform addressing formatting bias, keyword gaps, and industry readiness.
          </p>
        </motion.div>

        {/* 2-column sections */}
        <div className="grid gap-8 md:grid-cols-2">
          
          {/* Section 1: Problem Statement */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-bold text-slate-800">1. Problem Statement</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Standard Applicant Tracking Systems (ATS) reject roughly **75% of qualified resumes** due to rigid keyword validation, formatting biases, and unoptimized layout constraints. Students and career switchers are left completely in the dark, lacking access to clear feedback on why they were rejected, what real skill gaps they have, or how they align with salary expectations in their target domain.
              </p>
            </div>
          </motion.div>

          {/* Section 2: Solution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="h-5 w-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-slate-800">2. Solution</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                SkillSync AI provides a **fully open-access, local-first Career Intelligence layer**. It parses resumes client-side, runs structured domain classification, computes realistic salary matrices, detects skill alignments, and outlines custom roadmaps. By highlighting resume flaws and suggesting missing projects, we empower candidates to make their resumes readable by both machines and human recruiters.
              </p>
            </div>
          </motion.div>

          {/* Section 3: Architecture Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 p-6 rounded-2xl border border-slate-200 bg-slate-50"
          >
            <div className="flex items-center gap-2 mb-6">
              <Layers className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-bold text-slate-850">3. System Architecture</h3>
            </div>
            
            {/* Visual Node Flowchart */}
            <div className="grid gap-4 sm:grid-cols-3 text-center my-6">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest">Client Browser</span>
                <h5 className="font-semibold text-sm mt-2 text-slate-800">Resume Extraction</h5>
                <p className="text-xs text-slate-550 mt-1 leading-normal">
                  Reads PDF/TXT using PDF.js locally. Extracts raw text strings and handles layout parsing without sending binaries to the cloud.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white relative">
                <div className="hidden sm:block absolute top-1/2 -left-3 -translate-y-1/2 text-slate-400 font-bold">→</div>
                <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">Server Function</span>
                <h5 className="font-semibold text-sm mt-2 text-slate-800">TanStack Start handler</h5>
                <p className="text-xs text-slate-550 mt-1 leading-normal">
                  Secure POST server functions validate input text. Uses classification algorithms to determine candidate domain and match competencies.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white relative">
                <div className="hidden sm:block absolute top-1/2 -left-3 -translate-y-1/2 text-slate-400 font-bold">→</div>
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest">Analytics Layer</span>
                <h5 className="font-semibold text-sm mt-2 text-slate-800">Career Intelligence</h5>
                <p className="text-xs text-slate-550 mt-1 leading-normal">
                  Heuristic rules output ATS flaws, missing projects, 5-role salary estimates, readiness scores, and monthly roadmap guides.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 4: Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Compass className="h-5 w-5 text-orange-500" />
                <h3 className="text-lg font-bold text-slate-850">4. Core Features</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-650 leading-relaxed">
                <li className="flex gap-2 items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                  <span><strong>AI Resume Analyzer</strong>: Instant ATS audit, section score checks, and format suggestions.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                  <span><strong>AI Salary Prediction</strong>: Multi-role LPA predictions mapped using real parsed experience and tech values.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                  <span><strong>Industry Readiness speedometer</strong>: Tracks match percentages against standard job roles.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                  <span><strong>Open-Access Chatbot</strong>: Career chatbot integrating user API keys with local fallback capability.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Section 5: Future Scope */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-bold text-slate-850">5. Future Scope</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Future releases will integrate fully automated OCR for scanning image-based CV files, allow direct recruiters to query candidates matching custom indices, and supply visual PDF alignment diff tools. We plan to configure native mobile apps using Capacitor or React Native.
              </p>
            </div>
          </motion.div>

          {/* Section 6: Limitations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 p-6 rounded-2xl border border-amber-200 bg-amber-50"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-700" />
              <h3 className="text-lg font-bold text-amber-800">6. Technical Limitations</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              SkillSync AI does not run OCR processes, meaning flat image-PDF files will show blank characters. The keyword extraction checks list parameters against configured technical dictionaries, which may omit niche libraries or new framework releases. API keys for LLM Chatbots are stored in local client buffers and are never saved on the database to preserve developer privacy.
            </p>
          </motion.div>

        </div>

      </main>
      <Footer />
    </div>
  );
}
