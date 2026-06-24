import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Lightbulb, ExternalLink, Briefcase, GraduationCap, Github } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useResume } from "@/lib/resumeContext";

const iconMap: Record<string, any> = {
  Briefcase: Briefcase,
  GraduationCap: GraduationCap,
  Github: Github,
};

export const Route = createFileRoute("/features/recommendations")({
  component: Recommendations,
});

function Recommendations() {
  const { analysisResult } = useResume();

  const demoRecommendations = [
    {
      title: "Frontend Engineering Intern",
      company: "Vercel",
      type: "Internship",
      match: 94,
      icon: Briefcase,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      link: "https://vercel.com/careers",
    },
    {
      title: "React Query Open Source",
      company: "TanStack",
      type: "Open Source",
      match: 88,
      icon: Github,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      link: "https://github.com/TanStack/query",
    },
    {
      title: "Meta Frontend Certificate",
      company: "Coursera",
      type: "Certification",
      match: 85,
      icon: GraduationCap,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      link: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    },
  ];

  const recommendations = analysisResult
    ? analysisResult.recommendations.map((rec) => ({
        title: rec.title,
        company: rec.company,
        type: rec.type,
        match: rec.match,
        icon: iconMap[rec.iconName] || Briefcase,
        color: rec.color,
        bg: rec.bg,
        link: rec.link,
      }))
    : demoRecommendations;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-20">
        <div className="pointer-events-none absolute left-1/3 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]" />

        {/* Demo Mode alert banner */}
        {!analysisResult && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl max-w-6xl mx-auto"
          >
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
              <div className="text-left">
                <h4 className="font-semibold text-amber-300">Viewing Demo Recommendations</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upload your resume in the Resume Analyzer to decode custom jobs, certs, and projects recommendations matching your skill gaps!
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
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20 text-amber-400 mb-6">
            <Lightbulb className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Smart Recommendations</h1>
          <p className="text-xl text-muted-foreground">
            Curated opportunities tailored to your skills, goals, and current market trends.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-background/60 backdrop-blur-xl border-white/10 hover:border-amber-500/30 transition-all h-full flex flex-col group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${rec.bg}`}
                    >
                      <rec.icon className={`h-6 w-6 ${rec.color}`} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                      {rec.type}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{rec.title}</CardTitle>
                  <CardDescription className="text-base">{rec.company}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-muted-foreground">Match Score</span>
                    <span className="text-sm font-bold text-amber-400">{rec.match}%</span>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 font-semibold shadow-lg"
                    onClick={() => window.open(rec.link, "_blank")}
                  >
                    Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
