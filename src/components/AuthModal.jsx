import { useEffect, useState } from "react";
import {
  X,
  LogIn,
  UserPlus,
  Compass,
  Sparkles,
  CheckCircle,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  GraduationCap,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { loginUser, demoLogin } from "../utils/auth";
import { getUserProfile } from "../utils/careerTracks";

export default function AuthModal({ isOpen, onClose }) {
  const [tab, setTab] = useState("login"); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCollege, setRegCollege] = useState("");
  const [regRole, setRegRole] = useState("Frontend Engineer");
  const [regPassword, setRegPassword] = useState("");

  useEffect(() => {
    if (isOpen) {
      setErrorMsg("");
      setSuccessMsg("");
      const profile = getUserProfile();
      if (!loginEmail) {
        setLoginEmail("brijesh.sevra@skillpilot.dev");
        setLoginPassword("password123");
      }
      if (!regName) {
        setRegName(profile.name || "");
        setRegCollege(profile.college || "");
        setRegRole(profile.targetRole || "Frontend Engineer");
      }
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleLoginSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!loginEmail.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    const profile = getUserProfile();
    loginUser({
      name: profile.name || "Brijesh Sevra",
      email: loginEmail.trim(),
      college: profile.college,
      targetRole: profile.targetRole,
    });

    setSuccessMsg("Signed in successfully!");
    setTimeout(() => {
      onClose();
    }, 600);
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!regName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    loginUser({
      name: regName.trim(),
      email: regEmail.trim(),
      college: regCollege.trim() || "Tech Student",
      targetRole: regRole.trim() || "Software Engineer",
    });

    setSuccessMsg("Account created and signed in!");
    setTimeout(() => {
      onClose();
    }, 600);
  }

  function handleDemoLogin() {
    setErrorMsg("");
    demoLogin();
    setSuccessMsg("Logged in with Demo Student profile!");
    setTimeout(() => {
      onClose();
    }, 600);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-[#0f172a]">
        {/* Top Accent Gradient Bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-950/30">
              <Compass size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                SkillPilot Account
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sync your career roadmap and milestones
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close auth modal"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-1">
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
            <button
              type="button"
              onClick={() => {
                setTab("login");
                setErrorMsg("");
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
                tab === "login"
                  ? "bg-white text-indigo-600 shadow-xs dark:bg-[#090d16] dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <LogIn size={14} />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("register");
                setErrorMsg("");
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
                tab === "register"
                  ? "bg-white text-indigo-600 shadow-xs dark:bg-[#090d16] dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <UserPlus size={14} />
              Create Account
            </button>
          </div>
        </div>

        {/* Notifications & Status */}
        {errorMsg && (
          <div className="mx-6 mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-medium text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle size={15} />
            {successMsg}
          </div>
        )}

        {/* 1-Click Demo Shortcut */}
        <div className="px-6 pt-3">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="group flex w-full items-center justify-between rounded-xl border border-dashed border-indigo-300/80 bg-indigo-50/60 p-3 text-left transition hover:border-indigo-400 hover:bg-indigo-50 dark:border-indigo-700/60 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/50"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-600 text-white shadow-xs">
                <Sparkles size={15} />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">
                  1-Click Demo Student
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Quick sign-in as Brijesh Sevra (Frontend Engineer)
                </p>
              </div>
            </div>
            <ArrowRight
              size={15}
              className="text-indigo-600 transition-transform group-hover:translate-x-0.5 dark:text-indigo-400"
            />
          </button>
        </div>

        <div className="relative my-3 px-6">
          <div className="absolute inset-0 flex items-center px-6">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-wider">
            <span className="bg-white px-2 text-slate-400 dark:bg-[#0f172a] dark:text-slate-500">
              or continue with credentials
            </span>
          </div>
        </div>

        {/* Forms */}
        <div className="px-6 pb-6">
          {tab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {/* Email */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail
                    size={16}
                    className="absolute left-3 text-slate-400 dark:text-slate-500"
                  />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@skillpilot.dev"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700/80 dark:bg-slate-800/40 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-900 dark:focus:ring-indigo-900/30"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <span className="text-[10px] text-indigo-500 hover:underline cursor-pointer">
                    Demo: any password works
                  </span>
                </div>
                <div className="relative flex items-center">
                  <Lock
                    size={16}
                    className="absolute left-3 text-slate-400 dark:text-slate-500"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-10 pl-9 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700/80 dark:bg-slate-800/40 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-900 dark:focus:ring-indigo-900/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-950/20 transition hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99]"
              >
                <LogIn size={15} />
                Sign In to SkillPilot
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User
                    size={16}
                    className="absolute left-3 text-slate-400 dark:text-slate-500"
                  />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700/80 dark:bg-slate-800/40 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-900 dark:focus:ring-indigo-900/30"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail
                    size={16}
                    className="absolute left-3 text-slate-400 dark:text-slate-500"
                  />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="alex@college.edu"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700/80 dark:bg-slate-800/40 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-900 dark:focus:ring-indigo-900/30"
                  />
                </div>
              </div>

              {/* College & Target Role in 2 cols */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    College / Degree
                  </label>
                  <div className="relative flex items-center">
                    <GraduationCap
                      size={16}
                      className="absolute left-3 text-slate-400 dark:text-slate-500"
                    />
                    <input
                      type="text"
                      value={regCollege}
                      onChange={(e) => setRegCollege(e.target.value)}
                      placeholder="e.g. B.Tech CS"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700/80 dark:bg-slate-800/40 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-900 dark:focus:ring-indigo-900/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target Role
                  </label>
                  <div className="relative flex items-center">
                    <Briefcase
                      size={16}
                      className="absolute left-3 text-slate-400 dark:text-slate-500"
                    />
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700/80 dark:bg-slate-800/40 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-900 dark:focus:ring-indigo-900/30"
                    >
                      <option value="Frontend Engineer">Frontend Engineer</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="Backend Engineer">Backend Engineer</option>
                      <option value="AI / ML Engineer">AI / ML Engineer</option>
                      <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Create Password
                </label>
                <div className="relative flex items-center">
                  <Lock
                    size={16}
                    className="absolute left-3 text-slate-400 dark:text-slate-500"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-10 pl-9 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700/80 dark:bg-slate-800/40 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-900 dark:focus:ring-indigo-900/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-950/20 transition hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99]"
              >
                <UserPlus size={15} />
                Create Account & Start Learning
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

