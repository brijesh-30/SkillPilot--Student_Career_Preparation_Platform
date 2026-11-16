import { getUserProfile, saveUserProfile } from "./careerTracks";
import { recordActivity } from "./recentActivity";

const AUTH_KEY = "skillpilot-auth-session";
export const AUTH_EVENT = "skillpilot-auth-changed";

const defaultAuth = {
  isLoggedIn: true,
  email: "brijesh.sevra@skillpilot.dev",
  loginTime: new Date().toISOString(),
};

export function getAuthStatus() {
  try {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object" && typeof parsed.isLoggedIn === "boolean") {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Unable to read auth status:", e);
  }
  return defaultAuth;
}

export function saveAuthStatus(status) {
  try {
    const current = getAuthStatus();
    const updated = { ...current, ...status };
    localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: updated }));
    return updated;
  } catch (e) {
    console.error("Unable to save auth status:", e);
    return defaultAuth;
  }
}

export function loginUser({ name, email, college, targetRole }) {
  const currentProfile = getUserProfile();
  const userName = name?.trim() || currentProfile.name || "Tech Student";
  const userCollege = college?.trim() || currentProfile.college || "Computer Science";
  const userRole = targetRole?.trim() || currentProfile.targetRole || "Software Engineer";
  const userEmail = email?.trim() || "student@skillpilot.dev";

  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "TS";

  saveUserProfile({
    name: userName,
    college: userCollege,
    targetRole: userRole,
    initials,
  });

  const session = {
    isLoggedIn: true,
    email: userEmail,
    loginTime: new Date().toISOString(),
  };

  saveAuthStatus(session);
  recordActivity(`Logged in as ${userName}`, "task");
  return session;
}

export function logoutUser() {
  const session = {
    isLoggedIn: false,
    email: "",
    loginTime: null,
  };

  saveAuthStatus(session);
  recordActivity("Logged out of session", "task");
  return session;
}

export function demoLogin() {
  return loginUser({
    name: "Brijesh Sevra",
    email: "brijesh.sevra@skillpilot.dev",
    college: "Computer Science Student",
    targetRole: "Frontend Engineer",
  });
}

