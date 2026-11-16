import { useState } from "react";
import {
  FileSearch,
  Target,
  CheckCircle2,
  CircleAlert,
  Lightbulb,
  Sparkles,
  RotateCcw,
  BriefcaseBusiness,
  Code2,
  ArrowRight,
  Plus,
} from "lucide-react";
import { recordActivity } from "../utils/recentActivity";

const SKILLS = [
  { name: "HTML", aliases: ["html", "html5"] },
  { name: "CSS", aliases: ["css", "css3"] },
  { name: "JavaScript", aliases: ["javascript", "js", "ecmascript"] },
  { name: "TypeScript", aliases: ["typescript", "ts"] },
  { name: "React", aliases: ["react", "react.js", "reactjs"] },
  { name: "Next.js", aliases: ["next.js", "nextjs"] },
  { name: "Tailwind CSS", aliases: ["tailwind css", "tailwindcss", "tailwind"] },
  { name: "Bootstrap", aliases: ["bootstrap"] },
  { name: "Node.js", aliases: ["node.js", "nodejs"] },
  { name: "Express.js", aliases: ["express.js", "expressjs", "express"] },
  { name: "MongoDB", aliases: ["mongodb", "mongo db"] },
  { name: "SQL", aliases: ["sql", "mysql", "postgresql", "postgres"] },
  { name: "REST APIs", aliases: ["rest api", "rest apis", "restful api", "restful apis"] },
  { name: "Git", aliases: ["git"] },
  { name: "GitHub", aliases: ["github"] },
  { name: "Python", aliases: ["python"] },
  { name: "Java", aliases: ["java"] },
  { name: "C++", aliases: ["c++"] },
  { name: "C#", aliases: ["c#"] },
  { name: "Data Structures & Algorithms", aliases: ["data structures", "data structure", "algorithms", "dsa"] },
  { name: "OOP", aliases: ["object oriented programming", "oop"] },
  { name: "Docker", aliases: ["docker"] },
  { name: "AWS", aliases: ["aws", "amazon web services"] },
  { name: "CI/CD", aliases: ["ci/cd", "continuous integration", "continuous delivery"] },
  { name: "Testing", aliases: ["unit testing", "software testing", "jest", "vitest"] },
  { name: "Redux", aliases: ["redux", "redux toolkit"] },
  { name: "Figma", aliases: ["figma"] },
  { name: "Agile", aliases: ["agile", "scrum"] },
  { name: "Linux", aliases: ["linux"] },
  { name: "GraphQL", aliases: ["graphql"] },
];

const DEFAULT_SKILLS =
  "HTML, CSS, JavaScript, React, Tailwind CSS, Node.js, Express.js, MongoDB, SQL, REST APIs, Git, GitHub, C++";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsAlias(text, alias) {
  const pattern = new RegExp(
    `(^|[^a-z0-9])${escapeRegex(alias)}(?=$|[^a-z0-9])`,
    "i",
  );
  return pattern.test(text);
}

function analyzeSkills(jobDescription, userSkills) {
  const requiredSkills = SKILLS.filter((skill) =>
    skill.aliases.some((alias) => containsAlias(jobDescription, alias)),
  );

  const normalizedUserSkills = userSkills
    .split(/[,\n;]/)
    .map((skill) => skill.trim().toLowerCase())
    .filter(Boolean);

  const matched = [];
  const missing = [];

  requiredSkills.forEach((skill) => {
    const hasSkill = normalizedUserSkills.some((userSkill) => {
      return (
        skill.name.toLowerCase() === userSkill ||
        skill.aliases.some((alias) => alias.toLowerCase() === userSkill)
      );
    });

    if (hasSkill) {
      matched.push(skill.name);
    } else {
      missing.push(skill.name);
    }
  });

  const score =
    requiredSkills.length > 0
      ? Math.round((matched.length / requiredSkills.length) * 100)
      : null;

  return { requiredSkills, matched, missing, score };
}

