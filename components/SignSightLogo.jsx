"use client";

import { useId } from "react";

/**
 * شعار SignSight — يدان بإيماءات ILY و V مع هيكل عظمي متوهج وحركة خفيفة.
 */
export default function SignSightLogo({
  className = "size-9",
  showBackground = false,
  animated = true,
  title = "SignSight",
}) {
  const uid = useId().replace(/:/g, "");
  const boneGrad = `signsight-bone-${uid}`;
  const glowGrad = `signsight-glow-${uid}`;
  const jointGrad = `signsight-joint-${uid}`;
  const ringGrad = `signsight-ring-${uid}`;

  const prefix = animated ? `signsight-anim-${uid}` : "";

  const leftBones = [
    [17, 44, 17, 38],
    [17, 38, 11, 34],
    [11, 34, 7, 28],
    [17, 38, 14, 30],
    [14, 30, 13, 22],
    [13, 22, 12, 14],
    [17, 38, 19, 33],
    [19, 33, 20, 29],
    [17, 38, 21, 34],
    [21, 34, 22, 30],
    [17, 38, 23, 32],
    [23, 32, 25, 24],
    [25, 24, 27, 16],
    [27, 16, 28, 10],
  ];

  const rightBones = [
    [55, 44, 55, 38],
    [55, 38, 61, 34],
    [61, 34, 64, 28],
    [55, 38, 53, 33],
    [53, 33, 52, 29],
    [55, 38, 51, 34],
    [51, 34, 50, 30],
    [55, 38, 49, 30],
    [49, 30, 46, 20],
    [46, 20, 45, 12],
    [55, 38, 57, 30],
    [57, 30, 60, 20],
    [60, 20, 62, 12],
  ];

  const leftJoints = [
    [17, 44],
    [17, 38],
    [11, 34],
    [7, 28],
    [14, 30],
    [13, 22],
    [12, 14],
    [19, 33],
    [20, 29],
    [21, 34],
    [22, 30],
    [23, 32],
    [25, 24],
    [27, 16],
    [28, 10],
  ];

  const rightJoints = [
    [55, 44],
    [55, 38],
    [61, 34],
    [64, 28],
    [53, 33],
    [52, 29],
    [51, 34],
    [50, 30],
    [49, 30],
    [46, 20],
    [45, 12],
    [57, 30],
    [60, 20],
    [62, 12],
  ];

  const orbitNodes = [
    { cx: 36, cy: 10 },
    { cx: 62, cy: 36 },
    { cx: 36, cy: 62 },
    { cx: 10, cy: 36 },
  ];

  return (
    <div
      className={`relative shrink-0 ${className} ${showBackground ? "rounded-xl shadow-lg shadow-primary/20" : ""}`}
      aria-hidden={!title}
    >
      {animated && (
        <style>{`
          @keyframes ${prefix}-orbit {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes ${prefix}-float-left {
            0%, 100% { transform: translateY(0px) rotate(-2deg); }
            50% { transform: translateY(-1.5px) rotate(0deg); }
          }
          @keyframes ${prefix}-float-right {
            0%, 100% { transform: translateY(-1px) rotate(2deg); }
            50% { transform: translateY(1px) rotate(0deg); }
          }
          @keyframes ${prefix}-pulse {
            0%, 100% { opacity: 0.55; }
            50% { opacity: 1; }
          }
          @keyframes ${prefix}-joint-glow {
            0%, 100% { opacity: 0.65; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.15); }
          }
          @keyframes ${prefix}-node-travel {
            0%, 100% { opacity: 0.45; transform: scale(0.85); }
            50% { opacity: 1; transform: scale(1.15); }
          }
          .${prefix}-orbit {
            transform-origin: 36px 36px;
            animation: ${prefix}-orbit 10s linear infinite;
          }
          .${prefix}-hand-left {
            transform-origin: 17px 38px;
            animation: ${prefix}-float-left 3.2s ease-in-out infinite;
          }
          .${prefix}-hand-right {
            transform-origin: 55px 38px;
            animation: ${prefix}-float-right 3.2s ease-in-out infinite 0.4s;
          }
          .${prefix}-bone {
            animation: ${prefix}-pulse 2.4s ease-in-out infinite;
          }
          .${prefix}-joint {
            transform-origin: center;
            transform-box: fill-box;
            animation: ${prefix}-joint-glow 2s ease-in-out infinite;
          }
          .${prefix}-node-0 { animation: ${prefix}-node-travel 2s ease-in-out infinite 0s; }
          .${prefix}-node-1 { animation: ${prefix}-node-travel 2s ease-in-out infinite 0.5s; }
          .${prefix}-node-2 { animation: ${prefix}-node-travel 2s ease-in-out infinite 1s; }
          .${prefix}-node-3 { animation: ${prefix}-node-travel 2s ease-in-out infinite 1.5s; }
        `}</style>
      )}

      <svg
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label={title}
      >
        <defs>
          <linearGradient id={boneGrad} x1="8" y1="8" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e879f9" />
            <stop offset="0.5" stopColor="#c084fc" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id={ringGrad} x1="10" y1="10" x2="62" y2="62" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7c3aed" stopOpacity="0.9" />
            <stop offset="1" stopColor="#c026d3" stopOpacity="0.7" />
          </linearGradient>
          <radialGradient id={glowGrad} cx="36" cy="36" r="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d946ef" stopOpacity="0.18" />
            <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={jointGrad} cx="0.5" cy="0.5" r="0.5">
            <stop stopColor="#fdf4ff" />
            <stop offset="1" stopColor="#e879f9" />
          </radialGradient>
          <filter id={`${uid}-blur`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {showBackground && (
          <rect width="72" height="72" rx="16" fill="#0f0720" />
        )}

        <circle cx="36" cy="36" r="26" fill={`url(#${glowGrad})`} />

        <g className={animated ? `${prefix}-orbit` : undefined}>
          <circle
            cx="36"
            cy="36"
            r="24"
            stroke={`url(#${ringGrad})`}
            strokeWidth="0.8"
            strokeOpacity="0.55"
            fill="none"
          />
          <circle
            cx="36"
            cy="36"
            r="24"
            stroke="#e879f9"
            strokeWidth="0.4"
            strokeOpacity="0.25"
            strokeDasharray="3 8"
            fill="none"
          />
          {orbitNodes.map((node, i) => (
            <g key={`node-${i}`} className={animated ? `${prefix}-node-${i}` : undefined}>
              <circle
                cx={node.cx}
                cy={node.cy}
                r="2.2"
                fill="#fdf4ff"
                opacity="0.9"
              />
              <circle
                cx={node.cx}
                cy={node.cy}
                r="3.5"
                fill="#c084fc"
                opacity="0.35"
              />
            </g>
          ))}
        </g>

        <g className={animated ? `${prefix}-hand-left` : undefined} filter={`url(#${uid}-blur)`}>
          {leftBones.map(([x1, y1, x2, y2], i) => (
            <line
              key={`lb-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={`url(#${boneGrad})`}
              strokeWidth="1.5"
              strokeLinecap="round"
              className={animated ? `${prefix}-bone` : undefined}
              style={animated ? { animationDelay: `${i * 0.08}s` } : undefined}
            />
          ))}
          {leftJoints.map(([cx, cy], i) => (
            <circle
              key={`lj-${i}`}
              cx={cx}
              cy={cy}
              r={i === 0 ? 2 : i < 4 ? 1.6 : 1.3}
              fill={`url(#${jointGrad})`}
              className={animated ? `${prefix}-joint` : undefined}
              style={animated ? { animationDelay: `${i * 0.1}s` } : undefined}
            />
          ))}
        </g>

        <g className={animated ? `${prefix}-hand-right` : undefined} filter={`url(#${uid}-blur)`}>
          {rightBones.map(([x1, y1, x2, y2], i) => (
            <line
              key={`rb-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={`url(#${boneGrad})`}
              strokeWidth="1.5"
              strokeLinecap="round"
              className={animated ? `${prefix}-bone` : undefined}
              style={animated ? { animationDelay: `${i * 0.08 + 0.3}s` } : undefined}
            />
          ))}
          {rightJoints.map(([cx, cy], i) => (
            <circle
              key={`rj-${i}`}
              cx={cx}
              cy={cy}
              r={i === 0 ? 2 : i < 4 ? 1.6 : 1.3}
              fill={`url(#${jointGrad})`}
              className={animated ? `${prefix}-joint` : undefined}
              style={animated ? { animationDelay: `${i * 0.1 + 0.3}s` } : undefined}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
