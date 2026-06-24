import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  TrendingUp, 
  Smile, 
  Frown, 
  Percent, 
  FileSignature, 
  CheckCircle2, 
  AlertCircle, 
  Award,
  Sparkles,
  ArrowRight,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useResume } from "@/lib/resumeContext";
import { toast } from "sonner";

export const Route = createFileRoute("/features/negotiator")({
  component: SalaryNegotiator,
});

interface DialogueRound {
  sender: "recruiter" | "candidate";
  text: string;
  offer: number;
}

function SalaryNegotiator() {
  const { analysisResult } = useResume();
  const [targetRole, setTargetRole] = useState("Software Engineer");
  
  // Game states
  const [currentRound, setCurrentRound] = useState(1);
  const [currentOffer, setCurrentOffer] = useState(90000);
  const [dealProbability, setDealProbability] = useState(55); // percentage
  const [hrMood, setHrMood] = useState<"Skeptical" | "Neutral" | "Impressed" | "Annoyed" | "Generous">("Neutral");
  const [userReply, setUserReply] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [signature, setSignature] = useState("");
  const [isSigned, setIsSigned] = useState(false);
  
  // Detected tactics state
  const [detectedTactics, setDetectedTactics] = useState({
    marketRate: false,
    achievements: false,
    politeTone: false,
    alternativeComp: false
  });

  const [dialogue, setDialogue] = useState<DialogueRound[]>([
    {
      sender: "recruiter",
      text: "We're absolutely thrilled to offer you the position! Based on our budget and your experience, we can start you at a base salary of $90,000, along with standard medical benefits. How does that align with your expectations?",
      offer: 90000
    }
  ]);

  // Adjust target role if resume context is present
  useEffect(() => {
    if (analysisResult) {
      setTargetRole(analysisResult.role);
    }
  }, [analysisResult]);

  const handleSendReply = async () => {
    if (!userReply.trim()) {
      toast.error("Please enter a response first!");
      return;
    }

    const userText = userReply;
    setUserReply("");
    
    // Add user response to dialogue thread
    setDialogue((prev) => [...prev, { sender: "candidate", text: userText, offer: currentOffer }]);
    setIsTyping(true);
    
    // Core negotiation tactic parser rules
    const textLower = userText.toLowerCase();
    const tacticsUpdate = { ...detectedTactics };
    
    let scoreIncrement = 0;
    let probIncrement = 0;
    let matchesFound = 0;

    // Tactic 1: Market Rate Reference
    if (/(market|average|industry|scale|glassdoor|median|research|stats)/.test(textLower)) {
      tacticsUpdate.marketRate = true;
      scoreIncrement += 8000;
      probIncrement += 12;
      matchesFound++;
    }

    // Tactic 2: Highlighted Achievements
    if (/(developed|spearheaded|engineered|built|optimized|metrics|experience|delivered|impact|achieved)/.test(textLower)) {
      tacticsUpdate.achievements = true;
      scoreIncrement += 9000;
      probIncrement += 15;
      matchesFound++;
    }

    // Tactic 3: Polite Tone
    if (/(thank|grateful|excited|appreciate|delighted|thrilled|pleasure)/.test(textLower)) {
      tacticsUpdate.politeTone = true;
      scoreIncrement += 3000;
      probIncrement += 8;
      matchesFound++;
    }

    // Tactic 4: Alternative Compensation
    if (/(bonus|equity|shares|stock|options|benefits|vacation|remote|wfh|relocation)/.test(textLower)) {
      tacticsUpdate.alternativeComp = true;
      scoreIncrement += 6000;
      probIncrement += 10;
      matchesFound++;
    }

    setDetectedTactics(tacticsUpdate);

    // Determine HR Recruiter Mood and dialogue text
    let newOffer = currentOffer;
    let nextRound = currentRound + 1;
    let nextMood = hrMood;
    let recruiterReply = "";

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsTyping(false);

    if (nextRound === 2) {
      if (matchesFound >= 2) {
        newOffer += scoreIncrement + 4000;
        nextMood = "Impressed";
        recruiterReply = `That is very well-reasoned. I appreciate you bringing up these specific technical contributions and market standard benchmarks. Based on that, I've gone back to the hiring manager, and we can increase our initial base offer to $${newOffer.toLocaleString()}. What are your thoughts on this number?`;
      } else {
        newOffer += 3000;
        nextMood = "Skeptical";
        recruiterReply = `I understand your point, but we have strict grading bounds for this role. However, to show our goodwill, we can bump the offer slightly to $${newOffer.toLocaleString()}. Can we agree on this base?`;
      }
    } else if (nextRound === 3) {
      if (matchesFound >= 1) {
        newOffer += scoreIncrement + 2000;
        nextMood = "Generous";
        recruiterReply = `You make a compelling case for your value. We really want to bring you on board. I've managed to approve a higher sign-on parameter, bringing the base to $${newOffer.toLocaleString()}. I hope this demonstrates how much we value your skills!`;
      } else {
        newOffer += 2000;
        nextMood = "Annoyed";
        recruiterReply = `We are stretching our allocations here. I can offer $${newOffer.toLocaleString()} base, but we really cannot exceed this limit. Do we have a deal?`;
      }
    } else {
      // Final Round 4
      newOffer += matchesFound > 0 ? 3000 : 1000;
      nextMood = "Neutral";
      recruiterReply = `We've reached the absolute maximum cap for our budget guidelines for this position. Our final, best offer is $${newOffer.toLocaleString()} base. We'd truly love to have you join us. Take a moment to review this final contract!`;
      setIsFinished(true);
    }

    setCurrentOffer(newOffer);
    setCurrentRound(nextRound);
    setHrMood(nextMood);
    setDealProbability((prev) => Math.min(98, Math.max(30, prev + probIncrement - (matchesFound === 0 ? 5 : 0))));
    
    setDialogue((prev) => [...prev, { sender: "recruiter", text: recruiterReply, offer: newOffer }]);
  };

  const handleSignContract = () => {
    if (!signature.trim()) {
      toast.error("Please type your name to sign the offer letter!");
      return;
    }
    setIsSigned(true);
    toast.success("Offer contract signed successfully! Welcome to the team!");
  };

  const resetNegotiator = () => {
    setCurrentRound(1);
    setCurrentOffer(90000);
    setDealProbability(55);
    setHrMood("Neutral");
    setUserReply("");
    setIsFinished(false);
    setIsSigned(false);
    setSignature("");
    setDetectedTactics({
      marketRate: false,
      achievements: false,
      politeTone: false,
      alternativeComp: false
    });
    setDialogue([
      {
        sender: "recruiter",
        text: "We're absolutely thrilled to offer you the position! Based on our budget and your experience, we can start you at a base salary of $90,000, along with standard medical benefits. How does that align with your expectations?",
        offer: 90000
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-left">
      <Navbar />

      {/* Decorative BG blobs */}
      <div className="absolute right-0 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-orange-500/5 blur-[140px] pointer-events-none" />

      <main className="container mx-auto px-4 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20 text-orange-650 mb-4">
            <Briefcase className="h-7 w-7 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">AI Salary Negotiator</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Roleplay a salary discussion with a virtual Recruiter. The dashboard tracks HR sentiment, salary offer spikes, and negotiation strategies.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12 max-w-6xl mx-auto items-start">
          
          {/* LEFT: Game Meeting Dialogue Thread */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Recruiter Avatar */}
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200">
                    <span className="font-bold text-orange-700 text-sm">S</span>
                  </div>
                  <div>
                    <CardTitle className="text-base text-slate-800">HR Manager (Sarah)</CardTitle>
                    <CardDescription>Meeting Simulator: Negotiating {targetRole}</CardDescription>
                  </div>
                </div>
                <div className="text-xs bg-slate-100 px-3 py-1 rounded-full font-semibold border border-slate-200 text-slate-655">
                  Round {currentRound} of 4
                </div>
              </CardHeader>
              
              {/* Message History */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {dialogue.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === "candidate" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                        msg.sender === "candidate"
                          ? "bg-orange-500 text-white rounded-br-none shadow-sm"
                          : "bg-white border border-slate-200 text-slate-750 rounded-bl-none shadow-xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Reply Input Bar */}
              <div className="p-3 border-t border-slate-150 bg-white">
                {!isFinished ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userReply}
                      onChange={(e) => setUserReply(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                      placeholder="Type your counter-offer response here..."
                      className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-450 focus:outline-none focus:border-orange-500"
                    />
                    <Button
                      onClick={handleSendReply}
                      disabled={!userReply.trim() || isTyping}
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium px-5"
                    >
                      Send
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-2 text-xs font-semibold text-slate-500 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Negotiation final round complete. Review and sign the contract on the right!
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Strategy Helper prompts */}
            {!isFinished && (
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUserReply("Based on market averages from Glassdoor for this role, I was hoping to target $115,000.")}
                  className="text-xs border-slate-200 hover:bg-slate-50 text-slate-600 rounded-full font-medium"
                >
                  💡 Cite Market Rates
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUserReply("I'm very excited about this role. In my last position I spearheaded optimization scripts that reduced database queries by 40%.")}
                  className="text-xs border-slate-200 hover:bg-slate-50 text-slate-600 rounded-full font-medium"
                >
                  💡 Highlight Tech Achievements
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUserReply("Thank you so much for this offer. Is there any flexibility on sign-on bonus or remote options to align values?")}
                  className="text-xs border-slate-200 hover:bg-slate-50 text-slate-600 rounded-full font-medium"
                >
                  💡 Ask Alternative Perks
                </Button>
              </div>
            )}
          </div>

          {/* RIGHT: Dynamic Dashboard & Performance scorecard */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Metrics Board */}
            <Card className="bg-white border-slate-200 shadow-md">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-md text-slate-800 flex items-center gap-1.5">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  Live Negotiation Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                
                {/* 1. Live Salary offer counter */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Current Base Salary Offer</label>
                  <div className="text-3xl font-extrabold text-orange-600 tracking-tight mt-1">
                    ${currentOffer.toLocaleString()}
                  </div>
                </div>

                {/* 2. Acceptance probability thermometer */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Acceptance Likelihood</span>
                    <span>{dealProbability}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        dealProbability > 70 ? "bg-green-500" : dealProbability > 45 ? "bg-orange-500" : "bg-red-500"
                      }`}
                      style={{ width: `${dealProbability}%` }}
                    />
                  </div>
                </div>

                {/* 3. Recruiter Mood Gauge */}
                <div className="flex items-center justify-between border-t border-b border-slate-100 py-3 text-sm font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    {hrMood === "Annoyed" ? (
                      <Frown className="h-4.5 w-4.5 text-red-500" />
                    ) : (
                      <Smile className="h-4.5 w-4.5 text-green-500" />
                    )}
                    Recruiter Mood
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    hrMood === "Impressed" || hrMood === "Generous" 
                      ? "bg-green-50 text-green-700" 
                      : hrMood === "Annoyed" 
                      ? "bg-red-50 text-red-700" 
                      : "bg-slate-100 text-slate-750"
                  }`}>
                    {hrMood}
                  </span>
                </div>

                {/* 4. Negotiation Tactics checklist */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Strategies Detected</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { key: "marketRate", label: "Cites Market Rates" },
                      { key: "achievements", label: "Highlights Impact" },
                      { key: "politeTone", label: "Maintains Polite Tone" },
                      { key: "alternativeComp", label: "Requests alternative compensation" }
                    ].map((item) => (
                      <div 
                        key={item.key} 
                        className={`flex items-center gap-1.5 text-xs p-2 rounded-xl border transition-all duration-300 ${
                          detectedTactics[item.key as keyof typeof detectedTactics]
                            ? "bg-orange-50/50 border-orange-200 text-orange-700 font-bold"
                            : "bg-slate-50/50 border-slate-200 text-slate-400"
                        }`}
                      >
                        <CheckCircle2 className={`h-4 w-4 shrink-0 ${
                          detectedTactics[item.key as keyof typeof detectedTactics] ? "text-orange-500" : "text-slate-300"
                        }`} />
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* CONTRACT & DIGITAL SIGNING (Triggered when finished) */}
            <AnimatePresence>
              {isFinished && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Card className="bg-white border-slate-200 shadow-md border-t-4 border-t-green-500">
                    <CardHeader className="pb-3 text-center">
                      <FileSignature className="h-10 w-10 text-green-500 mx-auto" />
                      <CardTitle className="text-lg text-slate-800 mt-2">Job Offer Agreement</CardTitle>
                      <CardDescription>Digitally sign to lock in your final negotiated offer.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      
                      {/* Contract Summary details */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 leading-relaxed text-slate-700">
                        <div className="flex justify-between font-bold border-b border-slate-200 pb-1.5 mb-1.5 text-slate-800 text-sm">
                          <span>Employment Contract</span>
                          <span className="text-green-600 font-extrabold">READY</span>
                        </div>
                        <p><strong>Position:</strong> {targetRole}</p>
                        <p><strong>Base Compensation:</strong> ${currentOffer.toLocaleString()} USD / annum</p>
                        <p><strong>Perks:</strong> Medical Coverage & Equity Share Option Eligibility</p>
                      </div>

                      {/* Sign input */}
                      {!isSigned ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={signature}
                            onChange={(e) => setSignature(e.target.value)}
                            placeholder="Type your full name to sign"
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-green-500"
                          />
                          <Button
                            onClick={handleSignContract}
                            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-2.5 font-semibold shadow-[0_4px_12px_rgba(22,163,74,0.2)]"
                          >
                            Accept & Sign Agreement
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-green-50 border border-green-150 rounded-2xl space-y-2">
                          <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto" />
                          <h4 className="font-bold text-green-800 text-sm">Offer Officially Accepted!</h4>
                          <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wider">
                            Signed: {signature}
                          </p>
                        </div>
                      )}

                      <Button
                        onClick={resetNegotiator}
                        variant="ghost"
                        className="w-full text-xs text-slate-500 hover:text-orange-600 font-bold"
                      >
                        Reset Simulator
                      </Button>

                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
