import { useEffect, useRef, useState } from "react";
import {
  Search,
  Bell,
  X,
  Map,
  CheckCircle,
  Activity,
  Menu,
  Clock,
  Sparkles,
  Sun,
  Moon,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  Target,
  BarChart2,
  ShieldCheck,
} from "lucide-react";
import { getRecentActivities } from "../utils/recentActivity";
import { getTheme, toggleTheme, THEME_EVENT } from "../utils/theme";
import { getAuthStatus, logoutUser, AUTH_EVENT } from "../utils/auth";
import { getUserProfile } from "../utils/careerTracks";

const pageDetails = {
  Dashboard: {
    subtitle: "Welcome back! Here's your career progress and daily plan.",
  },
  "Career Roadmap": {
    subtitle: "Plan your technical milestones and track skills learned.",
  },
  "Daily Planner": {
    subtitle: "Organize daily tasks, track study time, and build habits.",
  },
  "Application Tracker": {
    subtitle: "Manage job applications and track interview rounds.",
  },
  "Job Analyzer": {
    subtitle: "Identify requirements and bridge skill gaps for your dream role.",
  },
  "Interview Practice": {
    subtitle: "Master technical questions with model answers and hints.",
  },
  Analytics: {
    subtitle: "Review your comprehensive career development metrics.",
  },
};

const categoryIcons = {
  Roadmap: Map,
  Skill: CheckCircle,
  Task: CheckCircle,
  Activity: Activity,
};