function SectionCard({ children, className = "" }) {
  return (
    <section
      className={`rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800/80 dark:bg-[#0f172a] transition-colors ${className}`}
    >
      {children}
    </section>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
        <Icon size={20} />
      </div>

      <div>
        <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

export default function JobAnalyzer() {
  const [role, setRole] = useState("React Developer");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [userSkills, setUserSkills] = useState(DEFAULT_SKILLS);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [addedSkills, setAddedSkills] = useState({});

  function handleAnalyze(event) {
    event.preventDefault();

    if (jobDescription.trim().length < 30) {
      setError(
        "Please paste a more detailed job description (at least 30 characters).",
      );
      setResult(null);
      return;
    }

    if (!userSkills.trim()) {
      setError("Please enter your current skills before analyzing.");
      setResult(null);
      return;
    }

    const analysis = analyzeSkills(jobDescription.toLowerCase(), userSkills);

    if (analysis.requiredSkills.length === 0) {
      setError(
        "We couldn't identify any supported technical skills. Try pasting a more detailed job description.",
      );
      setResult(null);
      return;
    }

    setError("");
    setResult(analysis);
  }

  function handleReset() {
    setRole("React Developer");
    setCompany("");
    setJobDescription("");
    setUserSkills(DEFAULT_SKILLS);
    setResult(null);
    setError("");
  }

  function addSkillToRoadmap(skillName) {
    try {
      const saved = localStorage.getItem("skillpilot-custom-roadmap");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stages && parsed.stages.length > 0) {
          const targetStage = parsed.stages[parsed.stages.length - 1];
          targetStage.skills = targetStage.skills || [];
          if (!targetStage.skills.some((s) => s.name === skillName)) {
            targetStage.skills.push({
              id: `skill-${Date.now()}`,
              name: skillName,
              completed: false,
            });
            localStorage.setItem(
              "skillpilot-custom-roadmap",
              JSON.stringify(parsed),
            );
            window.dispatchEvent(
              new CustomEvent("skillpilot-progress-updated"),
            );
            recordActivity(`Added ${skillName} to roadmap from Job Analyzer`, "skill");
          }
        }
      }
      setAddedSkills((prev) => ({ ...prev, [skillName]: true }));
    } catch (e) {
      console.error(e);
    }
  }

  function addSkillToDailyTask(skillName) {
    try {
      const savedTasks = localStorage.getItem("skillpilot-daily-tasks");
      const tasks = savedTasks ? JSON.parse(savedTasks) : [];
      const newTask = {
        id: `daily-${Date.now()}`,
        title: `Learn ${skillName} fundamentals & build mini-demo`,
        category: "Learning",
        duration: 45,
        due: "Today",
        completed: false,
      };
      tasks.push(newTask);
      localStorage.setItem("skillpilot-daily-tasks", JSON.stringify(tasks));
      recordActivity(`Added task: ${newTask.title}`, "task");
      setAddedSkills((prev) => ({ ...prev, [`task-${skillName}`]: true }));
    } catch (e) {
      console.error(e);
    }
  }

  const scoreLabel =
    result?.score === null
      ? "Not available"
      : result?.score >= 80
        ? "Strong skill overlap 🎉"
        : result?.score >= 50
          ? "Moderate skill overlap ⚡"
          : "Significant learning needed 📚";

  const recommendations = result ? result.missing.slice(0, 6) : [];

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-14 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-14 right-1/3 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-200">
            <Sparkles size={13} />
            JOB DESCRIPTION ANALYZER
          </div>

          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            Detect Skill Gaps. Bridge Them Before Applying.
          </h2>

          <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-300 sm:text-sm">
            Paste any job description to instantly compare with your current
            profile, calculate match percentage, and add missing skills directly
            to your daily plan.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAnalyze} className="space-y-6">
        <SectionCard>
          <SectionTitle
            icon={BriefcaseBusiness}
            title="Target Opportunity"
            subtitle="Position you are preparing to apply for"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Role
              </label>
              <input
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="e.g. React Developer, Frontend Engineer"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Company Name <span className="font-normal text-slate-400 dark:text-slate-500">(Optional)</span>
              </label>
              <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="e.g. Google, Atlassian, Startup"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <SectionTitle
            icon={FileSearch}
            title="Job Description Requirements"
            subtitle="Paste the job responsibilities and required qualifications"
          />

          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the full job description here...

