import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Mic, 
  Video, 
  Settings, 
  Play, 
  Camera, 
  CameraOff, 
  User, 
  AlertCircle, 
  Activity, 
  CheckCircle2, 
  Sparkles,
  Volume2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useResume } from "@/lib/resumeContext";
import { toast } from "sonner";

export const Route = createFileRoute("/features/interview-prep")({
  component: InterviewPrep,
});

function InterviewPrep() {
  const { analysisResult } = useResume();
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [useWebcam, setUseWebcam] = useState(true); // Default enabled for impressive presentation!
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCameraAccess, setHasCameraAccess] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Live video mock analytics state
  const [eyeContact, setEyeContact] = useState(94);
  const [posture, setPosture] = useState("Centered & Alert");
  const [vibe, setVibe] = useState("Professional");
  
  useEffect(() => {
    if (!isStarted || isPaused) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
      
      // Dynamic adjustments for webcam analytics
      setEyeContact((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // fluctuate around 90-96
        return Math.max(88, Math.min(98, prev + delta));
      });
      
      const postures = ["Centered & Alert", "Centered & Alert", "Slightly Leaned Left", "Centered & Alert", "Slightly Leaned Right"];
      setPosture(postures[Math.floor(Math.random() * postures.length)]);
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isPaused]);

  // Request webcam on start if enabled
  useEffect(() => {
    if (useWebcam && isStarted) {
      setHasCameraAccess(null);
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((s) => {
          setStream(s);
          setHasCameraAccess(true);
        })
        .catch((err) => {
          console.warn("Real webcam access denied/blocked:", err);
          // Set access to false to activate the high-fidelity cyber scan mockup fallback
          setHasCameraAccess(false);
          toast.info("Real camera blocked or unavailable. Engaged AI Cybernetic face scanner simulation.");
        });
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      setHasCameraAccess(null);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useWebcam, isStarted]);

  // Bind video element once stream or start changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isStarted]);

  const [feedback, setFeedback] = useState("");
  const [answer, setAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [interviewType, setInterviewType] = useState<"tech" | "hr" | "custom">("tech");
  
  const customQuestions = [
    "Design a food delivery app like Swiggy.",
    "Build a chat application architecture.",
    "How would you design Netflix?",
    "Create an AI Resume Analyzer system.",
  ];

  const getTechnicalQuestions = () => {
    if (!analysisResult) {
      return [
        "What is React Virtual DOM?",
        "Difference between useState and useEffect?",
        "What is event bubbling in JavaScript?",
        "Explain React Lifecycle."
      ];
    }
    const role = analysisResult.role;
    if (role.includes("AI")) {
      return [
        "Explain how Transformers and Attention mechanisms work.",
        "What is the difference between RAG and Fine-tuning?",
        "What are vector databases and how do you calculate cosine similarity?",
        "How do you resolve issues with vanishing gradients?"
      ];
    }
    if (role.includes("Backend")) {
      return [
        "Explain Node.js event loop architecture.",
        "What is database indexing and how does it speed up queries?",
        "How do you handle horizontal scaling and caching in REST APIs?",
        "What are ACID transactions in relational databases?"
      ];
    }
    if (role.includes("Full Stack")) {
      return [
        "Explain the difference between client-side and server-side rendering.",
        "How do you optimize React rendering performance and avoid unnecessary rerenders?",
        "How do you design secure token-based authentication (JWT)?",
        "What is CORS and how do you configure it securely?"
      ];
    }
    if (role.includes("DevOps")) {
      return [
        "Explain the core components of Kubernetes architecture.",
        "What is Infrastructure as Code (IaC) and why use Terraform?",
        "How do you secure a CI/CD pipeline using secrets management?",
        "What is the difference between Docker images and containers?"
      ];
    }
    return [
      "What is React Virtual DOM?",
      "Difference between useState and useEffect?",
      "What is event bubbling in JavaScript?",
      "Explain React Lifecycle."
    ];
  };

  const technicalQuestions = getTechnicalQuestions();

  const hrQuestions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "Describe a challenge you faced.",
    "Where do you see yourself in 5 years?"
  ];

  const startInterview = (type: "tech" | "hr" | "custom") => {
    setInterviewType(type);
    let q = "";
    if (type === "tech") {
      q = technicalQuestions[Math.floor(Math.random() * technicalQuestions.length)];
    } else if (type === "hr") {
      q = hrQuestions[Math.floor(Math.random() * hrQuestions.length)];
    } else {
      q = customQuestions[Math.floor(Math.random() * customQuestions.length)];
    }
    setCurrentQuestion(q);
    setIsStarted(true);
    setSeconds(0);
    setAnswer("");
    setFeedback("");
  };

  const endInterview = () => {
    setIsStarted(false);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setAnswer("");
    setFeedback("");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-left">
      <Navbar />

      {/* Dynamic Keyframe style inject for mock scanner bar */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes laser-scan {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 98%; opacity: 1; }
          100% { top: 0%; opacity: 0.8; }
        }
        .animate-laser {
          animation: laser-scan 3.2s linear infinite;
        }
      `}} />

      {/* Decorative BG blobs */}
      <div className="absolute right-0 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-orange-500/5 blur-[140px] pointer-events-none" />

      <main className="container mx-auto px-4 pt-28 pb-20">
        
        {/* Demo Mode alert banner */}
        {!analysisResult && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-5 rounded-2xl border border-orange-200 bg-orange-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-orange-500 animate-pulse" />
              <div>
                <h4 className="font-semibold text-slate-800">Viewing Demo Interview Questions</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload your resume in the Resume Analyzer to tailor mock interview questions matching your actual stack!
                </p>
              </div>
            </div>
            <Link to="/features/resume-analyzer">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-650 text-white rounded-xl font-medium">
                Upload Resume
              </Button>
            </Link>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20 text-orange-600 mb-4">
            <MessageSquare className="h-7 w-7 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">AI Interview Prep</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Practice real-world interview scenarios with our AI. Get instant feedback on your technical answers, tone, eye contact, and posture metrics.
          </p>
        </motion.div>

        {!isStarted ? (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Webcam Mode Switcher Card */}
            <Card className="bg-white border-slate-200 shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${useWebcam ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Face-to-Face Mock Interview</h4>
                  <p className="text-xs text-slate-500">Enable camera to track posture, eye contact, and expression confidence parameters.</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setUseWebcam(!useWebcam)}
                className={`rounded-full px-5 text-xs font-bold ${
                  useWebcam 
                    ? "border-orange-500 text-orange-600 bg-orange-50 hover:bg-orange-100" 
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {useWebcam ? "Webcam Active" : "Voice-Only"}
              </Button>
            </Card>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid gap-6 md:grid-cols-2"
            >
              {/* Technical card */}
              <Card
                className="bg-white border border-slate-200 hover:border-orange-500/50 transition-colors cursor-pointer"
                onClick={() => startInterview("tech")}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-2 text-orange-600">
                    <Video className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg text-slate-850">Technical Interview ({analysisResult ? analysisResult.role : "Frontend"})</CardTitle>
                  <CardDescription>{analysisResult ? `Tailored questions on ${analysisResult.detectedSkills.slice(0, 3).join(", ")}` : "React, System Design, JavaScript"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500 mb-4 font-normal">
                    {analysisResult
                      ? `A mock interview custom-generated for your resume as a ${analysisResult.role}, focusing on matching technical concepts.`
                      : "A 30-minute mock interview focusing on advanced frontend concepts and system design."}
                  </p>
                  <Button className="w-full bg-orange-500 text-white font-bold text-base py-5 hover:bg-orange-600 shadow-[0_4px_12px_rgba(249,115,22,0.2)]">
                    Start Mock Interview
                  </Button>
                </CardContent>
              </Card>

              {/* Behavior card */}
              <Card
                className="bg-white border border-slate-200 hover:border-orange-500/50 transition-colors cursor-pointer"
                onClick={() => startInterview("hr")}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-2 text-orange-600">
                    <Mic className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg text-slate-850">HR / Behavioral</CardTitle>
                  <CardDescription>Culture fit, Leadership, Conflict</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500 mb-4 font-normal">
                    Practice common behavioral questions using the STAR method with AI feedback and coaching logs.
                  </p>
                  <Button className="w-full bg-orange-500 text-white font-bold text-base py-5 hover:bg-orange-600 shadow-[0_4px_12px_rgba(249,115,22,0.2)]">
                    Start Mock Interview
                  </Button>
                </CardContent>
              </Card>

              {/* Custom scenario buttons */}
              <div className="md:col-span-2 flex justify-center mt-4">
                <Button
                  variant="outline"
                  className="gap-2 border-slate-200 hover:bg-slate-50 text-slate-850 rounded-xl"
                  onClick={() => startInterview("custom")}
                >
                  <Settings className="h-4 w-4 text-slate-500" />
                  Custom Scenario
                </Button>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <Card className="bg-white border border-slate-200 overflow-hidden shadow-md">
              <div className="grid md:grid-cols-3">
                
                {/* LEFT: Interview Panel (Video/Waveform) */}
                <div className="md:col-span-2 bg-slate-50 p-6 flex flex-col justify-between min-h-[500px] border-r border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Interview Live Feed</span>
                    </div>
                    <span className="font-mono text-sm text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-lg">
                      {Math.floor(seconds / 60).toString().padStart(2, "0")}:
                      {(seconds % 60).toString().padStart(2, "0")}
                    </span>
                  </div>

                  {/* Twin Video Feeds (User + Recruiter) */}
                  {useWebcam ? (
                    <div className="grid grid-cols-2 gap-4 my-auto">
                      
                      {/* 1. Recruiter Video Box */}
                      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-[4/3] flex items-center justify-center shadow-inner">
                        {/* Recruiter Simulated Wave */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex flex-col justify-end p-3 z-10 text-left">
                          <span className="text-[10px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded uppercase w-fit tracking-wide mb-1">
                            Interviewer
                          </span>
                          <h5 className="text-white text-xs font-bold">HR Sarah (AI)</h5>
                        </div>
                        <div className="text-center space-y-2">
                          <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto text-orange-500 animate-pulse">
                            <User className="h-8 w-8" />
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">AI AUDIO ENGAGED</span>
                        </div>
                      </div>

                      {/* 2. User Webcam Feed Box with mock face scanner fallback */}
                      <div className="relative rounded-2xl overflow-hidden border border-orange-500 bg-slate-950 aspect-[4/3] shadow-md flex items-center justify-center">
                        {hasCameraAccess === true ? (
                          // Real Webcam Video stream
                          <video 
                            ref={videoRef}
                            autoPlay 
                            playsInline 
                            muted 
                            className="absolute inset-0 w-full h-full object-cover scale-x-[-1] z-0"
                          />
                        ) : (
                          // High fidelity simulated visual face scan overlay (cyber face tracker)
                          <div className="absolute inset-0 z-0 bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
                            {/* Scanning moving line */}
                            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-laser z-20 shadow-[0_0_10px_#f97316]" />
                            
                            {/* Grid overlay background */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

                            {/* SVG Geometric Scanning Head Silhouette */}
                            <svg className="w-24 h-24 text-orange-500/25 animate-pulse relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.003 9.003 0 016.364 2.636M12 3a9.003 9.003 0 00-6.364 2.636" />
                              <circle cx="12" cy="12" r="1.5" className="text-orange-500 fill-orange-500 animate-ping" />
                            </svg>

                            <div className="absolute bottom-6 text-[8px] font-mono text-orange-400 font-bold uppercase tracking-wider text-center z-10 space-y-1">
                              <div>[SYS: AI CYBER SCAN ENGAGED]</div>
                              <div className="text-[7px] text-slate-500">Mapping 24 facial points...</div>
                            </div>
                          </div>
                        )}

                        {/* Real-time analytical overlays (Always displays!) */}
                        <div className="absolute top-2 right-2 bg-black/60 border border-white/10 px-2 py-1 rounded-md text-[9px] text-white font-bold flex items-center gap-1 z-10">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                          Eye Contact: {eyeContact}%
                        </div>
                        <div className="absolute top-8 right-2 bg-black/60 border border-white/10 px-2 py-1 rounded-md text-[9px] text-white font-bold z-10">
                          Posture: {posture}
                        </div>
                        <div className="absolute top-14 right-2 bg-black/60 border border-white/10 px-2 py-1 rounded-md text-[9px] text-white font-bold z-10">
                          Expression: {vibe}
                        </div>

                        <div className="absolute bottom-2 left-2 bg-black/60 border border-white/10 px-2 py-1 rounded-md text-[9px] text-white font-bold z-10 uppercase">
                          Candidate {hasCameraAccess === false ? "(SIMULATED)" : "(You)"}
                        </div>
                      </div>

                    </div>
                  ) : (
                    /* Fallback standard audio waveform visualizer */
                    <div className="text-center space-y-4 my-auto">
                      <div className="inline-flex w-20 h-20 rounded-full bg-orange-50/60 border border-orange-100 items-center justify-center mb-4">
                        <Mic className="h-8 w-8 text-orange-500" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">Listening to your answer...</h3>
                      <div className="flex justify-center gap-1 h-8 items-end">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ height: ["20%", "100%", "20%"] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                            className="w-1.5 bg-orange-500 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center gap-4 mt-6">
                    <Button
                      variant="destructive"
                      onClick={endInterview}
                      className="rounded-xl font-semibold px-6"
                    >
                      End Interview
                    </Button>
                    <Button
                      onClick={() => setIsPaused(!isPaused)}
                      variant="outline"
                      className="rounded-xl border-slate-200 text-slate-700 bg-white hover:bg-slate-50 px-6 font-semibold"
                    >
                      {isPaused ? "Resume" : "Pause"}
                    </Button>
                  </div>
                </div>

                {/* RIGHT: Question & Textarea Panel */}
                <div className="p-6 bg-white flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                        Current Question
                      </h4>
                      <p className="text-md font-semibold text-slate-850 leading-relaxed">
                        {currentQuestion}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Your Answer Response</label>
                      <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 text-sm"
                        rows={5}
                        placeholder="Type your answer here or speak..."
                      />
                    </div>

                    <Button
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl"
                      onClick={() => {
                        if (!answer.trim()) {
                          setFeedback("Please enter an answer first.");
                          return;
                        }

                        if (answer.length < 50) {
                          setFeedback(
                            "Answer is too short. Try explaining your thoughts in more detail, explaining specific technical actions you took."
                          );
                        } else if (answer.length < 150) {
                          setFeedback(
                            "Good answer. To make it stronger, add more real-world examples, metrics, and targeted technical terms."
                          );
                        } else {
                          setFeedback(
                            "Excellent answer! Strong logical explanation with sufficient detail, structural clarity, and direct metric highlights."
                          );
                        }
                      }}
                    >
                      Submit Answer
                    </Button>

                    <AnimatePresence>
                      {feedback && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100"
                        >
                          <p className="text-xs text-slate-700 leading-relaxed">
                            <strong className="text-orange-700 font-bold block mb-1">AI Mock Feedback:</strong> {feedback}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* AI Hints Block */}
                  <div className="space-y-3 pt-6 border-t border-slate-100">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                      Live AI Hints
                    </h4>
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-600 leading-relaxed">
                      <span className="text-amber-700 font-bold">Concept Key:</span> Mention specific engineering design constraints or architecture paradigms.
                    </div>
                  </div>
                </div>

              </div>
            </Card>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
