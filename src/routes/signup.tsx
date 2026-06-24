import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, User, Mail, Lock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      login(email, name);
      navigate({ to: "/" });
    }
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
      <div className="pointer-events-none absolute -bottom-40 -right-40 -z-10 h-[400px] w-[400px] rounded-full bg-orange-500/10 blur-[120px]" />

      <Card className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-3xl relative overflow-hidden">
        {/* Brand header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500" />
        
        <CardHeader className="space-y-2 pt-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 border border-orange-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">Create an Account</CardTitle>
          <CardDescription className="text-slate-500">Get started with SkillSync AI in under 60 seconds</CardDescription>
        </CardHeader>

        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4 pt-1">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium text-xs">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-slate-50 border-slate-200 text-slate-800 pl-10 rounded-xl focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Email Address */}
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

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium text-xs">Password</Label>
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
              Create Account
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pb-8">
            <div className="text-center text-xs text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-orange-650 font-bold hover:underline">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
