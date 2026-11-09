import { loadFont as loadCondensed } from "@remotion/google-fonts/BarlowCondensed";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadSans } from "@remotion/google-fonts/IBMPlexSans";
import { Easing, interpolate } from "remotion";

export const FONT = {
  display: loadCondensed("normal", { weights: ["600", "700", "800"], subsets: ["latin"] }).fontFamily,
  mono: loadMono("normal", { weights: ["400", "500", "600"], subsets: ["latin"] }).fontFamily,
  sans: loadSans("normal", { weights: ["400", "500", "600"], subsets: ["latin"] }).fontFamily,
};

// Warm editorial palette. Deliberately no blue anywhere (user request).
export const C = {
  paper: "#ECE5D8",
  paperDeep: "#E2D9C8",
  ink: "#1C1A17",
  inkSoft: "#4A453E",
  muted: "#8A8276",
  rule: "#C9BFAD",
  charcoal: "#1B1916",
  charcoalUp: "#2A2722",
  bone: "#EFE9DD",
  accent: "#E2462B",
  amber: "#EFAE3A",
  sage: "#8C9474",
  sea: "#D5CCBB",
  seaDark: "#2F2B26",
};

export const W = 1920;
export const H = 1080;
export const FPS = 30;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const E = {
  // Entrances: fast start, long settle.
  out: Easing.bezier(0.16, 1, 0.3, 1),
  outCubic: Easing.out(Easing.cubic),
  // Exits accelerate away.
  in: Easing.in(Easing.cubic),
  // Repositioning while visible.
  inOut: Easing.inOut(Easing.cubic),
  // Slight overshoot (~6%) for small elements landing.
  back: Easing.bezier(0.34, 1.35, 0.64, 1),
  linear: Easing.linear,
};

/** 0→1 between seconds a and b. */
export const ramp = (t: number, a: number, b: number, easing = E.out) =>
  interpolate(t, [a, b], [0, 1], { ...clamp, easing });

/** 1 while inside [a, b], with fade in/out of `f` seconds. */
export const window01 = (t: number, a: number, b: number, f = 0.4) =>
  Math.min(ramp(t, a, a + f, E.outCubic), 1 - ramp(t, b - f, b, E.in));

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
