import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Brain,
  Target,
  Trophy,
  ArrowUpRight,
  Flame,
  Sparkles,
} from "lucide-react";
import { getLearningStreak } from "../utils/learningStreak";

const STORAGE_KEYS = {
  applications: "skillpilot-applications",
  dailyTasks: "skillpilot-daily-tasks",
  interviews: "skillpilot-interview-progress",
  customRoadmap: "skillpilot-custom-roadmap",
  roadmapProgress: "skillpilot-roadmap-progress",
};

const INTERVIEW_CATEGORIES = {
  JavaScript: ["js-1", "js-2", "js-3", "js-4"],
  React: ["react-1", "react-2", "react-3", "react-4"],
  "Node.js": ["node-1", "node-2", "node-3", "node-4"],
  DBMS: ["dbms-1", "dbms-2", "dbms-3", "dbms-4"],
  OOP: ["oop-1", "oop-2", "oop-3", "oop-4"],
  DSA: ["dsa-1", "dsa-2", "dsa-3", "dsa-4"],
};

const STATUS_COLORS = {
  Applied: "bg-indigo-500",
  Interview: "bg-blue-500",
  "Under Review": "bg-amber-500",
  Rejected: "bg-rose-500",
  "Offer Received": "bg-emerald-500",
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getPercent(completed, total) {
  return total ? Math.round((completed / total) * 100) : 0;
}

function ProgressBar({ value, color = "bg-indigo-600" }) {
  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full ${color} transition-all duration-500`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function SectionCard({ title, subtitle, icon: Icon, children }) {
  return (
    <section className="min-w-0 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800/80 dark:bg-[#0f172a] transition-colors">
      <div className="mb-5 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
          <Icon size={20} />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function EmptyState({ children }) {
  return (
    <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-5 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400">
      {children}
    </p>
  );
}

function buildAnalytics() {
  const applications = readStorage(STORAGE_KEYS.applications, []);
  const interviews = readStorage(STORAGE_KEYS.interviews, {});
  const customRoadmap = readStorage(STORAGE_KEYS.customRoadmap, null);
  const dailyTasks = readStorage(STORAGE_KEYS.dailyTasks, []);
  const streak = getLearningStreak();

  // 1. Roadmap analytics
  const stages = customRoadmap?.stages || [];
  const allRoadmapSkills = stages.flatMap((s) => s.skills || []);
  const completedRoadmapSkills = allRoadmapSkills.filter((s) => s.completed).length;
  const roadmapPercentage = getPercent(
    completedRoadmapSkills,
    allRoadmapSkills.length,
  );

  const stageProgressList = stages.map((stage) => {
    const sSkills = stage.skills || [];
    const done = sSkills.filter((s) => s.completed).length;
    return {
      title: stage.title,
      total: sSkills.length,
      completed: done,
      percentage: getPercent(done, sSkills.length),
    };
  });

  // 2. Interview analytics
  const totalInterviews = Object.values(INTERVIEW_CATEGORIES).flat().length;
  const completedInterviews = Object.values(INTERVIEW_CATEGORIES)
    .flat()
    .filter((id) => interviews[id]?.completed).length;

  const interviewCategories = Object.entries(INTERVIEW_CATEGORIES).map(
    ([name, ids]) => {
      const done = ids.filter((id) => interviews[id]?.completed).length;
      return {
        name,
        completed: done,
        total: ids.length,
        percentage: getPercent(done, ids.length),
      };
    },
  );

  // 3. Application analytics
  const safeApps = Array.isArray(applications) ? applications : [];
  const statuses = [
    "Applied",
    "Under Review",
    "Interview",
    "Offer Received",
    "Rejected",
  ].map((status) => ({
    name: status,
    count: safeApps.filter((a) => (a?.status || "Applied") === status).length,
    color: STATUS_COLORS[status],
  }));

  // 4. Daily tasks
  const safeTasks = Array.isArray(dailyTasks) ? dailyTasks : [];
  const completedDailyTasks = safeTasks.filter((t) => t.completed).length;

  return {
    applications: safeApps,
    roadmapStages: stageProgressList,
    totalRoadmapSkills: allRoadmapSkills.length,
    completedRoadmapSkills,
    roadmapPercentage,
    completedInterviews,
    totalInterviews,
    interviewCategories,
    statuses,
    tasksCount: safeTasks.length,
    completedDailyTasks,
    streak,
  };
}

export default function Analytics() {
  const [data, setData] = useState(buildAnalytics);

  useEffect(() => {
    function refresh() {
      setData(buildAnalytics());
    }

    window.addEventListener("storage", refresh);
    window.addEventListener("skillpilot-progress-updated", refresh);
    window.addEventListener("skillpilot-activity-updated", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("skillpilot-progress-updated", refresh);
      window.removeEventListener("skillpilot-activity-updated", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const {
    applications,
    roadmapStages,
    totalRoadmapSkills,
    completedRoadmapSkills,
    roadmapPercentage,
    completedInterviews,
    totalInterviews,
    interviewCategories,
    statuses,
    tasksCount,
    completedDailyTasks,
    streak,
  } = data;

  const offerCount = applications.filter(
    (a) => a.status === "Offer Received",
  ).length;
  const interviewCount = applications.filter(
    (a) => a.status === "Interview",
  ).length;

  const statCards = [
    {
      label: "Roadmap Mastery",
      value: `${roadmapPercentage}%`,
      detail: `${completedRoadmapSkills} of ${totalRoadmapSkills} skills learned`,
      icon: Target,
      color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400",
    },
    {
      label: "Learning Streak",
      value: `${streak.currentStreak} Days`,
      detail: streak.activeToday ? "Studied today" : "Pending study session",
      icon: Flame,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-950/70 dark:text-orange-400",
    },
    {
      label: "Interview Prep",
      value: `${completedInterviews}/${totalInterviews}`,
      detail: `${getPercent(completedInterviews, totalInterviews)}% technical questions`,
      icon: Brain,
      color: "bg-violet-50 text-violet-600 dark:bg-violet-950/70 dark:text-violet-400",
    },
    {
      label: "Applications Sent",
      value: applications.length,
      detail: `${interviewCount} interviews, ${offerCount} offers`,
      icon: BriefcaseBusiness,
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Sparkles size={14} /> Performance Dashboard
          </div>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Career Readiness Analytics
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Live insights on your curriculum progress, interview question
            retention, and job application pipeline.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Real-time synchronized
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-slate-800/80 dark:bg-[#0f172a]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl font-mono-code">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{stat.detail}</p>
                </div>
                <div
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${stat.color}`}
                >
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Grid 1: Career Roadmap vs Job Applications */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Career Roadmap Stages */}
        <SectionCard
          title="Curriculum Stages"
          subtitle="Progress through your tech roadmap milestones"
          icon={Target}
        >
          <div className="mb-5 flex items-center justify-between rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 p-4">
            <div>
              <p className="text-xs text-indigo-700 dark:text-indigo-300">Total Progress</p>
              <p className="mt-0.5 text-2xl font-black text-indigo-950 dark:text-white font-mono-code">
                {roadmapPercentage}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-indigo-700 dark:text-indigo-300">Skills Learned</p>
              <p className="mt-0.5 text-base font-bold text-indigo-950 dark:text-white font-mono-code">
                {completedRoadmapSkills} / {totalRoadmapSkills}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {roadmapStages.map((stage) => (
              <div key={stage.title}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {stage.title}
                  </span>
                  <span className="font-bold text-slate-600 dark:text-slate-400 font-mono-code">
                    {stage.completed}/{stage.total} ({stage.percentage}%)
                  </span>
                </div>
                <ProgressBar
                  value={stage.percentage}
                  color={
                    stage.percentage === 100
                      ? "bg-emerald-500"
                      : stage.percentage > 0
                        ? "bg-indigo-600 dark:bg-indigo-500"
                        : "bg-slate-300 dark:bg-slate-700"
                  }
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Application Pipeline */}
        <SectionCard
          title="Job Search Pipeline"
          subtitle="Status breakdown of your active applications"
          icon={BriefcaseBusiness}
        >
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Applications</p>
              <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white font-mono-code">
                {applications.length}
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 p-4">
              <p className="text-xs text-emerald-700 dark:text-emerald-300">Offers Received</p>
              <p className="mt-1 text-2xl font-black text-emerald-900 dark:text-emerald-200 font-mono-code">
                {offerCount}
              </p>
            </div>
          </div>

          {applications.length === 0 ? (
            <EmptyState>
              No applications recorded yet. Add your submissions in the
              Application Tracker to see pipeline analytics here.
            </EmptyState>
          ) : (
            <div className="space-y-3.5">
              {statuses.map((status) => (
                <div key={status.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {status.name}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono-code">
                      {status.count} ({getPercent(status.count, applications.length)}%)
                    </span>
                  </div>
                  <ProgressBar
                    value={getPercent(status.count, applications.length)}
                    color={status.color}
                  />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* 2-Column Grid 2: Interview Readiness & Daily Execution */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Technical Interview Preparation */}
        <SectionCard
          title="Technical Interview Coverage"
          subtitle="Questions practiced and mastered by topic"
          icon={Brain}
        >
          <div className="mb-5 flex items-center justify-between rounded-2xl bg-violet-50/70 dark:bg-violet-950/40 p-4">
            <div>
              <p className="text-xs text-violet-700 dark:text-violet-300">Questions Mastered</p>
              <p className="mt-0.5 text-2xl font-black text-violet-950 dark:text-white font-mono-code">
                {completedInterviews} / {totalInterviews}
              </p>
            </div>
            <Trophy size={24} className="text-violet-600 dark:text-violet-400" />
          </div>

          <div className="space-y-3.5">
            {interviewCategories.map((category) => (
              <div key={category.name}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {category.name}
                  </span>
                  <span className="font-bold text-slate-600 dark:text-slate-400 font-mono-code">
                    {category.completed}/{category.total} ({category.percentage}%)
                  </span>
                </div>
                <ProgressBar
                  value={category.percentage}
                  color="bg-violet-600 dark:bg-violet-500"
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Daily Execution & Study Consistency */}
        <SectionCard
          title="Daily Habit & Execution"
          subtitle="Consistency metrics and task completion"
          icon={Flame}
        >
          <div className="mb-5 flex items-center justify-between rounded-2xl bg-orange-50/70 dark:bg-orange-950/40 p-4">
            <div>
              <p className="text-xs text-orange-700 dark:text-orange-300">Current Study Streak</p>
              <p className="mt-0.5 text-2xl font-black text-orange-950 dark:text-white font-mono-code">
                {streak.currentStreak} Days 🔥
              </p>
            </div>
            <span className="rounded-full bg-white dark:bg-slate-800 px-3 py-1 text-xs font-bold text-orange-700 dark:text-orange-300 shadow-xs">
              {streak.activeToday ? "Active Today" : "Pending Study"}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40 p-3.5 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Total Daily Tasks Tracked
              </span>
              <span className="font-bold text-slate-900 dark:text-white font-mono-code">{tasksCount}</span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40 p-3.5 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Completed Daily Tasks
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono-code">
                {completedDailyTasks}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40 p-3.5 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Overall Task Completion Rate
              </span>
              <span className="font-bold text-indigo-700 dark:text-indigo-400 font-mono-code">
                {getPercent(completedDailyTasks, tasksCount)}%
              </span>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Bottom Advice Banner */}
      <div className="flex items-start gap-3.5 rounded-3xl border border-indigo-100 bg-linear-to-r from-indigo-50/80 to-violet-50/80 dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-violet-950/40 p-5 text-xs text-slate-700 dark:text-slate-300">
        <ArrowUpRight size={18} className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
        <div>
          <p className="font-bold text-slate-900 dark:text-white">
            Maximizing Your Engineering Readiness
          </p>
          <p className="mt-0.5 leading-relaxed text-slate-600 dark:text-slate-300">
            Aim to maintain a balance of 60% building/coding projects, 25% DSA
            problem solving, and 15% interview communication practice. Review
            your analytics weekly to prioritize weaker areas.
          </p>
        </div>
      </div>
    </div>
  );
}
