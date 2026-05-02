
function TrainPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">صفحة تدريب الأدمن</h1>
      {/* محتوى الصفحة الخاص بكِ هنا */}
    </div>
  );
}

// 2. التصدير الافتراضي (هذا هو السطر الناقص أو الخاطئ في مشروعك)
export default TrainPage;


// // http://localhost:3000/admin/train
// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";
// import {
//   Save,
//   Camera,
//   RotateCcw,
//   Tag,
//   FolderPlus,
//   ShieldCheck,
//   CheckCircle,
//   Image as ImageIcon,
// } from "lucide-react";

// const RECORD_SECONDS = 5; // مدة المحاكاة قبل الحفظ

// export default function TrainSignPage() {
//   const webcamRef = useRef(null);
//   const timerRef = useRef(null);

//   const [signName, setSignName] = useState("");
//   const [category, setCategory] = useState("alphabets");
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saveCount, setSaveCount] = useState(0);

//   // حالات مضافة من الكود الأول
//   const [isRecording, setIsRecording] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [status, setStatus] = useState(
//     "الرجاء كتابة اسم الإشارة ثم التقاط الصورة.",
//   );

//   // تنظيف التايمر عند إغلاق الصفحة
//   useEffect(() => {
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, []);

//   // 1. التقاط الصورة مع محاكاة التقدم (Progress Simulation)
//   const capture = () => {
//     if (!signName.trim()) {
//       setStatus("⚠️ اكتب اسم الإشارة أولاً قبل الالتقاط.");
//       return;
//     }

//     setIsRecording(true);
//     setProgress(0);
//     setStatus("جاري تحليل الوضعية... حافظ على ثبات يدك.");

//     const startedAt = Date.now();
//     timerRef.current = setInterval(() => {
//       const elapsed = (Date.now() - startedAt) / 1000;
//       const pct = Math.min(100, Math.round((elapsed / RECORD_SECONDS) * 100));
//       setProgress(pct);

//       if (elapsed >= RECORD_SECONDS) {
//         clearInterval(timerRef.current);
//         const imageSrc = webcamRef.current.getScreenshot();
//         setCapturedImage(imageSrc);
//         setIsRecording(false);
//         setStatus("✅ تم الالتقاط بنجاح! يمكنك الحفظ الآن.");
//       }
//     }, 100);
//   };

//   // 2. إرسال البيانات إلى Strapi

//   // استبدلي دالة handleSaveToStrapi بهذا الجزء المضمون
//   const handleSaveToStrapi = async () => {
//     if (!signName || !capturedImage) return;

//     setLoading(true);
//     setStatus("جاري الرفع إلى Strapi...");
//     try {
//       // 1. تحويل الصورة من Base64 إلى File Object
//       const response = await fetch(capturedImage);
//       const blob = await response.blob();

//       const fileName = `${signName}_${Date.now()}.jpg`;
//       const file = new File([blob], fileName, { type: "image/jpeg" });

//       const formData = new FormData();
//       // استخدام blob مباشرة مع تحديد اسم ملف
//       formData.append("files", blob, `sign_${Date.now()}.jpg`);

//       // ثم الرفع
//       const uploadRes = await axios.post(
//         "http://localhost:1337/api/upload",
//         formData,
//       );

//       const fileId = uploadRes.data[0].id;
//       console.log("تم الرفع بنجاح، معرف الصورة:", fileId);

//       // 3. الربط بجدول الإشارات (تأكدي أن اسم الحقل في ستريبي هو Media وليس شيء آخر)
//       await axios.post("http://localhost:1337/api/signs", {
//         // تأكدي من أن الحرف s صغير أو كبير حسب ستريبي
//         data: {
//           Label: signName,
//           Category: category,
//           Media: fileId, // هذا يجب أن يكون حقل من نوع Media في Strapi
//         },
//       });

//       setSaveCount((prev) => prev + 1);
//       setCapturedImage(null);
//       setStatus(`✅ تم الحفظ بنجاح في قاعدة البيانات.`);
//       toast.success("تم الحفظ بنجاح!");
//     } catch (error) {
//       console.error("Error saving:", error.response?.data || error.message);
//       setStatus("❌ فشل الحفظ. راقبي الـ Console لمعرفة التفاصيل.");
//       toast.error("فشل الحفظ، تأكدي من صلاحيات Strapi");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetCapture = () => {
//     setCapturedImage(null);
//     setProgress(0);
//     setStatus("جاهز لالتقاط وضعية جديدة.");
//   };

//   return (
//     <div
//       className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans"
//       dir="rtl"
//     >
//       <main className="flex-1 flex flex-col p-8 overflow-y-auto">
//         {/* Header */}
//         <header className="mb-8 flex justify-between items-center">
//           <div>
//             <div className="flex items-center gap-3 mb-1">
//               <div className="w-8 h-8 bg-[#ff6b35] rounded-lg flex items-center justify-center">
//                 <span className="material-symbols-outlined text-white text-sm">
//                   psychology
//                 </span>
//               </div>
//               <h1 className="text-2xl font-black text-white tracking-tight">
//                 مختبر تدريب SignSight
//               </h1>
//             </div>
//             <p className="text-gray-500 text-sm">{status}</p>
//           </div>

