import { getLessonItem, getLessonId, getLessonImageUrl as mediaImageUrl } from "./dictionaryApi";
import { getQuizOptionMedia } from "./quizOptionMedia";

export const QUIZ_QUESTIONS_PER_LEVEL = 10;
export const QUIZ_PASS_PERCENT = 90;

export const QUIZ_LEVEL_CATEGORIES = [
  "الحروف الأبجدية",
  "الأرقام والعد",
  "كلمات شائعة",
  "الأطعمة والمشروبات",
  "المشاعر والأحاسيس",
  "السفر والسياحة",
  "التسوق",
  "الصحة والطب",
  "الرياضة والنشاط",
  "العائلة والأصدقاء",
  "الوقت والطقس",
  "المهن والعمل",
  "الألوان",
];

const CATEGORY_ALIAS_GROUPS = [
  ["الحروف الأبجدية", "حروف أبجدية", "الحروف"],
  ["الأرقام والعد", "الارقام والعد", "أرقام والعد", "الأرقام"],
  ["كلمات شائعة", "الكلمات الشائعة", "كلمات الشائعة"],
  ["الأطعمة والمشروبات", "أطعمة ومشروبات"],
  ["المشاعر والأحاسيس", "مشاعر وأحاسيس"],
  ["السفر والسياحة", "سفر وسياحة"],
  ["التسوق", "تسوق"],
  ["الصحة والطب", "صحة وطب"],
  ["الرياضة والنشاط", "رياضة ونشاط"],
  ["العائلة والأصدقاء", "عائلة وأصدقاء"],
  ["الوقت والطقس", "وقت وطقس"],
  ["المهن والعمل", "مهن وعمل"],
  ["الألوان", "ألوان", "الوان", "الالوان"],
];

export const sanitizeCategoryParam = (raw) => {
  if (!raw) return "";
  try {
    return decodeURIComponent(raw)
      .trim()
      .replace(/[-–—_]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return String(raw).trim().replace(/[-–—_]+$/g, "").trim();
  }
};

const normalizeCategory = (value = "") =>
  sanitizeCategoryParam(value)
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, "")
    .replace(/^ال+/u, "")
    .toLowerCase();

export const resolveCanonicalCategory = (category) => {
  const safe = sanitizeCategoryParam(category);
  if (!safe) return "";
  for (const c of QUIZ_LEVEL_CATEGORIES) {
    if (categoriesMatch(c, safe)) return c;
  }
  return safe;
};

export const categoriesMatch = (lessonCategory, targetCategory) => {
  const a = normalizeCategory(lessonCategory);
  const b = normalizeCategory(targetCategory);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;

  for (const group of CATEGORY_ALIAS_GROUPS) {
    const normalizedGroup = group.map((g) => normalizeCategory(g));
    if (normalizedGroup.includes(a) && normalizedGroup.includes(b)) return true;
  }

  return false;
};

export const getLessonImageUrl = (lesson, baseUrl) =>
  mediaImageUrl(lesson, baseUrl);

const shuffle = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export function buildQuizQuestions(category, dictionaryLessons, baseUrl) {
  const safeCategory = resolveCanonicalCategory(category);
  const lessons = dictionaryLessons
    .filter((lesson) =>
      categoriesMatch(getLessonItem(lesson).category, safeCategory)
    )
    .sort(
      (a, b) =>
        (getLessonItem(a).Order ?? 0) - (getLessonItem(b).Order ?? 0)
    );

  if (lessons.length === 0) return [];

  const pool = lessons;

  const questions = [];

  for (let i = 0; i < QUIZ_QUESTIONS_PER_LEVEL; i += 1) {
    const correctLesson = pool[i % pool.length];
    const correctTitle = getLessonItem(correctLesson).title || `الدرس ${i + 1}`;

    const distractors = shuffle(
      pool.filter((lesson) => getLessonId(lesson) !== getLessonId(correctLesson))
    ).slice(0, 3);

    while (distractors.length < 3) {
      distractors.push(pool[distractors.length % pool.length]);
    }

    const optionsLessons = shuffle([correctLesson, ...distractors.slice(0, 3)]);
    const optionMedia = optionsLessons.map((lesson) =>
      getQuizOptionMedia(lesson, baseUrl)
    );
    const correctAnswer = optionsLessons.findIndex(
      (lesson) => getLessonId(lesson) === getLessonId(correctLesson)
    );

    questions.push({
      id: `${safeCategory}-${i + 1}`,
      questionOrder: i + 1,
      question: `ما الإشارة الصحيحة لـ "${correctTitle}"؟`,
      category: safeCategory,
      correctAnswer,
      options: optionMedia.map((media) => media.url),
      optionMedia,
      optionTitles: optionsLessons.map(
        (lesson) => getLessonItem(lesson).title || ""
      ),
    });
  }

  return questions;
}
