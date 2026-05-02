
function TranslatorPage() {
  return (
    <div>
      {/* محتوى الصفحة هنا */}
      <h1>صفحة التدريب</h1>
    </div>
  );
}

// السطر التالي هو الأهم والذي يسبب المشكلة إذا كان مفقوداً
export default TranslatorPage;
//  "use client";
// import dynamic from "next/dynamic";

// const TranslatorClient = dynamic(() => import("./TranslatorClient"), {
//   ssr: false,
// });

// export default function TranslatorPage() {
//   return <TranslatorClient />;
// }
