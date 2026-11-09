import { Globals, SpringValue, type SpringConfig } from "@react-spring/web";

// No rAF loop: springs only move when advance() is called.
Globals.assign({ frameLoop: "demand" });

/**
 * Value of a react-spring physics simulation `ms` after it started.
 * Re-simulated from scratch on each call, so any frame can be rendered independently.
 */
export const springAt = (
  ms: number,
  {
    from = 0,
    to = 1,
    config = {},
  }: { from?: number; to?: number; config?: SpringConfig },
  fps = 60,
): number => {
  if (ms <= 0) return from;
  const s = new SpringValue(from);
  s.start(to, { config });
  const dt = 1000 / fps;
  for (let t = 0; t < ms; t += dt) s.advance(Math.min(dt, ms - t));
  const v = s.get();
  s.stop();
  return v;
};
