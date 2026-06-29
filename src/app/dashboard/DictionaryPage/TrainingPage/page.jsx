"use client";
import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import Sidebar from "../../Sidebar/page";
import { Upload, Video } from 'lucide-react';
import HandSkeletonOverlay from "@/components/HandSkeletonOverlay";
import { STRAPI_URL } from "@/lib/config";

const RECORD_SECONDS = 5;

function TrainingPage() {
  const [targetWord, setTargetWord] = useState('');
  const [status, setStatus] = useState('مستشعرات الكاميرا جاهزة لتسجيل الفيديو الحركي');
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [canSave, setCanSave] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [videosList, setVideosList] = useState([]); // تبدأ مصفوفة فارغة لتُعبأ من الباك آند

  const timerRef = useRef(null);
  const webcamRef = useRef(null);
  const previewVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const reprocessBusyRef = useRef(false);

  const mapEntryToRow = (item) => {
    const attrs = item.attributes || item;
    let vName = "sign_video.webm";
    const video = attrs.video?.data || attrs.video;
    if (video) {
      const videoItem = Array.isArray(video) ? video[0] : video;
      vName = videoItem?.attributes?.name || videoItem?.name || vName;
    }
    return {
      id: item.documentId || item.id,
      word: attrs.word,
      videoName: vName,
      isSavedInBackend: true,
      isSignAnalyzed: attrs.is_analyzed || false,
      isFaceAnalyzed: attrs.is_analyzed || false,
      analysisError: attrs.analysis_error || null,
    };
  };

  const reprocessPendingVideos = async () => {
    if (reprocessBusyRef.current) return null;
    reprocessBusyRef.current = true;
    try {
      const response = await fetch(
        `${STRAPI_URL}/api/saved-translations/reprocess-pending`,
        { method: "POST" }
      );
      if (!response.ok) return null;
      const json = await response.json();
      return json.data || null;
    } catch {
      return null;
    } finally {
      reprocessBusyRef.current = false;
    }
  };

  // 1. جلب البيانات المخزنة فعلياً في Strapi عند تحميل أو تحديث الصفحة
  const fetchUploadedVideos = async () => {
    try {
      const response = await fetch(`${STRAPI_URL}/api/saved-translations/list-all`);
      if (response.ok) {
        const json = await response.json();
        if (json.data) {
          const formattedVideos = json.data.map(mapEntryToRow);
          setVideosList(formattedVideos);
          return formattedVideos;
        }
      }

      // fallback للمسار القديم
      const fallback = await fetch(`${STRAPI_URL}/api/saved-translations?populate=*`);
      if (fallback.ok) {
        const json = await fallback.json();
        if (json.data) {
          const formattedVideos = json.data.map(mapEntryToRow);
          setVideosList(formattedVideos);
          return formattedVideos;
        }
      }
    } catch (e) {
      console.log("⚠️ تعذر جلب السجل الحقيقي، سيتم الاعتماد على العرض المحلي.");
    }
    return null;
  };

  const syncPendingAnalysis = async () => {
    const videos = await fetchUploadedVideos();
    const hasPending = (videos || []).some(
      (v) => v.isSavedInBackend && !v.isSignAnalyzed
    );
    if (!hasPending) return;

    setStatus("🔄 جاري إعادة تحليل الفيديوهات المعلّقة...");
    const result = await reprocessPendingVideos();
    await fetchUploadedVideos();

    if (result?.processed?.length) {
      setStatus(`✅ تم تحليل ${result.processed.length} فيديو بنجاح`);
    } else if (result?.failed?.length) {
      setStatus(
        `⚠️ فشل التحليل — تأكدي أن FastAPI يعمل (npm run dev) ثم اضغطي «إعادة المعالجة»`
      );
    }
  };

  useEffect(() => {
    fetchUploadedVideos().then((videos) => {
      const pending = (videos || []).some((v) => v.isSavedInBackend && !v.isSignAnalyzed);
      if (pending) syncPendingAnalysis();
    });
    const interval = setInterval(fetchUploadedVideos, 5000);
    return () => {
      clearInterval(interval);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const video = previewVideoRef.current;
    if (!video || !videoBlob) return undefined;

    const url = URL.createObjectURL(videoBlob);
    video.src = url;
    video.load();
    video.play().catch(() => {});

    return () => URL.revokeObjectURL(url);
  }, [videoBlob]);

  const pollAnalysisStatus = async (word, maxAttempts = 30) => {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const response = await fetch(`${STRAPI_URL}/api/saved-translations/list-all`);
        if (!response.ok) continue;
        const json = await response.json();
        const found = (json.data || []).find((item) => {
          const attrs = item.attributes || item;
          return attrs.word === word && attrs.is_analyzed;
        });
        if (found) {
          await fetchUploadedVideos();
          setStatus(`🤖 تم تعليم الحركة "${word}" بنجاح! يمكنك ترجمتها الآن في صفحة الترجمة المباشرة.`);
          return;
        }
      } catch {
        /* retry */
      }
    }
    setStatus('⚠️ التحليل يستغرق وقتاً — تأكد من تشغيل FastAPI (main.py) ثم حدّث الصفحة.');
  };

  const startRecordingVideo = () => {
    const trimmed = targetWord.trim();
    if (!trimmed) {
      setStatus('⚠️ فضلاً، اكتب اسم الحركة أولاً لبدء تسجيل الفيديو.');
      return;
    }

    const stream = webcamRef.current?.video?.srcObject;
    if (!stream) {
      setStatus('⚠️ فشل الوصول إلى بث الكاميرا الحية.');
      return;
    }

    chunksRef.current = [];
    let options = { mimeType: 'video/webm;codecs=vp9' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: 'video/webm' };
    }

    try {
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        setCanSave(true);
        setStatus('✅ تم التقاط فيديو الحركة بنجاح ومستعد للرفع.');
      };

      mediaRecorder.start();
      setIsRecording(true);
      setProgress(0);
      setCanSave(false);
      setStatus('🔴 جاري تسجيل فيديو الحركة الحية كاملاً الآن...');

      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const pct = Math.min(100, Math.round((elapsed / RECORD_SECONDS) * 100));
        setProgress(pct);

        if (elapsed >= RECORD_SECONDS) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
          }
          setIsRecording(false);
        }
      }, 100);

    } catch (err) {
      setStatus('⚠️ المتصفح واجه مشكلة في تهيئة مسجل الفيديو.');
    }
  };

  const handleVideoFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setStatus('⚠️ يرجى اختيار ملف فيديو صالح.');
      return;
    }

    setVideoBlob(file);
    setUploadedFileName(file.name);
    setCanSave(true);
    setStatus(`✅ تم تحميل "${file.name}" — جاهز للرفع والتحليل الفوري.`);
    e.target.value = '';
  };

  const handleUploadToStrapi = async () => {
    if (!videoBlob) return;
    const trimmed = targetWord.trim();
    if (!trimmed) {
      setStatus('⚠️ فضلاً، اكتب اسم الحركة قبل الرفع.');
      return;
    }
    const fileName = uploadedFileName || `sign_${Date.now()}.webm`;
    const tempId = Date.now();
    setIsSaving(true);
    setStatus('⚡ جاري رفع الملف وحفظ البيانات...');

    const temporaryRecord = {
      id: tempId,
      word: trimmed,
      videoName: fileName,
      isSavedInBackend: false,
      isSignAnalyzed: false,
      isFaceAnalyzed: false
    };
    setVideosList(prev => [temporaryRecord, ...prev]);

    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const formData = new FormData();
      formData.append('files', videoBlob, fileName);

      const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('فشل رفع ملف الفيديو إلى السيرفر');
      }

      const uploadData = await uploadResponse.json();
      const videoId = uploadData[0]?.id;
      const videoUrl = uploadData[0]?.url;
      if (!videoId) throw new Error('لم يتم استلام معرف الفيديو من السيرفر');

      const response = await fetch(`${STRAPI_URL}/api/saved-translations/save-sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          word: trimmed,
          videoId,
          videoUrl,
          details: { note: 'تم التسجيل عبر المتصفح', source: 'training_page' },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const msg = errData?.error?.message || `خطأ ${response.status}`;
        throw new Error(msg);
      }

      const saveResult = await response.json();
      if (saveResult.analysis?.ok) {
        setStatus(`🤖 تم تعليم الحركة "${trimmed}" بنجاح!`);
        await fetchUploadedVideos();
      } else {
        setStatus(
          `⚠️ تم الحفظ لكن التحليل فشل: ${saveResult.analysis?.error || "FastAPI غير متصل"} — سيتم إعادة المحاولة...`
        );
        pollAnalysisStatus(trimmed);
        syncPendingAnalysis();
      }

      setCanSave(false);
      setVideoBlob(null);
      setUploadedFileName('');
      setTargetWord('');
    } catch (error) {
      setVideosList(prev => prev.filter(v => v.id !== tempId));
      setStatus(`⚠️ ${error.message || 'حدث خطأ أثناء عملية الرفع.'}`);
    } finally {
      setIsSaving(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-12 pt-20 lg:pt-28 space-y-8">
        
        <header className="bg-card p-8 rounded-3xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-2 h-8 bg-primary rounded-full"></div>
             <span className="text-sm font-bold text-primary uppercase tracking-wider">وحدة المزامنة الذكية</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">رفع الفيديوهات وتسجيل الحركات</h1>
          <p className="text-sm text-muted-foreground mt-2">
            ارفع فيديو أو سجّل حركة جديدة — النظام يتتبّع 42 مفصل (اليدين)، يدرّب الحركة، ثم يترجمها نصاً وصوتاً في صفحة الترجمة الفورية
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">اسم الحركة</label>
              <input
                type="text"
                value={targetWord}
                onChange={(e) => setTargetWord(e.target.value)}
                className="w-full rounded-2xl border border-border bg-input text-foreground px-5 py-4 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                placeholder='مثال: "مرحبا"'
              />
            </div>
            
            <div className="rounded-2xl border-2 border-dashed border-border bg-muted/30 p-5 text-center space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoFileSelect}
                className="hidden"
              />
              <Video className="size-10 text-primary mx-auto" />
              <p className="text-sm font-bold text-foreground">رفع فيديو من الجهاز</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isSaving}
                className="w-full py-3 rounded-xl font-bold bg-primary hover:opacity-90 text-primary-foreground flex items-center justify-center gap-2 transition-all"
              >
                <Upload size={18} />
                اختر ملف فيديو
              </button>
              {uploadedFileName && (
                <p className="text-xs font-semibold text-primary truncate">{uploadedFileName}</p>
              )}
            </div>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-border" />
              <span className="px-3 text-xs font-bold text-muted-foreground">أو</span>
              <div className="flex-grow border-t border-border" />
            </div>

            <button
              onClick={startRecordingVideo}
              disabled={isRecording || isSaving}
              className={`w-full py-4 rounded-2xl font-bold transition-all ${
                isRecording
                  ? "bg-muted text-muted-foreground"
                  : "bg-secondary text-secondary-foreground hover:opacity-90 shadow-md"
              }`}
            >
              {isRecording ? "جاري التسجيل..." : "تسجيل بالكاميرا (5 ثوانٍ)"}
            </button>

            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
               <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>

            <button
              onClick={handleUploadToStrapi}
              disabled={!canSave || isSaving}
              className={`w-full py-4 rounded-2xl font-bold transition-all ${
                !canSave || isSaving
                  ? "bg-muted text-muted-foreground"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
              }`}
            >
              {isSaving ? "جاري الرفع..." : "🚀 رفع وحفظ البيانات للتحليل"}
            </button>
            
            <p className="text-center text-xs font-semibold text-muted-foreground p-3 bg-muted/30 rounded-xl border border-border">{status}</p>
          </div>

          <div className="bg-input rounded-3xl p-3 shadow-xl border border-border overflow-hidden min-h-[350px] relative">
            {videoBlob ? (
              <>
                <video
                  ref={previewVideoRef}
                  className="w-full h-full min-h-[320px] rounded-2xl object-cover"
                  controls
                  playsInline
                  muted
                  loop
                  onVolumeChange={(e) => {
                    e.currentTarget.muted = true;
                    e.currentTarget.volume = 0;
                  }}
                />
                <HandSkeletonOverlay videoRef={previewVideoRef} active mirrored={false} />
              </>
            ) : (
              <>
                <Webcam ref={webcamRef} className="w-full h-full min-h-[320px] rounded-2xl object-cover" mirrored audio={false} />
                <HandSkeletonOverlay videoRef={webcamRef} active mirrored />
              </>
            )}
            <div className="absolute top-4 right-4 rounded-full bg-background/60 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-primary border border-primary/30">
              ● تتبّع مفاصل اليدين (42 مفصل)
            </div>
          </div>
        </div>

        <section className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-extrabold text-foreground">سجل الفيديوهات وحالة معالجة الـ AI</h2>
              <p className="text-xs font-medium text-muted-foreground mt-1">تابع حالة حفظ الفيديوهات ونتائج دراسة لغة الإشارة وتعبيرات الوجه فوريًا</p>
            </div>
            <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full border border-primary/20">
              إجمالي الحركات: {videosList.length}
            </span>
            <button
              onClick={syncPendingAnalysis}
              className="px-4 py-1.5 text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 rounded-full hover:bg-amber-500/15 transition-all"
            >
              🔄 إعادة معالجة المعلّقة
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground text-xs font-bold uppercase border-b border-border">
                  <th className="p-4">اسم الحركة</th>
                  <th className="p-4">اسم ملف الفيديو</th>
                  <th className="p-4 text-center">هل تم الحفظ بالباك؟</th>
                  <th className="p-4 text-center">دراسة لغة الإشارة</th>
                  <th className="p-4 text-center">تحليل تعبيرات الوجه</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm font-medium text-foreground">
                {videosList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-muted-foreground italic">لا يوجد حركات مرفوعة حالياً. ابدأي بتسجيل أول حركة!</td>
                  </tr>
                ) : (
                  videosList.map((video) => (
                    <tr key={video.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-bold text-foreground">{video.word}</td>
                      <td className="p-4 text-xs font-mono text-muted-foreground">{video.videoName}</td>
                      <td className="p-4 text-center">
                        {video.isSavedInBackend ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-full">
                            <span className="size-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                            محفوظ بنجاح
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-full">
                            جاري الحفظ...
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {video.isSignAnalyzed ? (
                          <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-primary/10 text-primary border border-primary/20 rounded-full">
                            🧠 مكتمل ومدروس
                          </span>
                        ) : video.isSavedInBackend ? (
                          <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 rounded-full animate-pulse">
                            🔄 بانتظار تحليل المفاصل...
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">بانتظار الرفع</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {video.isFaceAnalyzed ? (
                          <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-primary/10 text-primary border border-primary/20 rounded-full">
                            😊 تم تحليل الوجه
                          </span>
                        ) : video.isSignAnalyzed ? (
                          <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-accent text-accent-foreground border border-border rounded-full animate-pulse">
                            👀 جاري معالجة الملامح...
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">بانتظار الرفع</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}

export default TrainingPage;