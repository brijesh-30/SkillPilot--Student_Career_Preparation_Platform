import {
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  Flame,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getLearningStreak } from "../utils/learningStreak";

const STORAGE_KEYS = {
  applications: "skillpilot-applications",
  dailyTasks: "skillpilot-daily-tasks",
  roadmapProgress: "skillpilot-roadmap-progress",
};

function getRoadmapProgress() {
  try {
    const savedProgress = localStorage.getItem(STORAGE_KEYS.roadmapProgress);
    return savedProgress ? Number(savedProgress) || 0 : 0;
  } catch {
    return 0;
  }
}

function getTodayTaskStats() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEYS.dailyTasks);
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      if (Array.isArray(tasks)) {
        const today = tasks.filter((t) => t.due === "Today");
        return {
          total: today.length,
          completed: today.filter((t) => t.completed).length,
        };
      }
    }
  } catch {
    // fallback
  }
  return { total: 0, completed: 0 };
}

function getAppStats() {
  try {
    const savedApps = localStorage.getItem(STORAGE_KEYS.applications);
    if (savedApps) {
      const apps = JSON.parse(savedApps);
      if (Array.isArray(apps)) {
        return {
          total: apps.length,
          interviews: apps.filter((a) => a.status === "Interview").length,
        };
      }
    }
  } catch {
    // fallback
  }
  return { total: 0, interviews: 0 };
}

export default function StatsCards({ onNavigate }) {
  const [streak, setStreak] = useState(() => getLearningStreak());
  const [roadmapProgress, setRoadmapProgress] = useState(getRoadmapProgress);
  const [todayTaskStats, setTodayTaskStats] = useState(getTodayTaskStats);
  const [appStats, setAppStats] = useState(getAppStats);

  function loadAllStats() {
    setStreak(getLearningStreak());
    setRoadmapProgress(getRoadmapProgress());
    setTodayTaskStats(getTodayTaskStats());
    setAppStats(getAppStats());
  }

  useEffect(() => {
    window.addEventListener("skillpilot-streak-updated", loadAllStats);
    window.addEventListener("skillpilot-progress-updated", loadAllStats);
    window.addEventListener("skillpilot-activity-updated", loadAllStats);
    window.addEventListener("storage", loadAllStats);

    return () => {
      window.removeEventListener("skillpilot-streak-updated", loadAllStats);
      window.removeEventListener("skillpilot-progress-updated", loadAllStats);
      window.removeEventListener("skillpilot-activity-updated", loadAllStats);
      window.removeEventListener("storage", loadAllStats);
    };
  }, []);

  const stats = [
    {
      title: "Goal Roadmap",
      value: `${roadmapProgress}%`,
      subtitle: "Frontend Developer track",
      detail: "Curated learning roadmap",
      icon: Compass,
      color: "from-indigo-500 to-violet-600",
      accentBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300",
      targetPage: "Career Roadmap",
    },
    {
      title: "Learning Streak",
      value: `${streak.currentStreak} ${streak.currentStreak === 1 ? "day" : "days"}`,
      subtitle: streak.activeToday ? "Studied today 🔥" : "Complete a task to keep streak",
      detail: streak.activeToday ? "Consistency maintained" : "Activity pending today",
      icon: Flame,
      color: "from-orange-500 to-amber-500",
      accentBg: "bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-amber-300",
      targetPage: "Daily Planner",
    },
    {
      title: "Today's Action Plan",
      value: `${todayTaskStats.completed}/${todayTaskStats.total}`,
      subtitle:
        todayTaskStats.total > 0
          ? `${Math.round((todayTaskStats.completed / todayTaskStats.total) * 100)}% completed`
          : "No tasks planned yet",
      detail: "Daily execution tracker",
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-600",
      accentBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300",
      targetPage: "Daily Planner",
    },
    {
      title: "Applications & Interviews",
      value: appStats.total,
      subtitle: `${appStats.interviews} active interviews`,
      detail: "Job search pipeline",
      icon: BriefcaseBusiness,
      color: "from-blue-500 to-cyan-600",
      accentBg: "bg-blue-50 text-blue-600 dark:bg-cyan-950/60 dark:text-cyan-300",
      targetPage: "Application Tracker",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <button
            key={stat.title}
            type="button"
            onClick={() => onNavigate?.(stat.targetPage)}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800/80 dark:bg-[#0f172a] dark:hover:border-slate-700 dark:hover:shadow-indigo-950/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {/* Top accent glow line */}
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.color} opacity-80 transition group-hover:opacity-100`}
            />

            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {stat.title}
                </p>
                <p className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl font-mono-code">
                  {stat.value}
                </p>
              </div>

              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${stat.accentBg} transition-transform duration-200 group-hover:scale-105`}
              >
                <Icon size={20} />
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-400">{stat.subtitle}</span>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                View &rarr;
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
