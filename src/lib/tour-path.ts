/** A photographic spatial interpretation, not a measured scan of the shop. */
export const TOUR_PATH = [
  { x: 0, y: 0, z: 0, yaw: 0, image: "facadeWide" },
  { x: 0, y: 0, z: -18, yaw: 0, image: "facadeEntrance" },
  { x: 0, y: 0, z: -36, yaw: 0, image: "interiorAisle" },
  { x: -2, y: 0, z: -54, yaw: 0.18, image: "aisleDrinks" },
  { x: 1, y: 0, z: -72, yaw: -0.15, image: "aisleBiscuits" },
  { x: 3, y: 0, z: -90, yaw: -0.22, image: "bakery" },
  { x: 1, y: 0, z: -108, yaw: 0.1, image: "staffEpicerie" },
  { x: -1, y: 0, z: -126, yaw: 0.12, image: "customers" },
  { x: 0, y: 0, z: -144, yaw: 0, image: "staffHygiene" },
] as const;
export function tourSample(progress: number) {
  const bounded = Math.max(0, Math.min(1, progress));
  const scaled = bounded * (TOUR_PATH.length - 1);
  const index = Math.min(TOUR_PATH.length - 2, Math.floor(scaled));
  const local = scaled - index;
  const a = TOUR_PATH[index], b = TOUR_PATH[index + 1];
  const smooth = local * local * (3 - 2 * local);
  return {
    x: a.x + (b.x - a.x) * smooth,
    y: 0.1 * Math.sin(scaled * Math.PI),
    z: a.z + (b.z - a.z) * local,
    yaw: a.yaw + (b.yaw - a.yaw) * smooth,
    index: Math.min(TOUR_PATH.length - 1, Math.round(scaled)),
    local,
  };
}
export function chapterProgress(index: number) { return Math.max(0, Math.min(TOUR_PATH.length - 1, index)) / (TOUR_PATH.length - 1); }
