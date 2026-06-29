// صفحة الترجمة

"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import Sidebar from "../Sidebar/page";
import { Volume2, Save, Bookmark } from "lucide-react";
import { toast } from "react-hot-toast";
import HandSkeletonOverlay from "@/components/HandSkeletonOverlay";
import { STRAPI_URL, FASTAPI_URL, FASTAPI_WS_URL } from "@/lib/config";

const WS_URL = FASTAPI_WS_URL;
const BASE_URL = STRAPI_URL;
const MIN_MATCH_CONFIDENCE = 75;

function speakArabic(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}

function RealTimeTranslationPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState(
    "نظام الترجمة الفورية جاهز — شغّل الكاميرا للبدء"
  );
  const [detectedText, setDetectedText] = useState(
    "لم يتم رصد حركات بعد. حرّكي مفاصل وأصابع اليد كما في الفيديو المُدرَّب."
  );
  const [matchedVideoInfo, setMatchedVideoInfo] = useState(null);
  const [translationHistory, setTranslationHistory] = useState([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const [trainedCount, setTrainedCount] = useState(0);
  const [liveHint, setLiveHint] = useState("");
  const [trainedWords, setTrainedWords] = useState([]);

  const webcamRef = useRef(null);
  const wsRef = useRef(null);
  const loopIntervalRef = useRef(null);
  const lastMatchedWordRef = useRef("");
  const wsEverConnectedRef = useRef(false);
  const handsReadyRef = useRef(false);
  const lastSendRef = useRef(0);
  const latestFeaturesRef = useRef(null);

  const sendFeaturesToServer = useCallback((features) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const now = Date.now();
    if (now - lastSendRef.current < 80) return;
    lastSendRef.current = now;

    ws.send(JSON.stringify({ features: features ?? null }));
  }, []);

  const handleHandFeatures = useCallback(
    (features) => {
      latestFeaturesRef.current = features;
      sendFeaturesToServer(features);
    },
    [sendFeaturesToServer]
  );

  const handleTranslationResult = useCallback(
    (word, accuracy = "—", source = "trained") => {
      if (!word || word === lastMatchedWordRef.current) return;
      lastMatchedWordRef.current = word;

      setDetectedText((prev) => {
        const clean =
          prev.includes("لم يتم رصد") ||
          prev.includes("في انتظار") ||
          prev.includes("متصل بالسيرفر") ||
          prev.includes("لم تُرصد يد") ||
          prev.includes("تم رصد اليد") ||
          prev.includes("جاري البحث")
            ? ""
            : prev;
        return `🎯 ${word}\n${clean}`.trim();
      });

      setTranslationHistory((prev) => [
        { word, time: new Date().toISOString() },
        ...prev.slice(0, 49),
      ]);

      setMatchedVideoInfo({
        word,
        accuracy,
        source: source === "trained" ? "حركاتك المُدرَّبة" : "محرك الذكاء الاصطناعي",
      });

      if (voiceEnabled) speakArabic(word);
    },
    [voiceEnabled]
  );

  useEffect(() => {
    fetch(`${FASTAPI_URL}/health`)
      .then((r) => r.json())
      .then((d) => {
        setTrainedCount(d.gestures ?? d.count ?? 0);
        setTrainedWords(Array.isArray(d.words) ? d.words : []);
      })
      .catch(() => {
        setTrainedCount(0);
        setTrainedWords([]);
      });
    return () => {
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
        loopIntervalRef.current = null;
      }
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const startTranslation = async () => {
    setStatus("جاري التحقق من سيرفر الذكاء الاصطناعي...");

    let vocabCount = 0;
    try {
      const res = await fetch(`${FASTAPI_URL}/health`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error("health failed");
      const data = await res.json();
      vocabCount = data.gestures ?? data.count ?? 0;
      setTrainedCount(vocabCount);
    } catch {
      setWsConnected(false);
      setStatus("⚠️ FastAPI غير شغّال — أوقفي npm run dev ثم شغّليه من جديد");
      toast.error(
        "تعذر الاتصال بـ FastAPI (المنفذ 8000). تأكدي أن npm run dev يعمل ويظهر [fastapi] في التيرمينال."
      );
      return;
    }

    if (vocabCount === 0) {
      toast(
        "لا توجد حركات مُحلَّلة بعد — ارفعي فيديو من «رفع الفيديوهات» وانتظري «تم التحليل»",
        { icon: "⚠️", duration: 6000 }
      );
    }

    setIsRunning(true);
    lastMatchedWordRef.current = "";
    wsEverConnectedRef.current = false;
    handsReadyRef.current = false;
    setDetectedText("... في انتظار رصد حركة المفاصل والأصابع أمام الكاميرا ...");
    setStatus("🟢 جاري الاتصال بمحرك الترجمة...");

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      wsEverConnectedRef.current = true;
      fetch(`${FASTAPI_URL}/reload-gestures`, { method: "POST" })
        .then((r) => r.json())
        .then((d) => {
          const count = d.count || 0;
          const words = Array.isArray(d.words) ? d.words : [];
          setTrainedCount(count);
          setTrainedWords(words);
          if (count === 0) {
            toast.error("لم يُحمَّل أي حركة — ارفعي فيديو من «رفع الفيديوهات» أولاً");
          } else {
            setLiveHint(`اعملي إحدى الحركات المُدرَّبة: ${words.join("، ")}`);
          }
        })
        .catch(() => {});
      setWsConnected(true);
      setStatus(
        `🟢 الكاميرا نشطة — ${vocabCount || trainedCount} حركة جاهزة للترجمة`
      );
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = setInterval(() => {
        sendFeaturesToServer(latestFeaturesRef.current);
      }, 100);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status === "success" && data.word) {
          const confidence = Number(data.confidence) || 0;
          const minRequired = Number(data.min_confidence) || MIN_MATCH_CONFIDENCE;
          if (confidence <= minRequired) {
            setLiveHint(
              `⚠️ التطابق ${confidence}% — يجب أن يتجاوز ${minRequired}% لاعتماد الترجمة`
            );
            return;
          }
          const accuracy = `${confidence}%`;
          handleTranslationResult(data.word, accuracy, data.source);
          setLiveHint("");
        } else if (data.status === "low_confidence") {
          const confidence = Number(data.confidence) || 0;
          const minRequired = Number(data.min_confidence) || MIN_MATCH_CONFIDENCE;
          const candidate = data.candidate || "";
          const msg = candidate
            ? `⚠️ أقرب حركة: «${candidate}» (${confidence}%) — يجب أن يتجاوز التطابق ${minRequired}% لاعتماد الترجمة`
            : `⚠️ التطابق ${confidence}% — يجب أن يتجاوز ${minRequired}% لاعتماد الترجمة`;
          setLiveHint(msg);
          setDetectedText(msg);
        } else if (data.status === "ready") {
          const words = data.vocabulary?.length
            ? data.vocabulary.join("، ")
            : "";
          setDetectedText(
            words
              ? `متصل بالسيرفر — اعملي إحدى الحركات: ${words}`
              : "متصل بالسيرفر — ارفعي فيديوهات مُدرَّبة أولاً"
          );
        } else if (data.status === "hand_detected") {
          const msg = `✋ جاري تحليل مفاصل اليد (${data.frames}/${data.needed}) — حرّكي الأصابع كما في الفيديو المُدرَّب (لا يلزم نفس وضعية الجسم)`;
          setLiveHint(msg);
          setDetectedText(msg);
        } else if (data.status === "searching") {
          const words = data.vocabulary?.length
            ? data.vocabulary.join("، ")
            : trainedWords.join("، ");
          const msg = words
            ? `🔍 جاري مقارنة حركة المفاصل مع الفيديوهات المُدرَّبة... جرّبي: ${words}`
            : "🔍 جاري مقارنة حركة المفاصل والأصابع مع الفيديوهات المُدرَّبة...";
          setLiveHint(msg);
          setDetectedText(msg);
        } else if (data.status === "cooldown") {
          const sec = data.remaining ?? 5;
          const msg = `⏳ انتظار ${sec} ثانية — استعدي للحركة التالية...`;
          setLiveHint(msg);
          setDetectedText(msg);
        } else if (data.status === "ready_for_next") {
          lastMatchedWordRef.current = "";
          const words = data.vocabulary?.length
            ? data.vocabulary.join("، ")
            : trainedWords.join("، ");
          const msg = words
            ? `✅ جاهز — اعملي الحركة التالية: ${words}`
            : "✅ جاهز — اعملي الحركة التالية";
          setLiveHint(msg);
          setDetectedText(msg);
        } else if (data.status === "silent") {
          lastMatchedWordRef.current = "";
          setDetectedText("لم تُرصد يد — ضعي يديك أمام الكاميرا وكرّري حركة المفاصل كما في الفيديو المُدرَّب");
          if (trainedWords.length > 0) {
            setLiveHint(`اعملي إحدى الحركات المُدرَّبة: ${trainedWords.join("، ")}`);
          }
        }
      } catch {
        /* ignore malformed messages */
      }
    };

    ws.onerror = () => {
      setWsConnected(false);
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
        loopIntervalRef.current = null;
      }
      if (!wsEverConnectedRef.current) {
        setIsRunning(false);
        setStatus(
          "⚠️ فشل اتصال WebSocket — أوقفي npm run dev ثم شغّليه من جديد (بعد npm run setup:ai)"
        );
        toast.error(
          "تعذر فتح قناة الترجمة المباشرة. أوقفي المشروع وأعدي تشغيل npm run dev."
        );
      }
    };

    ws.onclose = () => {
      setWsConnected(false);
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
        loopIntervalRef.current = null;
      }
      if (!wsEverConnectedRef.current) {
        setIsRunning(false);
        setStatus(
          "⚠️ سيرفر الترجمة لا يدعم WebSocket — نفّذ npm run setup:ai ثم أعدي تشغيل npm run dev"
        );
        toast.error(
          "انقطع الاتصال بمحرك الترجمة. نفّذي: npm run setup:ai ثم أعيدي تشغيل npm run dev"
        );
      }
    };
  };

  const stopTranslation = () => {
    setIsRunning(false);
    setStatus("🔴 تم إيقاف الترجمة الفورية");
    setMatchedVideoInfo(null);
    setLiveHint("");
    lastMatchedWordRef.current = "";
    handsReadyRef.current = false;
    latestFeaturesRef.current = null;
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const saveSession = () => {
    if (translationHistory.length === 0) {
      toast.error("لا توجد ترجمات لحفظها بعد");
      return;
    }

    const sessions = JSON.parse(localStorage.getItem("translation_sessions") || "[]");
    const newSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      summary: detectedText,
      words: translationHistory,
    };
    localStorage.setItem(
      "translation_sessions",
      JSON.stringify([newSession, ...sessions].slice(0, 30))
    );
    toast.success("تم حفظ جلسة الترجمة بنجاح!");
  };

  const saveWordToBackend = async () => {
    const word = matchedVideoInfo?.word;
    if (!word) {
      toast.error("لا توجد كلمة مترجمة للحفظ");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/saved-translations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            word,
            details: {
              source: "translation_session",
              savedAt: new Date().toISOString(),
            },
          },
        }),
      });
      if (response.ok) {
        toast.success(`تم حفظ "${word}" في سجل الترجمات`);
      } else {
        toast.error("تعذر الحفظ في قاعدة البيانات");
      }
    } catch {
      toast.error("تأكد من تشغيل سيرفر Strapi");
    }
  };

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-10 pt-20 lg:pt-28">
        <header className="rounded-3xl bg-card p-6 shadow-sm border border-border">
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            ترجمة فورية — نص + صوت
          </span>
          <h1 className="text-2xl font-black text-foreground mt-2">
            الترجمة الفورية بلغة الإشارة
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            يقارن حركة مفاصل وأصابع اليد مع الفيديوهات المُدرَّبة — تُعتمد الترجمة فقط إذا تجاوزت نسبة التطابق 75%
            {trainedCount > 0 && (
              <span className="text-primary font-bold"> ({trainedCount} حركة مُدرَّبة)</span>
            )}
          </p>
          {trainedWords.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              الحركات المتاحة للترجمة:{" "}
              <span className="font-bold text-foreground">{trainedWords.join(" · ")}</span>
            </p>
          )}
          {isRunning && liveHint && (
            <p className="text-xs font-bold text-primary mt-2 bg-primary/5 border border-primary/20 rounded-xl px-3 py-2">
              {liveHint}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3 items-center">
            <button
              onClick={() => (isRunning ? stopTranslation() : startTranslation())}
              className={`rounded-full px-7 py-3 text-sm font-bold shadow-md transition-all ${
                isRunning
                  ? "bg-rose-500 hover:bg-rose-600 text-white"
                  : "bg-primary hover:opacity-90 text-primary-foreground"
              }`}
            >
              {isRunning ? "إيقاف الكاميرا" : "تشغيل الكاميرا والترجمة"}
            </button>

            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`rounded-full px-5 py-3 text-sm font-bold flex items-center gap-2 border transition-all ${
                voiceEnabled
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              <Volume2 size={16} />
              {voiceEnabled ? "الصوت مفعّل" : "الصوت معطّل"}
            </button>

            <button
              onClick={saveSession}
              className="rounded-full px-5 py-3 text-sm font-bold flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/15 transition-all"
            >
              <Bookmark size={16} />
              حفظ الجلسة
            </button>

            <button
              onClick={saveWordToBackend}
              disabled={!matchedVideoInfo}
              className="rounded-full px-5 py-3 text-sm font-bold flex items-center gap-2 bg-accent text-accent-foreground border border-border hover:opacity-90 transition-all disabled:opacity-40"
            >
              <Save size={16} />
              حفظ الكلمة
            </button>

            <span className="rounded-full bg-muted/50 border border-border px-4 py-2 text-xs font-bold text-muted-foreground">
              {status}
            </span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3 mt-6">
          <section className="lg:col-span-2 overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-black text-foreground mb-3">
              📹 الكاميرا — رصد الإشارات الحية
            </h2>
            <div className="overflow-hidden rounded-2xl bg-input relative aspect-video">
              {isRunning ? (
                <>
                  <Webcam
                    ref={webcamRef}
                    className="w-full h-full object-cover"
                    mirrored
                    audio={false}
                  />
                  <HandSkeletonOverlay
                    videoRef={webcamRef}
                    active={isRunning}
                    mirrored
                    onFeatures={handleHandFeatures}
                    onReady={() => {
                      handsReadyRef.current = true;
                      if (!wsConnected) return;
                      setStatus((prev) =>
                        prev.includes("جاري تهيئة")
                          ? `🟢 الكاميرا نشطة — ${trainedCount} حركة جاهزة للترجمة`
                          : prev
                      );
                    }}
                  />
                  <div className="absolute top-3 right-3 rounded-full bg-background/60 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-primary border border-primary/30">
                    ● تتبّع 42 مفصل (اليدين)
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-sm text-muted-foreground bg-input text-center p-6">
                  <span>
                    👋 شغّل الكاميرا وقم بالإشارة أمامها لترجمة فورية إلى نص وصوت
                  </span>
                </div>
              )}
            </div>
          </section>

          <div className="space-y-4">
            <section className="rounded-3xl bg-card p-5 shadow-sm border border-border">
              <h2 className="text-sm font-black text-foreground mb-2">
                📝 النص المترجم
              </h2>
              <div className="h-[150px] overflow-y-auto rounded-2xl border border-border bg-muted/30 p-4 text-xs text-foreground font-medium leading-relaxed">
                <pre className="whitespace-pre-wrap font-sans">{detectedText}</pre>
              </div>
              {matchedVideoInfo && voiceEnabled && (
                <button
                  onClick={() => speakArabic(matchedVideoInfo.word)}
                  className="mt-3 w-full py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/15 border border-primary/20"
                >
                  <Volume2 size={14} /> إعادة تشغيل الصوت
                </button>
              )}
            </section>

            <section className="rounded-3xl bg-card p-5 shadow-sm border border-border">
              <h3 className="text-xs font-black text-foreground mb-3">
                📊 تقرير الترجمة
              </h3>
              {matchedVideoInfo ? (
                <div className="space-y-2 text-xs bg-primary/5 p-3 rounded-2xl border border-primary/20">
                  <div className="flex justify-between bg-card p-2 rounded-xl px-3 border border-border/60">
                    <span className="text-muted-foreground">الكلمة:</span>
                    <span className="font-bold text-primary">
                      {matchedVideoInfo.word}
                    </span>
                  </div>
                  <div className="flex justify-between bg-card p-2 rounded-xl px-3 border border-border/60">
                    <span className="text-muted-foreground">الدقة:</span>
                    <span className="font-bold text-foreground">
                      {matchedVideoInfo.accuracy}
                    </span>
                  </div>
                  <div className="flex justify-between bg-card p-2 rounded-xl px-3 border border-border/60">
                    <span className="text-muted-foreground">المصدر:</span>
                    <span className="font-bold text-foreground">
                      {matchedVideoInfo.source}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic text-center py-6">
                  في انتظار مطابقة حركة المفاصل مع فيديو مُدرَّب...
                </p>
              )}
            </section>

            {translationHistory.length > 0 && (
              <section className="rounded-3xl bg-card p-5 shadow-sm border border-border">
                <h3 className="text-xs font-black text-foreground mb-2">
                  سجل هذه الجلسة ({translationHistory.length})
                </h3>
                <ul className="max-h-32 overflow-y-auto space-y-1">
                  {translationHistory.slice(0, 8).map((item, i) => (
                    <li
                      key={i}
                      className="text-xs bg-muted/40 rounded-lg px-3 py-1.5 font-medium text-foreground border border-border/50"
                    >
                      {item.word}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default RealTimeTranslationPage;
