import { useEffect, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Clock3,
  Plus,
  Trash2,
  Pencil,
  X,
  Target,
  Sparkles,
} from "lucide-react";
import { recordActivity } from "../utils/recentActivity";
import { recordLearningActivity } from "../utils/learningStreak";

const STORAGE_KEY = "skillpilot-daily-tasks";

const categories = [
  "Learning",
  "Coding / DSA",
  "Project",
  "Interview",
  "Habit",
  "Personal",
];

const categoryStyles = {
  Learning:
    "bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60",
  "Coding / DSA":
    "bg-violet-50 text-violet-700 border-violet-200/60 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800/60",
  Project:
    "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/60 dark:text-cyan-300 dark:border-cyan-800/60",
  Interview:
    "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60",
  Habit:
    "bg-orange-50 text-orange-700 border-orange-200/60 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/60",
  Personal:
    "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60",
};

const starterTasks = [
  {
    id: "daily-1",
    title: "Master React useEffect & Cleanup Functions",
    category: "Learning",
    duration: 45,
    due: "Today",
    completed: true,
  },
  {
    id: "daily-2",
    title: "Solve 2 Medium LeetCode Binary Tree Problems",
    category: "Coding / DSA",
    duration: 60,
    due: "Today",
    completed: false,
  },
  {
    id: "daily-3",
    title: "Build Responsive Navbar for Portfolio Project",
    category: "Project",
    duration: 45,
    due: "Today",
    completed: false,
  },
  {
    id: "daily-4",
    title: "Practise JavaScript Closure Interview Explanations",
    category: "Interview",
    duration: 30,
    due: "Tomorrow",
    completed: false,
  },
];

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (error) {
    console.error("Unable to load daily tasks:", error);
  }
  return starterTasks;
}

const emptyForm = {
  title: "",
  category: "Learning",
  duration: "45",
  due: "Today",
};

