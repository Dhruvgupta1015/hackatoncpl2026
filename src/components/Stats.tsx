import { motion } from "framer-motion";
import { useState } from "react";
import { useResume } from "../lib/resumeContext";


const stats = [
 
  { value: "75%", label: "Resumes fail ATS screening before reaching recruiters" },
  { value: "88%", label: "Students have industry skill gaps" },
  { value: "3X", label: "Faster growth with personalized AI roadmaps" },
  { value: "92%", label: "Recruiters prioritize projects over grades" },
];
const insights = {
  "75%": {
    title: "ATS Optimization",
    text: "Most resumes fail because they don't contain the keywords recruiters search for.",
    action: "Use Resume Analyzer",
  },

  "88%": {
    title: "Skill Gap Alert",
    text: "Students often learn outdated technologies while companies need modern skills.",
    action: "Check Skill Gap",
  },

  "3X": {
    title: "Roadmap Advantage",
    text: "Structured learning paths help students grow significantly faster.",
    action: "Generate Roadmap",
  },

  "92%": {
    title: "Projects Matter",
    text: "Recruiters value practical projects more than grades in many tech roles.",
    action: "Build Projects",
  },
};

export function Stats() {
  const { analysisResult, analyzeResumeFile, isLoading, error } = useResume();
  const [selectedStat, setSelectedStat] = useState("");
  const [activeTool, setActiveTool] = useState("");
  const [userSkills, setUserSkills] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [projectInterest, setProjectInterest] = useState("");
  
return (
    <section className="relative py-16 md:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            The future of <span className="text-gradient">career intelligence</span>
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
           
 onClick={() => setSelectedStat(s.value)}

              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm hover-lift cursor-pointer transition-all duration-300 hover:scale-105 hover:border-orange-500/30 hover:shadow-md"
            >
              <div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, oklch(0.65 0.25 45 / 8%), transparent 70%)",
                }}
              />
              <div className="relative text-4xl font-bold text-gradient md:text-5xl">{s.value}</div>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-655 font-medium">
                {s.label}
              </p>
            </motion.div>
          ))}
                    {selectedStat && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-md"
            >
              <h3 className="text-2xl font-bold text-orange-600">
                {insights[selectedStat as keyof typeof insights].title}
              </h3>

              <p className="mt-3 text-slate-600">
                {insights[selectedStat as keyof typeof insights].text}
              </p>

              <button
                onClick={() => setActiveTool(selectedStat)}
                className="mt-5 rounded-xl bg-orange-500 px-5 py-2 text-white hover:bg-orange-600 transition font-semibold"
              >
                {insights[selectedStat as keyof typeof insights].action}
              </button>
              
              {activeTool === "75%" && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
                  <h4 className="font-bold text-slate-800">Resume Analyzer</h4>
                  
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    className="mt-4 block w-full text-sm text-slate-650 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-500/10 file:text-orange-600 hover:file:bg-orange-500/20 file:cursor-pointer"
                    disabled={isLoading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        await analyzeResumeFile(file);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  />

                  {isLoading && (
                    <div className="mt-4 flex items-center gap-2 text-orange-600">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                      <span>Parsing & analyzing resume...</span>
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 text-sm text-red-650">
                      Error: {error}
                    </div>
                  )}

                  {analysisResult ? (
                    <div className="mt-4 space-y-3">
                      <p className="font-semibold text-emerald-700">
                        Analysis Complete: {analysisResult.fileName || "Uploaded Resume"}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                          <span className="text-xs text-slate-500 block">ATS Score</span>
                          <span className="text-xl font-bold text-orange-600">{analysisResult.atsScore}%</span>
                        </div>
                        <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                          <span className="text-xs text-slate-500 block">Role Detected</span>
                          <span className="text-xl font-bold text-slate-800">{analysisResult.role}</span>
                        </div>
                      </div>
                      
                      {analysisResult.missingSkills.length > 0 && (
                        <div>
                          <span className="text-xs text-slate-500 block mb-1">Missing Skills Detected:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {analysisResult.missingSkills.map((skill) => (
                              <span key={skill} className="text-xs bg-red-50 border border-red-100 text-red-700 px-2.5 py-0.5 rounded-full font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    !isLoading && (
                      <p className="mt-4 text-xs text-slate-505">
                        Please upload your PDF or TXT resume to evaluate your metrics.
                      </p>
                    )
                  )}
                </div>
              )}

              {activeTool === "88%" && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
                  <h4 className="font-bold text-slate-800 mb-2">Skill Gap Analysis</h4>
                  {analysisResult ? (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600">
                        Analyzing skills for <strong className="text-orange-600">{analysisResult.role}</strong> role.
                      </p>
                      
                      <div>
                        <h5 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">Detected Skills</h5>
                        <div className="flex flex-wrap gap-1.5">
                          {analysisResult.detectedSkills.map((skill) => (
                            <span key={skill} className="text-xs bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="text-xs font-semibold text-red-650 uppercase tracking-wider mb-2">Missing Skills Gap</h5>
                        {analysisResult.missingSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {analysisResult.missingSkills.map((skill) => (
                              <span key={skill} className="text-xs bg-red-50 border border-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-emerald-700">Fantastic! No skills gaps detected for this role.</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-amber-700 mb-3 font-medium">
                        💡 Upload your resume under "75%" or in the Analyzer page to see a dynamic role-based skill gap. Otherwise, check standard tech skills below:
                      </p>
                      <input
                        type="text"
                        placeholder="Enter skills (e.g. HTML, CSS, JavaScript)"
                        value={userSkills}
                        onChange={(e) => setUserSkills(e.target.value)}
                        className="w-full rounded-lg bg-white border border-slate-200 p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                      />

                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        Missing standard frontend skills:
                      </p>
                      <ul className="ml-5 mt-1 list-disc text-sm text-slate-500">
                        {["React", "Node.js", "MongoDB", "Git", "TypeScript"]
                          .filter(
                            skill =>
                              !userSkills.toLowerCase().includes(skill.toLowerCase())
                          )
                          .map(skill => (
                            <li key={skill} className="text-xs">{skill}</li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTool === "3X" && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
                  <h4 className="font-bold text-slate-800 mb-2">AI Learning Roadmap</h4>
                  {analysisResult ? (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600">
                        Custom learning roadmap generated for <strong className="text-orange-600">{analysisResult.role}</strong> to bridge your missing skills.
                      </p>
                      <div className="space-y-3 border-l border-slate-200 ml-2 pl-4">
                        {analysisResult.roadmap.map((phase) => (
                          <div key={phase.month} className="relative">
                            <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-orange-500" />
                            <h5 className="text-xs font-bold text-orange-600 uppercase tracking-wider">{phase.month}: {phase.title}</h5>
                            <ul className="mt-1 list-disc ml-4 text-xs text-slate-500 space-y-1">
                              {phase.tasks.map((task) => (
                                <li key={task.title}>
                                  <span className="text-slate-800 font-medium">{task.title}</span>
                                  <span className="ml-1.5 text-[10px] uppercase bg-slate-100 border border-slate-200 text-slate-500 px-1.5 py-0.25 rounded-md">
                                    {task.type}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-amber-700 mb-3 font-medium">
                        💡 Upload your resume to generate a personalized timeline bridging your custom skill gap, or query standard learning paths below:
                      </p>
                      <input
                        type="text"
                        placeholder="Enter career goal (e.g. Frontend, Backend, AI)"
                        value={careerGoal}
                        onChange={(e) => setCareerGoal(e.target.value)}
                        className="w-full rounded-lg bg-white border border-slate-200 p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                      />

                      <div className="mt-4 text-xs space-y-2 text-slate-500">
                        {careerGoal.toLowerCase().includes("frontend") && (
                          <ul className="ml-5 list-disc">
                            <li>Month 1 → HTML, CSS, JavaScript Basics</li>
                            <li>Month 2 → React + Tailwind Development</li>
                            <li>Month 3 → Portfolio Projects & Vercel Deploy</li>
                          </ul>
                        )}

                        {careerGoal.toLowerCase().includes("backend") && (
                          <ul className="ml-5 list-disc">
                            <li>Month 1 → Node.js Event Loop & Fundamentals</li>
                            <li>Month 2 → Express, REST APIs & Databases</li>
                            <li>Month 3 → Docker, JWT Auth & Cloud Deploy</li>
                          </ul>
                        )}

                        {(!careerGoal || careerGoal.toLowerCase().includes("ai")) && (
                          <ul className="ml-5 list-disc">
                            <li>Month 1 → Python programming, NumPy & Pandas</li>
                            <li>Month 2 → Scikit-Learn ML Models & Validation</li>
                            <li>Month 3 → LLM integrations, Prompt Engineering & RAG</li>
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTool === "92%" && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
                  <h4 className="font-bold text-slate-800 mb-2">AI Project Recommender</h4>
                  {analysisResult ? (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600">
                        Recommended projects to build out your resume for <strong className="text-orange-600">{analysisResult.role}</strong> positions.
                      </p>
                      <div className="grid gap-2">
                        {analysisResult.roadmap.flatMap(phase => phase.tasks.filter(t => t.type === 'project')).map((proj, idx) => (
                          <div key={idx} className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm">
                            <h5 className="text-xs font-bold text-slate-800">{proj.title}</h5>
                            <p className="text-[10px] text-slate-500 mt-0.5">High-impact project targeting your skill gap.</p>
                          </div>
                        ))}
                        {analysisResult.recommendations.filter(r => r.type === "Open Source").map((osProj, idx) => (
                          <div key={idx} className="bg-orange-50 border border-orange-100 p-2.5 rounded-lg">
                            <h5 className="text-xs font-bold text-orange-700 flex items-center justify-between">
                              <span>{osProj.title}</span>
                              <span className="text-[9px] uppercase bg-orange-500/10 text-orange-600 px-1 rounded">Open Source</span>
                            </h5>
                            <p className="text-[10px] text-slate-500 mt-0.5">Contribute via {osProj.company}.</p>
                            <a href={osProj.link} target="_blank" rel="noreferrer" className="text-[10px] text-orange-600 hover:underline mt-1 block font-medium">
                              Contribute on Github →
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-amber-700 mb-3 font-medium">
                        💡 Upload your resume to receive projects tailored to your target stack and open source repos. Or search standard project recommendations below:
                      </p>
                      <input
                        type="text"
                        placeholder="Enter project focus (e.g. Frontend, Backend, AI)"
                        value={projectInterest}
                        onChange={(e) => setProjectInterest(e.target.value)}
                        className="w-full rounded-lg bg-white border border-slate-200 p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                      />

                      <div className="mt-4 text-xs space-y-2 text-slate-500">
                        {projectInterest.toLowerCase().includes("frontend") && (
                          <ul className="ml-5 list-disc">
                            <li>Interactive Portfolio Website (Next.js/Tailwind)</li>
                            <li>SaaS Landing Page & Dashboard Mockup</li>
                            <li>E-commerce Cart & Checkout flow</li>
                          </ul>
                        )}

                        {projectInterest.toLowerCase().includes("backend") && (
                          <ul className="ml-5 list-disc">
                            <li>Role-based Access Control Authentication API</li>
                            <li>Realtime Collaborative Chat app with WebSockets</li>
                            <li>Serverless Job Scheduler Worker</li>
                          </ul>
                        )}

                        {(!projectInterest || projectInterest.toLowerCase().includes("ai")) && (
                          <ul className="ml-5 list-disc">
                            <li>AI Resume Parser and Matcher</li>
                            <li>Semantic Search engine for documentation using vector DB</li>
                            <li>Autonomous Agent Interview Coach</li>
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
      
        </div>
      </div>
    </section>
  );
}
