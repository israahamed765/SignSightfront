import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,

  // منع Next من اعتبار مجلد SignSight الأب (package.json الجذري) جذر المشروع
  turbopack: {
    root: __dirname,
  },
  outputFileTracingRoot: __dirname,

  serverExternalPackages: [
    "@tensorflow/tfjs",
    "@tensorflow-models/pose-detection",
    "@mediapipe/pose",
  ],

  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    turbo: {
      resolveAlias: {
        fs: false,
        path: false,
        "@mediapipe/pose": "@mediapipe/pose/pose.js",
      },
    },
  },

  webpack: (config) => {
    config.resolve.alias["@mediapipe/pose"] = "@mediapipe/pose/pose.js";
    return config;
  },
};

export default nextConfig;
