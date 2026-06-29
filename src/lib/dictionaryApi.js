import { STRAPI_URL } from "../../lib/config";

export const DICTIONARY_POPULATE_QUERY =
  "populate[thumbnail]=true&populate[video]=true";

export const getLessonItem = (lesson) => lesson?.attributes ?? lesson ?? {};

export const getLessonId = (lesson) => {
  const item = getLessonItem(lesson);
  const raw = item.id ?? lesson?.id;
  if (raw == null || raw === "") return null;
  const num = Number(raw);
  return Number.isNaN(num) ? null : num;
};

export const isLessonCompleted = (lesson, completedIds) => {
  const id = getLessonId(lesson);
  if (id == null) return false;
  const set = new Set((completedIds || []).map((x) => Number(x)));
  return set.has(id);
};

const resolveAbsoluteUrl = (url, baseUrl = STRAPI_URL) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${baseUrl}${url}`;
};

/** Strapi v4 (nested) + v5 (flat) media */
export const normalizeStrapiMedia = (field) => {
  if (!field) return null;

  if (typeof field === "object" && field.url) return field;

  if (Array.isArray(field)) {
    const first = field[0];
    if (!first) return null;
    return first.attributes ?? first;
  }

  if (field.data) {
    if (Array.isArray(field.data)) {
      const first = field.data[0];
      return first?.attributes ?? first ?? null;
    }
    return field.data.attributes ?? field.data ?? null;
  }

  return field.attributes ?? field;
};

export const getMediaUrlFromObject = (media, baseUrl = STRAPI_URL) => {
  if (!media) return "";

  const candidates = [
    media.formats?.medium?.url,
    media.formats?.small?.url,
    media.formats?.large?.url,
    media.formats?.thumbnail?.url,
    media.url,
  ].filter(Boolean);

  const unique = [...new Set(candidates)];
  return unique.length ? resolveAbsoluteUrl(unique[0], baseUrl) : "";
};

export async function fetchDictionaryLessons(baseUrl = STRAPI_URL) {
  try {
    const res = await fetch(
      `${baseUrl}/api/dictionaries?${DICTIONARY_POPULATE_QUERY}&pagination[pageSize]=200`
    );
    if (!res.ok) {
      const fallback = await fetch(
        `${baseUrl}/api/dictionaries?populate=*&pagination[pageSize]=200`
      );
      if (!fallback.ok) return [];
      const fb = await fallback.json();
      return fb.data ?? [];
    }
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export const getLessonImageUrl = (lesson, baseUrl = STRAPI_URL) => {
  const item = getLessonItem(lesson);

  const thumbMedia = normalizeStrapiMedia(item.thumbnail);
  const thumbUrl = getMediaUrlFromObject(thumbMedia, baseUrl);
  if (thumbUrl) return thumbUrl;

  const videoField = item.video;
  const videoList = Array.isArray(videoField)
    ? videoField
    : videoField
      ? [normalizeStrapiMedia(videoField)].filter(Boolean)
      : [];

  for (const raw of videoList) {
    const media = normalizeStrapiMedia(raw);
    const url = getMediaUrlFromObject(media, baseUrl);
    if (url && !/\.(mp4|webm|mov|m4v|avi)(\?|$)/i.test(url)) {
      return url;
    }
  }

  return "";
};

export const getLessonVideoUrl = (lesson, baseUrl = STRAPI_URL) => {
  const item = getLessonItem(lesson);
  const videoField = item.video;
  if (!videoField) return "";

  const list = Array.isArray(videoField)
    ? videoField
    : [normalizeStrapiMedia(videoField)].filter(Boolean);

  for (const raw of list) {
    const media = normalizeStrapiMedia(raw);
    const url = media?.url;
    if (url) return resolveAbsoluteUrl(url, baseUrl);
  }

  return "";
};
