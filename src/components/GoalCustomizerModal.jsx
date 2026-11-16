import { useState } from "react";
import {
  X,
  Target,
  Sparkles,
  Calendar,
  User,
  GraduationCap,
  Check,
  Compass,
} from "lucide-react";
import {
  CAREER_TRACKS,
  getUserProfile,
  saveUserProfile,
  calculateDaysRemaining,
} from "../utils/careerTracks";
import { recordActivity } from "../utils/recentActivity";

export default function GoalCustomizerModal({ isOpen, onClose }) {
  const currentProfile = getUserProfile();

  const [name, setName] = useState(currentProfile.name);
  const [college, setCollege] = useState(currentProfile.college);
  const [targetRole, setTargetRole] = useState(currentProfile.targetRole);
  const [targetDate, setTargetDate] = useState(currentProfile.targetDate);
  const [selectedTrackId, setSelectedTrackId] = useState(() => {
    const match = CAREER_TRACKS.find(
      (t) => t.name.toLowerCase() === currentProfile.targetGoal.toLowerCase(),
    );
    return match ? match.id : "frontend";
  });
  const [loadTrackRoadmap, setLoadTrackRoadmap] = useState(true);

  if (!isOpen) return null;

  const daysLeft = calculateDaysRemaining(targetDate);
  const selectedTrack = CAREER_TRACKS.find((t) => t.id === selectedTrackId);

  function handleSave(event) {
    event.preventDefault();

    const trackName = selectedTrack ? selectedTrack.name : "Custom Goal";
    const initials = name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "TS";

    // 1. Update Profile
    saveUserProfile({
      name: name.trim() || "Student",
      college: college.trim() || "Tech Student",
      targetGoal: trackName,
      targetRole: targetRole.trim() || trackName,
      targetDate,
      initials,
    });

    // 2. If loadTrackRoadmap is enabled, replace or load the track's curated stages into custom roadmap!
    if (loadTrackRoadmap && selectedTrack) {
      const newRoadmap = {
        name: `${selectedTrack.name} Roadmap`,
        stages: selectedTrack.stages,
      };
      localStorage.setItem("skillpilot-custom-roadmap", JSON.stringify(newRoadmap));

      // Calculate progress
      const allSkills = selectedTrack.stages.flatMap((s) => s.skills || []);
      const completed = allSkills.filter((s) => s.completed).length;
      const pct = allSkills.length ? Math.round((completed / allSkills.length) * 100) : 0;
      localStorage.setItem("skillpilot-roadmap-progress", String(pct));

      window.dispatchEvent(
        new CustomEvent("skillpilot-progress-updated", { detail: { progress: pct } }),
      );
    }

    recordActivity(`Updated career goal to ${trackName} (Target: ${targetDate})`, "goal");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="my-auto w-full max-w-2xl rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-7 dark:border-slate-800 dark:bg-[#0f172a] transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
              <Target size={20} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                Define Your Career Goal
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose your track, target date, and personalized curriculum.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-5">
          {/* Track Selection Cards */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Select Primary Career Track
            </label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {CAREER_TRACKS.map((track) => {
                const isSelected = selectedTrackId === track.id;

                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      setSelectedTrackId(track.id);
                      setTargetRole(track.name);
                    }}
                    className={`relative flex flex-col justify-between rounded-2xl border p-3.5 text-left transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/50"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {track.name}
                        </span>
                        {isSelected && (
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-indigo-600 text-white dark:bg-indigo-500">
                            <Check size={12} />
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                        {track.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[10px] font-semibold text-indigo-700 dark:text-indigo-400">
                      <span className="rounded bg-indigo-100/60 dark:bg-indigo-950/80 px-1.5 py-0.5">
                        {track.badge}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500">{track.duration}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Role & Timeline */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Role Title
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus-within:border-indigo-500 dark:border-slate-700 dark:bg-slate-800/60">
                <Compass size={16} className="text-slate-400 dark:text-slate-500" />
                <input
                  required
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. SDE-1, Frontend Engineer"
                  className="w-full bg-transparent text-xs text-slate-800 outline-none dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Placement / Goal Date
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus-within:border-indigo-500 dark:border-slate-700 dark:bg-slate-800/60">
                <Calendar size={16} className="text-slate-400 dark:text-slate-500" />
                <input
                  required
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-800 outline-none dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Student Profile Details */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Your Full Name
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus-within:border-indigo-500 dark:border-slate-700 dark:bg-slate-800/60">
                <User size={16} className="text-slate-400 dark:text-slate-500" />
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Brijesh Sevra"
                  className="w-full bg-transparent text-xs text-slate-800 outline-none dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                College / Degree
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus-within:border-indigo-500 dark:border-slate-700 dark:bg-slate-800/60">
                <GraduationCap size={16} className="text-slate-400 dark:text-slate-500" />
                <input
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full bg-transparent text-xs text-slate-800 outline-none dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Days Countdown Callout */}
          {daysLeft !== null && (
            <div className="flex items-center justify-between rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-600 dark:text-amber-400" />
                <span className="font-semibold">Goal Countdown:</span>
              </div>
              <span className="font-bold text-amber-800 dark:text-amber-200 font-mono-code">
                {daysLeft} Days to go ({targetDate})
              </span>
            </div>
          )}

          {/* Checkbox to load curated roadmap */}
          <label className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs cursor-pointer dark:border-slate-800 dark:bg-slate-850 dark:bg-slate-800/40">
            <input
              type="checkbox"
              checked={loadTrackRoadmap}
              onChange={(e) => setLoadTrackRoadmap(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded accent-indigo-600"
            />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Load curated curriculum for {selectedTrack?.name}
              </span>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                Populates your Career Roadmap with industry-aligned stages and
                skills for this goal.
              </p>
            </div>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:brightness-105"
            >
              <Target size={14} />
              Set Active Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

