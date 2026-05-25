import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import crypto from "crypto";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";

dotenv.config();


const app = express();
const PORT = 3000;

app.use(express.json());

// Resolve visual path elements
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini SDK with telemetry header
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Initialize Firestore Database Server-side
let firestoreDb: any = null;
try {
  const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(firebaseConfigPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
    const firebaseApp = initializeApp(firebaseConfig);
    firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    console.log("Firebase App & Firestore successfully initialized in server.ts!");
  } else {
    console.warn("firebase-applet-config.json not found. Running in localized in-memory mode.");
  }
} catch (err) {
  console.error("Failed to initialize Firebase in server.ts:", err);
}

// Global In-Memory Store
const port: Record<string, string> = {}; // session IDs / users
const db = {
  users: [
    {
      id: "usr-1",
      email: "kattikoustubh22@gmail.com",
      name: "Koustubh Katti",
      role: "admin",
      plan: "premium",
      portfolioCount: 2,
      aiUsageCount: 4,
    },
    {
      id: "usr-2",
      email: "jane.doe@example.com",
      name: "Jane Doe",
      role: "user",
      plan: "free",
      portfolioCount: 1,
      aiUsageCount: 2,
    },
    {
      id: "usr-3",
      email: "recruiter@hiringtech.io",
      name: "Sarah recruiter",
      role: "recruiter",
      plan: "free",
      portfolioCount: 0,
      aiUsageCount: 0,
    }
  ],
  portfolios: [
    {
      id: "port-1",
      userId: "usr-1",
      title: "My Cyberpunk Lab",
      templateId: "cyberpunk",
      accentColor: "#ec4899",
      isPublished: true,
      slug: "neon-coder",
      personalInfo: {
        name: "Devon Hacker",
        title: "Senior Cyber Security Engineer & Web3 Architect",
        bio: "Decentralized systems specialist exploring Rust, zero-knowledge proofs, and glowing visual state terminals.",
        email: "devon@hacker.io",
        location: "Neo-Tokyo Synth District",
        linkedin: "linkedin.com/in/cyberpunk-devon",
        github: "github.com/neonhacker",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        headline: "Synthesizing secure code across modern multi-agent dimensions."
      },
      skills: ["Rust", "TypeScript", "Solidity", "Tailwind CSS", "Docker", "WASM", "Gemini LLM"],
      projects: [
        {
          id: "p-1",
          name: "AetherNet Node Scanner",
          description: "Real-time P2P overlay monitor with integrated visualization and intrusion intelligence mapping.",
          url: "https://github.com/neonhacker/aethernet",
          technologies: ["Rust", "WASM", "WebRTC"],
          image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: "p-2",
          name: "Spectral Theme Compiler",
          description: "Visual compiler turning code tokens into hot cyberpunk custom gradient vectors.",
          url: "https://github.com/neonhacker/spectral",
          technologies: ["TypeScript", "Tailwind", "Canvas"],
          image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80"
        }
      ],
      experience: [
        {
          id: "exp-1",
          company: "Nexus Grid Corp",
          role: "Lead Systems Security Lead",
          duration: "2024 - Present",
          description: "Secured decentralized microservices processing over $12M daily. Automated telemetry pipelines."
        },
        {
          id: "exp-2",
          company: "SynthLabs Tech",
          role: "Frontend Engineer",
          duration: "2022 - 2024",
          description: "Crafted cyberpunk styled visual telemetry tools using WebGL, React, and high-performance physics loops."
        }
      ],
      certifications: [
        {
          id: "cert-1",
          title: "Certified Kubernetes Administrator (CKA)",
          issuer: "Cloud Native Computing Foundation",
          date: "2024",
          url: "https://cncf.io"
        }
      ],
      testimonials: [
        {
          id: "test-1",
          clientName: "Aria Thorne",
          role: "CTO, HoloSystems",
          text: "Devon built a visual telemetry bridge that compressed client feedback latency by 45%. Outstanding design execution.",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
        }
      ],
      customDomain: "matrix.hacker.io"
    },
    {
      id: "port-2",
      userId: "usr-2",
      title: "Jane Creative Portfolio",
      templateId: "glassmorphism",
      accentColor: "#6366f1",
      isPublished: true,
      slug: "jane-designs",
      personalInfo: {
        name: "Jane Doe",
        title: "Product Designer & UI Engineer",
        bio: "Designing micro-interactions and high-fidelity layouts using generative design theories.",
        email: "jane.doe@example.com",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/janedoe",
        github: "github.com/janedoe",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        headline: "Designing soft elegant software boundaries for complex micro-data."
      },
      skills: ["Figma", "React", "CSS Variables", "Framer Motion", "Tailwind", "UX Analytics", "AI Styling"],
      projects: [
        {
          id: "p-3",
          name: "Sienna Air Quality Hub",
          description: "A soft, semi-transparent frosted layout showing weather details with fluid SVG particles.",
          url: "https://github.com/janedoe/sienna",
          technologies: ["React", "Glassmorphism", "SVG"],
          image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=400&q=80"
        }
      ],
      experience: [
        {
          id: "exp-3",
          company: "Florentine studio",
          role: "Senior UX Specialist",
          duration: "2023 - Present",
          description: "Spearheaded design transition to modern glass aesthetics, increasing active retention metrics by 18%."
        }
      ],
      certifications: [
        {
          id: "cert-2",
          title: "Intuit Certified Interactive Designer",
          issuer: "Intuit UX League",
          date: "2023"
        }
      ],
      testimonials: [
        {
          id: "test-2",
          clientName: "Marcus Vance",
          role: "Creative Director",
          text: "Jane brings an elite sense of negative space and typographic structure. Her code is clean, responsive, and easily testable.",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
        }
      ]
    },
    {
      id: "port-3",
      userId: "usr-1",
      title: "Lead Developer Profile",
      templateId: "professional",
      accentColor: "#2563eb",
      isPublished: true,
      slug: "koustubh-katti",
      personalInfo: {
        name: "Koustubh Katti",
        title: "Principal Cloud Architect & AI Strategist",
        bio: "Veteran full-stack engineer and tech founder building scalable cloud architectures, AI pipelines, and responsive SaaS products.",
        email: "kattikoustubh22@gmail.com",
        location: "Bangalore, India",
        linkedin: "linkedin.com/in/koustubh-katti",
        github: "github.com/koustubh",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        headline: "Enterprise-grade scalable systems paired with modern intelligence pipelines."
      },
      skills: ["Node.js", "Express", "React", "TypeScript", "Docker", "AWS", "Gemini API", "Recharts", "SaaS Engineering"],
      projects: [
        {
          id: "p-4",
          name: "SaaS Deployment Engine",
          description: "Automated provisioning tool for serverless nodes, featuring dynamic scaling and billing integration.",
          url: "https://github.com/koustubh/saas-deploy",
          technologies: ["Node.js", "AWS", "TypeScript"],
          image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80"
        }
      ],
      experience: [
        {
          id: "exp-4",
          company: "Enterprise AI Solutions",
          role: "Director of Engineering",
          duration: "2024 - Present",
          description: "Overseeing design and operations for enterprise SaaS platforms serving 250,000 active monthly workers."
        }
      ],
      certifications: [
        {
          id: "cert-3",
          title: "AWS Certified Solutions Architect – Professional",
          issuer: "Amazon Web Services",
          date: "2024"
        }
      ],
      testimonials: [
        {
          id: "test-3",
          clientName: "David Lee",
          role: "CEO, TechLaunch",
          text: "Koustubh builds server architectures that scale elegantly under unexpected load. His technical leadership was key to our series-B platform migration.",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
        }
      ]
    }
  ],
  analytics: [
    {
      portfolioId: "port-1",
      views: 1240,
      uniqueVisitors: 840,
      recruiterViews: 320,
      resumeDownloads: 145,
      projectClicks: { "p-1": 180, "p-2": 110 } as Record<string, number>,
      devices: { mobile: 520, desktop: 610, tablet: 110 },
      locations: [
        { country: "United States", count: 420 },
        { country: "Japan", count: 320 },
        { country: "Germany", count: 180 },
        { country: "India", count: 120 }
      ],
      weeklyViews: [
        { day: "Mon", count: 150 },
        { day: "Tue", count: 180 },
        { day: "Wed", count: 240 },
        { day: "Thu", count: 190 },
        { day: "Fri", count: 220 },
        { day: "Sat", count: 140 },
        { day: "Sun", count: 120 }
      ]
    },
    {
      portfolioId: "port-2",
      views: 750,
      uniqueVisitors: 410,
      recruiterViews: 120,
      resumeDownloads: 68,
      projectClicks: { "p-3": 95 } as Record<string, number>,
      devices: { mobile: 280, desktop: 410, tablet: 60 },
      locations: [
        { country: "United States", count: 310 },
        { country: "Canada", count: 100 }
      ],
      weeklyViews: [
        { day: "Mon", count: 80 },
        { day: "Tue", count: 95 },
        { day: "Wed", count: 110 },
        { day: "Thu", count: 130 },
        { day: "Fri", count: 120 },
        { day: "Sat", count: 85 },
        { day: "Sun", count: 130 }
      ]
    },
    {
      portfolioId: "port-3",
      views: 1950,
      uniqueVisitors: 1120,
      recruiterViews: 650,
      resumeDownloads: 240,
      projectClicks: { "p-4": 310 } as Record<string, number>,
      devices: { mobile: 680, desktop: 1120, tablet: 150 },
      locations: [
        { country: "India", count: 830 },
        { country: "United States", count: 620 },
        { country: "United Kingdom", count: 210 },
        { country: "Singapore", count: 110 }
      ],
      weeklyViews: [
        { day: "Mon", count: 210 },
        { day: "Tue", count: 280 },
        { day: "Wed", count: 310 },
        { day: "Thu", count: 290 },
        { day: "Fri", count: 340 },
        { day: "Sat", count: 145 },
        { day: "Sun", count: 175 }
      ]
    }
  ],
  bookmarks: [] as Array<{ recruiterId: string; portfolioId: string }>
};

