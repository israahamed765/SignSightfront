// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import dynamic from "next/dynamic";
// import {
//   Video,
//   Radio,
//   FileUp,
//   BookOpen,
//   Keyboard,
//   CheckCircle2,
//   XCircle,
//   Copy,
//   Loader2,
// } from "lucide-react";
// import { toast, Toaster } from "react-hot-toast";
// import Sidebar from "../dashboard/Sidebar/page";

// // استدعاء Webcam بشكل ديناميكي لمنع أخطاء الـ SSR
// const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

// export default function TranslatorClient() {
//   const webcamRef = useRef(null);
//   const [isCameraOpen, setIsCameraOpen] = useState(false);
//   const [translatedText, setTranslatedText] = useState(
//     "بانتظار بدء البث للترجمة...",
//   );
//   const [accuracy, setAccuracy] = useState(0);
//   const [isLoadingModel, setIsLoadingModel] = useState(true);
//   const [detector, setDetector] = useState(null);

//   // 1. تحميل المكتبات والنموذج مع دعم WebGL للسرعة
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     async function initAI() {
//       try {
//         const tf = await import("@tensorflow/tfjs");
//         await import("@tensorflow/tfjs-backend-webgl");
//         const poseDetection = await import("@tensorflow-models/pose-detection");

//         await tf.ready();
//         await tf.setBackend("webgl");

//         const model = poseDetection.SupportedModels.MoveNet;
//         const detectorConfig = {
//           modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
//         };

//         const createdDetector = await poseDetection.createDetector(
//           model,
//           detectorConfig,
//         );
//         setDetector(createdDetector);
//         setIsLoadingModel(false);
//         console.log("SignSight AI: WebGL Backend Ready");
//       } catch (error) {
//         console.error("AI Init Error:", error);
//         setIsLoadingModel(false);
//         toast.error("فشل تحميل محرك الذكاء الاصطناعي");
//       }
//     }
//     initAI();
//   }, []);

//   // 2. دالة التحليل المستمر
//   const runDetection = async () => {
//     if (
//       detector &&
//       webcamRef.current &&
//       webcamRef.current.video?.readyState === 4
//     ) {
//       const video = webcamRef.current.video;
//       const poses = await detector.estimatePoses(video);

//       if (poses.length > 0) {
//         const score = poses[0].score;
//         setAccuracy(Math.round(score * 100));

//         if (score > 0.4) {
//           setTranslatedText("جاري تحليل الحركة...");
//         } else {
//           setTranslatedText("يرجى التمركز أمام الكاميرا");
//         }
//       }
//     }
//   };

//   // 3. حلقة التكرار (Loop)
//   useEffect(() => {
//     let interval;
//     if (isCameraOpen && detector) {
//       interval = setInterval(() => {
//         runDetection();
//       }, 700);
//     }
//     return () => clearInterval(interval);
//   }, [isCameraOpen, detector]);

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(translatedText);
//     toast.success("تم نسخ النص!");
//   };

//   return (
//     <div
//       className="flex h-screen w-full bg-background overflow-hidden"
//       dir="rtl"
//     >
//       <Toaster position="top-center" />
//       <Sidebar />

//       <main className="flex-1 flex flex-col lg:mr-72 bg-background relative">
//         <div className="flex-1 flex p-6 gap-6 overflow-hidden">
//           {/* قسم الكاميرا */}
//           <div className="flex-[2.5] flex flex-col gap-6">
//             <div className="flex-1 bg-card rounded-[2.5rem] border border-border relative overflow-hidden flex items-center justify-center shadow-sm">
//               {isCameraOpen ? (
//                 <>
//                   <Webcam
//                     ref={webcamRef}
//                     mirrored
//                     screenshotFormat="image/jpeg"
//                     videoConstraints={{
//                       width: 640,
//                       height: 480,
//                       facingMode: "user",
//                     }}
//                     className="absolute inset-0 w-full h-full object-cover"
//                   />
//                   <div className="absolute top-6 left-6 flex items-center gap-2 bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full text-primary text-xs font-bold z-20 border border-primary/30">
//                     <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
//                     بث مباشر SignSight
//                   </div>
//                   <button
//                     onClick={() => setIsCameraOpen(false)}
//                     className="absolute top-6 right-6 p-2.5 bg-destructive text-destructive-foreground rounded-full hover:scale-110 z-20 transition-all shadow-xl"
//                   >
//                     <XCircle size={24} />
//                   </button>
//                 </>
//               ) : (
//                 <div className="text-center space-y-5">
//                   <div className="w-24 h-24 bg-primary/10 rounded-[2.2rem] flex items-center justify-center mx-auto border border-primary/20">
//                     <Video size={40} className="text-primary" />
//                   </div>
//                   <h3 className="text-2xl font-black text-foreground">
//                     مترجم الإشارة الفوري
//                   </h3>
//                   <p className="text-muted-foreground text-sm max-w-xs mx-auto font-medium">
//                     {isLoadingModel
//                       ? "جاري تهيئة النظام..."
//                       : "افتح الكاميرا وابدأ بالتحدث بلغة الإشارة."}
//                   </p>
//                 </div>
//               )}

//               {/* أزرار التحكم */}
//               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-card/90 backdrop-blur-xl p-3 rounded-3xl border border-border shadow-2xl z-30">
//                 <button
//                   onClick={() => setIsCameraOpen(true)}
//                   disabled={isLoadingModel}
//                   className="flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
//                 >
//                   {isLoadingModel ? (
//                     <Loader2 className="animate-spin" size={20} />
//                   ) : (
//                     <Radio size={20} />
//                   )}
//                   {isCameraOpen ? "إعادة المعايرة" : "بدء الترجمة"}
//                 </button>
//                 <button className="flex items-center gap-2 px-6 py-4 bg-secondary text-secondary-foreground font-bold rounded-2xl hover:bg-muted border border-border transition-all">
//                   <FileUp size={20} />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* قسم النص المترجم */}
//           <div className="flex-1 bg-card border border-border rounded-[2.5rem] flex flex-col shadow-sm min-w-[380px] overflow-hidden">
//             <div className="p-7 border-b border-border flex items-center justify-between bg-muted/30">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-primary/10 rounded-xl">
//                   <BookOpen size={20} className="text-primary" />
//                 </div>
//                 <h3 className="font-black text-lg text-foreground">
//                   الترجمة المباشرة
//                 </h3>
//               </div>
//               <button
//                 onClick={copyToClipboard}
//                 className="text-primary p-2 hover:bg-primary/10 rounded-lg transition-colors"
//               >
//                 <Copy size={20} />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-7 space-y-6">
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
//                   <span>دقة التحليل</span>
//                   <span
//                     className={`px-3 py-1 rounded-full ${accuracy > 70 ? "bg-accent/50 text-accent-foreground" : "bg-destructive/10 text-destructive"}`}
//                   >
//                     {accuracy}%
//                   </span>
//                 </div>
//                 <div className="bg-muted/20 p-8 rounded-3xl border-r-[6px] border-primary shadow-inner min-h-[200px]">
//                   <p className="text-2xl leading-relaxed font-bold text-foreground">
//                     {translatedText}
//                   </p>
//                 </div>
//               </div>
//               {!isCameraOpen && (
//                 <div className="flex flex-col items-center justify-center py-10 opacity-20 text-muted-foreground">
//                   <Keyboard size={50} />
//                   <p className="text-xs font-bold mt-2">بانتظار الإشارة...</p>
//                 </div>
//               )}
//             </div>

//             <div className="p-6 bg-muted/30 border-t border-border">
//               <button className="w-full py-5 text-sm font-black rounded-2xl bg-primary text-primary-foreground hover:shadow-primary/40 transition-all shadow-lg shadow-primary/20">
//                 حفظ نتائج الجلسة
//               </button>
//             </div>
//           </div>
//         </div>

//         <footer className="px-12 py-5 bg-card border-t border-border flex gap-12 items-center">
//           <InstructionItem text="إضاءة كافية" />
//           <InstructionItem text="وضوح اليدين" />
//           <InstructionItem text="تمركز الجسم" />
//         </footer>
//       </main>
//     </div>
//   );
// }

// function InstructionItem({ text }) {
//   return (
//     <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
//       <CheckCircle2 size={16} className="text-primary" />
//       <span>{text}</span>
//     </div>
//   );
// }
