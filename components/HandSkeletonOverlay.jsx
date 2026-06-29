"use client";

import { useEffect, useRef, useState } from "react";
import { drawHandSkeleton, getHandPalette, getVideoElement } from "@/lib/drawHandSkeleton";
import { extractHandsFeatures } from "@/lib/handFeatures";

export default function HandSkeletonOverlay({
  videoRef,
  active = true,
  mirrored = true,
  maxHands = 2,
  className = "",
  onFeatures,
  onReady,
}) {
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const rafRef = useRef(null);
  const onFeaturesRef = useRef(onFeatures);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onFeaturesRef.current = onFeatures;
  }, [onFeatures]);

  useEffect(() => {
    if (!active) {
      setReady(false);
      return undefined;
    }

    let cancelled = false;

    async function initHands() {
      const { Hands, HAND_CONNECTIONS } = await import("@mediapipe/hands");
      if (cancelled) return;

      const hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: maxHands,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.45,
      });

      const canvas = canvasRef.current;
      if (!canvas) return;

      hands.onResults((results) => {
        onFeaturesRef.current?.(
          extractHandsFeatures(results.multiHandLandmarks, results.multiHandedness)
        );

        const video = getVideoElement(videoRef);
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const width = video.videoWidth || video.clientWidth;
        const height = video.videoHeight || video.clientHeight;
        if (!width || !height) return;

        if (canvas.width !== width) canvas.width = width;
        if (canvas.height !== height) canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        const allHands = results.multiHandLandmarks || [];
        const handedness = results.multiHandedness || [];

        allHands.forEach((landmarks, index) => {
          const label = handedness[index]?.label || (index === 0 ? "Right" : "Left");
          drawHandSkeleton(
            ctx,
            landmarks,
            HAND_CONNECTIONS,
            width,
            height,
            mirrored,
            getHandPalette(label)
          );
        });
      });

      await hands.initialize();
      if (cancelled) {
        hands.close();
        return;
      }

      handsRef.current = { hands, connections: HAND_CONNECTIONS };
      setReady(true);
      onReady?.();
    }

    initHands().catch(() => setReady(false));

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      handsRef.current?.hands?.close();
      handsRef.current = null;
      setReady(false);
    };
  }, [active, mirrored, maxHands, videoRef]);

  useEffect(() => {
    if (!active || !ready) return undefined;

    let running = true;

    const tick = async () => {
      if (!running) return;

      const video = getVideoElement(videoRef);
      const hands = handsRef.current?.hands;

      if (video && hands && video.readyState >= 2) {
        try {
          await hands.send({ image: video });
        } catch {
          /* frame skipped */
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, ready, videoRef]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full pointer-events-none ${className}`}
    />
  );
}
