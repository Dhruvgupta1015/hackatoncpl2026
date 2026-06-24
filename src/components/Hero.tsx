
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, UploadCloud, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AILiveDemo } from "@/components/AILiveDemo";
import { Link } from "@tanstack/react-router";
import careerHero from "@/assets/career-hero.png";

export function Hero() {
  const [openResumeModal, setOpenResumeModal] = useState(false);
  return (
   <section id="hero" className="relative py-8 sm:py-10">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--gradient-radial-glow)] blur-3xl" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-[140px]" />

      <div className="container relative mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold tracking-wide text-foreground/80">
              AI-POWERED CAREER INTELLIGENCE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
          >
            Transform Your Career with{" "}
            <span className="text-gradient">AI-Powered Intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground"
          >
            Analyze skills, optimize resumes, generate personalized roadmaps, and become
            industry-ready — all powered by SkillSync AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button
              size="lg"
              onClick={() => {
                const el = document.getElementById("ai-demo");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                } else {
                  setOpenResumeModal(true);
                }
              }}
              className="group rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-6 text-base font-semibold text-white shadow-[0_0_36px_oklch(0.65_0.25_45/30%)] transition-all duration-300 hover:shadow-[0_0_50px_oklch(0.65_0.25_45/55%)] active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer"
            >
              <UploadCloud className="h-5 w-5 transition-transform group-hover:scale-110" />
              Analyze Resume
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const el = document.getElementById("dashboard");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = "/dashboard";
                }
              }}
              className="group rounded-full border-slate-200 bg-slate-50 px-6 py-6 text-base font-medium text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <LayoutDashboard className="h-5 w-5 text-orange-500 transition-transform group-hover:scale-110" />
              Explore Dashboard
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl border-t border-slate-200 pt-8"
          >
            {[
              "AI-Powered Resume Analysis",
              "Skill Gap Detection",
              "Personalized Learning Roadmaps",
              "Career Readiness Score"
            ].map((pt, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-card border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <span className="text-sm font-semibold text-foreground/80">{pt}</span>
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Premium Human-Friendly Hero Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[540px] flex items-center justify-center p-2 animate-float"
        >
          {/* Decorative glowing background behind the image */}
          <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-orange-500 to-amber-500 opacity-20 blur-xl" />
          
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-2 shadow-2xl backdrop-blur-md">
            <img 
              src={careerHero} 
              alt="SkillSync Career AI Intelligence" 
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
  {openResumeModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6 md:p-10 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-6xl rounded-3xl border border-slate-200 bg-background p-6 sm:p-8 shadow-2xl my-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            Upload Resume for AI Analysis
          </h2>

          <button
            onClick={() => setOpenResumeModal(false)}
            className="text-slate-400 hover:text-slate-700 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <div className="mt-6">
          <p className="text-slate-500">
            Drop your resume and let SkillSync AI analyze your skills,
            ATS score, salary potential, and career roadmap.
          </p>

          <div className="mt-6">
            <AILiveDemo isModal={true} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </section>
  );
}