// HELPER: Track or create analytics automatically
function ensureAnalyticsExists(portfolioId: string) {
  let item = db.analytics.find(a => a.portfolioId === portfolioId);
  if (!item) {
    item = {
      portfolioId,
      views: 0,
      uniqueVisitors: 0,
      recruiterViews: 0,
      resumeDownloads: 0,
      projectClicks: {},
      devices: { mobile: 0, desktop: 0, tablet: 0 },
      locations: [{ country: "Global", count: 1 }],
      weeklyViews: [
        { day: "Mon", count: 0 },
        { day: "Tue", count: 0 },
        { day: "Wed", count: 0 },
        { day: "Thu", count: 0 },
        { day: "Fri", count: 0 },
        { day: "Sat", count: 0 },
        { day: "Sun", count: 0 }
      ]
    };
    db.analytics.push(item);
  }
  return item;
}

// REST API DEFINITIONS

// Auth endpoints
app.post("/api/auth/register", async (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing registration fields" });
  }
  if (db.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: "Email is already registered" });
  }

  const isKoustubh = email.toLowerCase() === "kattikoustubh22@gmail.com";
  const newUser = {
    id: `usr-${Date.now()}`,
    email,
    name,
    role: (isKoustubh ? "admin" : (role === "recruiter" ? "recruiter" : "user")) as 'user' | 'recruiter' | 'admin',
    plan: (isKoustubh ? "premium" : "free") as 'free' | 'student_pro' | 'premium' | 'lifetime',
    portfolioCount: 0,
    aiUsageCount: 0
  };

  db.users.push(newUser);

  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, "users", newUser.id), newUser);
    } catch (err) {
      console.error("Firestore sync error in /api/auth/register:", err);
    }
  }

  res.status(201).json({ user: newUser, token: `mock-token-${newUser.id}` });
});

