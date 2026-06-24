import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const items = [
  {
    quote:
      "SkillSync AI identified gaps I didn't know I had. Three months later, I landed an internship at a top product company.",
    name: "Riya Sharma",
    role: "Software Engineer Intern",
    g: "from-cyan-400 to-blue-500",
  },
  {
    quote:
      "The roadmap feature is unreal — it gave me clarity and direction I'd been searching for over a year.",
    name: "Aman Verma",
    role: "Full Stack Developer",
    g: "from-violet-400 to-purple-500",
  },
  {
    quote:
      "AI suggestions felt like having a personal mentor. Helped me land my dream data science internship.",
    name: "Neha Singh",
    role: "Data Science Intern",
    g: "from-pink-400 to-rose-500",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-20 md:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-medium tracking-[0.15em] text-foreground/85 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Loved by Learners
          </div>
          <h2 className="mt-5 text-4xl font-bold md:text-5xl">
            What our users <span className="text-gradient">say</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.09] to-transparent p-7 backdrop-blur-xl hover-lift"
            >
              <div
                className={`pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-gradient-to-br ${t.g} opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-25`}
              />
              <Quote className="relative h-7 w-7 text-primary/60" />
              <p className="relative mt-4 text-base leading-relaxed text-foreground/90">
                "{t.quote}"
              </p>
              <div className="relative mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.g} ring-2 ring-white/10 text-xs font-bold text-white uppercase select-none`}
                >
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
