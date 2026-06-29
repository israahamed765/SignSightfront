const FEATURE_SIZE = 63;

const emptyHand = () => Array(FEATURE_SIZE).fill(0);

/** محاذاة المفاصل — نفس المنطق في sign_engine.py */
function rotateHandToCanonical(coords) {
  const ref = coords[9];
  const normXy = Math.hypot(ref[0], ref[1]);
  if (normXy < 1e-4) return coords;

  const angle = Math.atan2(ref[0], ref[1]);
  const c = Math.cos(-angle);
  const s = Math.sin(-angle);

  return coords.map(([x, y, z]) => [x * c - y * s, x * s + y * c, z]);
}

export function landmarksToFeatures(landmarkList) {
  if (!landmarkList?.length) return null;

  const coords = landmarkList.map((lm) => [lm.x, lm.y, lm.z ?? 0]);
  const wrist = coords[0];
  let normalized = coords.map((c) => [
    c[0] - wrist[0],
    c[1] - wrist[1],
    c[2] - wrist[2],
  ]);
  const scale =
    Math.hypot(normalized[9][0], normalized[9][1], normalized[9][2]) + 1e-6;
  normalized = normalized.map((c) => [c[0] / scale, c[1] / scale, c[2] / scale]);
  normalized = rotateHandToCanonical(normalized);

  return normalized.flatMap((c) => c);
}

export function extractHandsFeatures(multiHandLandmarks, multiHandedness = []) {
  if (!multiHandLandmarks?.length) return null;

  let left = null;
  let right = null;

  multiHandLandmarks.forEach((landmarks, index) => {
    const feat = landmarksToFeatures(landmarks);
    if (!feat) return;
    const label = multiHandedness[index]?.label || "Right";
    if (label === "Left") left = feat;
    else right = feat;
  });

  if (!left && !right) return null;
  // نفس ترتيب sign_engine.py: يسار (63) ثم يمين (63)
  if (!left && right) return [...emptyHand(), ...right];
  if (left && !right) return [...left, ...emptyHand()];
  return [...left, ...right];
}
