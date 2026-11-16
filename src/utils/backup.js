import { recordActivity } from "./recentActivity";

const BACKUP_KEYS = [
  "skillpilot-user-profile",
  "skillpilot-custom-roadmap",
  "skillpilot-roadmap-progress",
  "skillpilot-daily-tasks",
  "skillpilot-applications",
  "skillpilot-interview-progress",
  "skillpilot-learning-streak",
  "skillpilot-recent-activity",
];

export function exportSkillPilotData() {
  try {
    const payload = {
      app: "SkillPilot",
      version: "2.0",
      exportedAt: new Date().toISOString(),
      data: {},
    };

    BACKUP_KEYS.forEach((key) => {
      const val = localStorage.getItem(key);
      if (val !== null) {
        try {
          payload.data[key] = JSON.parse(val);
        } catch {
          payload.data[key] = val;
        }
      }
    });

    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `skillpilot-backup-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    recordActivity("Exported complete SkillPilot backup JSON", "backup");
    return { success: true };
  } catch (error) {
    console.error("Export failed:", error);
    return { success: false, error: error.message };
  }
}

export function importSkillPilotData(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !parsed.data || typeof parsed.data !== "object") {
      throw new Error("Invalid SkillPilot backup file format.");
    }

    Object.entries(parsed.data).forEach(([key, value]) => {
      if (BACKUP_KEYS.includes(key)) {
        localStorage.setItem(
          key,
          typeof value === "string" ? value : JSON.stringify(value),
        );
      }
    });

    // Notify all listeners
    window.dispatchEvent(new CustomEvent("skillpilot-progress-updated"));
    window.dispatchEvent(new CustomEvent("skillpilot-streak-updated"));
    window.dispatchEvent(new CustomEvent("skillpilot-activity-updated"));
    window.dispatchEvent(new CustomEvent("skillpilot-profile-updated"));
    window.dispatchEvent(new Event("storage"));

    recordActivity("Imported SkillPilot data from backup", "backup");
    return { success: true };
  } catch (error) {
    console.error("Import failed:", error);
    return { success: false, error: error.message };
  }
}

