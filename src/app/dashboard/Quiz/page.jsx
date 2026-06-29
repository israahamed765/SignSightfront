"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "../Sidebar/page";
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  Home, 
  Loader2, 
  Image as ImageIcon,
  AlertCircle,
  Star
} from "lucide-react";
import {
  buildQuizQuestions,
  QUIZ_QUESTIONS_PER_LEVEL,
  QUIZ_PASS_PERCENT,
  sanitizeCategoryParam,
} from "../../../lib/quizQuestions";
import { saveQuizResult } from "../../../lib/lessonProgress";
import { fetchDictionaryLessons } from "../../../lib/dictionaryApi";
import { STRAPI_URL } from "@/lib/config";

function QuizOptionButton({
  imgUrl,
  mediaType = "image",
  optionLabel,
  index,
  borderStyle,
  overlayEffect,
  disabled,
  onSelect,
  showCorrect,
  showWrong,
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const fullMediaUrl = imgUrl
    ? imgUrl.startsWith("http")
      ? imgUrl
      : `${STRAPI_URL}${imgUrl}`
    : "";
  const isVideo = mediaType === "video" && fullMediaUrl;
  const showImage = fullMediaUrl && !imageFailed && !isVideo;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={`group relative rounded-xl border-2 overflow-hidden transition-all duration-200 active:scale-[0.98] flex flex-col items-stretch w-full h-full min-h-0 ${borderStyle}`}
    >
      <div className="flex-1 min-h-0 w-full flex items-center justify-center p-1.5 bg-background/50">
        {isVideo ? (
          <video
            src={fullMediaUrl}
            className="max-w-full max-h-full object-contain rounded-lg"
            muted
            playsInline
            preload="metadata"
            loop
            autoPlay
            onVolumeChange={(e) => {
              e.currentTarget.muted = true;
              e.currentTarget.volume = 0;
            }}
          />
        ) : showImage ? (
          <img
            src={fullMediaUrl}
            alt={optionLabel || `خيار ${index + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg transition-transform group-hover:scale-[1.02]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground gap-1 font-bold text-[10px] px-1 text-center">
            <ImageIcon size={22} className="text-primary/40" />
            <span>{optionLabel || `خيار ${index + 1}`}</span>
          </div>
        )}
      </div>

      {overlayEffect && (
        <div className={`absolute inset-0 ${overlayEffect} transition-all pointer-events-none`} />
      )}

      {showCorrect && (
        <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-1 shadow-md z-20">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      )}
      {showWrong && (
        <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1 shadow-md z-20">
          <XCircle className="w-4 h-4" />
        </div>
      )}
    </button>
  );
}

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category");
  const currentCategory = sanitizeCategoryParam(rawCategory);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [answersState, setAnswersState] = useState({}); 
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalPercent, setFinalPercent] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      setLoading(true);
      try {
        const dictionaryLessons = await fetchDictionaryLessons(STRAPI_URL);

        if (dictionaryLessons.length > 0 && currentCategory) {
          const builtQuestions = buildQuizQuestions(
            currentCategory,
            dictionaryLessons,
            STRAPI_URL
          );

          if (builtQuestions.length > 0) {
            setQuestions(builtQuestions);
            const initialStates = {};
            builtQuestions.forEach((_, idx) => {
              initialStates[idx] = { selectedOption: null };
            });
            setAnswersState(initialStates);
            return;
          }
        }

        // fallback: Strapi quiz API
        const response = await fetch(
          `${STRAPI_URL}/api/quizzes?populate[image_options][populate]=*&pagination[pageSize]=100`
        );
        const result = await response.json();

        if (result.data) {
          const formattedQuestions = result.data.map((item) => {
            const attrs = item.attributes || item;
            const mediaData = attrs.image_options?.data || attrs.image_options || [];

            let imageUrls = [];
            if (Array.isArray(mediaData)) {
              imageUrls = mediaData.map((img) => {
                const imgAttrs = img.attributes || img;
                const path = imgAttrs.url || "";
                if (!path) return "";
                return path.startsWith("http") ? path : `${STRAPI_URL}${path}`;
              });
            }

            return {
              id: item.id,
              question: attrs.question,
              questionOrder: Number(attrs.question_order || 0),
              correctAnswer: Number(attrs.correctAnswerIndex || 0),
              category: attrs.category,
              options: imageUrls,
            };
          });

          let filteredQuestions = formattedQuestions;
          if (currentCategory) {
            filteredQuestions = formattedQuestions.filter(
              (q) =>
                q.category?.trim().toLowerCase() ===
                currentCategory.trim().toLowerCase()
            );
          }

          const sortedQuestions = filteredQuestions
            .sort((a, b) => a.questionOrder - b.questionOrder)
            .slice(0, QUIZ_QUESTIONS_PER_LEVEL);

          setQuestions(sortedQuestions);

          const initialStates = {};
          sortedQuestions.forEach((_, idx) => {
            initialStates[idx] = { selectedOption: null };
          });
          setAnswersState(initialStates);
        }
      } catch (error) {
        console.error("خطأ أثناء جلب أسئلة الاختبار:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizQuestions();
  }, [currentCategory]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentQuestionState = answersState[currentQuestionIndex] || { selectedOption: null };

  const handleOptionSelect = (optionIndex) => {
    setAnswersState(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        ...prev[currentQuestionIndex],
        selectedOption: optionIndex
      }
    }));
  };

  const calculateFinalScore = (state = answersState) =>
    questions.reduce((acc, q, idx) => {
      const selected = state[idx]?.selectedOption;
      return selected === q.correctAnswer ? acc + 1 : acc;
    }, 0);

  const handleNext = async () => {
    if (currentQuestionState.selectedOption === null) return;

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      return;
    }

    const finalScore = calculateFinalScore();
    const percent =
      questions.length > 0
        ? Math.round((finalScore / questions.length) * 100)
        : 0;

    setScore(finalScore);
    setFinalPercent(percent);
    setQuizPassed(percent >= QUIZ_PASS_PERCENT);
    setShowResult(true);

    if (currentCategory && !resultSaved) {
      const result = await saveQuizResult(
        currentCategory,
        finalScore,
        questions.length
      );
      setQuizPassed(result.passed);
      setFinalPercent(result.percent);
      setResultSaved(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setFinalPercent(0);
    setQuizPassed(false);
    setResultSaved(false);
    const resetStates = {};
    questions.forEach((_, idx) => {
      resetStates[idx] = { selectedOption: null };
    });
    setAnswersState(resetStates);
  };

  if (loading) {
    return (
      <div className="h-screen overflow-hidden bg-background" dir="rtl">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="h-full pt-20 flex flex-col items-center justify-center gap-3 font-black text-lg text-amber-500 animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin" />
          جاري جلب خيارات الصور الذكية...
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="h-screen overflow-hidden bg-background" dir="rtl">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="h-full pt-20 flex flex-col items-center justify-center text-muted-foreground gap-4 font-bold px-4 text-center">
          <p>لا توجد أسئلة اختبار مضافة لقسم &quot;{currentCategory || "هذا المسار"}&quot; بعد.</p>
          <button onClick={() => router.back()} className="px-5 py-2.5 bg-amber-500 text-black rounded-xl text-xs font-black shadow-md">
            العودة للخلف
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground" dir="rtl">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="h-full pt-20 flex flex-col overflow-hidden">
        <div className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-4 pb-3 flex flex-col min-h-0 overflow-hidden">
        
        {!showResult ? (
          <div className="flex flex-col flex-1 min-h-0 gap-2 overflow-hidden">
            
            <div className="flex flex-row justify-between items-center bg-card px-3 py-2 rounded-xl border border-border shadow-sm gap-2 shrink-0">
              <div className="min-w-0">
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-black border border-amber-500/20">
                  اختبار: {currentCategory || "عام"}
                </span>
                <h3 className="text-[11px] font-black text-muted-foreground mt-0.5 truncate">
                  السؤال {currentQuestionIndex + 1} من {questions.length}
                </h3>
              </div>
              <div className="w-28 sm:w-40 h-1.5 bg-accent rounded-full overflow-hidden shrink-0">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <Card className="bg-card border border-border shadow-lg rounded-2xl overflow-hidden p-3 sm:p-4 flex flex-col flex-1 min-h-0">
              <CardContent className="p-0 flex flex-col flex-1 min-h-0 gap-2">
                
                <h2 className="text-sm sm:text-base lg:text-lg font-black text-center leading-snug text-foreground px-1 shrink-0 line-clamp-2">
                  {currentQuestion?.question}
                </h2>

                <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
                  {currentQuestion?.options?.map((imgUrl, index) => {
                    
                    let borderStyle = "border-border bg-muted/30 shadow-sm hover:border-amber-500/40";
                    const optionLabel = currentQuestion?.optionTitles?.[index];
                    const optionMedia = currentQuestion?.optionMedia?.[index];
                    const mediaType = optionMedia?.type || "image";
                    const mediaUrl = optionMedia?.url || imgUrl;

                    if (currentQuestionState.selectedOption === index) {
                      borderStyle = "border-amber-500 bg-amber-500/[0.02] ring-2 ring-amber-500/20 shadow-md";
                    }

                    return (
                      <QuizOptionButton
                        key={index}
                        imgUrl={mediaUrl}
                        mediaType={mediaType}
                        optionLabel={optionLabel}
                        index={index}
                        borderStyle={borderStyle}
                        overlayEffect=""
                        disabled={false}
                        onSelect={() => handleOptionSelect(index)}
                        showCorrect={false}
                        showWrong={false}
                      />
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between gap-2 shrink-0">
                  
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className={`px-3 py-2 rounded-xl font-bold text-[10px] sm:text-xs transition-all active:scale-95 flex items-center gap-1 border ${
                      currentQuestionIndex !== 0 
                        ? "border-border bg-accent text-foreground hover:bg-accent/80" 
                        : "border-border bg-background text-muted-foreground cursor-not-allowed opacity-40"
                    }`}
                  >
                    <ArrowLeft className="w-3 h-3" />
                    السابق
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentQuestionState.selectedOption === null}
                    className={`px-4 sm:px-6 py-2 rounded-xl font-black text-[10px] sm:text-xs transition-all active:scale-95 flex items-center gap-1 ${
                      currentQuestionState.selectedOption !== null
                        ? "bg-amber-500 text-black hover:bg-amber-400"
                        : "bg-accent text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {currentQuestionIndex + 1 === questions.length ? "عرض النتيجة" : "التالي"}
                    <ArrowRight className="w-3 h-3 rotate-180" />
                  </button>

                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-card border border-border shadow-xl rounded-2xl p-4 sm:p-6 text-center space-y-4 max-w-xl mx-auto w-full my-auto overflow-y-auto max-h-full">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto border shadow-inner ${
                quizPassed
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}
            >
              {quizPassed ? (
                <Star className="w-10 h-10 fill-current" />
              ) : (
                <Award className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-xl md:text-2xl font-black">
                العلامة النهائية — اختبار {currentCategory}
              </h1>
              <p className="text-muted-foreground text-xs font-medium">
                أتممت {questions.length} أسئلة في هذا المستوى
              </p>
            </div>

            <div className="bg-background p-6 rounded-2xl border-2 border-border max-w-sm mx-auto space-y-3">
              <span className="block text-xs font-bold text-muted-foreground">
                نتيجتك النهائية
              </span>
              <div className="text-5xl font-black text-amber-500">
                {finalPercent}%
              </div>
              <div className="text-2xl font-black text-foreground">
                {score} / {questions.length}
              </div>
              <p className="text-xs text-muted-foreground font-bold">
                {score} إجابة صحيحة من أصل {questions.length}
              </p>
            </div>

            {quizPassed ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-white font-black text-lg shadow-lg shadow-emerald-500/20 animate-in zoom-in">
                <CheckCircle2 className="w-6 h-6" />
                تمام — اجتزت الاختبار بنجاح!
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
                تحتاج 90% أو أكثر للحصول على إشارة تمام
              </div>
            )}

            <div className="flex flex-row justify-center gap-2 pt-2">
              <button
                onClick={handleRestart}
                className="px-4 py-2.5 rounded-xl font-black text-xs border border-border text-foreground hover:bg-accent transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> إعادة الاختبار
              </button>
              <button
                onClick={() => router.push("/dashboard/Practice")}
                className="px-4 py-2.5 rounded-xl font-black text-xs bg-amber-500 text-black hover:bg-amber-400 transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" /> قائمة التدريبات
              </button>
            </div>
          </Card>
        )}

        </div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background font-bold text-amber-500 animate-pulse">
        جاري التحميل...
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}