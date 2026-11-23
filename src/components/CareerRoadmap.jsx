
import { useEffect, useMemo, useState } from "react";
import {
  Target,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  X,
  Save,
  Layers,
  Clock,
  GraduationCap,
  Code2,
  Rocket,
  BriefcaseBusiness,
} from "lucide-react";
import { recordLearningActivity } from "../utils/learningStreak";
import { CAREER_TRACKS } from "../utils/careerTracks";

const STORAGE_KEY = "skillpilot-custom-roadmap";
const PROGRESS_KEY = "skillpilot-roadmap-progress";
const PROGRESS_EVENT = "skillpilot-progress-updated";

const defaultStages = [
  {
    id: "stage-1",
    title: "Frontend Fundamentals",
    subtitle: "Build a strong foundation",
    description: "Learn the core technologies behind modern websites.",
    duration: "2–3 weeks",
    skills: [
      { id: "skill-1", name: "HTML", completed: false },
      { id: "skill-2", name: "CSS", completed: false },
      { id: "skill-3", name: "JavaScript", completed: false },
      { id: "skill-4", name: "Responsive Design", completed: false },
    ],
  },
  {
    id: "stage-2",
    title: "Modern Frontend Frameworks",
    subtitle: "Build interactive interfaces",
    description: "Create reusable components and modern user interfaces.",
    duration: "3–4 weeks",
    skills: [
      { id: "skill-5", name: "React", completed: false },
      { id: "skill-6", name: "Tailwind CSS", completed: false },
      { id: "skill-7", name: "React Hooks", completed: false },
      { id: "skill-8", name: "API Integration", completed: false },
      { id: "skill-9", name: "TanStack Query", completed: false },
    ],
  },
  {
    id: "stage-3",
    title: "Projects & Portfolio",
    subtitle: "Turn knowledge into proof",
    description: "Build projects that demonstrate your practical skills.",
    duration: "2–4 weeks",
    skills: [
      { id: "skill-10", name: "Git", completed: false },
      { id: "skill-11", name: "GitHub", completed: false },
      { id: "skill-12", name: "Project Building", completed: false },
      { id: "skill-13", name: "Deployment", completed: false },
    ],
  },
  {
    id: "stage-4",
    title: "DSA & Interview Preparation",
    subtitle: "Strengthen problem-solving",
    description:
      "Prepare for technical interviews and explain your solutions.",
    duration: "Ongoing",
    skills: [
      { id: "skill-14", name: "Data Structures", completed: false },
      { id: "skill-15", name: "Algorithms", completed: false },
      { id: "skill-16", name: "JavaScript Interviews", completed: false },
      { id: "skill-17", name: "Communication", completed: false },
    ],
  },
  {
    id: "stage-5",
    title: "Job Readiness",
    subtitle: "Prepare for opportunities",
    description: "Present your skills and projects professionally.",
    duration: "Ongoing",
    skills: [
      { id: "skill-18", name: "Resume", completed: false },
      { id: "skill-19", name: "Portfolio Website", completed: false },
      { id: "skill-20", name: "Interview Practice", completed: false },
      { id: "skill-21", name: "Job Search", completed: false },
    ],
  },
];

const stageIcons = [
  GraduationCap,
  Code2,
  Rocket,
  Target,
  BriefcaseBusiness,
];

const stageColors = [
  {
    icon: "bg-blue-100 text-blue-700 dark:bg-cyan-950/70 dark:text-cyan-300",
    badge: "bg-blue-50 text-blue-700 dark:bg-cyan-950/60 dark:text-cyan-300",
    bar: "from-blue-500 to-cyan-400",
  },
  {
    icon: "bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300",
    badge: "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
    bar: "from-violet-500 to-indigo-500",
  },
  {
    icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    bar: "from-emerald-500 to-teal-400",
  },
  {
    icon: "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    bar: "from-amber-500 to-orange-400",
  },
  {
    icon: "bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300",
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
    bar: "from-rose-500 to-pink-400",
  },
];

function loadRoadmap() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (
        parsed &&
        typeof parsed.name === "string" &&
        Array.isArray(parsed.stages)
      ) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Could not load the custom roadmap:", error);
  }

  return {
    name: "My Career Roadmap",
    stages: defaultStages,
  };
}

