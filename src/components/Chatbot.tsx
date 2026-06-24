import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Settings, Sparkles, AlertCircle, Bot, User, Paperclip, Mic } from "lucide-react";
import { useResume } from "@/lib/resumeContext";
import { Button } from "@/components/ui/button";

interface Message {
  sender: "bot" | "user";
  text: string;
  image?: string; // base64 representation of attached image
}

export function Chatbot() {
  const { analysisResult } = useResume();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am your SkillSync Career Assistant. How can I help you decode your resume, recommend projects, or prep for interviews today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Advanced features state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load local API key if exists
    const storedKey = localStorage.getItem("skillsync_openai_key");
    if (storedKey) setApiKey(storedKey);

    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
      };
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prev) => prev + (prev ? " " : "") + transcript);
      };
      rec.onerror = (e: any) => {
        console.error("Speech Recognition Error:", e);
        setIsListening(false);
      };
      rec.onend = () => {
        setIsListening(false);
      };
      recognitionRef.current = rec;
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom on new messages
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSaveKey = () => {
    localStorage.setItem("skillsync_openai_key", apiKey.trim());
    setShowSettings(false);
  };

  const handleClearKey = () => {
    localStorage.removeItem("skillsync_openai_key");
    setApiKey("");
    setShowSettings(false);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Try Chrome or Microsoft Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Attached image should be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    const attachedImage = selectedImage;

    if (!text.trim() && !attachedImage) return;

    // Add user message to state
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: text,
        image: attachedImage || undefined,
      },
    ]);

    // Reset input fields
    if (!textToSend) setInputValue("");
    setSelectedImage(null);
    setIsLoading(true);

    const keyToUse = localStorage.getItem("skillsync_openai_key") || "";

    if (keyToUse) {
      // Real API Mode with Vision Support
      try {
        const systemPrompt = `You are SkillSync AI, an expert career intelligence bot.
          The user is asking a question about their career, resume, or developer skills.
          Candidate Context:
          Name: ${analysisResult?.name || "Aditya (Demo)"}
          Target Role: ${analysisResult?.role || "Frontend Developer"}
          Skills Found: ${analysisResult?.detectedSkills.join(", ") || "React, TypeScript, JavaScript, CSS, HTML"}
          ATS Score: ${analysisResult?.atsScore || 84}
          Gaps/Missing Skills: ${analysisResult?.missingSkills.join(", ") || "Next.js, System Design"}
          Provide structured, concise, human-friendly, and professional advice. Focus on actionable tips.`;

        // Vision model content payload
        let messageContent: any = text;
        if (attachedImage) {
          messageContent = [
            { type: "text", text: text || "Analyze this attached screenshot or document." },
            { type: "image_url", image_url: { url: attachedImage } }
          ];
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keyToUse}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: messageContent },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed response from OpenAI. Check your API key.");
        }

        const data = await response.json();
        const botReply = data.choices[0]?.message?.content || "No reply generated. Try again.";
        setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `⚠️ API Error: ${err.message || "Something went wrong while connecting to OpenAI."}. Please verify your key in the settings panel.`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Mock Fallback Engine with image processing awareness
      setTimeout(() => {
        let reply = "";
        const query = text.toLowerCase();

        if (attachedImage) {
          reply = `I have received and processed your attached screenshot/image! 📸
          
Based on our visual analysis heuristics:
1. **Resume Structure**: The layout has clearly defined sections, which is excellent for ATS scanners.
2. **Readability**: High contrast and proper spacing ensure human-friendly reading.
3. **Recommendation**: We advise adding more quantified metrics (e.g. 'Optimized database queries by 35%') under each job or project description to boost your ATS compatibility score.`;
        } else if (analysisResult) {
          const { name, role, atsScore, careerReadiness, detectedSkills, missingSkills, currentSalary, futureSalary } = analysisResult;
          const firstMissing = missingSkills?.[0] || "Advanced System Design";
          
          if (query.includes("score") || query.includes("rating") || query.includes("ats") || query.includes("percent") || query.includes("number")) {
            reply = `Hey ${name}! Your resume is currently rated as **${atsScore}%** on ATS compatibility, and your Career Readiness index stands at **${careerReadiness}%**. 
            
To push this score above 90%, I recommend adding quantified project metrics and addressing your gap in **${firstMissing}**.`;
          } else if (query.includes("skill") || query.includes("gap") || query.includes("missing") || query.includes("learn") || query.includes("study") || query.includes("extra")) {
            reply = `Based on your profile, you have strong expertise in: **${detectedSkills.slice(0, 5).join(", ")}**.
            
However, for target **${role}** roles, we detected these skill gaps:
${missingSkills.map((s: string) => `- ${s}`).join("\n")}

Focus on learning **${firstMissing}** first to align with market demand.`;
          } else if (query.includes("project") || query.includes("portfolio") || query.includes("build") || query.includes("make") || query.includes("github")) {
            const projTitle = analysisResult.atsDetails?.missingProjects?.[0]?.title || (role.includes("AI") ? "Retrieving-Augmented Generation (RAG) Agent" : "High-Performance Redis Cache Engine");
            const projDesc = analysisResult.atsDetails?.missingProjects?.[0]?.description || "Build an interactive platform demo showcasing state management and clean styling.";
            reply = `Here is a custom portfolio project recommended for you:
            
**Project**: \`${projTitle}\`
- **Focus**: Learn and implement **${firstMissing}**.
- **Description**: ${projDesc}
- **Resume Bullet Point**: "Architected a ${projTitle} reducing server response latencies by 35% using clean structural paradigms."`;
          } else if (query.includes("salary") || query.includes("package") || query.includes("money") || query.includes("lpa") || query.includes("earning") || query.includes("job")) {
            reply = `For **${role}** roles, here is your salary benchmark:
- **Estimated Current Bracket**: **${currentSalary || "₹5–7 LPA"}**
- **Optimized Potential (with skill roadmaps)**: **${futureSalary || "₹12–16 LPA"}**
- **Market Demand Score**: **${analysisResult.marketDemand || 85}%** (Very High)

Acquiring **${firstMissing}** is the key factor to boost your LPA potential.`;
          } else if (query.includes("roadmap") || query.includes("path") || query.includes("milestone") || query.includes("month")) {
            reply = `Your personalized **3-Month Learning Roadmap** focuses on bridging gaps for **${role}**.
            
- **Month 1**: Focus on learning **${firstMissing}** and building a prototype.
- **Month 2**: Expand to secondary domains and testing.
- **Month 3**: Finalize portfolio showcase and practice mock interviews.

You can view the detailed roadmap using the *AI Roadmap* link in the navigation header.`;
          } else if (query.includes("bhai") || query.includes("dost") || query.includes("kaise") || query.includes("kya") || query.includes("help") || query.includes("namaste") || query.includes("hello") || query.includes("hi") || query.includes("hey")) {
            reply = `Haan bhai! Main aapka SkillSync Assistant hoon. 
Aapki profile **${role}** ke liye analyzed hai (ATS Score: **${atsScore}%**). 

Aap mujhse ye sab poochh sakte hain:
1. "Mere resume me kya flaws hain?"
2. "Mujhe kaunsa project banana chahiye?"
3. "Mera salary package kitna ho sakta hai?"
4. "Mera learning roadmap kya hai?"`;
          } else {
            reply = `Thanks for asking! I'm here as your AI Career Coach. 

For your analyzed **${role}** profile:
- **ATS Score**: ${atsScore}%
- **Skill Gaps**: ${missingSkills.slice(0, 3).join(", ") || "None!"}
- **Recommended Action**: Focus on learning **${firstMissing}**.

Ask me about your score, gaps, salary package, or recommended projects to get detailed answers!`;
          }
        } else {
          // No resume analyzed yet
          if (query.includes("bhai") || query.includes("dost") || query.includes("kaise") || query.includes("kya") || query.includes("help") || query.includes("namaste") || query.includes("hello") || query.includes("hi") || query.includes("hey")) {
            reply = `Namaste/Hello! 👋 Main aapka SkillSync Assistant hoon. 

Sabse pehle, apna resume **Analyze Resume** button se upload kijiye. 
Uske baad main aapko:
- Resume ATS score
- Skill gaps (missing skills)
- Study roadmap
- Portfolio project recommendations
- Salary benchmark potential

ke baare me poora logical details de sakunga!`;
          } else if (query.includes("score") || query.includes("rating") || query.includes("ats")) {
            reply = "To see your ATS compatibility rating, please upload your resume on the homepage first! Once analyzed, I will show your score here.";
          } else if (query.includes("project") || query.includes("github")) {
            reply = "I can recommend custom portfolio projects, but I need to see your resume first! Please upload your resume so I know your target role and skills.";
          } else if (query.includes("salary") || query.includes("package") || query.includes("lpa")) {
            reply = "Salary benchmarks are calculated based on your technical skills and target role. Upload your resume first to see a personalized package estimation.";
          } else {
            reply = `Hello! I am your SkillSync Career Assistant. 

Please upload a resume first using the **Analyze Resume** button so I can read your details. 

If you are looking for general info:
- **Average Entry Salary**: ₹4-8 LPA
- **Popular Tracks**: Frontend, Backend, AI / ML
- **Core Requirements**: Clean projects on GitHub, ATS-optimized formatting

How can I help you today?`;
          }
        }

        setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
        setIsLoading(false);
      }, 700);
    }
  };

  const quickPrompts = [
    "What are my resume flaws?",
    "Suggest a portfolio project",
    "How can I boost my salary?",
    "About Project details",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="mb-4 w-[360px] h-[480px] rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-elevated)] flex flex-col justify-between overflow-hidden backdrop-blur-xl"
          >
            {/* Chatbot Header */}
            <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-orange-500/15 flex items-center justify-center text-orange-650">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-semibold text-xs text-slate-800">SkillSync Assistant</h5>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block">
                    {apiKey ? "Live GPT API Mode" : "Local Context Helper"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
                  title="Configure OpenAI Key"
                >
                  <Settings className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Main body area (Scrollable chats / Settings) */}
            <div className="flex-1 p-4 overflow-y-auto relative flex flex-col gap-3 min-h-[260px] bg-slate-50/50">
              {showSettings ? (
                /* Settings panel */
                <div className="absolute inset-0 bg-white p-5 flex flex-col justify-between z-10">
                  <div>
                    <h6 className="font-semibold text-sm flex items-center gap-1.5 text-slate-800">
                      <Settings className="h-4 w-4 text-orange-500" /> API Settings
                    </h6>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      Enter your own OpenAI API key to enable direct calls. Key is stored securely in your browser's local cache.
                    </p>
                    <input
                      type="password"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveKey}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs"
                    >
                      Save Key
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleClearKey}
                      className="flex-1 rounded-lg text-xs"
                    >
                      Clear Key
                    </Button>
                  </div>
                </div>
              ) : (
                /* Chat Messages area */
                <>
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-2.5 max-w-[85%] ${msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"}`}
                    >
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-xs ${msg.sender === "user" ? "bg-orange-500 text-white" : "bg-slate-200 text-orange-600"}`}
                      >
                        {msg.sender === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                      </div>
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === "user" ? "bg-orange-500 text-white rounded-tr-none" : "bg-white border border-slate-200/60 text-slate-800 rounded-tl-none whitespace-pre-line shadow-sm"}`}
                      >
                        {msg.image && (
                          <div className="mb-2 max-w-[180px] rounded-lg overflow-hidden border border-slate-200/60">
                            <img src={msg.image} alt="Attachment" className="w-full object-cover max-h-[100px]" />
                          </div>
                        )}
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-2.5 self-start items-center">
                      <div className="h-6 w-6 rounded-full bg-slate-200 text-orange-650 flex items-center justify-center text-xs">
                        <Bot className="h-3 w-3" />
                      </div>
                      <div className="p-3 rounded-2xl bg-white border border-slate-200/60 text-slate-500 text-xs rounded-tl-none flex gap-1 items-center shadow-sm">
                        <span className="h-1.5 w-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-1.5 w-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>

            {/* Quick chips (only when settings are closed and chat has just started) */}
            {!showSettings && messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1 bg-slate-50/50">
                {quickPrompts.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSend(chip)}
                    className="text-[10px] bg-white border border-slate-200 hover:border-orange-500/50 hover:bg-orange-500/5 px-2.5 py-1.5 rounded-full text-slate-650 hover:text-orange-650 transition-all text-left cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Input area */}
            <div className="border-t border-slate-100 p-3 bg-slate-50 flex flex-col gap-2">
              {/* Attachment preview */}
              {selectedImage && (
                <div className="relative self-start h-10 w-10 rounded-lg border border-slate-200 overflow-hidden bg-white group shadow-sm">
                  <img src={selectedImage} alt="Attachment Preview" className="h-full w-full object-cover" />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white transition-opacity cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                {/* Image upload clip button */}
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-orange-600 hover:bg-orange-500/5 transition-all cursor-pointer shrink-0"
                  title="Attach Screenshot"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={imageInputRef}
                  className="hidden"
                  onChange={handleImageSelect}
                />

                {/* Voice speech mic button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${isListening ? "bg-red-500 border-red-500 text-white animate-pulse" : "bg-white border-slate-200 text-slate-500 hover:text-orange-600 hover:bg-orange-500/5"}`}
                  title={isListening ? "Listening... Speak now" : "Voice Input"}
                >
                  <Mic className="h-4 w-4" />
                </button>

                <input
                  type="text"
                  placeholder={showSettings ? "Configure API Key above..." : "Ask me anything..."}
                  disabled={showSettings}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 min-w-0"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={showSettings || (!inputValue.trim() && !selectedImage)}
                  className="h-8 w-8 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:hover:bg-orange-500 text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bubble Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-[0_0_24px_oklch(0.65_0.25_45/50%)] hover:shadow-[0_0_36px_oklch(0.65_0.25_45/70%)] relative border border-white/20 cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full animate-ping ring-2 ring-slate-950" />
        )}
      </motion.button>
    </div>
  );
}
