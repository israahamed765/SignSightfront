import {
  getLessonItem,
  getLessonImageUrl,
  getLessonVideoUrl,
} from "./dictionaryApi";

const isVideoUrl = (url) => /\.(mp4|webm|mov|m4v|avi)(\?|$)/i.test(url || "");

const normalizeCategory = (value = "") =>
  String(value || "")
    .trim()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, "")
    .replace(/^ال+/u, "")
    .toLowerCase();

const isNumbersCategory = (category) => {
  const c = normalizeCategory(category);
  return c.includes("رقام") || c.includes("عد");
};

const isColorsCategory = (category) => {
  const c = normalizeCategory(category);
  return c.includes("لوان") || c.includes("الوان");
};

const normalizeTitle = (title = "") =>
  String(title)
    .trim()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .toLowerCase();

const ARABIC_NUMBER_WORDS = {
  "رقم واحد": 1,
  واحد: 1,
  "١": 1,
  "1": 1,
  اثنين: 2,
  اثنان: 2,
  "٢": 2,
  "2": 2,
  ثلاثه: 3,
  ثلاثة: 3,
  "٣": 3,
  "3": 3,
  اربعه: 4,
  أربعة: 4,
  "٤": 4,
  "4": 4,
  خمسه: 5,
  خمسة: 5,
  "٥": 5,
  "5": 5,
  سته: 6,
  ستة: 6,
  "٦": 6,
  "6": 6,
  سبعه: 7,
  سبعة: 7,
  "٧": 7,
  "7": 7,
  ثمانيه: 8,
  ثمانية: 8,
  "٨": 8,
  "8": 8,
  تسعه: 9,
  تسعة: 9,
  "٩": 9,
  "9": 9,
  عشره: 10,
  عشرة: 10,
  "١٠": 10,
  "10": 10,
};

const COLOR_SWATCHES = {
  احمر: "#E53935",
  أحمر: "#E53935",
  ازرق: "#1E88E5",
  أزرق: "#1E88E5",
  اخضر: "#43A047",
  أخضر: "#43A047",
  اصفر: "#FDD835",
  أصفر: "#FDD835",
  برتقالي: "#FB8C00",
  بنفسجي: "#8E24AA",
  وردي: "#EC407A",
  اسود: "#212121",
  أسود: "#212121",
  ابيض: "#FAFAFA",
  أبيض: "#FAFAFA",
  رمادي: "#9E9E9E",
  بني: "#6D4C41",
  ذهبي: "#FFB300",
  فضي: "#B0BEC5",
};

const resolveNumberFromTitle = (title) => {
  const key = normalizeTitle(title);
  if (ARABIC_NUMBER_WORDS[key] != null) return ARABIC_NUMBER_WORDS[key];

  for (const [word, num] of Object.entries(ARABIC_NUMBER_WORDS)) {
    const w = normalizeTitle(word);
    if (key.includes(w) || w.includes(key)) return num;
  }

  const digitMatch = title.match(/[0-9\u0660-\u0669]+/);
  if (digitMatch) {
    const western = digitMatch[0].replace(/[\u0660-\u0669]/g, (d) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(d))
    );
    const num = Number(western);
    if (num >= 0 && num <= 10) return num;
  }

  return null;
};

const buildPlaceholderImage = (label, hex = "4F46E5") =>
  `https://placehold.co/320x240/${hex.replace("#", "")}/FFFFFF?text=${encodeURIComponent(label)}&font=noto-sans-arabic`;

export const getTitleFallbackImage = (title, category = "") => {
  const itemTitle = String(title || "").trim();
  if (!itemTitle) return "";

  if (isNumbersCategory(category)) {
    const num = resolveNumberFromTitle(itemTitle);
    if (num != null) {
      return buildPlaceholderImage(String(num), "059669");
    }
  }

  if (isColorsCategory(category)) {
    const colorKey = normalizeTitle(itemTitle);
    const hex =
      COLOR_SWATCHES[itemTitle] ||
      COLOR_SWATCHES[colorKey] ||
      Object.entries(COLOR_SWATCHES).find(([name]) =>
        colorKey.includes(normalizeTitle(name))
      )?.[1];

    if (hex) {
      return buildPlaceholderImage(itemTitle, hex.replace("#", ""));
    }
  }

  return buildPlaceholderImage(itemTitle.slice(0, 12), "6366F1");
};

export const getQuizOptionMedia = (lesson, baseUrl) => {
  const item = getLessonItem(lesson);
  const title = item.title || "";
  const category = item.category || "";

  const videoUrl = getLessonVideoUrl(lesson, baseUrl);
  if (videoUrl) {
    return { type: "video", url: videoUrl, title };
  }

  const imageUrl = getLessonImageUrl(lesson, baseUrl);
  if (imageUrl && !isVideoUrl(imageUrl)) {
    return { type: "image", url: imageUrl, title };
  }

  const fallback = getTitleFallbackImage(title, category);
  if (fallback) {
    return { type: "image", url: fallback, title };
  }

  return { type: "none", url: "", title };
};
