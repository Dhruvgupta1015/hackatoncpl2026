import { motion } from "framer-motion";
import { FileSearch, Target, Map, Lightbulb, Trophy, MessageSquare } from "lucide-react";
import { Link } from "@tanstack/react-router";

const features = [
  {
    icon: FileSearch,
    title: "AI Resume Analyzer",
    desc: "Upload your resume and get ATS scoring, quality analysis, and actionable improvement suggestions.",
    gradient: "from-cyan-400/20 to-blue-500/20",
    iconColor: "text-cyan-600 bg-cyan-50 border border-cyan-100/50",
    hoverBorder: "hover:border-cyan-500/30 hover:shadow-[0_12px_32px_rgba(6,182,212,0.08)]",
    link: "/features/resume-analyzer",
  },
  {
    icon: Target,
    title: "Skill Gap Analysis",
    desc: "Discover missing skills, strengths, and weaknesses — perfectly aligned with your career goals.",
    gradient: "from-violet-400/20 to-purple-500/20",
    iconColor: "text-violet-600 bg-violet-50 border border-violet-100/50",
    hoverBorder: "hover:border-violet-500/30 hover:shadow-[0_12px_32px_rgba(139,92,246,0.08)]",
    link: "/features/skill-gap",
  },
  {
    icon: Map,
    title: "AI Roadmap Generator",
    desc: "Personalized monthly learning paths with projects, certifications, and milestones built for you.",
    gradient: "from-pink-400/20 to-rose-500/20",
    iconColor: "text-pink-600 bg-pink-50 border border-pink-100/50",
    hoverBorder: "hover:border-pink-500/30 hover:shadow-[0_12px_32px_rgba(236,72,153,0.08)]",
    link: "/features/roadmap",
  },
  {
    icon: Lightbulb,
    title: "Smart Recommendations",
    desc: "Get AI-powered suggestions for internships, hackathons, certifications, and open-source projects.",
    gradient: "from-amber-400/20 to-orange-500/20",
    iconColor: "text-amber-600 bg-amber-50 border border-amber-100/50",
    hoverBorder: "hover:border-amber-500/30 hover:shadow-[0_12px_32px_rgba(245,158,11,0.08)]",
    link: "/features/recommendations",
  },
  {
    icon: Trophy,
    title: "Career Readiness Score",
    desc: "Track your readiness with a live dashboard — skills, performance, and industry alignment in one view.",
    gradient: "from-emerald-400/20 to-teal-500/20",
    iconColor: "text-emerald-600 bg-emerald-50 border border-emerald-100/50",
    hoverBorder: "hover:border-emerald-500/30 hover:shadow-[0_12px_32px_rgba(16,185,129,0.08)]",
    link: "/dashboard",
  },
  {
    icon: MessageSquare,
    title: "AI Interview Prep",
    desc: "Practice technical & HR interviews with intelligent feedback and personalized improvement tips.",
    gradient: "from-fuchsia-400/20 to-pink-500/20",
    iconColor: "text-fuchsia-600 bg-fuchsia-50 border border-fuchsia-100/50",
    hoverBorder: "hover:border-fuchsia-500/30 hover:shadow-[0_12px_32px_rgba(217,70,239,0.08)]",
    link: "/features/interview-prep",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-20 md:py-28 bg-slate-50/50">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-[11px] font-semibold tracking-[0.15em] text-foreground/85 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Powerful Features
          </div>
          <h2 className="mt-5 text-4xl font-bold md:text-5xl text-slate-800">
            Everything you need to <span className="text-gradient">grow</span>
          </h2>
          <p className="mt-4 text-base text-slate-500">
            Six AI engines working together to accelerate your career — from resume to your dream
            role.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={f.link} className="block h-full">
                <div className={`group relative h-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-orange-500/30 hover:shadow-lg hover:bg-orange-500/[0.005] hover-lift transition-all duration-300 ${f.hoverBorder}`}>
                  <div
                    className={`absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${f.gradient} blur-3xl opacity-30 transition-all duration-700 group-hover:opacity-60 group-hover:scale-125`}
                  />

                  <div className="relative">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${f.iconColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-800">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
