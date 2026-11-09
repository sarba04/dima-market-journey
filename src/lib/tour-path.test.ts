import { describe, expect, it } from "vitest";
import { tourSample, chapterProgress, TOUR_PATH } from "./tour-path";
describe("scroll-controlled spatial visit", () => {
 it("starts outside and ends at the final stop", () => {
  expect(tourSample(0).z).toBe(0);
  expect(tourSample(1).z).toBe(-144);
  expect(tourSample(1).index).toBe(8);
 });
 it("moves continuously forward through the entrance and departments", () => {
  let previous = 1;
  for (let i=0;i<=100;i++) { const z=tourSample(i/100).z; expect(z).toBeLessThanOrEqual(previous); previous=z; }
 });
 it("chapter navigation reaches each camera waypoint", () => {
  TOUR_PATH.forEach((stop,i) => { const sample=tourSample(chapterProgress(i)); expect(sample.z).toBeCloseTo(stop.z); expect(sample.x).toBeCloseTo(stop.x); expect(sample.index).toBe(i); });
 });
 it("clamps overscroll to the path", () => { expect(tourSample(-2).z).toBe(0); expect(tourSample(2).z).toBe(-144); });
});
