import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function CTA() {
  const [sliderValue, setSliderValue] = useState(100);

  // Dynamic values based on slider selection
  const getSimulatedData = (val: number) => {
    if (val < 33) {
      return {
        score: 52,
        rating: "Needs Work",
        color: "text-red-500",
        strokeColor: "stroke-red-500",
        bgColor: "bg-red-500/10",
        accentBg: "bg-red-50",
        accentBorder: "border-red-200",
        bullet1: "Built a web app using React for users.",
        bullet2: "Helped write backend APIs and run DB queries.",
        bullet3: "Fixed bugs and wrote test cases.",
        impact: "Vague descriptions. Missing metric-driven achievements and action verbs.",
      };
    } else if (val < 66) {
      return {
        score: 74,
        rating: "Competitive",
        color: "text-amber-500",
        strokeColor: "stroke-amber-500",
        bgColor: "bg-amber-500/10",
        accentBg: "bg-amber-50",
        accentBorder: "border-amber-200",
        bullet1: "Developed React web app features and built user dashboards.",
        bullet2: "Created Express REST APIs and optimized SQL database queries.",
        bullet3: "Identified codebase bugs and implemented unit test coverage.",
        impact: "Solid descriptions, but lacks quantified business impact and advanced stack alignment.",
      };
    } else {
      return {
        score: 94,
        rating: "Excellent (Fast-Track)",
        color: "text-emerald-500",
        strokeColor: "stroke-emerald-500",
        bgColor: "bg-emerald-500/10",
        accentBg: "bg-emerald-50/50",
        accentBorder: "border-emerald-200",
        bullet1: "Architected modern React SaaS dashboards, boosting rendering speed by 42% using TanStack Query.",
        bullet2: "Designed scalable Express.js backend APIs, reducing database response times by 30% via Redis caching.",
        bullet3: "Spearheaded debugging sprints, improving unit test coverage from 60% to 92% with Jest.",
        impact: "Highly optimized. Quantified metrics match enterprise-level roles perfectly.",
      };
    }
  };

  const data = getSimulatedData(sliderValue);

  return (
    <section className="relative py-20 md:py-24 bg-slate-50/60 overflow-hidden font-sans border-t border-slate-200">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute left-1/4 top-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-[var(--gradient-radial-glow)] blur-3xl opacity-50" />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative">
        
        {/* Title Block */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[11px] font-semibold tracking-[0.15em] text-foreground/85 uppercase">
            <Sparkles className="h-3 w-3 text-orange-500 animate-pulse" />
            AI Resume Simulator
          </div>
          <h2 className="mt-5 text-4xl font-bold md:text-5xl text-slate-800 tracking-tight">
            See the <span className="text-gradient">SkillSync AI</span> Difference
          </h2>
          <p className="mt-4 text-base text-slate-500 max-w-xl mx-auto">
            Drag the slider to see how AI rewrites dry descriptions into quantified, high-impact bullets that bypass ATS filters.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid md:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-12 shadow-xl backdrop-blur-md">
          
          {/* Left panel: Interactive Sliders & Live Meter */}
          <div className="md:col-span-5 flex flex-col items-center justify-center border-b border-slate-100 md:border-b-0 md:border-r border-slate-100 pb-8 md:pb-0 md:pr-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-450 mb-6">Simulated ATS Audit</h3>
            
            {/* Score Ring */}
            <div className="relative inline-flex items-center justify-center w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-100" />
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray="264" strokeDashoffset={264 - (264 * data.score) / 100} className={`transition-all duration-500 ${data.strokeColor}`} strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold text-slate-800">{data.score}%</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">ATS Score</span>
              </div>
            </div>

            {/* Rating pill */}
            <div className={`mt-5 px-4 py-1.5 rounded-full text-xs font-bold border ${data.color} ${data.bgColor} transition-all duration-300`}>
              {data.rating}
            </div>

            {/* Interactive Drag Slider */}
            <div className="w-full mt-10 px-4">
              <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wide">
                <span>Before AI</span>
                <span>Optimized</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-600 transition-all focus:outline-none"
              />
              <p className="text-center text-[10px] text-slate-400 mt-2 font-medium">
                Drag slider to simulate rewriting engine
              </p>
            </div>
          </div>

          {/* Right panel: Bullet points presentation */}
          <div className="md:col-span-7 space-y-6 md:pl-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 mb-3">Project Bullet Points</h4>
              
              {/* Bullets Container */}
              <div className="space-y-4">
                {[data.bullet1, data.bullet2, data.bullet3].map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-150 bg-slate-50/50 hover:bg-slate-50 transition-all duration-200">
                    {data.score === 94 ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className={`h-5 w-5 shrink-0 mt-0.5 ${data.score === 74 ? "text-amber-500" : "text-red-400"}`} />
                    )}
                    <p className="text-xs leading-relaxed text-slate-700 font-medium">
                      {bullet}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic Alert Box */}
            <div className={`p-4 rounded-2xl border ${data.accentBorder} ${data.accentBg} transition-all duration-300`}>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Expert Analysis</span>
              <p className="text-xs text-slate-650 mt-1 leading-relaxed font-medium">
                {data.impact}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                onClick={() => {
                  const el = document.getElementById("ai-demo");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/features/resume-analyzer";
                  }
                }}
                className="flex-1 min-w-[180px] rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-5 shadow-[0_4px_24px_rgba(249,115,22,0.2)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Analyze Your Resume</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const el = document.getElementById("dashboard");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/dashboard";
                  }
                }}
                className="flex-1 min-w-[180px] rounded-full border-slate-200 bg-slate-50 hover:bg-slate-100 font-semibold py-5 transition-all cursor-pointer"
              >
                Explore Score Dashboard
              </Button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
