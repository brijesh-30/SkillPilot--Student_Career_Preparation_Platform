import { useEffect, useState } from "react";
import { BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";

const ROADMAP_KEY = "skillpilot-custom-roadmap";
const PROGRESS_EVENT = "skillpilot-progress-updated";

const defaultSkills = [
  { name: "HTML & CSS", category: "Fundamentals", progress: 100, color: "bg-orange-500" },
  { name: "JavaScript (ES6+)", category: "Core Language", progress: 75, color: "bg-amber-500" },
  { name: "React & Hooks", category: "Framework", progress: 60, color: "bg-cyan-500" },
  { name: "Tailwind CSS", category: "Styling", progress: 85, color: "bg-teal-500" },
  { name: "DSA & Problem Solving", category: "CS Fundamentals", progress: 40, color: "bg-indigo-500" },
  { name: "Git & GitHub", category: "Tools", progress: 90, color: "bg-rose-500" },
];

function calculateSkills() {
  try {
    const saved = localStorage.getItem(ROADMAP_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const stages = parsed.stages || [];
      const allSkills = stages.flatMap((s) => s.skills || []);

      if (allSkills.length > 0) {
        return defaultSkills.map((ds) => {
          const match = allSkills.find(
            (s) =>
              s.name.toLowerCase().includes(ds.name.toLowerCase().split(" ")[0]) ||
              ds.name.toLowerCase().includes(s.name.toLowerCase()),
          );
          if (match) {
            return {
              ...ds,
              progress: match.completed ? 100 : ds.progress,
            };
          }
          return ds;
        });
      }
    }
  } catch (error) {
    console.error("Unable to calculate skills:", error);
  }

  return defaultSkills;
}

export default function LearningProgress({ onNavigate }) {
  const [skills, setSkills] = useState(calculateSkills);

  useEffect(() => {
    function updateProgress() {
      setSkills(calculateSkills());
    }

    window.addEventListener(PROGRESS_EVENT, updateProgress);
    window.addEventListener("storage", updateProgress);

    return () => {
      window.removeEventListener(PROGRESS_EVENT, updateProgress);
      window.removeEventListener("storage", updateProgress);
    };
  }, []);

  const completedSkills = skills.filter((s) => s.progress === 100).length;

  return (
    <section className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800/80 dark:bg-[#0f172a] transition-colors">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
            <BookOpen size={18} />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Core Competencies
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {completedSkills} of {skills.length} core engineering skills mastered
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate?.("Career Roadmap")}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Full Roadmap <ArrowRight size={13} />
        </button>
      </div>

      {/* Skills list distributed evenly to occupy the full container height */}
      <div className="flex flex-1 flex-col justify-between py-2 space-y-3.5">
        {skills.map((skill) => (
          <div key={skill.name} className="flex flex-col justify-center">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {skill.name}
                </span>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  {skill.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold font-mono-code ${
                    skill.progress === 100
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60"
                      : skill.progress >= 70
                        ? "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/60"
                        : "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60"
                  }`}
                >
                  {skill.progress === 100 ? "Mastered" : `${skill.progress}%`}
                </span>
              </div>
            </div>

            <div
              className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
              role="progressbar"
              aria-valuenow={skill.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`h-full rounded-full ${skill.color} transition-all duration-500`}
                style={{ width: `${skill.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Pill */}
      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
        <CheckCircle2 size={15} className="shrink-0 text-emerald-500 dark:text-emerald-400" />
        <span>Completing roadmap milestones updates this progress automatically.</span>
      </div>
    </section>
  );
}
