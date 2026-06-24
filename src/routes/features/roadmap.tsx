import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Map, 
  Calendar, 
  PlayCircle, 
  Code2, 
  Award, 
  Trophy, 
  Lock, 
  Unlock, 
  Check, 
  BookOpen, 
  ChevronRight, 
  Sparkles, 
  Star,
  Gamepad2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useResume } from "@/lib/resumeContext";
import { toast } from "sonner";

const iconMap: Record<string, any> = {
  PlayCircle: PlayCircle,
  Code2: Code2,
  Award: Award,
};

interface SkillNode {
  id: string;
  label: string;
  description: string;
  x: string;
  y: string;
  prerequisites: string[];
  resources: string[];
  masteryQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

const rpgSkillsData: Record<string, SkillNode[]> = {
  Frontend: [
    {
      id: "fe-html-css",
      label: "HTML5 & CSS3 Master",
      description: "Advanced semantic markup, modern CSS grid/flexbox layouts, accessibility, and responsive principles.",
      x: "15%",
      y: "20%",
      prerequisites: [],
      resources: ["MDN Web Docs: CSS Grid & Flexbox", "web.dev: Learn Accessibility (A11y)"],
      masteryQuiz: [
        {
          question: "Which CSS layout model is designed for one-dimensional layouts?",
          options: ["CSS Grid", "Flexbox", "Floats", "Absolute Positioning"],
          correctIndex: 1,
        },
        {
          question: "What does the HTML5 element <main> represent?",
          options: ["The sidebar links", "The primary, unique content of the document", "The site footer elements", "The primary navigation block"],
          correctIndex: 1,
        },
        {
          question: "Which CSS property is used to specify the stack order of elements?",
          options: ["z-index", "position", "display", "opacity"],
          correctIndex: 0,
        }
      ]
    },
    {
      id: "fe-js",
      label: "JavaScript Deep Dive",
      description: "Understanding asynchronous flows, event loops, scopes, closures, ES6+ features, and DOM manipulation.",
      x: "50%",
      y: "20%",
      prerequisites: ["fe-html-css"],
      resources: ["Eloquent JavaScript - Closures & Async", "MDN: JavaScript Event Loop & Promises"],
      masteryQuiz: [
        {
          question: "What is a closure in JavaScript?",
          options: [
            "A way to close the browser tab programmatically",
            "A function that has access to its outer scope even after the outer function has returned",
            "A syntax error caused by unmatched curly braces",
            "An internal database storage mechanism"
          ],
          correctIndex: 1,
        },
        {
          question: "What is the output of: console.log(typeof NaN)?",
          options: ["'number'", "'NaN'", "'undefined'", "'object'"],
          correctIndex: 0,
        },
        {
          question: "Which promise method resolves when all input promises resolve, or rejects immediately on the first rejection?",
          options: ["Promise.all()", "Promise.any()", "Promise.race()", "Promise.allSettled()"],
          correctIndex: 0,
        }
      ]
    },
    {
      id: "fe-react-core",
      label: "React Core Architecture",
      description: "Virtual DOM reconciliation, state-effect synchronization, custom hooks, ref management, and component lifecycles.",
      x: "35%",
      y: "50%",
      prerequisites: ["fe-js"],
      resources: ["React Docs: Escape Hatches & Refs", "React Dev: Custom Hooks Pattern"],
      masteryQuiz: [
        {
          question: "What hook would you use to store a persistent value that does not trigger a re-render when updated?",
          options: ["useState", "useEffect", "useRef", "useMemo"],
          correctIndex: 2,
        },
        {
          question: "In React, what is the main purpose of 'keys' in lists?",
          options: [
            "To uniquely identify a DOM element across pages",
            "To help React identify which items have changed, been added, or been removed",
            "To encrypt the list items inside the virtual DOM",
            "To apply Tailwind utility classes dynamically"
          ],
          correctIndex: 1,
        },
        {
          question: "What does the useCallback hook return?",
          options: [
            "A memoized state value",
            "A side effect cleanup function",
            "A memoized version of the callback function that only changes if dependencies change",
            "A reference to a DOM node"
          ],
          correctIndex: 2,
        }
      ]
    },
    {
      id: "fe-state-mgmt",
      label: "Advanced State Management",
      description: "Managing deep application state with Zustand, Redux Toolkit, Context optimization, and reactive store patterns.",
      x: "15%",
      y: "80%",
      prerequisites: ["fe-react-core"],
      resources: ["Zustand Guide: State slices", "Redux Toolkit: RTK Query integration"],
      masteryQuiz: [
        {
          question: "In Zustand, how can you avoid unnecessary re-renders when accessing the store?",
          options: [
            "Use selectors to extract only the specific state values needed",
            "Always wrap the entire component in React.memo",
            "Store state values in standard refs instead",
            "Run Zustand stores inside a web worker"
          ],
          correctIndex: 0,
        },
        {
          question: "Which tool is commonly used to debug state transitions, inspect actions, and travel time in Redux/Zustand stores?",
          options: ["React DevTools", "Redux DevTools Extension", "Chrome Network Tab", "Postman Console"],
          correctIndex: 1,
        },
        {
          question: "What is an action creator in Redux?",
          options: [
            "A function that returns an action object with a type and payload",
            "A middleware that intercept API calls",
            "A reducer function that calculates state delta",
            "A React context provider element"
          ],
          correctIndex: 0,
        }
      ]
    },
    {
      id: "fe-nextjs",
      label: "Next.js SSR & Performance",
      description: "Server Components, Server Actions, Static Site Generation (SSG), Incremental Static Regeneration (ISR), and image optimization.",
      x: "85%",
      y: "50%",
      prerequisites: ["fe-react-core"],
      resources: ["Next.js Docs: Rendering Patterns", "Vercel: Core Web Vitals Optimization"],
      masteryQuiz: [
        {
          question: "By default in the Next.js App Router, are components treated as Client Components or Server Components?",
          options: ["Client Components", "Server Components", "Shared Components", "Static HTML blocks"],
          correctIndex: 1,
        },
        {
          question: "Which tag is added at the top of a file to declare that its sub-components should run on the client?",
          options: ["'use server'", "'client'", "'use client'", "'enable hydration'"],
          correctIndex: 2,
        },
        {
          question: "What rendering mode updates static pages after they have been built, without rebuilding the whole site?",
          options: ["Static Site Generation (SSG)", "Incremental Static Regeneration (ISR)", "Server-side Rendering (SSR)", "Dynamic Hydration"],
          correctIndex: 1,
        }
      ]
    },
    {
      id: "fe-testing",
      label: "Testing & CI/CD",
      description: "Unit testing with Vitest/Jest, integration testing with React Testing Library, and end-to-end user flows with Playwright.",
      x: "65%",
      y: "80%",
      prerequisites: ["fe-nextjs"],
      resources: ["Vitest API: mock & spyOn methods", "Playwright Docs: E2E user flows"],
      masteryQuiz: [
        {
          question: "Which library is optimized to simulate human-like user events in React unit tests?",
          options: ["Jest", "Vitest", "@testing-library/user-event", "Selenium Web Driver"],
          correctIndex: 2,
        },
        {
          question: "What is the primary difference between a mock and a spy in Vitest?",
          options: [
            "A spy tracks original method calls without stubbing its behavior; a mock replaces the behavior entirely",
            "A mock is only for backend APIs, while a spy is for browser DOM elements",
            "Spies are slower and run asynchronously",
            "There is no difference"
          ],
          correctIndex: 0,
        },
        {
          question: "What is the purpose of a CI/CD pipeline?",
          options: [
            "To automate the testing, building, and deployment of code on changes",
            "To encrypt local databases before production push",
            "To run AI lint checkers on server responses",
            "To host web applications on cloud VMs"
          ],
          correctIndex: 0,
        }
      ]
    }
  ],
  Backend: [
    {
      id: "be-express",
      label: "Node.js & Express API Design",
      description: "Building scalable HTTP RESTful routers, handling stream events, implementing custom CORS middleware, and error interceptors.",
      x: "15%",
      y: "20%",
      prerequisites: [],
      resources: ["Express Docs: Writing Middleware", "Node.js Streams Handbook"],
      masteryQuiz: [
        {
          question: "In Express, what parameters does an error-handling middleware function receive?",
          options: ["(req, res)", "(req, res, next)", "(err, req, res, next)", "(err, req, res)"],
          correctIndex: 2,
        },
        {
          question: "Which Node.js module is used to read and write files asynchronously?",
          options: ["path", "fs/promises", "http", "stream"],
          correctIndex: 1,
        },
        {
          question: "What is CORS designed to prevent?",
          options: [
            "Cross-site scripting (XSS) code injection",
            "Unauthorized cross-origin resource access in the browser",
            "SQL query injection on database endpoints",
            "Docker container memory leakage"
          ],
          correctIndex: 1,
        }
      ]
    },
    {
      id: "be-sql",
      label: "PostgreSQL & Database Schema",
      description: "Designing structured relationships, indexes for slow queries, transactions, and concurrency management.",
      x: "50%",
      y: "20%",
      prerequisites: ["be-express"],
      resources: ["PostgreSQL Tutorial: B-Tree Indexing", "DB-Engines: ACID Transactions Schema"],
      masteryQuiz: [
        {
          question: "What does the 'A' in ACID transactions stand for?",
          options: ["Association", "Atomicity", "Availability", "Authentication"],
          correctIndex: 1,
        },
        {
          question: "Which index type is the default and most commonly used in PostgreSQL?",
          options: ["Hash Index", "B-Tree Index", "GIN Index", "BRIN Index"],
          correctIndex: 1,
        },
        {
          question: "What SQL statement is used to combine rows from two or more tables based on a related column?",
          options: ["GROUP BY", "UNION", "JOIN", "HAVING"],
          correctIndex: 2,
        }
      ]
    },
    {
      id: "be-orm",
      label: "Prisma ORM & Schema Migrations",
      description: "Writing type-safe queries, handling n+1 query patterns, configuring relation mappings, and staging production migrations.",
      x: "35%",
      y: "50%",
      prerequisites: ["be-sql"],
      resources: ["Prisma Guide: Relation queries", "Prisma: Optimizing DB queries"],
      masteryQuiz: [
        {
          question: "How does Prisma solve the 'N+1 query problem' when querying relational data?",
          options: [
            "By caching all queries in Node.js server memory",
            "By using database JOINs or batching queries automatically via relation loading",
            "By requiring users to write raw SQL SELECT queries",
            "By indexing tables automatically"
          ],
          correctIndex: 1,
        },
        {
          question: "What command is used to apply schema migrations to a local development database in Prisma?",
          options: ["npx prisma db push", "npx prisma migrate dev", "npx prisma generate", "npx prisma studio"],
          correctIndex: 1,
        },
        {
          question: "What is the purpose of 'npx prisma generate'?",
          options: [
            "It generates a new database file",
            "It builds the TypeScript types based on your Prisma schema",
            "It deploys migrations to staging servers",
            "It validates security keys in the config file"
          ],
          correctIndex: 1,
        }
      ]
    },
    {
      id: "be-docker",
      label: "Docker Containerization",
      description: "Writing multi-stage Dockerfiles, building lightweight Alpine images, and orchestration using Docker Compose.",
      x: "15%",
      y: "80%",
      prerequisites: ["be-orm"],
      resources: ["Docker Docs: Multi-stage builds", "Docker: Layer caching best practices"],
      masteryQuiz: [
        {
          question: "What is the advantage of using a multi-stage Docker build?",
          options: [
            "It allows running tests concurrently inside the build container",
            "It keeps the final production image size small by discarding build dependencies",
            "It builds images in parallel on Docker Hub",
            "It secures environment variables in public repositories"
          ],
          correctIndex: 1,
        },
        {
          question: "Which Docker Compose command builds and starts container services in background detached mode?",
          options: ["docker compose up -d", "docker compose start --daemon", "docker compose run -b", "docker compose up --silent"],
          correctIndex: 0,
        },
        {
          question: "What directive in a Dockerfile defines the working directory inside the container?",
          options: ["DIR", "WORKDIR", "CD", "FOLDER"],
          correctIndex: 1,
        }
      ]
    },
    {
      id: "be-redis",
      label: "Redis Caching & Queue Management",
      description: "Implementing Redis in-memory lookup cache, cache invalidation schemes (TTL), and async queues using BullMQ.",
      x: "85%",
      y: "50%",
      prerequisites: ["be-orm"],
      resources: ["Redis Docs: Key-value operations", "BullMQ: Job queues & Redis broker"],
      masteryQuiz: [
        {
          question: "What is cache stampede (or thundering herd)?",
          options: [
            "When multiple API keys are compromised concurrently",
            "When a heavy cache key expires and multiple requests fetch database queries simultaneously",
            "When Redis server runs out of disk space",
            "When a database query triggers a recursion error"
          ],
          correctIndex: 1,
        },
        {
          question: "Which Redis data structure is ideal for representing a queue of task messages?",
          options: ["Strings", "Hashes", "Lists", "Sets"],
          correctIndex: 2,
        },
        {
          question: "What does TTL stand for in caching systems?",
          options: ["Time to Live", "Total Transfer Latency", "Transaction Trace Log", "Temporary Task Lock"],
          correctIndex: 0,
        }
      ]
    },
    {
      id: "be-scale",
      label: "System Design & Scaling",
      description: "Designing horizontal scalability, setting up rate limiters, reverse proxies (Nginx), and load balancers.",
      x: "65%",
      y: "80%",
      prerequisites: ["be-redis"],
      resources: ["System Design: Rate Limiting Algorithms", "Nginx: Load Balancing Configurations"],
      masteryQuiz: [
        {
          question: "Which rate-limiting algorithm handles bursty traffic while maintaining a steady average response rate?",
          options: ["Fixed Window Counter", "Sliding Window Log", "Token Bucket", "Leaky Bucket"],
          correctIndex: 2,
        },
        {
          question: "What is the primary difference between horizontal scaling and vertical scaling?",
          options: [
            "Vertical scaling adds more machines; horizontal scaling adds more CPU/RAM to a single machine",
            "Horizontal scaling adds more machines; vertical scaling adds more CPU/RAM to a single machine",
            "Horizontal scaling is only for SQL databases",
            "Vertical scaling is always serverless"
          ],
          correctIndex: 1,
        },
        {
          question: "What does a reverse proxy like Nginx do?",
          options: [
            "It intercepts backend server calls to databases",
            "It forwards incoming client HTTP requests to appropriate backend services",
            "It compiles TypeScript files on-the-fly",
            "It stores cookies inside the client browser"
          ],
          correctIndex: 1,
        }
      ]
    }
  ],
  AI: [
    {
      id: "ai-python",
      label: "Python Core & Pandas Data Science",
      description: "Data preparation, vector manipulation using NumPy, handling relational dataframes in Pandas, and basic linear algebra.",
      x: "15%",
      y: "20%",
      prerequisites: [],
      resources: ["Pandas Guide: DataFrame operations", "NumPy: Matrix calculations"],
      masteryQuiz: [
        {
          question: "In Pandas, which method returns the first N rows of a DataFrame?",
          options: ["df.first(N)", "df.head(N)", "df.slice(N)", "df.top(N)"],
          correctIndex: 1,
        },
        {
          question: "Which NumPy array operation performs element-wise multiplication of two arrays (a and b)?",
          options: ["a.dot(b)", "a * b", "np.matmul(a, b)", "a @ b"],
          correctIndex: 1,
        },
        {
          question: "What is the primary purpose of data normalization before feeding it to ML models?",
          options: [
            "To encrypt data fields",
            "To scale features to a common range (e.g. 0 to 1) to improve training stability",
            "To remove all null string rows",
            "To compress the file size"
          ],
          correctIndex: 1,
        }
      ]
    },
    {
      id: "ai-ml",
      label: "Supervised Learning Models",
      description: "Training linear regressions, random forests, SVMs with Scikit-learn, and computing evaluation metrics (F1-score, ROC-AUC).",
      x: "50%",
      y: "20%",
      prerequisites: ["ai-python"],
      resources: ["Scikit-learn: Regression vs Classification", "ML Metrics: Precision, Recall & F1"],
      masteryQuiz: [
        {
          question: "What metric is the harmonic mean of precision and recall?",
          options: ["Accuracy", "F1-Score", "Mean Absolute Error (MAE)", "R-squared"],
          correctIndex: 1,
        },
        {
          question: "In a Random Forest model, what does 'ensemble learning' refer to?",
          options: [
            "Using multiple neural network layers to extract features",
            "Combining predictions of multiple decision trees to form a robust prediction",
            "Compressing data matrices using PCA",
            "Deploying models to multiple servers simultaneously"
          ],
          correctIndex: 1,
        },
        {
          question: "What is over-fitting in machine learning?",
          options: [
            "When a model performs exceptionally on both training and test data",
            "When a model memorizes training noise and fails to generalize to unseen data",
            "When the model file size exceeds server disk limits",
            "When the learning rate is set to zero"
          ],
          correctIndex: 1,
        }
      ]
    },
    {
      id: "ai-dl",
      label: "Neural Networks & PyTorch",
      description: "Building custom neural layers, backward propagation, optimizing learning rates, and training classifiers with PyTorch.",
      x: "35%",
      y: "50%",
      prerequisites: ["ai-ml"],
      resources: ["PyTorch Tutorials: Custom Tensors", "Deep Learning: Backpropagation maths"],
      masteryQuiz: [
        {
          question: "What PyTorch function is called to compute the gradients during the backward pass?",
          options: ["loss.backward()", "optimizer.step()", "model.forward()", "gradients.compute()"],
          correctIndex: 0,
        },
        {
          question: "Which activation function is commonly used to introduce non-linearity and maps values from negative to zero, and positive to themselves?",
          options: ["Sigmoid", "Tanh", "ReLU", "Softmax"],
          correctIndex: 2,
        },
        {
          question: "What is the purpose of the optimizer.zero_grad() call in PyTorch training loops?",
          options: [
            "It deletes the training model weights",
            "It clears the gradients of all optimized parameters from the previous batch to prevent accumulation",
            "It resets the learning rate back to its original value",
            "It logs loss values to the tensorboard dashboard"
          ],
          correctIndex: 1,
        }
      ]
    },
    {
      id: "ai-nlp",
      label: "Transformer Models & Fine-tuning",
      description: "Fine-tuning pre-trained models using HuggingFace Transformers, text tokenization, and attention mechanics.",
      x: "15%",
      y: "80%",
      prerequisites: ["ai-dl"],
      resources: ["Hugging Face: Fine-tuning BERT/GPT", "Illustrated Transformer: Attention layer"],
      masteryQuiz: [
        {
          question: "What core mechanism inside Transformer architectures allows modeling dependencies regardless of distance in text?",
          options: ["Recurrent neural networks", "Convolutional kernels", "Self-Attention", "Gradient clipping"],
          correctIndex: 2,
        },
        {
          question: "What does tokenization do in NLP pipelines?",
          options: [
            "It encrypts text for database security",
            "It breaks text inputs into words, sub-words, or character units (tokens) for embedding lookup",
            "It translates text from one language to another",
            "It parses syntax rules of python code"
          ],
          correctIndex: 1,
        },
        {
          question: "Which library is the industry standard for loading and fine-tuning open-source models (like LLaMA or BERT)?",
          options: ["TensorFlow Extended", "Hugging Face Transformers", "OpenAI SDK", "SciPy"],
          correctIndex: 1,
        }
      ]
    },
    {
      id: "ai-agents",
      label: "LangChain AI Agents & RAG",
      description: "Vector databases (Chroma/Pinecone), semantic searches, building custom tools for agents, and Retrieval-Augmented Generation (RAG).",
      x: "85%",
      y: "50%",
      prerequisites: ["ai-dl"],
      resources: ["Pinecone Docs: Vector embeddings & search", "LangChain: Tool binding patterns"],
      masteryQuiz: [
        {
          question: "What is the primary objective of Retrieval-Augmented Generation (RAG)?",
          options: [
            "To speed up the inference speed of transformers",
            "To retrieve external documents and inject them into the LLM context to ground predictions and reduce hallucinations",
            "To auto-generate unit tests for React applications",
            "To fine-tune LLMs on consumer GPUs"
          ],
          correctIndex: 1,
        },
        {
          question: "What is a vector embedding?",
          options: [
            "A compressed zip file of text databases",
            "A mathematical representation of semantic meaning expressed as a high-dimensional vector",
            "A database index column",
            "An array of string tokens"
          ],
          correctIndex: 1,
        },
        {
          question: "In LangChain, what is a 'tool'?",
          options: [
            "An IDE extensions for coding AI agents",
            "A Python function or external API description that an agent can decide to call to solve a task",
            "A neural network optimizer",
            "A prompt template placeholder"
          ],
          correctIndex: 1,
        }
      ]
    },
    {
      id: "ai-deploy",
      label: "LLM Operations & Scaling",
      description: "Serving models with vLLM, optimizing latency (quantization), and scaling model routing frameworks.",
      x: "65%",
      y: "80%",
      prerequisites: ["ai-agents"],
      resources: ["vLLM: Continuous batching configurations", "Hugging Face: Quantization algorithms (AWQ/GPTQ)"],
      masteryQuiz: [
        {
          question: "What does LLM quantization accomplish?",
          options: [
            "It reduces memory footprints by converting model weights from high-precision floats to lower precision (e.g. float16 to int4/int8)",
            "It increases the vocabulary limit of model parameters",
            "It translates text prompts into mathematical formulas",
            "It increases LLM training speed"
          ],
          correctIndex: 0,
        },
        {
          question: "What routing technique optimizes throughput by grouping incoming text generation tokens dynamically?",
          options: ["Static batching", "Continuous Batching", "PageAttention routing", "Greedy decoding"],
          correctIndex: 1,
        },
        {
          question: "Which serving library is widely used to run LLM backends with high-throughput vLLM engine support?",
          options: ["FastAPI standard router", "vLLM", "Gunicorn server", "Docker registry"],
          correctIndex: 1,
        }
      ]
    }
  ]
};

export const Route = createFileRoute("/features/roadmap")({
  component: RoadmapGenerator,
});

function RoadmapGenerator() {
  const { analysisResult, setAnalysisResult } = useResume();
  const [career, setCareer] = useState("Frontend");
  const [viewMode, setViewMode] = useState<"list" | "rpg">("rpg"); // default to rpg for impressive loading!

  // Game/mastery state
  const [masteredNodes, setMasteredNodes] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("skillsync_rpg_mastery");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {}
      }
    }
    // Default mastered: first 2 nodes of each path
    return ["fe-html-css", "fe-js", "be-express", "be-sql", "ai-python", "ai-ml"];
  });

  const [activeNode, setActiveNode] = useState<SkillNode | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFailed, setQuizFailed] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

  // Sync mastered status to local storage
  useEffect(() => {
    localStorage.setItem("skillsync_rpg_mastery", JSON.stringify(masteredNodes));
  }, [masteredNodes]);

  // Determine current active career category from context role or dropdown state
  const activeCareerGroup = (() => {
    if (!analysisResult) return career;
    const role = analysisResult.role.toLowerCase();
    if (role.includes("backend") || role.includes("node") || role.includes("python") && !role.includes("ai")) return "Backend";
    if (role.includes("ai") || role.includes("ml") || role.includes("intelligence") || role.includes("data scientist")) return "AI";
    return "Frontend";
  })();

  const currentNodes = rpgSkillsData[activeCareerGroup as keyof typeof rpgSkillsData] || rpgSkillsData.Frontend;

  const getStatus = (node: SkillNode) => {
    if (masteredNodes.includes(node.id)) return "mastered";
    const meetsPrereqs = node.prerequisites.every((prereq) => masteredNodes.includes(prereq));
    return meetsPrereqs ? "available" : "locked";
  };

  const handleNodeClick = (node: SkillNode) => {
    const status = getStatus(node);
    if (status === "locked") {
      toast.error(`Skill node locked! Complete its prerequisites first.`);
      return;
    }
    setActiveNode(node);
    setQuizStarted(false);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setQuizFailed(false);
    setQuizFinished(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const submitAnswer = () => {
    if (selectedOption === null || !activeNode) return;

    const isCorrect = selectedOption === activeNode.masteryQuiz[currentQuestionIdx].correctIndex;
    if (!isCorrect) {
      setQuizFailed(true);
      return;
    }

    if (currentQuestionIdx + 1 < activeNode.masteryQuiz.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Finished and passed!
      setQuizFinished(true);
      if (!masteredNodes.includes(activeNode.id)) {
        const newMastered = [...masteredNodes, activeNode.id];
        setMasteredNodes(newMastered);
        
        // Dynamic impact on Career Readiness Score
        if (analysisResult) {
          const currentScore = analysisResult.careerReadiness || 72;
          const updatedScore = Math.min(100, currentScore + 6);
          setAnalysisResult({
            ...analysisResult,
            careerReadiness: updatedScore,
          });
        }
        
        setShowUnlockAnimation(true);
        toast.success(`Congratulations! Unlocked ${activeNode.label} mastery!`);
      }
    }
  };

  const resetMasteryProgress = () => {
    const defaultMastered = ["fe-html-css", "fe-js", "be-express", "be-sql", "ai-python", "ai-ml"];
    setMasteredNodes(defaultMastered);
    toast.success("RPG Tree mastery progress reset successfully.");
  };

  const roadmaps = {
    Frontend: [
      {
        month: "Month 1",
        title: "HTML, CSS & JavaScript",
        status: "current",
        tasks: [
          { title: "Master HTML & CSS Fundamentals", type: "course", icon: PlayCircle },
          { title: "Build Portfolio Website", type: "project", icon: Code2 },
        ],
      },
      {
        month: "Month 2",
        title: "React & TailwindCSS",
        status: "upcoming",
        tasks: [
          { title: "Learn React Hooks & Routing", type: "course", icon: PlayCircle },
          { title: "Build a Task Management App", type: "project", icon: Code2 },
        ],
      },
      {
        month: "Month 3",
        title: "Advanced Frontend & Deployment",
        status: "upcoming",
        tasks: [
          { title: "Master Next.js App Router", type: "course", icon: PlayCircle },
          { title: "Deploy Portfolio with CI/CD on Vercel", type: "project", icon: Code2 },
        ],
      },
    ],

    Backend: [
      {
        month: "Month 1",
        title: "Node.js & Express",
        status: "current",
        tasks: [
          { title: "Learn Express.js & Middleware", type: "course", icon: PlayCircle },
          { title: "Build REST API for Book Store", type: "project", icon: Code2 },
        ],
      },
      {
        month: "Month 2",
        title: "Databases & ORMs",
        status: "upcoming",
        tasks: [
          { title: "SQL vs NoSQL (PostgreSQL & MongoDB)", type: "course", icon: PlayCircle },
          { title: "Implement Auth using Prisma & JWT", type: "project", icon: Code2 },
        ],
      },
      {
        month: "Month 3",
        title: "Deployment & Containers",
        status: "upcoming",
        tasks: [
          { title: "Docker Containerization", type: "course", icon: Award },
          { title: "Deploy API to AWS ECS", type: "project", icon: Code2 },
        ],
      },
    ],

    AI: [
      {
        month: "Month 1",
        title: "Python & Machine Learning",
        status: "current",
        tasks: [
          { title: "Learn Python & NumPy / Pandas", type: "course", icon: PlayCircle },
          { title: "Build ML Model for Salary Prediction", type: "project", icon: Code2 },
        ],
      },
      {
        month: "Month 2",
        title: "Deep Learning & NLP",
        status: "upcoming",
        tasks: [
          { title: "Neural Networks with PyTorch", type: "course", icon: PlayCircle },
          { title: "Fine-tune LLM for Text Analysis", type: "project", icon: Code2 },
        ],
      },
      {
        month: "Month 3",
        title: "AI Agent Implementation",
        status: "upcoming",
        tasks: [
          { title: "LangChain AI Agents & RAG", type: "course", icon: Award },
          { title: "Build RAG Chatbot with VectorDB", type: "project", icon: Code2 },
        ],
      },
    ],
  };

  const roadmapMonths = analysisResult
    ? analysisResult.roadmap.map((phase) => ({
        month: phase.month,
        title: phase.title,
        status: phase.status,
        tasks: phase.tasks.map((task) => ({
          title: task.title,
          type: task.type,
          icon: iconMap[task.iconName] || PlayCircle,
        })),
      }))
    : roadmaps[career as keyof typeof roadmaps];

  const targetRoleName = analysisResult ? analysisResult.role : "Senior Full Stack Engineer";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      
      {/* Background radial overlays */}
      <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute left-0 bottom-0 -z-10 h-[600px] w-[600px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />

      <main className="container mx-auto px-4 pt-28 pb-20 relative">
        {/* Demo Mode alert banner */}
        {!analysisResult && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-5 rounded-2xl border border-orange-200 bg-orange-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-orange-500 animate-pulse" />
              <div className="text-left">
                <h4 className="font-semibold text-slate-800">Viewing Standard Path</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload your resume in the Resume Analyzer to generate a custom step-by-step career tree!
                </p>
              </div>
            </div>
            <Link to="/features/resume-analyzer">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium">
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
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20 text-orange-650 mb-4">
            <Map className="h-7 w-7 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Interactive Career Roadmap</h1>
          
          <p className="text-lg text-slate-500">
            Progress through your learning path for <span className="text-orange-600 font-semibold">{targetRoleName}</span>.
          </p>

          {!analysisResult && (
            <div className="flex justify-center gap-3 mt-5">
              {["Frontend", "Backend", "AI"].map((cat) => (
                <Button 
                  key={cat}
                  onClick={() => setCareer(cat)}
                  variant="outline"
                  className={career === cat ? "border-orange-500 bg-orange-50 text-orange-700 font-medium" : "border-slate-200 text-slate-600 hover:bg-slate-50"}
                >
                  {cat === "AI" ? "AI / Machine Learning" : cat}
                </Button>
              ))}
            </div>
          )}

          {/* VIEW SWITCHER TAB */}
          <div className="mt-8 inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("rpg")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                viewMode === "rpg" 
                  ? "bg-white text-orange-600 shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Gamepad2 className="h-4 w-4" />
              RPG Skill Tree (Quizzes & Unlocks)
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                viewMode === "list" 
                  ? "bg-white text-orange-600 shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Map className="h-4 w-4" />
              Standard Roadmap List
            </button>
          </div>
        </motion.div>

        {/* -------------------------------------------------------------------------- */}
        {/* VIEW 1: RPG SKILL TREE                                                     */}
        {/* -------------------------------------------------------------------------- */}
        <AnimatePresence mode="wait">
          {viewMode === "rpg" && (
            <motion.div
              key="rpg-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-6 flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-slate-700 text-sm font-medium">
                  <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                  <span>Interactive Node Mode active. Solve node quizzes to level up your career score.</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetMasteryProgress}
                  className="text-xs text-slate-500 hover:text-orange-600 font-semibold"
                >
                  Reset Tree Mastery
                </Button>
              </div>

              {/* RPG CANVAS WRAPPER */}
              <div className="relative w-full aspect-[4/3] max-w-4xl border border-slate-200 rounded-3xl bg-slate-50/50 p-6 overflow-hidden shadow-sm backdrop-blur-md">
                
                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  {currentNodes.map((node) => {
                    return node.prerequisites.map((prereqId) => {
                      const parentNode = currentNodes.find((n) => n.id === prereqId);
                      if (!parentNode) return null;

                      const startMastered = masteredNodes.includes(parentNode.id);
                      const endMastered = masteredNodes.includes(node.id);
                      const isCompleteLink = startMastered && endMastered;
                      const isUnlockedLink = startMastered && !endMastered;

                      return (
                        <motion.line
                          key={`${parentNode.id}-${node.id}`}
                          x1={parentNode.x}
                          y1={parentNode.y}
                          x2={node.x}
                          y2={node.y}
                          stroke={isCompleteLink ? "#f97316" : isUnlockedLink ? "#fdba74" : "#e2e8f0"}
                          strokeWidth={isCompleteLink ? "3" : "2"}
                          strokeDasharray={isUnlockedLink ? "5,5" : "none"}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.8 }}
                        />
                      );
                    });
                  })}
                </svg>

                {/* Nodes Interactive Layer */}
                <div className="absolute inset-0 w-full h-full z-10">
                  {currentNodes.map((node) => {
                    const status = getStatus(node);
                    
                    return (
                      <motion.div
                        key={node.id}
                        style={{ left: node.x, top: node.y }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                        whileHover={{ scale: 1.08 }}
                        onClick={() => handleNodeClick(node)}
                      >
                        {/* Pulse Ring for available nodes */}
                        {status === "available" && (
                          <div className="absolute inset-0 -m-3 rounded-full border border-orange-400 animate-ping opacity-75" />
                        )}

                        <div 
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md border ${
                            status === "mastered"
                              ? "bg-orange-500 border-orange-600 text-white shadow-orange-500/20"
                              : status === "available"
                              ? "bg-white border-orange-400 text-orange-600 shadow-orange-100"
                              : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          {status === "mastered" ? (
                            <Check className="w-6 h-6 stroke-[3px]" />
                          ) : status === "available" ? (
                            <Unlock className="w-5 h-5" />
                          ) : (
                            <Lock className="w-5 h-5" />
                          )}
                        </div>

                        {/* Label Overlay */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-16 bg-white border border-slate-200 py-1.5 px-3 rounded-xl shadow-md text-xs font-semibold text-slate-800 whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity">
                          {node.label}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Grid guidelines background layout */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40 -z-20" />
              </div>
            </motion.div>
          )}

          {/* -------------------------------------------------------------------------- */}
          {/* VIEW 2: STANDARD ROADMAP LIST                                              */}
          {/* -------------------------------------------------------------------------- */}
          {viewMode === "list" && (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="max-w-3xl mx-auto relative text-left"
            >
              <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-slate-200" />
              <div className="space-y-12">
                {roadmapMonths.map((month, index) => (
                  <motion.div
                    key={month.month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-24"
                  >
                    <div
                      className={`absolute left-6 top-1.5 h-5 w-5 rounded-full ring-4 ring-background z-10 flex items-center justify-center
                      ${month.status === "current" ? "bg-orange-500" : "bg-slate-200"}`}
                    >
                      {month.status === "current" && (
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                      )}
                    </div>

                    <div className="absolute left-0 top-1.5 text-sm font-semibold text-slate-400 w-16 text-right">
                      {month.month}
                    </div>

                    <Card className={`bg-white border-slate-200 shadow-sm ${month.status === "current" ? "ring-1 ring-orange-500/50" : ""}`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl flex justify-between items-center text-slate-800">
                          {month.title}
                          {month.status === "current" && (
                            <span className="text-xs bg-orange-500/10 text-orange-700 px-2.5 py-1 rounded-full font-semibold">
                              Current Focus
                            </span>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {month.tasks.map((task, tIndex) => (
                          <div
                            key={tIndex}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <task.icon className={`h-5 w-5 ${task.type === "project" ? "text-orange-600" : "text-amber-600"}`} />
                              <span className="text-sm font-medium text-slate-700">{task.title}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 hover:bg-orange-500/10 hover:text-orange-700 text-slate-600 font-semibold"
                              onClick={() => alert(`Launching: "${task.title}"`)}
                            >
                              Launch
                            </Button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* -------------------------------------------------------------------------- */}
        {/* NODE DETAIL & MASTERY QUIZ DIALOG OVERLAY                                  */}
        {/* -------------------------------------------------------------------------- */}
        <AnimatePresence>
          {activeNode && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden relative text-left"
              >
                
                {/* Header Decoration */}
                <div className="h-3 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 w-full" />
                
                <div className="p-6">
                  {/* Title and stats */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                        {masteredNodes.includes(activeNode.id) ? "Mastered Node" : "Unlocked Challenge"}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-800 mt-2">{activeNode.label}</h3>
                    </div>
                    <button 
                      onClick={() => setActiveNode(null)}
                      className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Node Content / Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    {activeNode.description}
                  </p>

                  {/* Standard details if quiz NOT started */}
                  {!quizStarted && !quizFinished && (
                    <div className="space-y-4">
                      {/* Learning resources */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2 mb-2">
                          <BookOpen className="h-4 w-4 text-orange-500" />
                          Recommended Learning resources
                        </h4>
                        <ul className="space-y-1.5">
                          {activeNode.resources.map((res, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                              <ChevronRight className="h-3 w-3 text-orange-500" />
                              <span>{res}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Unlock info */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="text-xs text-slate-500 font-medium">
                          🏆 Reward: <strong className="text-slate-800">+6% Career Readiness Score</strong>
                        </div>
                        <Button 
                          onClick={startQuiz}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl flex items-center gap-1.5"
                        >
                          <Gamepad2 className="h-4 w-4" />
                          Start Skill Challenge
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Quiz layout */}
                  {quizStarted && !quizFinished && !quizFailed && (
                    <div className="space-y-5">
                      {/* Progress tracker */}
                      <div className="flex justify-between items-center text-xs text-slate-500 font-semibold mb-2">
                        <span>QUESTION {currentQuestionIdx + 1} OF {activeNode.masteryQuiz.length}</span>
                        <span>{Math.round(((currentQuestionIdx) / activeNode.masteryQuiz.length) * 100)}% Complete</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200/50">
                        <div 
                          className="h-full bg-orange-500 transition-all duration-300" 
                          style={{ width: `${((currentQuestionIdx) / activeNode.masteryQuiz.length) * 100}%` }}
                        />
                      </div>

                      {/* Question */}
                      <p className="text-md font-semibold text-slate-800 leading-snug">
                        {activeNode.masteryQuiz[currentQuestionIdx].question}
                      </p>

                      {/* Options */}
                      <div className="space-y-2">
                        {activeNode.masteryQuiz[currentQuestionIdx].options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedOption(i)}
                            className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all ${
                              selectedOption === i 
                                ? "bg-orange-50 border-orange-400 text-orange-700 ring-1 ring-orange-400" 
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span className="inline-block w-6 h-6 rounded-lg bg-slate-100 text-slate-500 text-center font-bold mr-3 leading-6">
                              {String.fromCharCode(65 + i)}
                            </span>
                            {opt}
                          </button>
                        ))}
                      </div>

                      {/* Controls */}
                      <div className="flex justify-end pt-3 border-t border-slate-100">
                        <Button
                          onClick={submitAnswer}
                          disabled={selectedOption === null}
                          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl font-medium"
                        >
                          Submit Answer
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Quiz Fail Screen */}
                  {quizFailed && (
                    <div className="text-center py-6 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto border border-red-100 shadow-sm">
                        ✕
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">Incorrect Answer</h4>
                        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                          Challenge failed. Re-read the resources and try again to master this skill node!
                        </p>
                      </div>
                      <div className="flex gap-3 justify-center pt-2">
                        <Button 
                          onClick={() => {
                            setQuizFailed(false);
                            setSelectedOption(null);
                          }} 
                          className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl"
                        >
                          Try Again
                        </Button>
                        <Button 
                          onClick={() => setActiveNode(null)} 
                          variant="outline" 
                          className="border-slate-200 text-slate-700 rounded-xl"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Quiz Success Screen */}
                  {quizFinished && (
                    <div className="text-center py-6 space-y-4 relative">
                      {/* Floating sparkles animation overlay */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-40 h-40 border border-orange-500/10 rounded-full absolute"
                        />
                      </div>

                      <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto border border-green-100 shadow-sm relative z-10">
                        <Trophy className="h-8 w-8 text-orange-500" />
                      </div>
                      <div className="relative z-10">
                        <h4 className="text-xl font-bold text-slate-800">Node Mastered!</h4>
                        <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                          You answered all questions correctly and unlocked <strong>{activeNode.label}</strong>!
                        </p>
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">
                          <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                          +6% Career Readiness Score Added!
                        </div>
                      </div>
                      <div className="pt-4 flex justify-center z-10 relative">
                        <Button 
                          onClick={() => setActiveNode(null)}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl"
                        >
                          Close Challenge
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
      <Footer />
    </div>
  );
}