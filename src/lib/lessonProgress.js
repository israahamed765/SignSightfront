import {
  resolveCanonicalCategory,
  categoriesMatch,
} from "./quizQuestions";
import { STRAPI_URL } from "../../lib/config";
const ACTIVE_USER_KEY = "signsight_active_user_id";

const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("jwt") || localStorage.getItem("token");
};

export const getCurrentUserId = () => {
  if (typeof window === "undefined") return null;
  const user = getStoredUser();
  const activeId = localStorage.getItem(ACTIVE_USER_KEY);
  if (!user?.id || !activeId || String(user.id) !== activeId) {
    return null;
  }
  return String(user.id);
};

const localKey = (type, userId = getCurrentUserId()) => {
  if (!userId) return null;
  return `${type}_${userId}`;
};

export const clearUserProgressStorage = (userId) => {
  if (typeof window === "undefined" || !userId) return;
  const id = String(userId);
  localStorage.removeItem(`completed_lessons_${id}`);
  localStorage.removeItem(`saved_lessons_${id}`);
  localStorage.removeItem(`passed_quizzes_${id}`);
};

export const beginUserSession = (user) => {
  if (typeof window === "undefined" || !user?.id) return;

  const previousActiveId = localStorage.getItem(ACTIVE_USER_KEY);
  const previousUser = getStoredUser();

  if (previousActiveId && previousActiveId !== String(user.id)) {
    clearUserProgressStorage(previousActiveId);
  }
  if (previousUser?.id && String(previousUser.id) !== String(user.id)) {
    clearUserProgressStorage(previousUser.id);
  }

  localStorage.setItem(ACTIVE_USER_KEY, String(user.id));

  const {
    completed_lessons,
    saved_lessons,
    passed_quizzes,
    ...cleanUser
  } = user;

  localStorage.setItem("user", JSON.stringify(cleanUser));
};

export const endUserSession = () => {
  if (typeof window === "undefined") return;

  const activeId = localStorage.getItem(ACTIVE_USER_KEY);
  if (activeId) {
    clearUserProgressStorage(activeId);
  }

  localStorage.removeItem(ACTIVE_USER_KEY);
  localStorage.removeItem("jwt");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const loadLocalProgress = () => {
  const userId = getCurrentUserId();
  if (!userId) {
    return { completed: [], saved: [], passedQuizzes: {} };
  }

  const completedKey = localKey("completed_lessons", userId);
  const savedKey = localKey("saved_lessons", userId);
  const passedKey = localKey("passed_quizzes", userId);

  let completed = [];
  let saved = [];
  let passedQuizzes = {};

  try {
    completed = JSON.parse(localStorage.getItem(completedKey) || "[]");
  } catch {
    completed = [];
  }

  try {
    saved = JSON.parse(localStorage.getItem(savedKey) || "[]");
  } catch {
    saved = [];
  }

  try {
    passedQuizzes = JSON.parse(localStorage.getItem(passedKey) || "{}");
  } catch {
    passedQuizzes = {};
  }

  return { completed, saved, passedQuizzes };
};

const saveLocalProgress = (completed, saved, passedQuizzes) => {
  const userId = getCurrentUserId();
  if (!userId) return;

  localStorage.setItem(
    localKey("completed_lessons", userId),
    JSON.stringify(completed)
  );
  localStorage.setItem(localKey("saved_lessons", userId), JSON.stringify(saved));
  localStorage.setItem(
    localKey("passed_quizzes", userId),
    JSON.stringify(passedQuizzes ?? {})
  );
};

export const fetchLessonProgress = async () => {
  const token = getToken();
  const userId = getCurrentUserId();

  if (!token || !userId) {
    return { completed: [], saved: [], passedQuizzes: {} };
  }

  try {
    const response = await fetch(`${STRAPI_URL}/api/users/me/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      const completed = Array.isArray(data.completed_lessons)
        ? data.completed_lessons
        : [];
      const saved = Array.isArray(data.saved_lessons) ? data.saved_lessons : [];
      const passedQuizzes =
        data.passed_quizzes && typeof data.passed_quizzes === "object"
          ? data.passed_quizzes
          : {};

      saveLocalProgress(completed, saved, passedQuizzes);
      return { completed, saved, passedQuizzes };
    }
  } catch {
    /* fallback below */
  }

  return loadLocalProgress();
};

export const syncLessonProgress = async (completed, saved, passedQuizzes) => {
  const userId = getCurrentUserId();
  if (!userId) {
    return { ok: false, reason: "login_required" };
  }

  saveLocalProgress(completed, saved, passedQuizzes);

  const token = getToken();
  if (!token) {
    return { ok: false, reason: "login_required" };
  }

  try {
    const payload = {
      completed_lessons: completed,
      saved_lessons: saved,
    };
    if (passedQuizzes !== undefined) {
      payload.passed_quizzes = passedQuizzes;
    }

    const response = await fetch(`${STRAPI_URL}/api/users/me/progress`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { ok: true };
    }
  } catch {
    /* saved locally only */
  }

  return { ok: true, localOnly: true };
};

export const toggleCompletedLesson = async (lessonId, completedIds) => {
  const id = Number(lessonId);
  const updated = completedIds.includes(id)
    ? completedIds.filter((item) => item !== id)
    : [...completedIds, id];

  const { saved, passedQuizzes } = loadLocalProgress();
  await syncLessonProgress(updated, saved, passedQuizzes);
  return updated;
};

export const toggleSavedLesson = async (lessonId, savedIds) => {
  const id = Number(lessonId);
  const updated = savedIds.includes(id)
    ? savedIds.filter((item) => item !== id)
    : [...savedIds, id];

  const { completed, passedQuizzes } = loadLocalProgress();
  await syncLessonProgress(completed, updated, passedQuizzes);
  return updated;
};

export const saveQuizResult = async (category, score, total) => {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = percent >= 90;
  const canonicalCategory = resolveCanonicalCategory(category);

  const { completed, saved, passedQuizzes } = loadLocalProgress();
  const updatedPassed = {
    ...passedQuizzes,
    [canonicalCategory]: {
      score,
      total,
      percent,
      passed,
      completedAt: new Date().toISOString(),
    },
  };

  await syncLessonProgress(completed, saved, updatedPassed);
  return { percent, passed, passedQuizzes: updatedPassed, category: canonicalCategory };
};

export const getQuizResultForCategory = (passedQuizzes, category) => {
  if (!passedQuizzes || !category) return null;

  const direct = passedQuizzes[category];
  if (direct) return direct;

  const canonical = resolveCanonicalCategory(category);
  if (passedQuizzes[canonical]) return passedQuizzes[canonical];

  for (const [key, value] of Object.entries(passedQuizzes)) {
    if (categoriesMatch(key, category) || categoriesMatch(key, canonical)) {
      return value;
    }
  }

  return null;
};

export const hasQuizAttempt = (passedQuizzes, category) =>
  Boolean(getQuizResultForCategory(passedQuizzes, category));

export const isQuizPassed = (passedQuizzes, category) =>
  Boolean(getQuizResultForCategory(passedQuizzes, category)?.passed);
