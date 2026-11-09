/**
 * A photographic spatial interpretation, not a measured scan of the shop.
 *
 * Each stop is a "room" of the walk. `vp` is the photo's vanishing point (or
 * subject) in texture UV space (y up), `relief` how strongly the photo is
 * sculpted around it: positive values carve a corridor that recedes towards
 * the vanishing point, negative values push a subject (a person) towards the
 * lens. `door` is where the passage to the next room opens (the end of the
 * aisle, never a face). `focus` mirrors CSS object-position (x/y from the top-left) and keeps
 * the subject framed when the photo is cropped to the viewport.
 */
export type TourStop = {
  x: number;
  y: number;
  z: number;
  yaw: number;
  image:
    | "facadeWide"
    | "facadeEntrance"
    | "interiorAisle"
    | "aisleDrinks"
    | "aisleBiscuits"
    | "bakery"
    | "staffEpicerie"
    | "customers"
    | "staffHygiene";
  vp: readonly [number, number];
  door: readonly [number, number];
  relief: number;
  focus: readonly [number, number];
};

export const TOUR_PATH: readonly TourStop[] = [
  {
    x: 0,
    y: 0,
    z: 0,
    yaw: 0,
    image: "facadeWide",
    vp: [0.46, 0.42],
    door: [0.48, 0.4],
    relief: 3.2,
    focus: [0.5, 0.6],
  },
  {
    x: 0,
    y: 0,
    z: -18,
    yaw: 0,
    image: "facadeEntrance",
    vp: [0.62, 0.45],
    door: [0.62, 0.45],
    relief: 4.2,
    focus: [0.55, 0.55],
  },
  {
    x: 0,
    y: 0,
    z: -36,
    yaw: 0,
    image: "interiorAisle",
    vp: [0.5, 0.56],
    door: [0.5, 0.56],
    relief: 9,
    focus: [0.5, 0.55],
  },
  {
    x: -2,
    y: 0,
    z: -54,
    yaw: 0.18,
    image: "aisleDrinks",
    vp: [0.56, 0.62],
    door: [0.56, 0.62],
    relief: 8,
    focus: [0.55, 0.5],
  },
  {
    x: 1,
    y: 0,
    z: -72,
    yaw: -0.15,
    image: "aisleBiscuits",
    vp: [0.76, 0.6],
    door: [0.76, 0.6],
    relief: 7,
    focus: [0.5, 0.5],
  },
  {
    x: 3,
    y: 0,
    z: -90,
    yaw: -0.22,
    image: "bakery",
    vp: [0.62, 0.52],
    door: [0.42, 0.62],
    relief: -3.4,
    focus: [0.5, 0.38],
  },
  {
    x: 1,
    y: 0,
    z: -108,
    yaw: 0.1,
    image: "staffEpicerie",
    vp: [0.62, 0.58],
    door: [0.86, 0.72],
    relief: -4.4,
    focus: [0.5, 0.35],
  },
  {
    x: -1,
    y: 0,
    z: -126,
    yaw: 0.12,
    image: "customers",
    vp: [0.55, 0.55],
    door: [0.5, 0.86],
    relief: -3.6,
    focus: [0.5, 0.4],
  },
  {
    x: 0,
    y: 0,
    z: -144,
    yaw: 0,
    image: "staffHygiene",
    vp: [0.36, 0.52],
    door: [0.7, 0.6],
    relief: -3.8,
    focus: [0.5, 0.35],
  },
];

/** Distance between the camera at a stop and that stop's photographic room. */
export const ROOM_DISTANCE = 18;

const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

export function tourSample(progress: number) {
  const bounded = Math.max(0, Math.min(1, progress));
  const scaled = bounded * (TOUR_PATH.length - 1);
  const index = Math.min(TOUR_PATH.length - 2, Math.floor(scaled));
  const local = scaled - index;
  const a = TOUR_PATH[index],
    b = TOUR_PATH[index + 1];
  const smooth = local * local * (3 - 2 * local);
  // The walk lingers at each room and accelerates through the doorways in between.
  const walk = smoother(local);
  return {
    x: a.x + (b.x - a.x) * smooth,
    y: 0.1 * Math.sin(scaled * Math.PI),
    z: a.z + (b.z - a.z) * walk,
    yaw: a.yaw + (b.yaw - a.yaw) * smooth,
    index: Math.min(TOUR_PATH.length - 1, Math.round(scaled)),
    local,
  };
}
export function chapterProgress(index: number) {
  return Math.max(0, Math.min(TOUR_PATH.length - 1, index)) / (TOUR_PATH.length - 1);
}