app.post("/api/auth/google", async (req, res) => {
  const { email, name, uid, role } = req.body;
  if (!email || !uid) {
    return res.status(400).json({ error: "Missing Google authentication parameters" });
  }

  let user = db.users.find(u => u.id === uid || u.email.toLowerCase() === email.toLowerCase());
  const isKoustubh = email.toLowerCase() === "kattikoustubh22@gmail.com";

  if (!user) {
    user = {
      id: uid,
      email,
      name: name || "Google User",
      role: (isKoustubh ? "admin" : (role === "recruiter" ? "recruiter" : "user")) as 'user' | 'recruiter' | 'admin',
      plan: (isKoustubh ? "premium" : "free") as 'free' | 'student_pro' | 'premium' | 'lifetime',
      portfolioCount: 0,
      aiUsageCount: 0
    };
    db.users.push(user);
    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "users", user.id), user);
      } catch (err) {
        console.error("Firestore sync error in /api/auth/google creation:", err);
      }
    }
  } else {
    // Sync the user ID to the Google UID if different (important for direct client Firestore ownership match!)
    if (user.id !== uid) {
      db.portfolios.forEach(p => {
        if (p.userId === user.id) {
          p.userId = uid;
          if (firestoreDb) {
            setDoc(doc(firestoreDb, "portfolios", p.id), p).catch(console.error);
          }
        }
      });

      if (firestoreDb) {
        try {
          await deleteDoc(doc(firestoreDb, "users", user.id));
        } catch (err) {
          console.error("Firestore delete error for legacy user doc:", err);
        }
      }

      user.id = uid;
      if (firestoreDb) {
        try {
          await setDoc(doc(firestoreDb, "users", uid), user);
        } catch (err) {
          console.error("Firestore re-saving synced user error:", err);
        }
      }
    }
  }

  res.json({ user, token: `mock-token-${user.id}` });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: "Invalid login credentials" });
  }
  // Simplified logic
  res.json({ user, token: `mock-token-${user.id}` });
});

app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  const user = db.users.find(u => u.email.toLowerCase() === email?.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "Email address not found" });
  }
  res.json({ success: true, message: "A recovery OTP has been generated & simulated successfully!" });
});

// Portfolios API
app.get("/api/portfolios", (req, res) => {
  const token = req.headers.authorization;
  const userId = token?.replace("Bearer mock-token-", "");
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  const userPortfolios = db.portfolios.filter(p => p.userId === userId);
  res.json(userPortfolios);
});

// Grab public portfolio route by slug (for micro websites!)
app.get("/api/portfolios/slug/:slug", (req, res) => {
  const { slug } = req.params;
  const portfolio = db.portfolios.find(p => p.slug === slug && p.isPublished);
  if (!portfolio) {
    return res.status(404).json({ error: "Published portfolio not found with this slug link" });
  }
  res.json(portfolio);
});

