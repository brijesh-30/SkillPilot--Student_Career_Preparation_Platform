const THEME_KEY = "skillpilot-theme";
export const THEME_EVENT = "skillpilot-theme-changed";

export function getTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") {
      return saved;
    }
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
  } catch {
    // fallback
  }
  return "light";
}

export function applyTheme(theme) {
  try {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  } catch (e) {
    console.error("Failed to apply theme class:", e);
  }
}

export function setTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
    window.dispatchEvent(
      new CustomEvent(THEME_EVENT, { detail: { theme } })
    );
  } catch (e) {
    console.error("Failed to set theme:", e);
  }
}

export function toggleTheme() {
  const current = getTheme();
  const next = current === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

// Initial theme application
if (typeof window !== "undefined") {
  applyTheme(getTheme());
}

