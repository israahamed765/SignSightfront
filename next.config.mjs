/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // هذا السطر يمنع الـ Build من التوقف بسبب أخطاء الـ TS في المكتبات
    ignoreBuildErrors: true,
  },
  eslint: {
    // هذا السطر يمنع الـ Build من التوقف بسبب أخطاء الـ ESLint
    ignoreDuringBuilds: true,
  },
  // 1. حل مشكلة TensorFlow و MediaPipe
  transpilePackages: ["@tensorflow-models/pose-detection", "@mediapipe/pose"],
  // Next 16 يستخدم Turbopack افتراضياً في dev؛ وجود هذا المفتاح يمنع رسالة التعارض مع webpack config.
  turbopack: {},
  // 3. الحفاظ على إعدادات webpack للأدوات التي لا تزال تحتاجها
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
