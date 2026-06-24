import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Download, 
  Linkedin, 
  Palette, 
  Grid, 
  Code2, 
  Layers,
  FileImage
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useResume } from "@/lib/resumeContext";
import { toast } from "sonner";

export const Route = createFileRoute("/features/banner-builder")({
  component: BannerBuilder,
});

type ThemeType = "vibrant" | "minimalist" | "gradient";

function BannerBuilder() {
  const { analysisResult } = useResume();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Form states
  const [name, setName] = useState("Alex Mercer");
  const [headline, setHeadline] = useState("Full Stack Developer & AI Engineer");
  const [tagline, setTagline] = useState("Architecting high-throughput distributed applications.");
  const [skills, setSkills] = useState("React, TypeScript, Node.js, Python, RAG, LangChain");
  const [activeTheme, setActiveTheme] = useState<ThemeType>("vibrant");

  // Sync inputs with uploaded resume details if available
  useEffect(() => {
    if (analysisResult) {
      if (analysisResult.name) setName(analysisResult.name);
      if (analysisResult.role) setHeadline(`${analysisResult.role}`);
      if (analysisResult.detectedSkills) {
        setSkills(analysisResult.detectedSkills.slice(0, 6).join(", "));
      }
    }
  }, [analysisResult]);

  // Redraw canvas on input changes
  useEffect(() => {
    drawBanner();
  }, [name, headline, tagline, skills, activeTheme]);

  const drawBanner = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Standard LinkedIn Banner dimensions: 1584 x 396
    const W = 1584;
    const H = 396;
    ctx.clearRect(0, 0, W, H);

    if (activeTheme === "vibrant") {
      // 1. Vibrant Orange Theme
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(1, "#fff7ed");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Draw Grid Lines
      ctx.strokeStyle = "rgba(249, 115, 22, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Large orange background geometric circle outline
      ctx.beginPath();
      ctx.arc(W - 200, H / 2, 220, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(249, 115, 22, 0.08)";
      ctx.lineWidth = 40;
      ctx.stroke();

      // Mini concentric circle
      ctx.beginPath();
      ctx.arc(W - 200, H / 2, 140, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(249, 115, 22, 0.04)";
      ctx.lineWidth = 20;
      ctx.stroke();

      // Top corner orange banner highlight accent line
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(W, 0);
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 14;
      ctx.stroke();

      // Custom interlocking "SS" geometric logo monogram watermark on right
      ctx.save();
      ctx.translate(W - 240, H / 2 - 30);
      ctx.font = "bold 96px Space Grotesk, Arial";
      ctx.fillStyle = "rgba(249, 115, 22, 0.12)";
      ctx.fillText("S", 0, 0);
      ctx.fillStyle = "rgba(15, 23, 42, 0.1)";
      ctx.fillText("S", 30, 20);
      ctx.restore();

      // TEXT: Name
      ctx.fillStyle = "#0f172a"; // Slate-900
      ctx.font = "bold 56px Space Grotesk, Arial";
      ctx.fillText(name, 100, 130);

      // TEXT: Headline
      ctx.fillStyle = "#f97316"; // Orange-500
      ctx.font = "semibold 26px Inter, Arial";
      ctx.fillText(headline, 100, 185);

      // TEXT: Tagline
      ctx.fillStyle = "#64748b"; // Slate-500
      ctx.font = "italic 20px Inter, Arial";
      ctx.fillText(tagline, 100, 230);

      // SKILLS: Render badges on bottom left
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 16px Inter, Arial";
      ctx.fillText("CORE STACK: " + skills.toUpperCase(), 100, 310);

      // Highlight bracket bar
      ctx.fillStyle = "#f97316";
      ctx.fillRect(72, 86, 6, 155);

    } else if (activeTheme === "minimalist") {
      // 2. Minimalist Tech Code Theme
      ctx.fillStyle = "#0b0f19"; // Deep Tech Dark-Blue/Grey
      ctx.fillRect(0, 0, W, H);

      // Draw vector tech lines
      ctx.strokeStyle = "rgba(249, 115, 22, 0.15)";
      ctx.lineWidth = 1.5;
      
      // Node lines
      ctx.beginPath();
      ctx.moveTo(W - 350, 100);
      ctx.lineTo(W - 200, 250);
      ctx.lineTo(W - 100, 250);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(W - 350, 100, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#f97316";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(W - 200, 250, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(W - 100, 250, 6, 0, Math.PI * 2);
      ctx.fill();

      // Left bracket accent
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(90, 80);
      ctx.lineTo(60, 80);
      ctx.lineTo(60, 310);
      ctx.lineTo(90, 310);
      ctx.stroke();

      // Right bracket accent
      ctx.beginPath();
      ctx.moveTo(W - 90, 80);
      ctx.lineTo(W - 60, 80);
      ctx.lineTo(W - 60, 310);
      ctx.lineTo(W - 90, 310);
      ctx.stroke();

      // TEXT: Name
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 60px Space Grotesk, Arial";
      ctx.fillText(name, 110, 135);

      // TEXT: Headline
      ctx.fillStyle = "#f97316";
      ctx.font = "bold 26px Courier New, monospace";
      ctx.fillText(`< ${headline} />`, 110, 190);

      // TEXT: Tagline
      ctx.fillStyle = "#94a3b8"; // Slate-400
      ctx.font = "19px Courier New, monospace";
      ctx.fillText(`// ${tagline}`, 110, 235);

      // TEXT: Skills
      ctx.fillStyle = "#f8fafc";
      ctx.font = "15px Courier New, monospace";
      ctx.fillText(`const STACK = [ "${skills.split(", ").join('", "')}" ];`, 110, 305);

    } else if (activeTheme === "gradient") {
      // 3. Mesh Gradient Theme
      const grad = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, W / 1.2);
      grad.addColorStop(0, "#ff7e40"); // Soft light orange
      grad.addColorStop(0.5, "#ea580c"); // Mid orange
      grad.addColorStop(1, "#431407"); // Deep brown
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Concentric background circular ripples
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 2;
      for (let r = 100; r < 600; r += 80) {
        ctx.beginPath();
        ctx.arc(W - 250, H / 2, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // TEXT: Name
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 58px Space Grotesk, Arial";
      ctx.fillText(name, 100, 130);

      // TEXT: Headline
      ctx.fillStyle = "#fef08a"; // Soft yellow
      ctx.font = "bold 26px Inter, Arial";
      ctx.fillText(headline, 100, 185);

      // TEXT: Tagline
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.font = "italic 20px Inter, Arial";
      ctx.fillText(tagline, 100, 230);

      // TEXT: Skills
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 15px Inter, Arial";
      ctx.fillText("CAPABILITIES: " + skills.toUpperCase(), 100, 305);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${name.toLowerCase().replace(/\s+/g, "_")}_linkedin_banner.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Downloaded high-resolution LinkedIn Banner PNG!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate image download.");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-left">
      <Navbar />

      {/* Background blobs */}
      <div className="absolute right-0 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-orange-500/5 blur-[140px] pointer-events-none" />

      <main className="container mx-auto px-4 pt-28 pb-20">
        
        {/* Header Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20 text-orange-650 mb-4">
            <Palette className="h-7 w-7 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">LinkedIn Banner Builder</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Design a custom professional LinkedIn background banner. Export a pixel-perfect standard PNG instantly.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12 max-w-6xl mx-auto items-start">
          
          {/* LEFT: Live Preview Canvas card */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden p-6 text-center">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 text-left flex items-center gap-1.5">
                <FileImage className="h-4.5 w-4.5 text-slate-400" />
                Live Banner Preview (1584 x 396 standard ratio)
              </h3>
              
              {/* Canvas element scaled responsive via CSS */}
              <div className="w-full border border-slate-200 rounded-2xl overflow-hidden shadow-inner bg-slate-100 relative">
                <canvas 
                  ref={canvasRef}
                  width={1584}
                  height={396}
                  id="linkedin-banner-canvas"
                  className="w-full h-auto aspect-[4/1] block"
                />
              </div>

              <div className="flex justify-between items-center mt-4 text-xs text-slate-500 font-semibold">
                <span>Format: PNG</span>
                <span>Dimensions: 1584 x 396 px</span>
              </div>
            </Card>
          </div>

          {/* RIGHT: Editor Panel */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <Card className="bg-white border-slate-200 shadow-md">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base text-slate-800">Customize Banner Text</CardTitle>
                <CardDescription>Tailor content to display on the canvas.</CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Headline */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Headline / Role</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Tagline */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Tagline Statement</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Skills */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Core Skills (comma separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Theme Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Banner Theme Style</label>
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {[
                      { key: "vibrant", label: "Orange Grid", icon: Grid },
                      { key: "minimalist", label: "Dark Code", icon: Code2 },
                      { key: "gradient", label: "Mesh Wave", icon: Layers }
                    ].map((th) => (
                      <button
                        key={th.key}
                        onClick={() => setActiveTheme(th.key as ThemeType)}
                        className={`text-[10px] py-1.5 rounded-lg font-semibold flex flex-col items-center gap-1 transition-all ${
                          activeTheme === th.key ? "bg-white text-orange-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <th.icon className="h-3.5 w-3.5" />
                        {th.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Download Button */}
                <Button
                  onClick={handleDownload}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 font-semibold shadow-[0_4px_12px_rgba(249,115,22,0.2)] flex items-center justify-center gap-2 mt-4"
                >
                  <Download className="h-4.5 w-4.5" />
                  Download Banner (PNG)
                </Button>

              </CardContent>
            </Card>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
