const PROFILE_STORAGE_KEY = "skillpilot-user-profile";

export const CAREER_TRACKS = [
  {
    id: "frontend",
    name: "Frontend Developer",
    badge: "Popular",
    description: "Build fast, interactive web applications with React, JavaScript, and Tailwind CSS.",
    duration: "4–5 months",
    stages: [
      {
        id: "stage-fe-1",
        title: "Frontend Fundamentals",
        subtitle: "Build a rock-solid web foundation",
        description: "Master semantic HTML5, modern CSS3 layout systems (Flexbox, Grid), and responsive design.",
        duration: "3–4 weeks",
        skills: [
          { id: "fe-1", name: "Semantic HTML5", completed: true },
          { id: "fe-2", name: "CSS Flexbox & CSS Grid", completed: true },
          { id: "fe-3", name: "Responsive Web Design", completed: true },
          { id: "fe-4", name: "JavaScript ES6+ Fundamentals", completed: true },
        ],
      },
      {
        id: "stage-fe-2",
        title: "Modern React & Component Architecture",
        subtitle: "Develop dynamic UI applications",
        description: "Learn component lifecycle, custom hooks, state management, and modern component design.",
        duration: "4–5 weeks",
        skills: [
          { id: "fe-5", name: "React Components & JSX", completed: true },
          { id: "fe-6", name: "React Hooks (useState, useEffect, useMemo)", completed: true },
          { id: "fe-7", name: "Tailwind CSS Styling", completed: true },
          { id: "fe-8", name: "Client-side Routing (React Router)", completed: false },
          { id: "fe-9", name: "API Fetching & TanStack Query", completed: false },
        ],
      },
      {
        id: "stage-fe-3",
        title: "Production Projects & State",
        subtitle: "Create real portfolio proof of work",
        description: "Build production-ready web apps with clean code, global state, and external APIs.",
        duration: "4–6 weeks",
        skills: [
          { id: "fe-10", name: "Global State (Zustand or Redux Toolkit)", completed: false },
          { id: "fe-11", name: "Git Workflow & GitHub Collaboration", completed: false },
          { id: "fe-12", name: "Next.js & Server Components", completed: false },
          { id: "fe-13", name: "Production Deployment (Vercel / Netlify)", completed: false },
        ],
      },
      {
        id: "stage-fe-4",
        title: "DSA & Frontend Interview Readiness",
        subtitle: "Prepare for placement coding rounds",
        description: "Strengthen problem-solving in JavaScript and practice frontend machine-coding rounds.",
        duration: "Ongoing",
        skills: [
          { id: "fe-14", name: "JavaScript Polyfills & Closures", completed: false },
          { id: "fe-15", name: "Data Structures (Arrays, HashMaps, Trees)", completed: false },
          { id: "fe-16", name: "DOM Manipulation & Performance", completed: false },
          { id: "fe-17", name: "Machine Coding Round Practice", completed: false },
        ],
      },
      {
        id: "stage-fe-5",
        title: "Job Readiness & Placement Prep",
        subtitle: "Turn skills into interviews and offers",
        description: "Create your developer portfolio, polish your tech resume, and practice mock rounds.",
        duration: "3–4 weeks",
        skills: [
          { id: "fe-18", name: "Tech Resume & ATS Optimization", completed: false },
          { id: "fe-19", name: "Personal Developer Portfolio Website", completed: false },
          { id: "fe-20", name: "Behavioral & Technical Mock Interviews", completed: false },
          { id: "fe-21", name: "Cold Outreach & Job Application Tracking", completed: false },
        ],
      },
    ],
  },
  {
    id: "backend",
    name: "Backend Developer",
    badge: "High Demand",
    description: "Design scalable REST APIs, microservices, databases, and secure server architectures.",
    duration: "5–6 months",
    stages: [
      {
        id: "stage-be-1",
        title: "Programming & Server Runtimes",
        subtitle: "Deepen core language foundations",
        description: "Master server-side JavaScript/Node.js or Python, asynchronous programming, and runtime internals.",
        duration: "3–4 weeks",
        skills: [
          { id: "be-1", name: "JavaScript/TypeScript or Python", completed: true },
          { id: "be-2", name: "Node.js Runtime & Event Loop", completed: false },
          { id: "be-3", name: "Express.js Framework", completed: false },
          { id: "be-4", name: "RESTful API Design & Best Practices", completed: false },
        ],
      },
      {
        id: "stage-be-2",
        title: "Databases & ORMs",
        subtitle: "Store, query, and optimize data",
        description: "Learn relational (PostgreSQL/MySQL) and non-relational (MongoDB) database systems.",
        duration: "4–5 weeks",
        skills: [
          { id: "be-5", name: "SQL & Relational Schema Design", completed: false },
          { id: "be-6", name: "PostgreSQL or MySQL", completed: false },
          { id: "be-7", name: "MongoDB & Mongoose", completed: false },
          { id: "be-8", name: "Prisma or Drizzle ORM", completed: false },
          { id: "be-9", name: "Database Indexing & Queries", completed: false },
        ],
      },
      {
        id: "stage-be-3",
        title: "Authentication, Security & Caching",
        subtitle: "Build secure, resilient services",
        description: "Implement user authentication, authorization, role-based access control, and caching with Redis.",
        duration: "3–4 weeks",
        skills: [
          { id: "be-10", name: "JWT & Refresh Tokens", completed: false },
          { id: "be-11", name: "OAuth2 & Social Logins", completed: false },
          { id: "be-12", name: "Redis Caching & Session Storage", completed: false },
          { id: "be-13", name: "API Rate Limiting & Validation", completed: false },
        ],
      },
      {
        id: "stage-be-4",
        title: "DevOps Basics & Deployment",
        subtitle: "Containerize and ship to the cloud",
        description: "Containerize applications with Docker and deploy backend APIs to production clouds.",
        duration: "3–4 weeks",
        skills: [
          { id: "be-14", name: "Docker & Containerization", completed: false },
          { id: "be-15", name: "CI/CD with GitHub Actions", completed: false },
          { id: "be-16", name: "Cloud Deployment (AWS / Railway)", completed: false },
          { id: "be-17", name: "Basic System Design Principles", completed: false },
        ],
      },
    ],
  },
  {
    id: "fullstack",
    name: "Full-Stack Developer",
    badge: "Comprehensive",
    description: "End-to-end web engineering: connect high-performance React frontends to scalable backends.",
    duration: "6 months",
    stages: [
      {
        id: "stage-fs-1",
        title: "Frontend Foundations",
        subtitle: "Responsive user interfaces",
        description: "HTML, CSS, modern JavaScript, and React framework.",
        duration: "4 weeks",
        skills: [
          { id: "fs-1", name: "HTML5, CSS3 & Responsive UI", completed: true },
          { id: "fs-2", name: "JavaScript ES6+ Deep Dive", completed: true },
          { id: "fs-3", name: "React.js & Tailwind CSS", completed: true },
          { id: "fs-4", name: "State Management & React Hooks", completed: false },
        ],
      },
      {
        id: "stage-fs-2",
        title: "Backend & Databases",
        subtitle: "Server architecture and data storage",
        description: "Node.js, Express, MongoDB, and PostgreSQL.",
        duration: "5 weeks",
        skills: [
          { id: "fs-5", name: "Node.js & Express APIs", completed: false },
          { id: "fs-6", name: "MongoDB & PostgreSQL", completed: false },
          { id: "fs-7", name: "JWT Authentication & Protected Routes", completed: false },
          { id: "fs-8", name: "Full-Stack API Integration", completed: false },
        ],
      },
      {
        id: "stage-fs-3",
        title: "Next.js Full-Stack Framework",
        subtitle: "Full-stack apps with modern React",
        description: "Server Actions, Server Components, SSR, and Prisma.",
        duration: "4 weeks",
        skills: [
          { id: "fs-9", name: "Next.js App Router & SSR", completed: false },
          { id: "fs-10", name: "Server Actions & API Routes", completed: false },
          { id: "fs-11", name: "Prisma ORM with PostgreSQL", completed: false },
          { id: "fs-12", name: "Payment Integration (Stripe / Razorpay)", completed: false },
        ],
      },
      {
        id: "stage-fs-4",
        title: "Production Projects & Placement Readiness",
        subtitle: "Showcase full-stack mastery",
        description: "Build 2 production apps, deployment, and interview preparation.",
        duration: "Ongoing",
        skills: [
          { id: "fs-13", name: "Full-Stack Capstone Project", completed: false },
          { id: "fs-14", name: "Vercel / Render / Supabase Deployment", completed: false },
          { id: "fs-15", name: "DSA & Problem Solving Rounds", completed: false },
          { id: "fs-16", name: "Full-Stack System Design Interviews", completed: false },
        ],
      },
    ],
  },
  {
    id: "dsa",
    name: "DSA & Placement Prep",
    badge: "Campus Placements",
    description: "Crack technical coding rounds in product and services companies with focused problem solving.",
    duration: "4–5 months",
    stages: [
      {
        id: "stage-dsa-1",
        title: "Language & Complexity Basics",
        subtitle: "Foundations of algorithm analysis",
        description: "Master C++, Java, or Python and analyze Big-O time and space complexity.",
        duration: "2–3 weeks",
        skills: [
          { id: "dsa-1", name: "C++ STL / Java Collections", completed: true },
          { id: "dsa-2", name: "Time & Space Complexity (Big-O)", completed: true },
          { id: "dsa-3", name: "Basic Math & Bit Manipulation", completed: false },
          { id: "dsa-4", name: "Recursion & Backtracking Foundations", completed: false },
        ],
      },
      {
        id: "stage-dsa-2",
        title: "Linear Data Structures",
        subtitle: "Arrays, Strings, Linked Lists, Stacks & Queues",
        description: "Two pointers, sliding window, fast/slow pointers, and monotonic stacks.",
        duration: "4–5 weeks",
        skills: [
          { id: "dsa-5", name: "Arrays (Two Pointers & Sliding Window)", completed: false },
          { id: "dsa-6", name: "Strings & Pattern Matching", completed: false },
          { id: "dsa-7", name: "Linked List Reversal & Fast-Slow Pointers", completed: false },
          { id: "dsa-8", name: "Stacks & Queues (Monotonic Stack)", completed: false },
        ],
      },
      {
        id: "stage-dsa-3",
        title: "Trees, Graphs & Advanced Structures",
        subtitle: "Hierarchical and network data structures",
        description: "Binary Trees, BSTs, BFS, DFS, Dijkstra, and Disjoint Set Union.",
        duration: "5–6 weeks",
        skills: [
          { id: "dsa-9", name: "Binary Trees (Traversals & Views)", completed: false },
          { id: "dsa-10", name: "Binary Search Trees (BST)", completed: false },
          { id: "dsa-11", name: "Graph Traversals (BFS & DFS)", completed: false },
          { id: "dsa-12", name: "Shortest Path (Dijkstra) & Spanning Trees", completed: false },
          { id: "dsa-13", name: "Heaps & Priority Queues", completed: false },
        ],
      },
      {
        id: "stage-dsa-4",
        title: "Dynamic Programming & Greedy",
        subtitle: "Master the hardest placement topics",
        description: "1D/2D DP, Knapsack variations, Longest Common Subsequence, and Greedy algorithms.",
        duration: "4–5 weeks",
        skills: [
          { id: "dsa-14", name: "1D & 2D Dynamic Programming", completed: false },
          { id: "dsa-15", name: "0/1 Knapsack & Unbounded Knapsack", completed: false },
          { id: "dsa-16", name: "Longest Common Subsequence (LCS)", completed: false },
          { id: "dsa-17", name: "Greedy Interval Scheduling", completed: false },
        ],
      },
    ],
  },
];

const defaultProfile = {
  name: "Brijesh Sevra",
  targetGoal: "Frontend Developer",
  targetDate: "2027-06-30",
  targetRole: "Frontend Engineer",
  college: "Computer Science Student",
  initials: "BS",
};

export function getUserProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        return { ...defaultProfile, ...parsed };
      }
    }
  } catch (e) {
    console.error("Unable to read user profile:", e);
  }
  return defaultProfile;
}

export function saveUserProfile(updated) {
  try {
    const current = getUserProfile();
    const merged = { ...current, ...updated };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent("skillpilot-profile-updated", { detail: merged }));
    return merged;
  } catch (e) {
    console.error("Unable to save user profile:", e);
    return defaultProfile;
  }
}

export function calculateDaysRemaining(targetDateStr) {
  if (!targetDateStr) return null;
  const target = new Date(`${targetDateStr}T23:59:59`);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