//           <div className="flex gap-4">
//             <div className="bg-[#1a1a1a] px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
//               <div className="text-right">
//                 <p className="text-[10px] text-gray-500 font-bold uppercase">
//                   الصور المجموعة
//                 </p>
//                 <p className="text-lg font-black text-[#ff6b35] leading-none">
//                   {saveCount}
//                 </p>
//               </div>
//               <CheckCircle className="text-[#ff6b35]" size={20} />
//             </div>
//             <div className="bg-[#1a1a1a] px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
//               <ShieldCheck
//                 className={
//                   loading ? "text-yellow-500 animate-pulse" : "text-green-500"
//                 }
//                 size={18}
//               />
//               <span className="text-xs font-bold">
//                 {loading ? "جاري المزامنة..." : "بيئة التطوير متصلة"}
//               </span>
//             </div>
//           </div>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           {/* الكاميرا والمعاينة */}
//           <div className="lg:col-span-7 space-y-6">
//             <div className="relative aspect-video bg-[#151515] rounded-[2.5rem] border-2 border-white/5 overflow-hidden shadow-2xl group">
//               {!capturedImage ? (
//                 <Webcam
//                   audio={false}
//                   ref={webcamRef}
//                   screenshotFormat="image/jpeg"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="relative w-full h-full">
//                   <img
//                     src={capturedImage}
//                     className="w-full h-full object-cover animate-in fade-in duration-500"
//                     alt="Captured"
//                   />
//                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
//                     <p className="text-white font-bold flex items-center gap-2 bg-[#ff6b35] px-6 py-3 rounded-full">
//                       <ImageIcon size={20} /> جاهز للحفظ
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* شريط التقدم (Progress Bar) مدمج في التصميم */}
//               {isRecording && (
//                 <div className="absolute bottom-0 left-0 w-full h-2 bg-white/10">
//                   <div
//                     className="h-full bg-[#ff6b35] transition-all duration-100"
//                     style={{ width: `${progress}%` }}
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="flex gap-4">
//               <button
//                 onClick={capture}
//                 disabled={isRecording || !!capturedImage}
//                 className="flex-1 py-5 bg-[#ff6b35] text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#ff6b35]/20 disabled:opacity-50"
//               >
//                 <Camera size={24} />{" "}
//                 {isRecording
//                   ? `جاري الالتقاط (${progress}%)`
//                   : "التقاط وضعية جديدة"}
//               </button>

//               {capturedImage && (
//                 <button
//                   onClick={resetCapture}
//                   className="px-8 py-5 bg-white/5 text-white rounded-2xl font-black hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2"
//                 >
//                   <RotateCcw size={20} /> إعادة
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* التحكم والبيانات */}
//           <div className="lg:col-span-5 space-y-6">
//             <div className="bg-[#111111] p-8 rounded-[2.5rem] border border-white/5 space-y-8 relative overflow-hidden">
//               <div className="space-y-6 relative z-10">
//                 <div className="space-y-3">
//                   <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                     <Tag size={14} className="text-[#ff6b35]" /> هوية الإشارة
//                     (Label)
//                   </label>
//                   <input
//                     type="text"
//                     value={signName}
//                     onChange={(e) => setSignName(e.target.value)}
//                     placeholder="مثال: حرف الياء"
//                     className="w-full p-4 rounded-xl bg-[#1a1a1a] border border-white/5 focus:border-[#ff6b35] outline-none font-bold text-white transition-all"
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                     <FolderPlus size={14} className="text-[#ff6b35]" /> التصنيف
//                     الهيكلي
//                   </label>
//                   <select
//                     value={category}
//                     onChange={(e) => setCategory(e.target.value)}
//                     className="w-full p-4 rounded-xl bg-[#1a1a1a] border border-white/5 outline-none font-bold text-white cursor-pointer"
//                   >
//                     <option value="alphabets">الأبجدية العربية</option>
//                     <option value="numbers">الأرقام الإشارية</option>
//                     <option value="common_words">الكلمات اليومية</option>
//                   </select>
//                 </div>

//                 <button
//                   onClick={handleSaveToStrapi}
//                   disabled={loading || !capturedImage}
//                   className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl
//                     ${loading || !capturedImage ? "bg-white/5 text-gray-500 cursor-not-allowed" : "bg-white text-black hover:bg-[#ff6b35] hover:text-white"}
//                   `}
//                 >
//                   {loading ? (
//                     <span className="flex items-center gap-2 italic">
//                       جاري المزامنة...
//                     </span>
//                   ) : (
//                     <>
//                       <Save size={22} /> حفظ في Strapi
//                     </>
//                   )}
//                 </button>
//               </div>
//               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#ff6b35]/5 rounded-full blur-3xl pointer-events-none" />
//             </div>

//             <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
//               <h4 className="text-xs font-bold text-blue-400 mb-2 flex items-center gap-2">
//                 <span className="material-symbols-outlined !text-sm">info</span>{" "}
//                 نصيحة لإسراء:
//               </h4>
//               <p className="text-[11px] text-gray-400 leading-relaxed">
//                 شريط التقدم البرتقالي يضمن ثبات يدك لمدة {RECORD_SECONDS} ثوانٍ
//                 قبل الحفظ، وهذا يقلل من الصور المهتزة في قاعدة بياناتك.
//               </p>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
