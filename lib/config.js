const DEFAULT_STRAPI = "http://localhost:1337";
const DEFAULT_FASTAPI = "http://localhost:8000";

const stripTrailingSlash = (url) => url.replace(/\/+$/, "");

export const STRAPI_URL = stripTrailingSlash(
  process.env.NEXT_PUBLIC_STRAPI_API_URL || DEFAULT_STRAPI
);

export const FASTAPI_URL = stripTrailingSlash(
  process.env.NEXT_PUBLIC_FASTAPI_URL || DEFAULT_FASTAPI
);

function buildWsUrl() {
  if (process.env.NEXT_PUBLIC_FASTAPI_WS_URL) {
    return stripTrailingSlash(process.env.NEXT_PUBLIC_FASTAPI_WS_URL);
  }

  if (FASTAPI_URL.startsWith("https://")) {
    return `${FASTAPI_URL.replace(/^https:\/\//, "wss://")}/ws/translate`;
  }

  if (FASTAPI_URL.startsWith("http://")) {
    return `${FASTAPI_URL.replace(/^http:\/\//, "ws://")}/ws/translate`;
  }

  return "ws://localhost:8000/ws/translate";
}

export const FASTAPI_WS_URL = buildWsUrl();

export function getUserDisplayName(user) {
  if (!user) return "مستخدم SignSight";
  if (user.username?.trim()) return user.username.trim();
  const email = user.email?.trim();
  if (email) return email.split("@")[0];
  return "مستخدم SignSight";
}
