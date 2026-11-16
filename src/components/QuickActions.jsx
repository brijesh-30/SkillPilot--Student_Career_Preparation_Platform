import {
  Compass,
  FileSearch,
  MessagesSquare,
  BriefcaseBusiness,
  ArrowUpRight,
  Sparkles,
  Zap,
} from "lucide-react";

const actions = [
  {
    title: "Career Roadmap",
    description: "Milestones, stages & track progress",
    tag: "Curriculum",
    icon: Compass,
    color: "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-800/60",
    page: "Career Roadmap",
  },
  {
    title: "Practice Interview",
    description: "Timed answers, model solutions & hints",
    tag: "Placement Prep",
    icon: MessagesSquare,
    color: "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-950/70 dark:text-violet-300 dark:border-violet-800/60",
    page: "Interview Practice",
  },
  {
    title: "Job Analyzer",
    description: "Scan JD for skill gaps & 1-click add",
    tag: "Match Score",
    icon: FileSearch,
    color: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-cyan-950/70 dark:text-cyan-300 dark:border-cyan-800/60",
    page: "Job Analyzer",
  },
  {
    title: "Application Tracker",
    description: "Kanban pipeline, rounds & status",
    tag: "Job Pipeline",
    icon: BriefcaseBusiness,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/60",
    page: "Application Tracker",
  },
];

export default function QuickActions({ onNavigate }) {
  return (
    <section className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800/80 dark:bg-[#0f172a] transition-colors">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
            <Zap size={18} />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Quick Actions</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              One-click access to your primary preparation workspaces
            </p>
          </div>
        </div>
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
          <Sparkles size={14} />
        </span>
      </div>

      {/* 2x2 Action Tiles (flex-1 to occupy full height) */}
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 py-1">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              type="button"
              onClick={() => onNavigate?.(action.page)}
              className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-left transition duration-150 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-xs dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700 dark:hover:bg-slate-800/70"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${action.color} transition-transform group-hover:scale-105`}
                >
                  <Icon size={19} />
                </span>

                <span className="inline-flex items-center gap-0.5 rounded-md bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                  {action.tag}
                  <ArrowUpRight
                    size={11}
                    className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                  />
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {action.title}
                </h4>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Launcher Footer */}
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-indigo-100/70 bg-indigo-50/60 dark:border-indigo-900/50 dark:bg-indigo-950/40 px-3.5 py-2.5 text-xs text-indigo-900 dark:text-indigo-200">
        <span className="font-semibold text-[11px]">
          Targeting placement rounds?
        </span>
        <button
          type="button"
          onClick={() => onNavigate?.("Interview Practice")}
          className="font-bold text-[11px] text-indigo-700 dark:text-indigo-300 hover:underline inline-flex items-center gap-1"
        >
          Mock Questions &rarr;
        </button>
      </div>
    </section>
  );
}
