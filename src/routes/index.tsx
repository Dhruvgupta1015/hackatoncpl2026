import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { HowItWorks } from "@/components/HowItWorks";
import { AILiveDemo } from "@/components/AILiveDemo";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillSync AI — AI-Powered Career Intelligence Platform" },
      {
        name: "description",
        content:
          "Analyze skills, optimize resumes, generate AI roadmaps, and become industry-ready. SkillSync AI is your complete AI-driven career growth ecosystem.",
      },
      { property: "og:title", content: "SkillSync AI — AI-Powered Career Intelligence" },
      {
        property: "og:description",
        content:
          "Transform your career with AI-powered resume analysis, skill gap insights, and personalized roadmaps.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      {/* global ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/[0.05] blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-secondary/[0.05] blur-[120px]" />
        <div className="absolute left-1/3 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/[0.04] blur-[120px]" />
      </div>

      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <HowItWorks />
      <AILiveDemo />
      <DashboardPreview />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