Example:
We are looking for a Frontend Engineer with strong JavaScript, React, TypeScript, Tailwind CSS, REST APIs, Git, and responsive design experience..."
            rows={7}
            className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 text-xs leading-relaxed text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
          />

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span>More detailed requirements yield higher match accuracy.</span>
            <span className="font-mono-code">{jobDescription.length} characters</span>
          </div>
        </SectionCard>

        <SectionCard>
          <SectionTitle
            icon={Code2}
            title="Your Current Skill Profile"
            subtitle="Skills you can confidently explain and code in an interview"
          />

          <textarea
            value={userSkills}
            onChange={(event) => setUserSkills(event.target.value)}
            rows={3}
            placeholder="HTML, CSS, JavaScript, React, Node.js, Git..."
            className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 text-xs leading-relaxed text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
          />
        </SectionCard>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700"
          >
            <CircleAlert size={17} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw size={15} />
            Reset
          </button>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:brightness-105"
          >
            <Sparkles size={16} />
            Analyze Job Description
            <ArrowRight size={15} />
          </button>
        </div>
      </form>

      {/* Analysis Results */}
      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Match Percentage Ring Card */}
            <SectionCard className="lg:col-span-1 flex flex-col justify-between text-center">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Estimated Skill Overlap
                </p>

                <div className="my-6 flex justify-center">
                  <div
                    className="grid h-36 w-36 place-items-center rounded-full shadow-inner"
                    style={{
                      background: `conic-gradient(#6366f1 ${result.score}%, #e2e8f0 ${result.score}% 100%)`,
                    }}
                  >
                    <div className="grid h-28 w-28 place-items-center rounded-full bg-white shadow-xs">
                      <div>
                        <p className="text-3xl font-black text-slate-900">
                          {result.score}%
                        </p>
                        <p className="text-[10px] uppercase font-bold text-slate-400">
                          Match Score
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="font-bold text-indigo-700 text-sm">{scoreLabel}</p>
              </div>

              <p className="mt-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
                {result.matched.length} of {result.requiredSkills.length} identified requirements matched.
              </p>
            </SectionCard>

            {/* Matched vs Missing Skills breakdown */}
            <SectionCard className="lg:col-span-2">
              <SectionTitle
                icon={Target}
                title="Skills Breakdown"
                subtitle="Identified keywords matched vs to be learned"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Matched */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <div className="mb-2.5 flex items-center justify-between">
                    <p className="text-xs font-bold text-emerald-800">
                      Matched Skills ({result.matched.length})
                    </p>
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  </div>

                  {result.matched.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {result.matched.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-emerald-200 bg-white px-2 py-1 text-[11px] font-semibold text-emerald-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      No matching skills detected.
                    </p>
                  )}
                </div>

                {/* Missing */}
                <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                  <div className="mb-2.5 flex items-center justify-between">
                    <p className="text-xs font-bold text-amber-800">
                      Skills to Develop ({result.missing.length})
                    </p>
                    <CircleAlert size={16} className="text-amber-600" />
                  </div>

                  {result.missing.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {result.missing.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-amber-200 bg-white px-2 py-1 text-[11px] font-semibold text-amber-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      All identified requirements are present in your skills!
                    </p>
                  )}
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Actionable Learning Priorities */}
          {recommendations.length > 0 && (
            <SectionCard>
              <SectionTitle
                icon={Lightbulb}
                title="Actionable Learning Priorities"
                subtitle="1-Click add missing skills to your Career Roadmap or Daily Plan"
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {recommendations.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{skill}</p>
                      <p className="text-[11px] text-slate-500">
                        Required in this job listing
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => addSkillToRoadmap(skill)}
                        disabled={addedSkills[skill]}
                        className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50"
                      >
                        <Plus size={12} />
                        {addedSkills[skill] ? "In Roadmap ✓" : "+ Roadmap"}
                      </button>

                      <button
                        type="button"
                        onClick={() => addSkillToDailyTask(skill)}
                        disabled={addedSkills[`task-${skill}`]}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        <Plus size={12} />
                        {addedSkills[`task-${skill}`] ? "Added ✓" : "+ Task"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      )}
    </div>
  );
}
