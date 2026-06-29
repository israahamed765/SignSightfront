const HAND_PALETTES = {
  right: {
    wrist: "#a855f7",
    finger: "#f97316",
    tip: "#ec4899",
    line: "rgba(168, 85, 247, 0.75)",
  },
  left: {
    wrist: "#06b6d4",
    finger: "#22c55e",
    tip: "#eab308",
    line: "rgba(6, 182, 212, 0.75)",
  },
};

const DEFAULT_PALETTE = HAND_PALETTES.right;

const TIP_INDICES = new Set([4, 8, 12, 16, 20]);

function toCanvasPoint(landmark, width, height, mirrored) {
  const x = (mirrored ? 1 - landmark.x : landmark.x) * width;
  const y = landmark.y * height;
  return { x, y };
}

function drawSphere(ctx, x, y, radius, fill, glow = false) {
  if (glow) {
    ctx.save();
    ctx.shadowColor = fill;
    ctx.shadowBlur = radius * 1.8;
  }

  const gradient = ctx.createRadialGradient(
    x - radius * 0.35,
    y - radius * 0.35,
    radius * 0.1,
    x,
    y,
    radius
  );
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.35, fill);
  gradient.addColorStop(1, fill);

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = Math.max(1, radius * 0.18);
  ctx.stroke();

  if (glow) ctx.restore();
}

export function drawHandSkeleton(
  ctx,
  landmarks,
  connections,
  width,
  height,
  mirrored = true,
  palette = DEFAULT_PALETTE
) {
  if (!landmarks?.length) return;

  const points = landmarks.map((lm) => toCanvasPoint(lm, width, height, mirrored));
  const scale = Math.min(width, height);

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  connections.forEach(([start, end]) => {
    const a = points[start];
    const b = points[end];
    if (!a || !b) return;

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = palette.line;
    ctx.lineWidth = Math.max(2, scale * 0.006);
    ctx.stroke();
  });

  points.forEach((point, index) => {
    const isWrist = index === 0;
    const isTip = TIP_INDICES.has(index);
    const radius = isWrist
      ? scale * 0.022
      : isTip
        ? scale * 0.016
        : scale * 0.011;
    const color = isWrist
      ? palette.wrist
      : isTip
        ? palette.tip
        : palette.finger;

    drawSphere(ctx, point.x, point.y, radius, color, isWrist || isTip);
  });

  ctx.restore();
}

export function getHandPalette(handednessLabel) {
  return handednessLabel === "Left" ? HAND_PALETTES.left : HAND_PALETTES.right;
}

export function getVideoElement(ref) {
  const node = ref?.current;
  if (!node) return null;
  if (node instanceof HTMLVideoElement) return node;
  return node.video || null;
}
