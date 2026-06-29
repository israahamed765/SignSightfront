import { getLessonId, isLessonCompleted } from "./dictionaryApi";

export const LEARNING_CATEGORY_KEYS = [
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

export const TOTAL_LEARNING_CATEGORIES = LEARNING_CATEGORY_KEYS.length;

export const computeCategoryProgressList = (lessons, completedIds, categoriesMatch) =>
  LEARNING_CATEGORY_KEYS.map((category) => {
    const categoryLessons = lessons.filter((lesson) => {
      const item = lesson.attributes || lesson;
      return categoriesMatch(item.category, category);
    });
    const total = categoryLessons.length;
    const done = categoryLessons.filter((lesson) =>
      isLessonCompleted(lesson, completedIds)
    ).length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { label: category, percent, total, done };
  });

export const computeLevelOneStatus = (categoryProgress) => {
  const withLessons = categoryProgress.filter((c) => c.total > 0);
  const completedCategories = withLessons.filter((c) => c.percent === 100).length;
  const totalCategories = withLessons.length || TOTAL_LEARNING_CATEGORIES;
  const allLessonsDone =
    withLessons.length > 0 && withLessons.every((c) => c.percent === 100);

  return {
    level: allLessonsDone ? 2 : 1,
    label: allLessonsDone ? "متوسط" : "مبتدئ",
    level1Complete: allLessonsDone,
    completedCategories,
    totalCategories,
    level1Percent:
      totalCategories > 0
        ? Math.round((completedCategories / totalCategories) * 100)
        : 0,
  };
};

export { getLessonId, isLessonCompleted };
