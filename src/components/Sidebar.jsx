import {
  BarChart3,
  BriefcaseBusiness,
  Compass,
  FileSearch,
  LayoutDashboard,
  Map,
  MessagesSquare,
  X,
  Flame,
  CheckCircle2,
  Download,
  Upload,
  Pencil,
  LogOut,
  LogIn,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getLearningStreak } from "../utils/learningStreak";
import { getUserProfile } from "../utils/careerTracks";
import { exportSkillPilotData, importSkillPilotData } from "../utils/backup";
import { getAuthStatus, logoutUser, AUTH_EVENT } from "../utils/auth";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, badge: null },
  { label: "Career Roadmap", icon: Map, badge: null },
  { label: "Daily Planner", icon: CheckCircle2, badge: null },
  { label: "Job Analyzer", icon: FileSearch, badge: null },
  { label: "Application Tracker", icon: BriefcaseBusiness, badge: null },
  { label: "Interview Practice", icon: MessagesSquare, badge: null },
  { label: "Analytics", icon: BarChart3, badge: null },
];

export default function Sidebar({
  activePage = "Dashboard",
  onNavigate = () => {},
  isMobileOpen = false,
  onCloseMobile = () => {},
  onOpenGoalModal = () => {},
  onOpenAuthModal = () => {},
}) {
  const [streak, setStreak] = useState(() => getLearningStreak());
  const [profile, setProfile] = useState(() => getUserProfile());
  const [auth, setAuth] = useState(() => getAuthStatus());
  const [backupMsg, setBackupMsg] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    function updateStreak() {
      setStreak(getLearningStreak());
    }
    function updateProfile(e) {
      if (e?.detail) setProfile(e.detail);
      else setProfile(getUserProfile());
    }
    function updateAuth(e) {
      if (e?.detail) setAuth(e.detail);
      else setAuth(getAuthStatus());
      setProfile(getUserProfile());
    }

    window.addEventListener("skillpilot-streak-updated", updateStreak);
    window.addEventListener("skillpilot-profile-updated", updateProfile);
    window.addEventListener(AUTH_EVENT, updateAuth);
    window.addEventListener("storage", () => {
      updateStreak();
      updateProfile();
      updateAuth();
    });

    return () => {
      window.removeEventListener("skillpilot-streak-updated", updateStreak);
      window.removeEventListener("skillpilot-profile-updated", updateProfile);
      window.removeEventListener(AUTH_EVENT, updateAuth);
      window.removeEventListener("storage", updateStreak);
    };
  }, []);

  function handleExport() {
    exportSkillPilotData();
    setBackupMsg("Exported!");
    setTimeout(() => setBackupMsg(""), 2500);
  }

  function handleFileImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        const res = importSkillPilotData(content);
        if (res.success) {
          setBackupMsg("Imported!");
        } else {
          setBackupMsg("Import error");
        }
        setTimeout(() => setBackupMsg(""), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const content = (
    <div className="flex h-full w-full flex-col justify-between p-4 sm:p-5">
      <div>
        {/* Brand & Mobile Close */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onNavigate("Dashboard");
              onCloseMobile();
            }}
            className="group flex items-center gap-3 rounded-xl text-left transition"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-indigo-500 via-indigo-600 to-violet-600 shadow-md shadow-indigo-950/50 ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105">
              <Compass size={22} className="text-white" />
            </span>

            <span className="min-w-0">
              <span className="block text-lg font-bold tracking-tight text-white">
                SkillPilot
              </span>
              <span className="block text-[11px] font-medium text-slate-400">
                Career Command Center
              </span>
            </span>
          </button>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Streak Pill */}
        <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-orange-500/20 text-orange-400">
              <Flame size={14} />
            </span>
            <span className="font-semibold text-slate-200">
              {streak.currentStreak} Day Streak
            </span>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              streak.activeToday
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-amber-500/20 text-amber-300"
            }`}
          >
            {streak.activeToday ? "Active Today" : "Study Today"}
          </span>
        </div>

        {/* Navigation Section */}
        <nav className="mt-6" aria-label="Main navigation">
          <p className="mb-2.5 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Navigation
          </p>

          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.label;

              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate(item.label);
                      onCloseMobile();
                    }}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-950/40"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-white" />
                    )}

                    <Icon
                      size={18}
                      className={`shrink-0 transition-transform duration-150 ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:scale-105 group-hover:text-indigo-300"
                      }`}
                    />

                    <span className="min-w-0 flex-1 truncate">{item.label}</span>

                    {item.badge && (
                      <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Bottom Profile, Target Goal, & Backup */}
      <div className="space-y-2.5 pt-4">
        {/* Target Goal Summary with Edit */}
        <div className="rounded-xl border border-indigo-500/25 bg-indigo-950/40 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
              Active Goal
            </span>
            <button
              type="button"
              onClick={onOpenGoalModal}
              className="inline-flex items-center gap-1 rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-200 transition hover:bg-indigo-500/40"
            >
              <Pencil size={10} />
              Edit
            </button>
          </div>
          <p className="mt-1 truncate text-xs font-bold text-white">
            {profile.targetGoal}
          </p>
          <p className="truncate text-[10px] text-slate-400">
            Target: {profile.targetDate}
          </p>
        </div>

        {/* Data Backup Bar */}
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-[11px] text-slate-400">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {backupMsg || "Data Backup"}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleExport}
              title="Export all data to JSON file"
              className="rounded p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <Download size={14} />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Import data from JSON backup"
              className="rounded p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <Upload size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </div>
        </div>

        {/* User Profile Card / Sign In Action */}
        {auth.isLoggedIn ? (
          <div className="group relative rounded-xl border border-white/10 bg-white/5 p-2.5 transition hover:bg-white/8">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-sm ring-1 ring-white/20">
                {profile.initials || "BS"}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-xs font-semibold text-white">
                    {profile.name}
                  </p>
                  <span
                    className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20"
                    title="Active Session"
                  />
                </div>
                <p className="truncate text-[10px] text-slate-400">
                  {profile.targetRole || profile.college}
                </p>
              </div>

              {/* Log Out button on sidebar */}
              <button
                type="button"
                onClick={() => logoutUser()}
                title="Log out of SkillPilot"
                aria-label="Log out of SkillPilot"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-500/20 hover:text-rose-300"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-indigo-500/30 bg-indigo-950/30 p-2.5 text-center">
            <div className="flex items-center gap-2 text-left mb-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-600/30 text-indigo-300">
                <User size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-white">
                  Guest Session
                </p>
                <p className="truncate text-[10px] text-slate-400">
                  Sign in to sync your progress
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-500"
            >
              <LogIn size={13} />
              <span>Log In / Sign Up</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-800/80 bg-slate-950 text-white lg:flex lg:w-72">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 flex bg-slate-950/70 backdrop-blur-sm lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-slate-800 bg-slate-950 text-white shadow-2xl">
            {content}
          </div>
          <div
            className="flex-1"
            onClick={onCloseMobile}
            aria-label="Dismiss sidebar"
          />
        </div>
      )}
    </>
  );
}
