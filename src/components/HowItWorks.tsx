import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

const UploadSvg = () => (
  <svg className="h-7 w-7 text-orange-600 transition-transform duration-500 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5h10.5a2.25 2.25 0 002.25-2.25V7.518a2.25 2.25 0 00-.75-1.688l-3.375-3.375a2.25 2.25 0 00-1.688-.75H6.75A2.25 2.25 0 004.5 5.25v12a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const AnalysisSvg = () => (
  <svg className="h-7 w-7 text-orange-600 transition-transform duration-500 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925-3.546 5.974 5.974 0 00-2.133-1A3.75 3.75 0 003 7.5a3.75 3.75 0 003.56 3.748 5.99 5.99 0 001.926 3.546c.866.702 1.884 1.157 2.97 1.258A3.746 3.746 0 0012 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.008v.008H12V18zm6-7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const InsightsSvg = () => (
  <svg className="h-7 w-7 text-orange-600 transition-transform duration-500 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l-.707.707M12 6a6 6 0 00-6 6c0 2.22 1.206 4.155 3 5.197V19.5h6v-2.303c1.794-1.042 3-2.977 3-5.197a6 6 0 00-6-6z" />
  </svg>
);

const AchieveGoalsSvg = () => (
  <svg className="h-7 w-7 text-orange-600 transition-transform duration-500 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41a14.98 14.98 0 00-1.22 6.16m7.18-2.2a9 9 0 01-3.64 5.34m0 0l-3.32-3.32m3.32 3.32a9 9 0 00-5.34-3.64m0 0l3.32-3.32m-3.32 3.32L3 21l2.41-2.41" />
    <circle cx="15" cy="9" r="1.5" />
  </svg>
);

const steps = [
  {
    icon: UploadSvg,
    title: "Upload Resume",
    desc: "Upload your resume or fill in your profile in under a minute.",
    color: "text-orange-600 bg-orange-50 border-orange-200",
    link: "/features/resume-analyzer",
  },
  {
    icon: AnalysisSvg,
    title: "AI Analysis",
    desc: "Our AI analyzes skills, experience, and career goals deeply.",
    color: "text-orange-600 bg-orange-50 border-orange-200",
    link: "/dashboard",
  },
  {
    icon: InsightsSvg,
    title: "Get Insights",
    desc: "Receive personalized insights and skill gap analysis.",
    color: "text-orange-600 bg-orange-50 border-orange-200",
    link: "/features/skill-gap",
  },
  {
    icon: AchieveGoalsSvg,
    title: "Achieve Goals",
    desc: "Follow your AI roadmap and land your dream career.",
    color: "text-orange-600 bg-orange-50 border-orange-200",
    link: "/features/roadmap",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-20 md:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.15em] text-slate-800 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            How It Works
          </div>
          <h2 className="mt-5 text-4xl font-bold md:text-5xl">
            From confusion to <span className="text-gradient">confidence</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Four simple steps to your AI-powered career transformation.
          </p>
        </motion.div>

        <div className="relative mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* connection line */}
          <div className="pointer-events-none absolute left-12 right-12 top-10 hidden h-px bg-slate-200 lg:block" />

          {steps.map((s, i) => (
            <Link
              key={s.title}
              to={s.link}
              className="group relative text-center cursor-pointer block"
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="transition-all duration-300 hover:-translate-y-2 flex flex-col items-center"
              >
                <div className="relative inline-flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-orange-500/10 opacity-25 blur-xl transition-opacity duration-500 group-hover:opacity-60" />
                  <div className={`relative flex h-20 w-20 items-center justify-center rounded-full border backdrop-blur-md transition-transform duration-500 group-hover:scale-105 ${s.color}`}>
                    <s.icon />
                  </div>
                  <div className="absolute -right-1.5 -top-1.5 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white shadow-[0_3px_8px_rgba(249,115,22,0.3)] z-10">
                    {i + 1}
                  </div>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-800">{s.title}</h3>
                <p className="mt-2 text-xs text-slate-500 max-w-[200px] leading-relaxed">{s.desc}</p>
                <p className="mt-3.5 text-orange-600 text-xs font-semibold hover:underline flex items-center gap-1">
                  Open Feature →
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
