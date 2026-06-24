import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, LogOut, User, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useState, useEffect, useRef } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/features/pitch-coach", label: "AI Pitch Coach" },
  { href: "/features/resume-refiner", label: "Resume Refiner" },
  { href: "/features/negotiator", label: "Salary Negotiator" },
  { href: "/features/emerging-jobs", label: "Future Careers" },
  { href: "/features/banner-builder", label: "Banner Builder" },
  { href: "/about-project", label: "About Project" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <nav className="glass-panel mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-5 py-3 bg-background/80 backdrop-blur-md border border-border">
        <Link to="/" className="flex items-center gap-2">
          {/* Custom Human-designed Geometric Monogram Logo */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-white/20 shadow-sm overflow-hidden select-none">
            <span className="font-display font-bold text-xs tracking-tight text-white">S</span>
            <span className="font-display font-bold text-xs tracking-tight text-orange-500 -ml-0.5">S</span>
            <div className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-orange-500 m-0.5 animate-pulse" />
          </div>
          <span className="font-display text-base font-semibold tracking-tight text-foreground">
            SkillSync{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              AI
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            l.href.startsWith("/#") ? (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                to={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center gap-2" ref={dropdownRef}>
          {user ? (
            <div className="relative">
              {/* Profile Avatar Trigger Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-350 transition-all cursor-pointer"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-slate-800 hidden sm:inline-block pr-1">
                  {user.name}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-300 mr-1.5 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2.5 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl backdrop-blur-md z-50 text-slate-800"
                  >
                    {/* User Profile Summary */}
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-sm font-bold text-white uppercase shadow-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{user.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* Progress details (Startup vibe) */}
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 mb-3 text-[11px] space-y-1.5">
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Career Readiness</span>
                        <span className="font-bold text-orange-600">84%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full animate-pulse" style={{ width: "84%" }} />
                      </div>
                    </div>

                    {/* Menu links */}
                    <div className="space-y-1">
                      <Link 
                        to="/dashboard" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all"
                      >
                        <BarChart3 className="h-4 w-4 text-slate-500" />
                        My Dashboard
                      </Link>
                      <Link 
                        to="/features/resume-analyzer" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all"
                      >
                        <User className="h-4 w-4 text-slate-500" />
                        Resume Analysis
                      </Link>
                    </div>

                    {/* Signout Button */}
                    <div className="border-t border-slate-100 pt-2.5 mt-2.5">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-red-650 hover:bg-red-50 transition-all cursor-pointer text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden text-foreground/90 hover:text-foreground hover:bg-slate-100 sm:inline-flex cursor-pointer"
                >
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 text-white font-semibold shadow-[0_0_24px_oklch(0.65_0.25_45/25%)] transition-all duration-300 hover:shadow-[0_0_36px_oklch(0.65_0.25_45/45%)] active:scale-[0.97] cursor-pointer"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