export default function DailyProgress() {
  const [tasks, setTasks] = useState(loadTasks);
  const [selectedDay, setSelectedDay] = useState("Today");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickCategory, setQuickCategory] = useState("Coding / DSA");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Unable to save daily tasks:", error);
    }
  }, [tasks]);

  function handleQuickAdd(e) {
    e.preventDefault();
    const title = quickTitle.trim();
    if (!title) return;

    const newTask = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      category: quickCategory,
      duration: 45,
      due: selectedDay,
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    recordActivity(`Added task: ${title}`, "task");
    setQuickTitle("");
  }

  const todayTasks = tasks.filter((task) => task.due === "Today");
  const completedToday = todayTasks.filter((task) => task.completed).length;
  const progress = todayTasks.length
    ? Math.round((completedToday / todayTasks.length) * 100)
    : 0;

  // Calculate planned study time
  const totalMinutesToday = todayTasks.reduce(
    (sum, t) => sum + (Number(t.duration) || 0),
    0,
  );
  const completedMinutesToday = todayTasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + (Number(t.duration) || 0), 0);

  const visibleTasks = tasks.filter((task) => task.due === selectedDay);

  function openAddForm() {
    setEditingId(null);
    setForm({ ...emptyForm, due: selectedDay });
    setShowForm(true);
  }

  function openEditForm(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      category: task.category,
      duration: String(task.duration),
      due: task.due,
    });
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const title = form.title.trim();
    const duration = Number(form.duration);

    if (!title || !Number.isFinite(duration) || duration < 1) return;

    if (editingId !== null) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingId
            ? {
                ...task,
                title,
                category: form.category,
                duration,
                due: form.due,
              }
            : task,
        ),
      );
      recordActivity(`Updated task: ${title}`, "task");
    } else {
      const newTask = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title,
        category: form.category,
        duration,
        due: form.due,
        completed: false,
      };

      setTasks((previous) => [...previous, newTask]);
      recordActivity(`Added task: ${title}`, "task");
    }

    setSelectedDay(form.due);
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function toggleTask(task) {
    const willComplete = !task.completed;

    setTasks((previous) =>
      previous.map((item) =>
        item.id === task.id ? { ...item, completed: willComplete } : item,
      ),
    );

    recordActivity(
      `${willComplete ? "Completed" : "Reopened"} task: ${task.title}`,
      "task",
    );

    if (willComplete) {
      recordLearningActivity();
    }
  }

  function deleteTask(task) {
    setTasks((previous) => previous.filter((item) => item.id !== task.id));
    recordActivity(`Deleted task: ${task.title}`, "task");
  }

  return (
    <section className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800/80 dark:bg-[#0f172a] transition-colors">
      <div>
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none">
              <CalendarCheck size={22} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                  Daily Action Plan
                </h2>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                  {completedToday}/{todayTasks.length} Completed
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track daily coding, learning, and projects. Consistency builds
                mastery.
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1">
              {["Today", "Tomorrow"].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                    selectedDay === day
                      ? "bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:brightness-105"
            >
              <Plus size={15} />
              Add Task
            </button>
          </div>
        </div>

        {/* Metric Strips */}
        <div className="my-4 grid grid-cols-3 gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-800/40">
            <CheckCircle2 className="shrink-0 text-emerald-500 dark:text-emerald-400" size={18} />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate font-mono-code">
                {completedToday}/{todayTasks.length} Done
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Today's tasks</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-800/40">
            <Clock3 className="shrink-0 text-indigo-500 dark:text-indigo-400" size={18} />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate font-mono-code">
                {completedMinutesToday}/{totalMinutesToday}m
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Study time</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-800/40">
            <Target className="shrink-0 text-violet-500 dark:text-violet-400" size={18} />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate font-mono-code">
                {progress}%
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Completion</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {selectedDay}'s Progress
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono-code">{progress}%</span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-indigo-500 via-indigo-600 to-violet-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task List & Inline Quick Add (flex-1 to distribute full height) */}
      <div className="flex flex-1 flex-col justify-between">
        {visibleTasks.length > 0 ? (
          <div className="space-y-2 py-1">
            {visibleTasks.map((task) => (
              <div
                key={task.id}
                className={`group flex items-center gap-3 rounded-2xl border p-3.5 transition ${
                  task.completed
                    ? "border-emerald-200/60 bg-emerald-50/30 text-slate-400 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-slate-500"
                    : "border-slate-200/80 bg-white hover:border-indigo-200 hover:shadow-xs dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task)}
                  aria-label={`${task.completed ? "Reopen" : "Complete"} ${task.title}`}
                  className="shrink-0 transition-transform active:scale-90"
                >
                  {task.completed ? (
                    <CheckCircle2 className="text-emerald-500 dark:text-emerald-400" size={21} />
                  ) : (
                    <Circle
                      className="text-slate-300 transition hover:text-indigo-600 dark:text-slate-600 dark:hover:text-indigo-400"
                      size={21}
                    />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-semibold transition-all ${
                      task.completed
                        ? "text-slate-400 line-through dark:text-slate-500"
                        : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {task.title}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                        categoryStyles[task.category] ||
                        "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {task.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-400">
                      <Clock3 size={11} />
                      {task.duration} mins
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex shrink-0 items-center gap-1 opacity-80 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => openEditForm(task)}
                    aria-label={`Edit ${task.title}`}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTask(task)}
                    aria-label={`Delete ${task.title}`}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center dark:border-slate-800 dark:bg-slate-800/30">
            <CalendarCheck className="mx-auto mb-2 text-slate-300 dark:text-slate-600" size={28} />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No tasks planned for {selectedDay.toLowerCase()}.
            </p>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
              Plan your learning topics, DSA problems, or project milestones.
            </p>
            <button
              type="button"
              onClick={openAddForm}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <Plus size={14} /> Add your first task
            </button>
          </div>
        )}

        {/* Completion Celebratory Banner */}
        {todayTasks.length > 0 && completedToday === todayTasks.length && (
          <div className="mt-3 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>
              Awesome work! You have completed all planned tasks for today.
            </span>
          </div>
        )}

        {/* Inline Quick Add Task Strip */}
        <form
          onSubmit={handleQuickAdd}
          className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800"
        >
          <input
            type="text"
            placeholder={`+ Quick add a task for ${selectedDay.toLowerCase()}...`}
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
          />
          <select
            value={quickCategory}
            onChange={(e) => setQuickCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-[11px] font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-xs transition hover:brightness-110 dark:bg-indigo-500"
          >
            <Plus size={14} /> Add
          </button>
        </form>
      </div>

      {/* Task Modal (Add / Edit) */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-xs">
          <div
            role="dialog"
            aria-modal="true"
            className="my-auto w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-[#0f172a] sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingId !== null ? "Edit Task" : "Add Daily Task"}
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close task form"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="daily-task-title"
                  className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Task Description
                </label>
                <input
                  id="daily-task-title"
                  autoFocus
                  required
                  maxLength={120}
                  value={form.title}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                  placeholder="e.g. Build React component, Solve 2 LeetCode problems..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-900/40"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="daily-task-category"
                    className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Category
                  </label>
                  <select
                    id="daily-task-category"
                    value={form.category}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        category: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="daily-task-duration"
                    className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Duration (Minutes)
                  </label>
                  <input
                    id="daily-task-duration"
                    type="number"
                    min="5"
                    max="600"
                    step="5"
                    required
                    value={form.duration}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        duration: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="daily-task-day"
                  className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Schedule For
                </label>
                <select
                  id="daily-task-day"
                  value={form.due}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      due: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
                >
                  <Plus size={14} />
                  {editingId !== null ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