function getProgress(stages) {
  const allSkills = stages.flatMap((stage) => stage.skills || []);
  const completed = allSkills.filter((skill) => skill.completed).length;

  return {
    total: allSkills.length,
    completed,
    remaining: allSkills.length - completed,
    percentage: allSkills.length
      ? Math.round((completed / allSkills.length) * 100)
      : 0,
  };
}

function getStageProgress(stage) {
  const skills = stage.skills || [];
  const total = skills.length;
  const completed = skills.filter((skill) => skill.completed).length;

  return {
    total,
    completed,
    percentage: total ? Math.round((completed / total) * 100) : 0,
  };
}

function publishProgress(stages) {
  const { percentage } = getProgress(stages);

  try {
    localStorage.setItem(PROGRESS_KEY, String(percentage));
  } catch (error) {
    console.error("Could not save roadmap progress:", error);
  }

  window.dispatchEvent(
    new CustomEvent(PROGRESS_EVENT, {
      detail: { progress: percentage },
    }),
  );
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function moveItem(items, index, direction) {
  const nextIndex = index + direction;

  if (nextIndex < 0 || nextIndex >= items.length) return items;

  const updated = [...items];
  [updated[index], updated[nextIndex]] = [
    updated[nextIndex],
    updated[index],
  ];

  return updated;
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function ActionButton({ onClick, children, disabled, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
    >
      {children}
    </button>
  );
}

export default function CareerRoadmap({ selectedSearchResult }) {
  const [roadmap, setRoadmap] = useState(loadRoadmap);
  const [expandedStage, setExpandedStage] = useState("stage-1");
  const [highlightedSkillId, setHighlightedSkillId] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(roadmap.name);
  const [editingStage, setEditingStage] = useState(null);
  const [stageDraft, setStageDraft] = useState({});
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillDraft, setSkillDraft] = useState("");
  const [addingSkillTo, setAddingSkillTo] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [addingStage, setAddingStage] = useState(false);
  const [newStageTitle, setNewStageTitle] = useState("");

  const { stages } = roadmap;
  const progress = useMemo(() => getProgress(stages), [stages]);

  // Save roadmap changes and update overall progress.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmap));
    } catch (error) {
      console.error("Could not save the custom roadmap:", error);
    }

    publishProgress(roadmap.stages);
  }, [roadmap]);

  // Navigate to a matching stage or skill selected from global search.
  useEffect(() => {
    if (!selectedSearchResult) return;

    const query = normalizeText(selectedSearchResult.title);

    if (!query) return;

    let matchingStage = null;
    let matchingSkill = null;

    for (const stage of roadmap.stages) {
      const skill = (stage.skills || []).find(
        (item) => normalizeText(item.name) === query,
      );

      if (skill) {
        matchingStage = stage;
        matchingSkill = skill;
        break;
      }

      if (normalizeText(stage.title) === query) {
        matchingStage = stage;
        break;
      }
    }

    if (matchingStage) {
      setExpandedStage(matchingStage.id);
      setHighlightedSkillId(matchingSkill?.id || null);
    } else {
      setHighlightedSkillId(null);
    }
  }, [selectedSearchResult, roadmap.stages]);

  // Scroll to the selected skill after the matching stage expands.
  useEffect(() => {
    if (!highlightedSkillId || !expandedStage) return;

    const element = document.getElementById(
      `roadmap-skill-${highlightedSkillId}`,
    );

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [highlightedSkillId, expandedStage, roadmap.stages]);

  function updateStages(updater) {
    setRoadmap((previous) => ({
      ...previous,
      stages:
        typeof updater === "function"
          ? updater(previous.stages)
          : updater,
    }));
  }

  function saveRoadmapName() {
    const name = nameDraft.trim();
    if (!name) return;

    setRoadmap((previous) => ({ ...previous, name }));
    setEditingName(false);
  }

  function startEditingStage(stage) {
    setEditingStage(stage.id);
    setStageDraft({
      title: stage.title,
      subtitle: stage.subtitle,
      description: stage.description,
      duration: stage.duration,
    });
  }

  function saveStage() {
    if (!stageDraft.title?.trim()) return;

    updateStages((previous) =>
      previous.map((stage) =>
        stage.id === editingStage
          ? {
              ...stage,
              title: stageDraft.title.trim(),
              subtitle: (stageDraft.subtitle || "").trim(),
              description: (stageDraft.description || "").trim(),
              duration: (stageDraft.duration || "").trim(),
            }
          : stage,
      ),
    );

    setEditingStage(null);
  }

  function addStage() {
    const title = newStageTitle.trim();
    if (!title) return;

    const id = `stage-${makeId()}`;

    updateStages((previous) => [
      ...previous,
      {
        id,
        title,
        subtitle: "Your next learning milestone",
        description: "Customize this stage to fit your career goals.",
        duration: "Set your own pace",
        skills: [],
      },
    ]);

    setExpandedStage(id);
    setNewStageTitle("");
    setAddingStage(false);
  }

  function deleteStage(stageId) {
    const stage = stages.find((item) => item.id === stageId);
    if (!stage) return;

    if (
      !window.confirm(
        `Delete "${stage.title}" and all its skills? This cannot be undone.`,
      )
    ) {
      return;
    }

    updateStages((previous) =>
      previous.filter((item) => item.id !== stageId),
    );

    if (expandedStage === stageId) setExpandedStage(null);
    if (stage.skills?.some((skill) => skill.id === highlightedSkillId)) {
      setHighlightedSkillId(null);
    }
  }

  function addSkill(stageId) {
    const name = newSkill.trim();
    if (!name) return;

    updateStages((previous) =>
      previous.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              skills: [
                ...(stage.skills || []),
                {
                  id: `skill-${makeId()}`,
                  name,
                  completed: false,
                },
              ],
            }
          : stage,
      ),
    );

    setNewSkill("");
    setAddingSkillTo(null);
  }

  function saveSkill(stageId, skillId) {
    const name = skillDraft.trim();
    if (!name) return;

    updateStages((previous) =>
      previous.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              skills: stage.skills.map((skill) =>
                skill.id === skillId ? { ...skill, name } : skill,
              ),
            }
          : stage,
      ),
    );

    setEditingSkill(null);
    setSkillDraft("");
  }

  function deleteSkill(stageId, skillId) {
    updateStages((previous) =>
      previous.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              skills: stage.skills.filter((skill) => skill.id !== skillId),
            }
          : stage,
      ),
    );

    if (highlightedSkillId === skillId) {
      setHighlightedSkillId(null);
    }
  }

  function toggleSkill(stageId, skillId) {
    const skill = stages
      .find((stage) => stage.id === stageId)
      ?.skills.find((item) => item.id === skillId);

    if (!skill) return;

    const completing = !skill.completed;

    updateStages((previous) =>
      previous.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              skills: stage.skills.map((item) =>
                item.id === skillId
                  ? { ...item, completed: !item.completed }
                  : item,
              ),
            }
          : stage,
      ),
    );

    if (completing) recordLearningActivity();
  }

  function getSkillStatus(stageId, skillId) {
    const orderedSkills = stages.flatMap((stage) =>
      (stage.skills || []).map((skill) => ({
        ...skill,
        stageId: stage.id,
      })),
    );

    const skill = orderedSkills.find((item) => item.id === skillId);
    if (skill?.completed) return "Completed";

    const nextSkill = orderedSkills.find((item) => !item.completed);

    if (nextSkill?.id === skillId && nextSkill?.stageId === stageId) {
      return "Currently learning";
    }

    return "Up next";
  }

  function loadTrack(trackId) {
    const track = CAREER_TRACKS.find((t) => t.id === trackId);
    if (!track) return;

    if (
      !window.confirm(
        `Load the ${track.name} curriculum? Your current roadmap will be updated with this track.`
      )
    ) {
      return;
    }

    setRoadmap({
      name: `${track.name} Roadmap`,
      stages: track.stages,
    });

    setExpandedStage(track.stages[0]?.id || null);
    setHighlightedSkillId(null);
    setNameDraft(`${track.name} Roadmap`);
  }

  function resetRoadmap() {
    if (
      !window.confirm(
        "Replace your custom roadmap with the default Frontend Developer roadmap? Your custom changes will be lost.",
      )
    ) {
      return;
    }

    setRoadmap({
      name: "My Career Roadmap",
      stages: defaultStages,
    });

    setExpandedStage("stage-1");
    setHighlightedSkillId(null);
    setNameDraft("My Career Roadmap");
  }

  return (
    <section id="career-roadmap" className="scroll-mt-24 space-y-6">
      {/* Roadmap overview banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-violet-200">
              <Sparkles size={14} />
              YOUR PERSONAL CAREER PLAN
            </div>

            {editingName ? (
              <div className="flex max-w-xl flex-col gap-2 sm:flex-row">
                <input
                  autoFocus
                  value={nameDraft}
                  onChange={(event) => setNameDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") saveRoadmapName();
                    if (event.key === "Escape") setEditingName(false);
                  }}
                  className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-lg font-bold text-white outline-none placeholder:text-slate-400 focus:border-violet-300"
                  placeholder="Roadmap name"
                  aria-label="Roadmap name"
                />
                <button
                  type="button"
                  onClick={saveRoadmapName}
                  className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-50"
                >
                  <Save size={16} className="mr-1 inline" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingName(false)}
                  className="rounded-lg border border-white/20 px-3 py-2 text-sm text-white hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold sm:text-3xl">
                  {roadmap.name}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setNameDraft(roadmap.name);
                    setEditingName(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-violet-100 hover:bg-white/20"
                >
                  <Pencil size={13} />
                  Rename
                </button>
              </div>
            )}

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Customize your learning journey, mark skills you have learned,
              and track your progress toward becoming job-ready.
            </p>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-300">
              <span>{stages.length} learning stages</span>
              <span>{progress.completed} skills completed</span>
              <span>{progress.remaining} skills remaining</span>
            </div>

            <div className="mt-3 h-2 max-w-2xl overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-linear-to-r from-cyan-300 via-violet-300 to-fuchsia-300 transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
              <Target size={27} className="text-violet-200" />
            </div>
            <div>
              <p className="text-sm text-slate-300">Overall progress</p>
              <p className="mt-1 text-3xl font-bold">
                {progress.percentage}%
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {progress.completed} of {progress.total} skills
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stage list and customization */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-7 dark:border-slate-800/80 dark:bg-[#0f172a] transition-colors">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Your learning journey
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Select skills as you learn them. Your progress saves
              automatically.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  loadTrack(e.target.value);
                  e.target.value = "";
                }
              }}
              aria-label="Switch career curriculum track"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:border-slate-300 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600"
            >
              <option value="" disabled>
                Switch Track ▾
              </option>
              {CAREER_TRACKS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setAddingStage(!addingStage)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-700"
            >
              <Plus size={15} />
              Add Stage
            </button>

            <ActionButton onClick={resetRoadmap}>
              Reset
            </ActionButton>
          </div>
        </div>

        {addingStage && (
          <form
            className="mb-5 flex flex-col gap-2 rounded-xl border border-violet-200 bg-violet-50/50 p-4 sm:flex-row dark:border-violet-900/50 dark:bg-violet-950/30"
            onSubmit={(event) => {
              event.preventDefault();
              addStage();
            }}
          >
            <input
              autoFocus
              value={newStageTitle}
              onChange={(event) => setNewStageTitle(event.target.value)}
              placeholder="Enter stage name"
              aria-label="New stage name"
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-violet-900/40"
            />
            <button
              type="submit"
              className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Create stage
            </button>
            <ActionButton onClick={() => setAddingStage(false)}>
              <X size={14} />
              Cancel
            </ActionButton>
          </form>
        )}

        <div className="space-y-4">
          {stages.map((stage, index) => {
            const StageIcon = stageIcons[index % stageIcons.length];
            const colors = stageColors[index % stageColors.length];
            const stageProgress = getStageProgress(stage);
            const isExpanded = expandedStage === stage.id;

            const status =
              stageProgress.total > 0 && stageProgress.percentage === 100
                ? "Completed"
                : stageProgress.completed > 0
                  ? "In progress"
                  : index === 0 ||
                      stages
                        .slice(0, index)
                        .every(
                          (item) =>
                            (item.skills || []).length > 0 &&
                            item.skills.every((skill) => skill.completed),
                        )
                    ? "Ready to start"
                    : "Upcoming";

            return (
              <article
                key={stage.id}
                className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                  isExpanded
                    ? "border-violet-200 bg-linear-to-br from-white to-violet-50/40 shadow-md shadow-violet-100/50 dark:border-violet-900/60 dark:from-[#0f172a] dark:to-violet-950/20 dark:shadow-none"
                    : "border-slate-200 bg-white hover:border-violet-200 hover:shadow-sm dark:border-slate-800 dark:bg-[#0f172a] dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-start gap-3 p-4 sm:items-center sm:gap-4 sm:p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700 dark:bg-violet-950/80 dark:text-violet-300">
                    {index + 1}
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors.icon}`}
                  >
                    {stageProgress.total > 0 &&
                    stageProgress.percentage === 100 ? (
                      <CheckCircle2 size={22} />
                    ) : (
                      <StageIcon size={22} />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedStage(isExpanded ? null : stage.id)
                    }
                    aria-expanded={isExpanded}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Stage {index + 1}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${colors.badge}`}
                      >
                        {status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-800 dark:text-white">
                      {stage.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                      {stage.subtitle}
                    </p>
                  </button>

                  <div className="hidden w-24 shrink-0 sm:block">
                    <div className="mb-1 text-right text-xs font-bold text-slate-600 dark:text-slate-300 font-mono-code">
                      {stageProgress.percentage}%
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className={`h-full rounded-full bg-linear-to-r ${colors.bar} transition-all duration-500`}
                        style={{ width: `${stageProgress.percentage}%` }}
                      />
                    </div>
                    <p className="mt-1 text-right text-[10px] text-slate-400 dark:text-slate-500 font-mono-code">
                      {stageProgress.completed}/{stageProgress.total} skills
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <ActionButton
                      title="Move stage up"
                      disabled={index === 0}
                      onClick={() =>
                        updateStages((previous) =>
                          moveItem(previous, index, -1),
                        )
                      }
                    >
                      <ArrowUp size={14} />
                    </ActionButton>
                    <ActionButton
                      title="Move stage down"
                      disabled={index === stages.length - 1}
                      onClick={() =>
                        updateStages((previous) =>
                          moveItem(previous, index, 1),
                        )
                      }
                    >
                      <ArrowDown size={14} />
                    </ActionButton>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedStage(isExpanded ? null : stage.id)
                      }
                      aria-label={
                        isExpanded ? "Collapse stage" : "Expand stage"
                      }
                      className="rounded-lg p-2 text-slate-400 hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-slate-800 dark:hover:text-violet-300"
                    >
                      {isExpanded ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-violet-100 dark:border-slate-800/80 px-4 pb-5 pt-4 sm:px-5">
                    {editingStage === stage.id ? (
                      <form
                        className="space-y-3"
                        onSubmit={(event) => {
                          event.preventDefault();
                          saveStage();
                        }}
                      >
                        {[
                          ["title", "Stage name"],
                          ["subtitle", "Subtitle"],
                          ["description", "Description"],
                          ["duration", "Suggested duration"],
                        ].map(([key, label]) => (
                          <label
                            key={key}
                            className="block text-xs font-semibold text-slate-600 dark:text-slate-300"
                          >
                            {label}
                            <input
                              value={stageDraft[key] ?? ""}
                              onChange={(event) =>
                                setStageDraft((previous) => ({
                                  ...previous,
                                  [key]: event.target.value,
                                }))
                              }
                              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-violet-900/40"
                            />
                          </label>
                        ))}

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="submit"
                            className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                          >
                            <Save size={14} className="mr-1 inline" />
                            Save changes
                          </button>
                          <ActionButton
                            onClick={() => setEditingStage(null)}
                          >
                            Cancel
                          </ActionButton>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                              {stage.description}
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                              <Clock size={14} />
                              Suggested duration: {stage.duration}
                            </div>
                          </div>

                          <div className="flex shrink-0 flex-wrap gap-2">
                            <ActionButton
                              onClick={() => startEditingStage(stage)}
                            >
                              <Pencil size={13} />
                              Edit
                            </ActionButton>
                            <ActionButton
                              onClick={() => deleteStage(stage.id)}
                            >
                              <Trash2 size={13} />
                              Delete
                            </ActionButton>
                          </div>
                        </div>

                        <div className="mt-5">
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Layers
                                size={16}
                                className="text-violet-600 dark:text-violet-400"
                              />
                              <h5 className="text-sm font-bold text-slate-800 dark:text-white">
                                Skills & technologies
                              </h5>
                              <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-950/70 dark:text-violet-300">
                                {stageProgress.completed}/{stageProgress.total}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setAddingSkillTo(stage.id);
                                setNewSkill("");
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700"
                            >
                              <Plus size={14} />
                              Add skill
                            </button>
                          </div>

                          {addingSkillTo === stage.id && (
                            <form
                              className="mb-4 flex flex-col gap-2 sm:flex-row"
                              onSubmit={(event) => {
                                event.preventDefault();
                                addSkill(stage.id);
                              }}
                            >
                              <input
                                autoFocus
                                value={newSkill}
                                onChange={(event) =>
                                  setNewSkill(event.target.value)
                                }
                                placeholder="e.g. TanStack Query"
                                aria-label="New skill name"
                                className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-violet-900/40"
                              />
                              <button
                                type="submit"
                                className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                              >
                                Add
                              </button>
                              <ActionButton
                                onClick={() => setAddingSkillTo(null)}
                              >
                                Cancel
                              </ActionButton>
                            </form>
                          )}

                          {(stage.skills || []).length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900/40">
                              <Layers
                                size={24}
                                className="mx-auto text-slate-400 dark:text-slate-500"
                              />
                              <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                No skills added yet
                              </p>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Add technologies or skills for this stage.
                              </p>
                            </div>
                          ) : (
                            <div className="grid gap-2 sm:grid-cols-2">
                              {stage.skills.map((skill, skillIndex) => {
                                const skillStatus = getSkillStatus(
                                  stage.id,
                                  skill.id,
                                );
                                const isEditing = editingSkill === skill.id;
                                const isHighlighted =
                                  highlightedSkillId === skill.id;

                                return (
                                  <div
                                    key={skill.id}
                                    id={`roadmap-skill-${skill.id}`}
                                    className={`flex min-w-0 items-start gap-2 rounded-xl border p-3 transition ${
                                      isHighlighted
                                        ? "border-violet-500 bg-violet-100 ring-2 ring-violet-300 shadow-md dark:border-violet-400 dark:bg-violet-950/70 dark:ring-violet-700"
                                        : skill.completed
                                          ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/30"
                                          : "border-slate-200 bg-white hover:border-violet-200 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={skill.completed}
                                      onChange={() =>
                                        toggleSkill(stage.id, skill.id)
                                      }
                                      aria-label={`Mark ${skill.name} as learned`}
                                      className="mt-1 h-4 w-4 shrink-0 accent-violet-600 rounded"
                                    />

                                    <div className="min-w-0 flex-1">
                                      {isEditing ? (
                                        <form
                                          onSubmit={(event) => {
                                            event.preventDefault();
                                            saveSkill(stage.id, skill.id);
                                          }}
                                        >
                                          <input
                                            autoFocus
                                            value={skillDraft}
                                            onChange={(event) =>
                                              setSkillDraft(event.target.value)
                                            }
                                            aria-label="Edit skill name"
                                            className="w-full rounded-md border border-violet-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-violet-100 dark:border-violet-700 dark:bg-slate-900 dark:text-white"
                                          />
                                          <div className="mt-2 flex gap-2">
                                            <button
                                              type="submit"
                                              className="text-xs font-semibold text-violet-700 hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200"
                                            >
                                              Save
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setEditingSkill(null)
                                              }
                                              className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </form>
                                      ) : (
                                        <>
                                          <p
                                            className={`wrap-break-word text-sm font-semibold ${
                                              skill.completed
                                                ? "text-emerald-800 dark:text-emerald-300"
                                                : "text-slate-800 dark:text-slate-100"
                                            }`}
                                          >
                                            {skill.name}
                                          </p>
                                          <p
                                            className={`mt-1 text-[11px] font-medium ${
                                              skill.completed
                                                ? "text-emerald-700 dark:text-emerald-400"
                                                : skillStatus ===
                                                    "Currently learning"
                                                  ? "text-indigo-600 dark:text-indigo-400"
                                                  : "text-slate-500 dark:text-slate-400"
                                            }`}
                                          >
                                            {skillStatus}
                                          </p>
                                          {isHighlighted && (
                                            <p className="mt-2 text-[11px] font-bold text-violet-700 dark:text-violet-300">
                                              <Target
                                                size={12}
                                                className="mr-1 inline"
                                              />
                                              Search result
                                            </p>
                                          )}
                                        </>
                                      )}
                                    </div>

                                    {!isEditing && (
                                      <div className="flex shrink-0 flex-wrap gap-1">
                                        <button
                                          type="button"
                                          title="Move skill up"
                                          aria-label={`Move ${skill.name} up`}
                                          disabled={skillIndex === 0}
                                          onClick={() =>
                                            updateStages((previous) =>
                                              previous.map((item) =>
                                                item.id === stage.id
                                                  ? {
                                                      ...item,
                                                      skills: moveItem(
                                                        item.skills,
                                                        skillIndex,
                                                        -1,
                                                      ),
                                                    }
                                                  : item,
                                              ),
                                            )
                                          }
                                          className="rounded p-1 text-slate-400 hover:bg-violet-100 hover:text-violet-700 disabled:opacity-30 dark:hover:bg-slate-800 dark:hover:text-violet-300"
                                        >
                                          <ArrowUp size={13} />
                                        </button>
                                        <button
                                          type="button"
                                          title="Move skill down"
                                          aria-label={`Move ${skill.name} down`}
                                          disabled={
                                            skillIndex === stage.skills.length - 1
                                          }
                                          onClick={() =>
                                            updateStages((previous) =>
                                              previous.map((item) =>
                                                item.id === stage.id
                                                  ? {
                                                      ...item,
                                                      skills: moveItem(
                                                        item.skills,
                                                        skillIndex,
                                                        1,
                                                      ),
                                                    }
                                                  : item,
                                              ),
                                            )
                                          }
                                          className="rounded p-1 text-slate-400 hover:bg-violet-100 hover:text-violet-700 disabled:opacity-30 dark:hover:bg-slate-800 dark:hover:text-violet-300"
                                        >
                                          <ArrowDown size={13} />
                                        </button>
                                        <button
                                          type="button"
                                          title="Edit skill"
                                          aria-label={`Edit ${skill.name}`}
                                          onClick={() => {
                                            setEditingSkill(skill.id);
                                            setSkillDraft(skill.name);
                                          }}
                                          className="rounded p-1 text-slate-400 hover:bg-violet-100 hover:text-violet-700 dark:hover:bg-slate-800 dark:hover:text-violet-300"
                                        >
                                          <Pencil size={13} />
                                        </button>
                                        <button
                                          type="button"
                                          title="Delete skill"
                                          aria-label={`Delete ${skill.name}`}
                                          onClick={() => {
                                            if (
                                              window.confirm(
                                                `Delete "${skill.name}"?`,
                                              )
                                            ) {
                                              deleteSkill(stage.id, skill.id);
                                            }
                                          }}
                                          className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </article>
            );
          })}

          {stages.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-800 dark:bg-slate-900/40">
              <Layers size={30} className="mx-auto text-violet-400 dark:text-violet-500" />
              <h4 className="mt-3 font-bold text-slate-800 dark:text-white">
                Start your learning journey
              </h4>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Add your first stage to create a personalized roadmap.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-100 bg-linear-to-r from-amber-50 to-orange-50 p-4 dark:border-amber-900/40 dark:from-amber-950/30 dark:to-orange-950/20">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">
              Consistency beats perfection.
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
              Mark a skill complete when you feel confident using it. Your
              roadmap is customizable, and your progress is saved automatically
              in this browser.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
