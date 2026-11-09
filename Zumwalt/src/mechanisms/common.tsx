import React from "react";
import { interpolate } from "remotion";
import { C, clamp, E, FONT, ramp } from "../theme";
import { Chip, Folio, Headline, Kicker, useT } from "../ui";

/** Header shared by the mechanism animations. */
export const MechHeader: React.FC<{ n: number; kicker: string; title: string; dark?: boolean; titleSize?: number }> = ({
  n,
  kicker,
  title,
  dark,
  titleSize = 96,
}) => (
  <>
    <Folio label={`HOW IT WORKS · ${String(n).padStart(2, "0")}`} dark={dark} />
    <div style={{ position: "absolute", left: 192, top: 150 }}>
      <Kicker at={0.25} color={dark ? C.amber : C.accent}>
        {kicker}
      </Kicker>
      <Headline at={0.4} text={title} size={titleSize} color={dark ? C.bone : C.ink} style={{ marginTop: 6 }} />
    </div>
  </>
);

/** "Principle · not to scale" style stamp, top right. */
export const Stamp: React.FC<{ at: number; text: string; dark?: boolean }> = ({ at, text, dark }) => {
  const { t } = useT();
  const p = ramp(t, at, at + 0.5);
  return (
    <div
      style={{
        position: "absolute",
        right: 192,
        top: 88,
        fontFamily: FONT.mono,
        fontSize: 20,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: dark ? C.bone : C.ink,
        border: `2px solid ${dark ? "#6B645A" : C.rule}`,
        padding: "8px 14px",
        opacity: p,
      }}
    >
      {text}
    </div>
  );
};

/** Row of step chips; `active` is the index of the current step (fractional allowed for cross-fade). */
export const Steps: React.FC<{ labels: string[]; activeAt: number[]; x: number; y: number; dark?: boolean; showAt?: number }> = ({
  labels,
  activeAt,
  x,
  y,
  dark,
  showAt = 0.8,
}) => {
  const { t } = useT();
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 14, opacity: ramp(t, showAt, showAt + 0.5) }}>
      {labels.map((l, i) => {
        const on = ramp(t, activeAt[i], activeAt[i] + 0.25, E.outCubic) * (1 - (i + 1 < activeAt.length ? ramp(t, activeAt[i + 1], activeAt[i + 1] + 0.25) : 0));
        return <Chip key={i} active={on} label={`${i + 1} · ${l}`} dark={dark} />;
      })}
    </div>
  );
};

/** SVG callout text with a short leader line, faded in at `at`. */
export const Callout: React.FC<{
  at: number;
  x: number;
  y: number;
  text: string;
  sub?: string;
  color?: string;
  anchor?: "start" | "middle" | "end";
  until?: number;
  size?: number;
}> = ({ at, x, y, text, sub, color = C.ink, anchor = "start", until, size = 26 }) => {
  const { t } = useT();
  const o = ramp(t, at, at + 0.45) * (until ? 1 - ramp(t, until, until + 0.4, E.in) : 1);
  return (
    <g opacity={o} transform={`translate(0 ${(1 - ramp(t, at, at + 0.45)) * 10})`}>
      <text x={x} y={y} textAnchor={anchor} fontFamily={FONT.mono} fontWeight={600} fontSize={size} letterSpacing="0.06em" fill={color}>
        {text}
      </text>
      {sub ? (
        <text x={x} y={y + size * 1.25} textAnchor={anchor} fontFamily={FONT.sans} fontSize={size - 2} fill={color} opacity={0.8}>
          {sub}
        </text>
      ) : null}
    </g>
  );
};

/** Expanding ring pulse used for impacts and returns. */
export const Pulse: React.FC<{ at: number; x: number; y: number; color: string; r?: number }> = ({ at, x, y, color, r = 60 }) => {
  const { t } = useT();
  const p = ramp(t, at, at + 0.9, E.outCubic);
  if (t < at) return null;
  return <circle cx={x} cy={y} r={8 + r * p} fill="none" stroke={color} strokeWidth={4 * (1 - p) + 0.5} opacity={1 - p} />;
};

/** Integral of a piecewise-linear signal over time, so speeds can change without jumps in position. */
export const integrate = (t: number, rate: (s: number) => number, step = 1 / 30) => {
  let acc = 0;
  for (let s = 0; s < t; s += step) acc += rate(s) * Math.min(step, t - s);
  return acc;
};

export const keyframes = (t: number, times: number[], values: number[]) =>
  interpolate(t, times, values, { ...clamp, easing: E.inOut });

/** Samples a cubic bezier into points. */
export const cubic = (
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  n = 60,
): [number, number][] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    const a = (1 - u) ** 3;
    const b = 3 * (1 - u) ** 2 * u;
    const c = 3 * (1 - u) * u ** 2;
    const d = u ** 3;
    return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
  });