// Save or Create Portfolio
app.post("/api/portfolios", async (req, res) => {
  const token = req.headers.authorization;
  const userId = token?.replace("Bearer mock-token-", "");
  if (!userId) {
    return res.status(401).json({ error: "Unauthenticated user request" });
  }

  const data = req.body;
  const user = db.users.find(u => u.id === userId);

  // Plan limits constraints checks
  if (!data.id) {
    const existingCount = db.portfolios.filter(p => p.userId === userId).length;
    if (user) {
      if (user.plan === "free" && existingCount >= 1) {
        return res.status(403).json({ error: "Free account limit reached (max 1 portfolio). Upgrade to Student Pro, Premium, or Lifetime for more!" });
      }
      if (user.plan === "student_pro" && existingCount >= 3) {
        return res.status(403).json({ error: "Student Pro account limit reached (max 3 portfolios). Upgrade to Premium or Lifetime for unlimited creations!" });
      }
    }
  }

  const newId = data.id || `port-${Date.now()}`;
  const slug = data.slug || `site-${Date.now().toString().slice(-5)}`;

  const existingIndex = db.portfolios.findIndex(p => p.id === newId);
  const updatedPortfolio = {
    id: newId,
    userId,
    title: data.title || "My Portfolio Web",
    templateId: data.templateId || "minimal",
    accentColor: data.accentColor || "#3b82f6",
    isPublished: data.isPublished !== undefined ? data.isPublished : true,
    slug,
    personalInfo: {
      name: data.personalInfo?.name || "My Name",
      title: data.personalInfo?.title || "My Title",
      bio: data.personalInfo?.bio || "An detailed bio about myself.",
      email: data.personalInfo?.email || "",
      location: data.personalInfo?.location || "",
      linkedin: data.personalInfo?.linkedin || "",
      github: data.personalInfo?.github || "",
      avatar: data.personalInfo?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      headline: data.personalInfo?.headline || ""
    },
    skills: Array.isArray(data.skills) ? data.skills : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    experience: Array.isArray(data.experience) ? data.experience : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
    testimonials: Array.isArray(data.testimonials) ? data.testimonials : [],
    customDomain: data.customDomain || ""
  };

  if (existingIndex > -1) {
    db.portfolios[existingIndex] = updatedPortfolio;
  } else {
    db.portfolios.push(updatedPortfolio);
    if (user) user.portfolioCount = (user.portfolioCount || 0) + 1;
  }

  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, "portfolios", updatedPortfolio.id), updatedPortfolio);
      if (user) {
        await setDoc(doc(firestoreDb, "users", user.id), user);
      }
    } catch (err) {
      console.error("Firestore sync error on portfolio save:", err);
    }
  }

  ensureAnalyticsExists(newId);
  res.json(updatedPortfolio);
});

// Delete portfolio
app.delete("/api/portfolios/:id", async (req, res) => {
  const token = req.headers.authorization;
  const userId = token?.replace("Bearer mock-token-", "");
  if (!userId) return res.status(401).json({ error: "Access denied" });

  const { id } = req.params;
  const index = db.portfolios.findIndex(p => p.id === id && p.userId === userId);
  if (index === -1) {
    return res.status(404).json({ error: "Portfolio not owned by user or missing value" });
  }

  db.portfolios.splice(index, 1);
  const user = db.users.find(u => u.id === userId);
  if (user && user.portfolioCount > 0) user.portfolioCount -= 1;

  if (firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, "portfolios", id));
      if (user) {
        await setDoc(doc(firestoreDb, "users", user.id), user);
      }
    } catch (err) {
      console.error("Firestore sync error on portfolio delete:", err);
    }
  }

  res.json({ success: true, message: "Successfully deleted portfolio" });
});

// Update Domain for Premium
app.post("/api/portfolios/:id/domain", async (req, res) => {
  const token = req.headers.authorization;
  const userId = token?.replace("Bearer mock-token-", "");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const user = db.users.find(u => u.id === userId);
  if (!user || user.plan === "free") {
    return res.status(403).json({ error: "Custom domains is restricted to premium subscription plan tiers (Student Pro, Premium or Lifetime)." });
  }

  const { id } = req.params;
  const { customDomain } = req.body;
  const portfolio = db.portfolios.find(p => p.id === id && p.userId === userId);
  if (!portfolio) return res.status(404).json({ error: "Portfolio not found" });

  portfolio.customDomain = customDomain;

  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, "portfolios", id), portfolio);
    } catch (err) {
      console.error("Firestore sync error on domain set:", err);
    }
  }

  res.json({ success: true, customDomain });
});

// Get Analytics
app.get("/api/analytics/:portfolioId", (req, res) => {
  const { portfolioId } = req.params;
  const analysis = ensureAnalyticsExists(portfolioId);
  res.json(analysis);
});

// Track stats increment (simulated when viewing someone's page or downloading)
app.post("/api/analytics/:portfolioId/track", (req, res) => {
  const { portfolioId } = req.params;
  const { type, projectId, isRecruiter } = req.body; // type: 'view' | 'download' | 'click'
  const analysis = ensureAnalyticsExists(portfolioId);

  if (type === 'view') {
    analysis.views += 1;
    if (Math.random() > 0.3) analysis.uniqueVisitors += 1;
    if (isRecruiter) analysis.recruiterViews += 1;
    
    // Choose randomly mobile or desktop
    if (Math.random() > 0.5) {
      analysis.devices.desktop += 1;
    } else {
      analysis.devices.mobile += 1;
    }
  } else if (type === 'download') {
    analysis.resumeDownloads += 1;
  } else if (type === 'click' && projectId) {
    analysis.projectClicks[projectId] = (analysis.projectClicks[projectId] || 0) + 1;
  }

  res.json({ success: true, analysis });
});

