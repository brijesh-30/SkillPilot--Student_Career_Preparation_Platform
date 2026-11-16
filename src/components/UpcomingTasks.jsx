
import { recordActivity } from "../utils/recentActivity";
import { useEffect, useState } from "react";
import { CheckCircle, Circle, Clock, ListTodo } from "lucide-react";

const initialTasks = [
  { id: 1, title: "Complete React tutorial", category: "Learning", due: "Today", color: "violet" },
  { id: 2, title: "Solve 5 DSA problems", category: "Practice", due: "Today", color: "blue" },
  { id: 3, title: "Build a small React project", category: "Project", due: "Tomorrow", color: "emerald" },
  { id: 4, title: "Practise technical interview questions", category: "Interview", due: "Tomorrow", color: "amber" },
];

const STORAGE_KEY = "skillpilot-upcoming-tasks";

const categoryStyles = {
  violet: "bg-violet-100 text-violet-700",
  blue: "bg-blue-100 text-blue-700",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
};

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const savedTasks = JSON.parse(saved);
      if (Array.isArray(savedTasks)) {
        return initialTasks.map((task) => {
          const savedTask = savedTasks.find((item) => item.id === task.id);
          return {
            ...task,
            completed: typeof savedTask?.completed === "boolean"
              ? savedTask.completed
              : false,
          };
        });
      }
    }
  } catch (error) {
    console.error("Unable to load upcoming tasks:", error);
  }

  return initialTasks.map((task) => ({ ...task, completed: false }));
}

export default function UpcomingTasks() {
  const [tasks, setTasks] = useState(loadTasks);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Unable to save upcoming tasks:", error);
    }
  }, [tasks]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  function toggleTask(id) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    const willComplete = !task.completed;

    setTasks((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );

    recordActivity(
      willComplete
        ? `Completed task: ${task.title}`
        : `Reopened task: ${task.title}`,
      "task"
    );
  }

  return (
    <section className="group flex h-full flex-col rounded-2xl border border-orange-200/80 bg-linear-to-br from-orange-50 via-amber-50 to-white p-4 shadow-sm transition duration-200 hover:shadow-md sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-orange-700">
            Stay on track
          </p>
          <h3 className="text-base font-bold text-slate-900">Upcoming Tasks</h3>
          <p className="mt-1 text-xs text-slate-500">
            Small actions create big progress.
          </p>
        </div>

        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-200">
          <ListTodo size={21} />
        </div>
      </div>

      <div className="mb-3 rounded-xl border border-orange-100 bg-white/80 p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-600">Task progress</span>
          <span className="text-xs font-bold text-orange-700">
            {completedCount}/{tasks.length}
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-orange-100"
          role="progressbar"
          aria-label="Upcoming task completion"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-orange-400 to-amber-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1.5 text-right text-[11px] text-slate-500">
          {progress}% complete
        </p>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => toggleTask(task.id)}
            aria-pressed={Boolean(task.completed)}
            className={`flex w-full items-start gap-2.5 rounded-xl border p-3 text-left transition ${
              task.completed
                ? "border-emerald-200 bg-emerald-50"
                : "border-orange-100 bg-white/85 hover:border-orange-300 hover:shadow-sm"
            }`}
          >
            {task.completed ? (
              <CheckCircle className="mt-0.5 shrink-0 text-emerald-600" size={19} />
            ) : (
              <Circle className="mt-0.5 shrink-0 text-slate-300 group-hover:text-orange-500" size={19} />
            )}

            <span className="min-w-0 flex-1">
              <span className={`block text-sm font-semibold leading-5 ${
                task.completed ? "text-slate-400 line-through" : "text-slate-700"
              }`}>
                {task.title}
              </span>
              <span className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                <Clock size={11} /> {task.due}
              </span>
            </span>

            <span className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${categoryStyles[task.color]}`}>
              {task.category}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-slate-500">
        {completedCount === tasks.length
          ? "Amazing work — all tasks completed! 🎉"
          : "Every completed task counts. ✨"}
      </p>
    </section>
  );
}
