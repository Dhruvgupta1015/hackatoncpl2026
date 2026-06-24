import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            {/* Custom Monogram Logo */}
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-white/20 shadow-sm overflow-hidden select-none">
              <span className="font-display font-bold text-xs tracking-tight text-white">S</span>
              <span className="font-display font-bold text-xs tracking-tight text-cyan-400 -ml-0.5">S</span>
              <div className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-cyan-400 m-0.5" />
            </div>
            <span className="font-display text-base font-semibold">
              SkillSync <span className="text-gradient-cyan">AI</span>
            </span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#dashboard" className="hover:text-foreground">
              Dashboard
            </a>
            <Link to="/about-project" className="hover:text-foreground">
              About Project
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 SkillSync AI. Built for the future workforce.
          </p>
        </div>
      </div>
    </footer>
  );
}
