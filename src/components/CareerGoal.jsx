import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, CheckCircle2, BookOpen, Pencil, Clock } from "lucide-react";
import { getUserProfile, calculateDaysRemaining } from "../utils/careerTracks";

const PROGRESS_KEY = "skillpilot-roadmap-progress";
const ROADMAP_KEY = "skillpilot-custom-roadmap";
const PROGRESS_EVENT = "skillpilot-progress-updated";

function readProgress() {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved === null || saved.trim() === "") return 0;
    const value = Number(saved);
    return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
  } catch {
    return 0;
  }
}

function readRoadmapData() {
  try {
    const saved = localStorage.getItem(ROADMAP_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const allSkills = (parsed.stages || []).flatMap((s) => s.skills || []);
      const completed = allSkills.filter((s) => s.completed).length;
      return {
        totalSkills: allSkills.length || 20,
        completedSkills: completed,
        stagesCount: (parsed.stages || []).length || 4,
      };
    }
  } catch (e) {
    console.error(e);
  }
  return {
    totalSkills: 20,
    completedSkills: 0,
    stagesCount: 4,
  };
}

export default function CareerGoal({ onNavigate, onEditGoal }) {
  const [progress, setProgress] = useState(readProgress);
  const [meta, setMeta] = useState(readRoadmapData);
  const [profile, setProfile] = useState(() => getUserProfile());

  useEffect(() => {
    const update = (event) => {
      const value = event?.detail?.progress;
      setProgress(
        typeof value === "number"
          ? Math.min(100, Math.max(0, value))
          : readProgress(),
      );
      setMeta(readRoadmapData());
      setProfile(getUserProfile());
    };

    function updateProfile(e) {
      if (e?.detail) setProfile(e.detail);
      else setProfile(getUserProfile());
      setMeta(readRoadmapData());
    }

    window.addEventListener(PROGRESS_EVENT, update);
    window.addEventListener("skillpilot-profile-updated", updateProfile);
    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener(PROGRESS_EVENT, update);
      window.removeEventListener("skillpilot-profile-updated", updateProfile);
      window.removeEventListener("storage", update);
    };
  }, []);

  const daysRemaining = calculateDaysRemaining(profile.targetDate);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference * (1 - progress / 100);

  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-slate-800/80 bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-lg shadow-indigo-950/20 sm:p-7 dark:border-indigo-900/40">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-10 -top-14 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-14 left-1/3 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
        {/* Left Side: Goal Info */}
        <div className="max-w-2xl min-w-0">
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-200">
              <Sparkles size={13} className="text-indigo-300" />
              ACTIVE CAREER GOAL
            </span>

            {daysRemaining !== null && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 font-mono-code">
                <Clock size={11} />
                {daysRemaining} Days Left
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              {profile.targetGoal}
            </h2>
            <button
              type="button"
              onClick={onEditGoal}
              className="inline-flex items-center gap-1 rounded-xl border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200 transition hover:bg-white/20"
            >
              <Pencil size={12} />
              Change Track
            </button>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
            Targeting <span className="font-semibold text-white">{profile.targetRole}</span> by{" "}
            <span className="font-semibold text-white">{profile.targetDate}</span>.
            Build consistency, master interview topics, and ship production projects everyday.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-medium">
              <BookOpen size={13} className="text-indigo-400" />
              {meta.stagesCount} Curriculum Stages
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-medium">
              <CheckCircle2 size={13} className="text-emerald-400" />
              {meta.completedSkills} of {meta.totalSkills} Skills Learned
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate?.("Career Roadmap")}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 via-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-900/50 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-indigo-900/80 hover:brightness-110"
            >
              Explore Full Roadmap
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={() => onNavigate?.("Daily Planner")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/15"
            >
              Today's Action Plan
            </button>
          </div>
        </div>

        {/* Right Side: Circular Radial Progress */}
        <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:flex-col sm:justify-center sm:px-6 sm:py-5">
          <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
            <svg
              className="h-full w-full -rotate-90"
              viewBox="0 0 100 100"
              role="img"
              aria-label={`Career roadmap completion: ${progress}%`}
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#goalProgressGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient
                  id="goalProgressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white sm:text-3xl font-mono-code">
                {progress}%
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200">
                Done
              </span>
            </div>
          </div>

          <div className="text-left sm:text-center">
            <p className="text-xs font-bold text-white">Roadmap Completion</p>
            <p className="mt-0.5 text-[11px] text-slate-300">
              {meta.totalSkills - meta.completedSkills} skills remaining
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