export default function TopNavbar({
  activePage = "Dashboard",
  searchResults = [],
  onSearchSelect = () => {},
  onToggleMobileMenu = () => {},
  onOpenAuthModal = () => {},
  onOpenGoalModal = () => {},
  onNavigate = () => {},
}) {
  const currentPage = pageDetails[activePage] || pageDetails.Dashboard;

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activities, setActivities] = useState(() => getRecentActivities());
  const [theme, setThemeState] = useState(() => getTheme());
  const [auth, setAuth] = useState(() => getAuthStatus());
  const [profile, setProfile] = useState(() => getUserProfile());

  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const profileMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredResults = normalizedQuery
    ? searchResults
        .filter((item) =>
          `${item.title} ${item.description || ""} ${item.category}`
            .toLowerCase()
            .includes(normalizedQuery),
        )
        .slice(0, 8)
    : [];

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
        setIsOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    function updateActivities() {
      setActivities(getRecentActivities());
    }
    function updateTheme(e) {
      if (e?.detail?.theme) setThemeState(e.detail.theme);
      else setThemeState(getTheme());
    }
    function updateAuth(e) {
      if (e?.detail) setAuth(e.detail);
      else setAuth(getAuthStatus());
      setProfile(getUserProfile());
    }
    function updateProfile(e) {
      if (e?.detail) setProfile(e.detail);
      else setProfile(getUserProfile());
    }

    window.addEventListener("skillpilot-activity-updated", updateActivities);
    window.addEventListener(THEME_EVENT, updateTheme);
    window.addEventListener(AUTH_EVENT, updateAuth);
    window.addEventListener("skillpilot-profile-updated", updateProfile);
    window.addEventListener("storage", () => {
      updateActivities();
      setAuth(getAuthStatus());
      setProfile(getUserProfile());
    });

    return () => {
      window.removeEventListener(
        "skillpilot-activity-updated",
        updateActivities,
      );
      window.removeEventListener(THEME_EVENT, updateTheme);
      window.removeEventListener(AUTH_EVENT, updateAuth);
      window.removeEventListener("skillpilot-profile-updated", updateProfile);
      window.removeEventListener("storage", updateActivities);
    };
  }, []);

  function selectResult(result) {
    onSearchSelect(result);
    setQuery("");
    setIsOpen(false);
  }

  function handleLogout() {
    logoutUser();
    setShowProfileMenu(false);
  }

  return (
    <header className="sticky top-0 z-30 flex flex-col gap-3 border-b border-slate-200/90 bg-white/95 px-4 py-3.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#090d16]/95 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 transition-colors">
      {/* Title & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Open navigation menu"
          className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700/80 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {activePage}
          </h1>
          <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block sm:text-sm">
            {currentPage.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls: Search, Theme Toggle, Notifications, Auth/Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Search */}
        <div ref={searchRef} className="relative min-w-0 flex-1 sm:w-64 md:w-72 sm:flex-none">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm transition focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 dark:border-slate-700/80 dark:bg-slate-800/50 dark:focus-within:border-indigo-400 dark:focus-within:bg-slate-900/90 dark:focus-within:ring-indigo-900/40">
            <Search size={16} className="shrink-0 text-slate-400 dark:text-slate-500" />
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search skills, tasks..."
              aria-label="Search roadmap, skills, tasks and activities"
              className="w-full min-w-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && filteredResults.length > 0) {
                  selectResult(filteredResults[0]);
                }
              }}
            />

            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  setIsOpen(true);
                }}
                className="shrink-0 rounded p-0.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                <X size={14} />
              </button>
            ) : (
              <kbd className="hidden shrink-0 items-center rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 md:inline-flex">
                Ctrl K
              </kbd>
            )}
          </label>

          {/* Search Results Dropdown */}
          {isOpen && normalizedQuery && (
            <div className="absolute right-0 top-full z-50 mt-2 max-h-96 w-full min-w-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-[#0f172a] sm:w-96">
              <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span>Results</span>
                <span>{filteredResults.length} found</span>
              </div>

              {filteredResults.length === 0 ? (
                <div className="px-4 py-7 text-center">
                  <Search className="mx-auto mb-2 text-slate-300 dark:text-slate-600" size={24} />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    No results found
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Try searching for React, CSS, Daily Task, or Roadmap stage.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredResults.map((result) => {
                    const Icon = categoryIcons[result.category] || Search;
                    return (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => selectResult(result)}
                        className="flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition hover:bg-indigo-50/70 dark:hover:bg-slate-800/70"
                      >
                        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                          <Icon size={14} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                            {result.title}
                          </span>
                          <span className="block truncate text-[11px] text-slate-400 dark:text-slate-400">
                            {result.description || result.category}
                          </span>
                        </span>

                        <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {result.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Theme Toggle Button (Light / Dark) */}
        <button
          type="button"
          onClick={() => {
            const next = toggleTheme();
            setThemeState(next);
          }}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="relative rounded-xl border border-slate-200 bg-slate-50/80 p-2 text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700/80 dark:bg-slate-800/50 dark:text-amber-400 dark:hover:bg-slate-800"
        >
          {theme === "dark" ? (
            <Sun size={18} className="transition-transform duration-200 hover:rotate-45" />
          ) : (
            <Moon size={18} className="transition-transform duration-200 hover:-rotate-12" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div ref={notificationRef} className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="Recent activity notifications"
            className="relative rounded-xl border border-slate-200 bg-slate-50/80 p-2 text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700/80 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Bell size={18} />
            {activities.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-[#0f172a] sm:w-96">
              <div className="mb-2 flex items-center justify-between border-b border-slate-100 px-2 pb-2 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
                  Recent Activity
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {activities.length} entries
                </span>
              </div>

              {activities.length > 0 ? (
                <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
                  {activities.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
                    >
                      <Activity
                        size={15}
                        className="mt-0.5 shrink-0 text-indigo-500 dark:text-indigo-400"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {item.message}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                          <Clock size={10} />
                          {item.timestamp
                            ? new Date(item.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Recently"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                  No recent activities recorded yet.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Auth / Profile Area */}
        {auth.isLoggedIn ? (
          <div ref={profileMenuRef} className="relative">
            {/* Interactive User Avatar Button */}
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              aria-label={`Open profile menu for ${profile.name}`}
              className="group relative flex items-center gap-1.5 rounded-xl p-1 transition hover:bg-slate-100 dark:hover:bg-slate-800/60"
            >
              <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-indigo-500 via-indigo-600 to-violet-600 text-xs font-bold text-white shadow-sm ring-2 ring-indigo-200 transition-transform duration-150 group-hover:scale-105 dark:ring-indigo-900/60">
                {profile.initials || "BS"}
                <span
                  className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
                  title="Signed In & Syncing"
                />
              </div>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-150 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 ${
                  showProfileMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Popover */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-[#0f172a] sm:w-80 animate-fadeIn">
                {/* User Header */}
                <div className="flex items-start gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm">
                    {profile.initials || "BS"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                        {profile.name}
                      </p>
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                        <ShieldCheck size={10} />
                        Active
                      </span>
                    </div>
                    <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                      {auth.email || "brijesh.sevra@skillpilot.dev"}
                    </p>
                    <p className="mt-1 truncate text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                      {profile.targetRole || "Frontend Engineer"} · {profile.college || "Tech Student"}
                    </p>
                  </div>
                </div>

                {/* Quick Menu Options */}
                <div className="space-y-1 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenGoalModal();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60"
                  >
                    <Target size={15} className="text-indigo-500 dark:text-indigo-400" />
                    <span className="flex-1 truncate">Edit Career Goal</span>
                    <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-300">
                      {profile.targetGoal || "Frontend"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate("Analytics");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60"
                  >
                    <BarChart2 size={15} className="text-violet-500 dark:text-violet-400" />
                    <span className="flex-1 truncate">Career Analytics</span>
                  </button>
                </div>

                {/* Logout Action */}
                <div className="border-t border-slate-100 pt-2 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                  >
                    <span className="flex items-center gap-2">
                      <LogOut size={15} />
                      Log Out
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      End Session
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            {/* Sign In Button */}
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-950/20 transition hover:from-indigo-500 hover:to-violet-500 active:scale-95"
            >
              <LogIn size={15} />
              <span className="hidden sm:inline">Log In</span>
            </button>

            {/* Guest Avatar button */}
            <button
              type="button"
              onClick={onOpenAuthModal}
              title="Sign in to your account"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-100 text-slate-500 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            >
              <User size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
