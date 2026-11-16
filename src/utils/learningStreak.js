
const STORAGE_KEY = "skillpilot-learning-streak";

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function readStreakData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (
      saved &&
      Array.isArray(saved.activityDates) &&
      typeof saved.lastActivityDate === "string"
    ) {
      return saved;
    }
  } catch (error) {
    console.error("Unable to read learning streak:", error);
  }

  return {
    activityDates: [],
    lastActivityDate: "",
  };
}

export function recordLearningActivity() {
  const data = readStreakData();
  const today = getLocalDateKey();

  // Several completed activities on one day count as one active day.
  if (data.activityDates.includes(today)) {
    return getLearningStreak();
  }

  const activityDates = [...data.activityDates, today].sort();

  const updatedData = {
    activityDates,
    lastActivityDate: today,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error("Unable to save learning activity:", error);
  }

  window.dispatchEvent(new Event("skillpilot-streak-updated"));

  return getLearningStreak();
}

export function getLearningStreak() {
  const data = readStreakData();
  const today = getLocalDateKey();
  const yesterday = getLocalDateKey(
    new Date(new Date().setDate(new Date().getDate() - 1))
  );

  const dates = new Set(data.activityDates);
  const lastActivity = data.lastActivityDate;

  // No activity today or yesterday means the current streak has expired.
  if (lastActivity !== today && lastActivity !== yesterday) {
    return {
      currentStreak: 0,
      activeToday: false,
      lastActivityDate: lastActivity,
    };
  }

  let currentStreak = 0;
  let cursor = lastActivity;

  while (dates.has(cursor)) {
    currentStreak += 1;

    const previous = new Date(`${cursor}T12:00:00`);
    previous.setDate(previous.getDate() - 1);
    cursor = getLocalDateKey(previous);
  }

  return {
    currentStreak,
    activeToday: lastActivity === today,
    lastActivityDate: lastActivity,
  };
}
