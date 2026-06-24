import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Mail, Lock, ShieldCheck, UserCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/login")({
  component: Login,
});

const LOADING_STEPS = [
  "Securing network channel...",
  "Authenticating credentials...",
  "Syncing SkillSync AI neural nodes...",
  "Loading career database context...",
  "Workspace configured! Redirecting..."
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isQuickLogging, setIsQuickLogging] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetUser, setTargetUser] = useState<{ email: string; name: string } | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: any;
    if (isQuickLogging) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < LOADING_STEPS.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            if (targetUser) {
              login(targetUser.email, targetUser.name);
              navigate({ to: "/" });
            }
            return prev;
          }
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isQuickLogging, targetUser, login, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      const name = email.split("@")[0].replace(/[^a-zA-Z]/g, " ");
      const capitalizedName = name.replace(/\b\w/g, c => c.toUpperCase());
      
      setTargetUser({ email, name: capitalizedName || "Candidate" });
      setIsQuickLogging(true);
      setCurrentStepIndex(0);
    }
  };

  const triggerQuickLogin = (email: string, name: string) => {
    setTargetUser({ email, name });
    setIsQuickLogging(true);
    setCurrentStepIndex(0);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 font-sans overflow-hidden">
      {/* Absolute Back Button */}
      <div className="absolute left-6 top-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-550 hover:text-orange-600 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Background radial blobs */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[600px] w-[600px] rounded-full bg-[var(--gradient-radial-glow)] blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -top-40 -left-40 -z-10 h-[400px] w-[400px] rounded-full bg-orange-500/10 blur-[120px]" />
      
      {/* Real-time Loader Overlay */}
      {isQuickLogging && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="relative h-20 w-20 flex items-center justify-center">
            {/* Double outer neon spinners */}
            <div className="absolute inset-0 rounded-full border-4 border-orange-500/10 border-t-orange-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-amber-500/10 border-b-amber-500 animate-spin duration-700 reverse" />
            <Sparkles className="h-6 w-6 text-orange-500 animate-pulse" />
          </div>
          
          <h3 className="mt-8 text-xl font-bold text-slate-800">
            Establishing Secure AI Session
          </h3>
          <p className="mt-2 text-sm text-slate-500 font-medium min-h-[20px]">
            {LOADING_STEPS[currentStepIndex]}
          </p>

          <div className="mt-8 w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / LOADING_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <Card className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-3xl relative overflow-hidden">
        {/* Brand header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500" />
        
        <CardHeader className="space-y-2 pt-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 border border-orange-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">Welcome Back</CardTitle>
          <CardDescription className="text-slate-500">Sign in to your SkillSync AI account</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4 pt-1">
            {/* Input Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium text-xs">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-50 border-slate-200 text-slate-800 pl-10 rounded-xl focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-medium text-xs">Password</Label>
                <Link to="/" className="text-xs text-orange-650 font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-50 border-slate-200 text-slate-800 pl-10 rounded-xl focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl py-5 font-semibold shadow-md active:scale-[0.98] transition-all cursor-pointer mt-2"
            >
              Sign In
            </Button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <span className="relative px-3 bg-white text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Or Quick Login (Judge Access)
              </span>
            </div>

            {/* Quick credentials access */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => triggerQuickLogin("judge@skillsync.ai", "Hackathon Judge")}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-orange-500/20 bg-orange-500/5 text-orange-700 hover:bg-orange-500/10 text-xs font-semibold transition-all cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>CPL Judge</span>
              </button>
              
              <button
                type="button"
                onClick={() => triggerQuickLogin("aditya.verma@gmail.com", "Aditya Verma")}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-all cursor-pointer"
              >
                <UserCheck className="h-4 w-4 shrink-0 text-slate-500" />
                <span>Candidate</span>
              </button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pb-8">
            <div className="text-center text-xs text-slate-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-orange-650 font-bold hover:underline">
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

