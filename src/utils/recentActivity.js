
const STORAGE_KEY = "skillpilot-recent-activity";
const EVENT_NAME = "skillpilot-activity-updated";
const MAX_ACTIVITIES = 10;

export function getRecentActivities() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const activities = saved ? JSON.parse(saved) : [];

    return Array.isArray(activities) ? activities : [];
  } catch (error) {
    console.error("Unable to load recent activity:", error);
    return [];
  }
}

export function recordActivity(message, type = "task") {
  try {
    const activity = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      message,
      type,
      timestamp: new Date().toISOString(),
    };

    const activities = [
      activity,
      ...getRecentActivities(),
    ].slice(0, MAX_ACTIVITIES);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(activities)
    );

    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (error) {
    console.error("Unable to record recent activity:", error);
  }
}

export { EVENT_NAME };