// Subscriptions upgraded
app.post("/api/subs/upgrade", async (req, res) => {
  const token = req.headers.authorization;
  const userId = token?.replace("Bearer mock-token-", "");
  if (!userId) return res.status(401).json({ error: "Unauthorized access" });

  const user = db.users.find(u => u.id === userId);
  if (user) {
    const { plan } = req.body;
    const validatedPlan = (plan === "student_pro" || plan === "lifetime" || plan === "premium") ? plan : "premium";
    user.plan = validatedPlan;

    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "users", user.id), user);
      } catch (err) {
        console.error("Firestore sync error on subscription upgrade:", err);
      }
    }

    res.json({ success: true, user, message: `Subscription upgraded to ${validatedPlan} successfully!` });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Razorpay Integration
app.get("/api/payments/razorpay/config", (req, res) => {
  res.json({
    keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_mock_key_id",
    hasLiveKeys: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
  });
});

app.post("/api/payments/razorpay/order", async (req, res) => {
  const token = req.headers.authorization;
  const userId = token?.replace("Bearer mock-token-", "");
  if (!userId) return res.status(401).json({ error: "Unauthorized access" });

  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const { plan } = req.body;
  if (!plan || (plan !== "student_pro" && plan !== "premium" && plan !== "lifetime")) {
    return res.status(400).json({ error: "Invalid plan selected" });
  }

  // Determine amount in INR Paise
  let amount = 29900; // default premium 299
  if (plan === "student_pro") amount = 9900; // 99 INR
  if (plan === "lifetime") amount = 149900; // 1499 INR

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret) {
    try {
      // Lazy load Razorpay
      const Razorpay = (await import("razorpay")).default;
      const razorpayInstance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const options = {
        amount,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}_${userId.slice(0, 8)}`,
      };

      const order = await razorpayInstance.orders.create(options);
      return res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        isMock: false
      });
    } catch (err: any) {
      console.error("Razorpay Live Order Creation Failed:", err);
      return res.status(500).json({ error: err.message || "Failed to create live Razorpay order" });
    }
  } else {
    // Graceful fallback sandbox mock response
    return res.json({
      orderId: `order_sandbox_${Math.random().toString(36).substring(2, 10)}`,
      amount,
      currency: "INR",
      isMock: true,
      message: "Running in sandbox demo mode since RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET are not set in the environment variables."
    });
  }
});

app.post("/api/payments/razorpay/verify", async (req, res) => {
  const token = req.headers.authorization;
  const userId = token?.replace("Bearer mock-token-", "");
  if (!userId) return res.status(401).json({ error: "Unauthorized access" });

  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, plan, isMock } = req.body;
  if (!plan) return res.status(400).json({ error: "Plan parameter is required." });

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (isMock || !keySecret) {
    // In sandbox mock mode, directly upgrade the user
    user.plan = plan;
    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "users", user.id), user);
      } catch (err) {
        console.error("Firestore sync error with mockup razorpay upgrade:", err);
      }
    }
    return res.json({
      success: true,
      user,
      message: `Sandbox payment verified! Plan successfully upgraded to ${plan}.`
    });
  }

  // Standard live cryptographical signature verification
  try {
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac("sha256", keySecret)
      .update(text)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: "Razorpay Signature verification failed. Integrity breach." });
    }

    // Success: upgrade state & sync
    user.plan = plan;
    if (firestoreDb) {
      await setDoc(doc(firestoreDb, "users", user.id), user);
    }

    return res.json({
      success: true,
      user,
      message: `Verified payment successfully! Plan upgraded to ${plan}.`
    });
  } catch (err: any) {
    console.error("Razorpay verification failure:", err);
    return res.status(500).json({ error: err.message || "Failed to verify transaction." });
  }
});

app.post("/api/subs/cancel", async (req, res) => {
  const token = req.headers.authorization;
  const userId = token?.replace("Bearer mock-token-", "");
  if (!userId) return res.status(401).json({ error: "Unauthorized access" });

  const user = db.users.find(u => u.id === userId);
  if (user) {
    user.plan = "free";

    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "users", user.id), user);
      } catch (err) {
        console.error("Firestore sync error on subscription cancellation:", err);
      }
    }

    res.json({ success: true, user, message: "Subscription cancelled." });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Recruiter Search Portfolio engine
app.get("/api/recruiter/search", (req, res) => {
  const { skills, title, location } = req.query;
  let results = db.portfolios.filter(p => p.isPublished);

  // Search filter options
  if (title) {
    const searchStr = String(title).toLowerCase();
    results = results.filter(p => 
      p.personalInfo.title.toLowerCase().includes(searchStr) ||
      p.slug.toLowerCase().includes(searchStr)
    );
  }

  if (location) {
    const searchLoc = String(location).toLowerCase();
    results = results.filter(p => 
      p.personalInfo.location.toLowerCase().includes(searchLoc)
    );
  }

  if (skills) {
    const querySkills = String(skills).toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
    if (querySkills.length > 0) {
      results = results.filter(p => {
        const itemSkillsLower = p.skills.map(s => s.toLowerCase());
        return querySkills.every(qs => itemSkillsLower.some(is => is.includes(qs)));
      });
    }
  }

  res.json(results);
});

// Bookmarks candidate for recruiter
app.post("/api/recruiter/bookmark", (req, res) => {
  const { portfolioId, recruiterId } = req.body;
  if (!portfolioId || !recruiterId) return res.status(400).json({ error: "Missing bookmarks context id" });
  
  const originalIndex = db.bookmarks.findIndex(b => b.portfolioId === portfolioId && b.recruiterId === recruiterId);
  let bookmarked = false;
  if (originalIndex > -1) {
    db.bookmarks.splice(originalIndex, 1);
    bookmarked = false;
  } else {
    db.bookmarks.push({ recruiterId, portfolioId });
    bookmarked = true;
  }
  
  res.json({ success: true, bookmarked });
});

app.get("/api/recruiter/bookmarks/:recruiterId", (req, res) => {
  const { recruiterId } = req.params;
  const portfolioIds = db.bookmarks.filter(b => b.recruiterId === recruiterId).map(b => b.portfolioId);
  const portfoliosList = db.portfolios.filter(p => portfolioIds.includes(p.id));
  res.json(portfoliosList);
});

// Admin Panel endpoints
app.get("/api/admin/overview", (req, res) => {
  const token = req.headers.authorization;
  const userId = token?.replace("Bearer mock-token-", "");
  const user = db.users.find(u => u.id === userId);
  if (!user || user.email !== "kattikoustubh22@gmail.com") {
    return res.status(403).json({ error: "Access Denied. Strictly restricted to Koustubh Katti." });
  }

  const totalUsers = db.users.length;
  const premiumUsers = db.users.filter(u => u.plan !== "free").length;
  const totalPortfolios = db.portfolios.length;
  const activePublished = db.portfolios.filter(p => p.isPublished).length;
  const aggregateViews = db.analytics.reduce((sum, a) => sum + a.views, 0);

  res.json({
    totalUsers,
    premiumUsers,
    totalPortfolios,
    activePublished,
    aggregateViews,
    usersList: db.users,
    portfoliosList: db.portfolios.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      userName: p.personalInfo.name,
      templateId: p.templateId,
      isPublished: p.isPublished
    }))
  });
});

app.post("/api/admin/moderate-portfolio", async (req, res) => {
  const token = req.headers.authorization;
  const userId = token?.replace("Bearer mock-token-", "");
  const user = db.users.find(u => u.id === userId);
  if (!user || user.email !== "kattikoustubh22@gmail.com") {
    return res.status(403).json({ error: "Access Denied. Strictly restricted to Koustubh Katti." });
  }

  const { portfolioId, isPublished } = req.body;
  const p = db.portfolios.find(item => item.id === portfolioId);
  if (!p) return res.status(404).json({ error: "Portfolio selection not found" });

  p.isPublished = isPublished;

  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, "portfolios", portfolioId), p);
    } catch (err) {
      console.error("Firestore sync error in moderate-portfolio:", err);
    }
  }

  res.json({ success: true, isPublished, portfolioId });
});

// REAL SERVER-SIDE GEMINI generation AI routes
app.post("/api/ai/generate", async (req, res) => {
  const token = req.headers.authorization;
  const userId = token?.replace("Bearer mock-token-", "");
  
  const { userPrompt, templateId, userName, userTitle, tone } = req.body;
  
  if (!userPrompt) {
    return res.status(400).json({ error: "Please enter a concept prompt." });
  }

  // Update counts on user if authenticated
  let userObject = db.users.find(u => u.id === userId);
  if (userObject) {
    if (userObject.plan === "free" && userObject.aiUsageCount >= 5) {
      return res.status(403).json({ error: "You reached your limit of 5 free AI runs! Upgrade to Premium for infinite creations!" });
    }
    userObject.aiUsageCount = (userObject.aiUsageCount || 0) + 1;

    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "users", userObject.id), userObject);
      } catch (err) {
        console.error("Firestore sync error on AI usage increment:", err);
      }
    }
  }

  // Define fallback portfolio in case Gemini fails or process.env is missing
  const textPromptContext = `User concept prompt: "${userPrompt}". Name: "${userName || "Candidate"}". Title: "${userTitle || "Specialist"}". Selected template tone style: "${templateId || "modern"}" using a "${tone || "impressive"}" voice.`;

  const fallbackData = {
    title: `${userName || "My"} Professional Canvas`,
    templateId: templateId || "glassmorphism",
    accentColor: templateId === "cyberpunk" ? "#ec4899" : templateId === "founder" ? "#f59e0b" : "#3b82f6",
    personalInfo: {
      name: userName || "Alex Mercer",
      title: userTitle || "Full Stack Architect & Technical Founder",
      bio: `Highly motivated technologist focused on turning ideas into clean scalable software codes. Specialized in constructing elegant visual layouts, API engines, and adaptive SaaS interfaces related to "${userPrompt}".`,
      email: "hello@alexmercer.dev",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/alexmercer",
      github: "github.com/alexmercer",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      headline: `Building the future of software with high-end tools: "${userPrompt}".`
    },
    skills: ["TypeScript", "React", "Next.js", "Express", "Tailwind CSS", "SaaS Automation", "Generative AI"],
    projects: [
      {
        id: `p-${Date.now()}-1`,
        name: "Intelli-Node Dispatcher",
        description: `Automated data routing framework styled directly around "${userPrompt}" to optimize request bandwidth.`,
        url: "https://github.com",
        technologies: ["React", "TypeScript", "Vite"],
        image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: `p-${Date.now()}-2`,
        name: "Symphony Orchestrator",
        description: "An elegant interactive state dashboard monitoring decentralized workflows and real-time triggers.",
        url: "https://github",
        technologies: ["Express", "Tailwind", "D3.js"],
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80"
      }
    ],
    experience: [
      {
        id: `exp-${Date.now()}-1`,
        company: "Vanguard Labs",
        role: "Senior Full Stack Dev",
        duration: "2023 - Present",
        description: `Crafted resilient visual pipelines oriented towards client feedback. Pioneered solutions for: ${userPrompt}.`
      },
      {
        id: `exp-${Date.now()}-2`,
        company: "BetaCloud Systems",
        role: "Frontend Prototyper",
        duration: "2021 - 2023",
        description: "Assisted design group with high-fidelity transitions, component states design system architecture."
      }
    ],
    certifications: [
      {
        id: `cert-${Date.now()}-1`,
        title: "AWS Solutions Developer Associate",
        issuer: "Amazon Web Services",
        date: "2023"
      }
    ],
    testimonials: [
      {
        id: `test-${Date.now()}-1`,
        clientName: "Elena Rostova",
        role: "Product Owner",
        text: `Alex delivers pixel-perfect, highly responsive modules that elevated our release cycle efficiency. Superb work in building layouts!`,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
      }
    ]
  };

  if (!ai) {
    // Graceful simulated feedback if Gemini key is missing
    console.log("Gemini API key is not configured yet. Providing simulated AI profile generation.");
    return res.json({ portfolio: fallbackData, note: "Loaded via intelligent offline generative framework. Configure GEMINI_API_KEY for dynamic API calls." });
  }

  try {
    const aiSystemPrompt = `You are an elite senior UX/UI copywriter and professional resume developer. Your task is to generate premium, highly professional portfolio content for "Profyl AI" in strict JSON format based on a user's prompt request.
    
    You MUST output valid, parseable JSON matching this structure perfectly:
    {
      "title": "A highly premium tagline or portfolio title",
      "templateId": "one of: cyberpunk, glassmorphism, professional, creative, founder, neo_brutalist, midnight_nebula",
      "accentColor": "A custom hex color code appropriate for this aesthetic",
      "personalInfo": {
        "name": "The user's input name",
        "title": "A compelling job title or headline",
        "bio": "A rich, extremely professional, 3-4 sentence bio with high-impact words",
        "email": "A professional fallback email",
        "location": "A modern relevant location",
        "linkedin": "linkedin.com/in/... (placeholder)",
        "github": "github.com/... (placeholder)",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        "headline": "A short, engaging LinkedIn-style headline"
      },
      "skills": ["At least 6-8 relevant professional tools or skills tailored to the prompt"],
      "projects": [
        {
          "name": "Project Name #1",
          "description": "Compelling description focused on achievements, metrics, and premium technologies used.",
          "technologies": ["Tech1", "Tech2", "Tech3"],
          "url": "https://github.com",
          "image": "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=400&q=80"
        },
        {
          "name": "Project Name #2",
          "description": "Highly descriptive developer project with details showing mastery and scaling capabilities.",
          "technologies": ["TechA", "TechB"],
          "url": "https://github.com",
          "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80"
        }
      ],
      "experience": [
        {
          "company": "Company Corp Alpha",
          "role": "Role Title",
          "duration": "2024 - Present",
          "description": "Highlight achievements based on the prompt, e.g. increased click metrics, optimized load speed, or scale automated systems."
        },
        {
          "company": "Beta Systemic Agency",
          "role": "Software Associate",
          "duration": "2022 - 2024",
          "description": "Collaborated with team to engineer cloud pipelines or responsive frontends."
        }
      ],
      "certifications": [
        {
          "title": "A professional certification name",
          "issuer": "Credible Institution (AWS, Google, Harvard, etc.)",
          "date": "2024"
        }
      ],
      "testimonials": [
        {
          "clientName": "Devon Vance",
          "role": "VP of engineering",
          "text": "Extremely pleased with the outstanding delivery quality and fast communication loop.",
          "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
        }
      ]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are asked to generate a custom portfolio with this info: ${textPromptContext}. Write premium professional, beautiful copy in JSON format.`,
      config: {
        systemInstruction: aiSystemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            templateId: { type: Type.STRING },
            accentColor: { type: Type.STRING },
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                title: { type: Type.STRING },
                bio: { type: Type.STRING },
                email: { type: Type.STRING },
                location: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                github: { type: Type.STRING },
                avatar: { type: Type.STRING },
                headline: { type: Type.STRING }
              },
              required: ["name", "title", "bio", "email", "location", "linkedin", "github", "avatar", "headline"]
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  technologies: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  url: { type: Type.STRING },
                  image: { type: Type.STRING }
                },
                required: ["name", "description", "technologies", "url", "image"]
              }
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["company", "role", "duration", "description"]
              }
            },
            certifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  issuer: { type: Type.STRING },
                  date: { type: Type.STRING }
                },
                required: ["title", "issuer", "date"]
              }
            },
            testimonials: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  clientName: { type: Type.STRING },
                  role: { type: Type.STRING },
                  text: { type: Type.STRING },
                  avatar: { type: Type.STRING }
                },
                required: ["clientName", "role", "text", "avatar"]
              }
            }
          },
          required: ["title", "templateId", "accentColor", "personalInfo", "skills", "projects", "experience", "certifications", "testimonials"]
        }
      }
    });

    const cleanText = response.text || "";
    const parsed = JSON.parse(cleanText.trim());

    // Inject temporary IDs
    if (parsed.projects) {
      parsed.projects = parsed.projects.map((proj: any, idx: number) => ({
        id: `p-${Date.now()}-${idx}`,
        ...proj
      }));
    }
    if (parsed.experience) {
      parsed.experience = parsed.experience.map((exp: any, idx: number) => ({
        id: `exp-${Date.now()}-${idx}`,
        ...exp
      }));
    }
    if (parsed.certifications) {
      parsed.certifications = parsed.certifications.map((certs: any, idx: number) => ({
        id: `certs-${Date.now()}-${idx}`,
        ...certs
      }));
    }
    if (parsed.testimonials) {
      parsed.testimonials = parsed.testimonials.map((test: any, idx: number) => ({
        id: `test-${Date.now()}-${idx}`,
        ...test
      }));
    }

    res.json({ portfolio: parsed });

  } catch (error: any) {
    console.error("Gemini Live Generation Error:", error);
    res.status(500).json({
      error: "Gemini error during content drafting. Using local smart generators fallback.",
      details: error.message,
      portfolio: fallbackData
    });
  }
});

// AI Improver endpoint
app.post("/api/ai/improve", async (req, res) => {
  const { originalText, action } = req.body; // action: 'professional' | 'shorten' | 'bullet'
  if (!originalText) return res.status(400).json({ error: "Missing source text data to optimize." });

  if (!ai) {
    // Elegant fallback simulation
    let result = originalText;
    if (action === "shorten") {
      result = "Synthesized cloud engineer with a proven track record of reducing latency. Accomplished architecture modularity perfectly.";
    } else {
      result = `[Optimized] Expressive professional outline: Successfully engineered and scaled clean cloud-oriented microservices. Mastered continuous delivery integration, standard interface protocols, and maximized visual pixel layouts.`;
    }
    return res.json({ result });
  }

  try {
    const systemPrompt = "You are a senior professional resume rewrite specialist. Rewrite the provided text as requested. Do NOT output anything else except the optimized text itself. Output must be clean, impressive, and tailored to professional tech resumes.";
    const userPromptText = `Improve this text: "${originalText}". Action requirement: Make it "${action || "professional and high impact"}".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPromptText,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    res.json({ result: response.text?.trim() || originalText });
  } catch (err: any) {
    res.status(500).json({ error: "Fail. Gemini improver has encountered an issue.", result: `[Improved Fallback] ${originalText}` });
  }
});

// Firestore sync loaders on server boot
async function syncDbFromFirestore() {
  if (!firestoreDb) return;
  try {
    console.log("Syncing database from Firestore...");
    // 1. Sync users
    const usersSnap = await getDocs(collection(firestoreDb, "users"));
    if (usersSnap.empty) {
      console.log("Firestore 'users' is empty, pre-populating with default users.");
      for (const u of db.users) {
        await setDoc(doc(firestoreDb, "users", u.id), u);
      }
    } else {
      const fbUsers: any[] = [];
      usersSnap.forEach(docSnap => {
        fbUsers.push(docSnap.data());
      });
      db.users = fbUsers;
    }

    // 2. Sync portfolios
    const portfoliosSnap = await getDocs(collection(firestoreDb, "portfolios"));
    if (portfoliosSnap.empty) {
      console.log("Firestore 'portfolios' is empty, pre-populating with default portfolios.");
      for (const p of db.portfolios) {
        await setDoc(doc(firestoreDb, "portfolios", p.id), p);
      }
    } else {
      const fbPortfolios: any[] = [];
      portfoliosSnap.forEach(docSnap => {
        fbPortfolios.push(docSnap.data());
      });
      db.portfolios = fbPortfolios;
    }
    
    console.log(`Database synced! Loaded ${db.users.length} users and ${db.portfolios.length} portfolios from Firestore.`);
  } catch (err) {
    console.error("Error during Firestore sync on load:", err);
  }
}

// Configure Vite or Static production endpoints wrapped in async to avoid top-level await
async function startServer() {
  // Sync from Firestore first
  await syncDbFromFirestore();

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Global listen trigger
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Profyl AI Server successfully booted on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical: Failed to boot Profyl AI server:", err);
});
