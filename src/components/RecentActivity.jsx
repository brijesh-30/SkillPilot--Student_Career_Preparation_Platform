import { useEffect, useState } from "react";
import { Activity, CheckCircle2, RotateCcw, Clock, Sparkles } from "lucide-react";
import { getRecentActivities, EVENT_NAME } from "../utils/recentActivity";

function getTimeLabel(timestamp) {
  const activityTime = new Date(timestamp);
  const now = new Date();

  if (Number.isNaN(activityTime.getTime())) return "Recently";

  const diff = Math.max(0, now.getTime() - activityTime.getTime());
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";

  return `${days}d ago`;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState(() => getRecentActivities());

  useEffect(() => {
    const refreshActivities = () => setActivities(getRecentActivities());

    window.addEventListener(EVENT_NAME, refreshActivities);
    window.addEventListener("storage", refreshActivities);

    return () => {
      window.removeEventListener(EVENT_NAME, refreshActivities);
      window.removeEventListener("storage", refreshActivities);
    };
  }, []);

  return (
    <section className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800/80 dark:bg-[#0f172a] transition-colors">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/70 dark:text-violet-400">
            <Activity size={18} />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Live Activity Stream
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Real-time log of tasks, roadmap skills & interview practice
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-950/70 dark:text-violet-300">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* Activity Items (flex-1 to occupy available height evenly) */}
      <div className="flex flex-1 flex-col justify-between py-1 space-y-2">
        {activities.length > 0 ? (
          activities.slice(0, 5).map((item) => {
            const isReopened = item.message.startsWith("Reopened");
            const isCompleted = item.message.startsWith("Completed");

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-xs transition hover:bg-white hover:border-slate-200 hover:shadow-xs dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700 dark:hover:bg-slate-800/70"
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
                    isCompleted
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400"
                      : isReopened
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400"
                        : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-400"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={15} />
                  ) : isReopened ? (
                    <RotateCcw size={14} />
                  ) : (
                    <Sparkles size={14} />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate">
                    {item.message}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-mono-code">
                    <Clock size={10} />
                    {getTimeLabel(item.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400">
            <Activity className="mx-auto mb-2 text-slate-300 dark:text-slate-600" size={24} />
            <p className="font-semibold text-slate-700 dark:text-slate-200">No events logged yet</p>
            <p className="mt-0.5 text-slate-400 dark:text-slate-500">
              Complete a task, check off a roadmap skill, or practice an interview question.
            </p>
          </div>
        )}
      </div>

      {/* Footer Log Info */}
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-3.5 py-2 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
        <span>Logged automatically in browser</span>
        <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono-code">
          {activities.length} total events
        </span>
      </div>
    </section>
  );
}
