import React from "react";
import { C } from "./theme";

/**
 * Side profile of DDG-1000, traced from the Pearl Harbor arrival footage (bow to the right).
 * Units: ship length = 1000, waterline at y = 0, up is negative. Schematic, not a drawing.
 */
export const SHIP = {
  hull: "M0,0 L0,-34 L965,-34 L1000,0 Z",
  hangar: "M222,-34 L226,-74 L342,-74 L342,-34 Z",
  domes: "M238,-74 A12,12 0 0 1 262,-74 Z M290,-74 A12,12 0 0 1 314,-74 Z",
  house: "M332,-34 L357,-140 L562,-140 L600,-34 Z",
  mast: "M548,-140 L548,-178 M540,-168 L556,-168",
  ags: "M648,-34 L656,-57 L712,-57 L721,-34 Z M712,-48 L800,-48 L800,-43 L716,-43 Z M758,-34 L765,-54 L816,-54 L824,-34 Z M816,-46 L902,-46 L902,-41 L820,-41 Z",
  cps: "M640,-34 L646,-46 L760,-46 L766,-34 Z",
};

export type ShipVariant = "ags" | "cps";

export const ShipProfile: React.FC<{
  x: number;
  y: number;
  width: number;
  variant?: ShipVariant;
  draw?: number;
  fill?: number;
  stroke?: string;
  fillColor?: string;
  strokeWidth?: number;
  hideWeapons?: boolean;
  weaponsColor?: string;
}> = ({
  x,
  y,
  width,
  variant = "ags",
  draw = 1,
  fill = 1,
  stroke = C.ink,
  fillColor = C.ink,
  strokeWidth = 2.5,
  hideWeapons,
  weaponsColor,
}) => {
  const s = width / 1000;
  const common = {
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1 - draw,
    stroke,
    strokeWidth: strokeWidth / s,
    strokeLinejoin: "round" as const,
    fill: fillColor,
    fillOpacity: fill,
    vectorEffect: "none" as const,
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={SHIP.hull} {...common} />
      <path d={SHIP.hangar} {...common} />
      <path d={SHIP.domes} {...common} />
      <path d={SHIP.house} {...common} />
      <path d={SHIP.mast} {...common} fill="none" />
      {hideWeapons ? null : (
        <path
          d={variant === "ags" ? SHIP.ags : SHIP.cps}
          {...common}
          stroke={weaponsColor ?? stroke}
          fill={weaponsColor ?? fillColor}
        />
      )}
    </g>
  );
};

/** Compact filled ship glyph for rows and grids. */
export const ShipGlyph: React.FC<{ x: number; y: number; width: number; color: string; outline?: boolean }> = ({
  x,
  y,
  width,
  color,
  outline,
}) => (
  <ShipProfile
    x={x}
    y={y}
    width={width}
    fill={outline ? 0 : 1}
    fillColor={color}
    stroke={color}
    strokeWidth={outline ? 2 : 0.5}
  />
);

/** Builds an SVG path string from points, optionally only the first fraction p of them. */
export const polyline = (pts: [number, number][], p = 1) => {
  if (pts.length === 0 || p <= 0) return "";
  const n = Math.max(1, p * (pts.length - 1));
  const whole = Math.floor(n);
  const out = pts.slice(0, whole + 1).map(([a, b], i) => `${i ? "L" : "M"}${a.toFixed(1)},${b.toFixed(1)}`);
  const frac = n - whole;
  if (frac > 0 && whole + 1 < pts.length) {
    const [ax, ay] = pts[whole];
    const [bx, by] = pts[whole + 1];
    out.push(`L${(ax + (bx - ax) * frac).toFixed(1)},${(ay + (by - ay) * frac).toFixed(1)}`);
  }
  return out.join(" ");
};

/** Point and heading at fraction p along a sampled polyline. */
export const pointAt = (pts: [number, number][], p: number) => {
  const n = Math.min(pts.length - 1.0001, Math.max(0, p * (pts.length - 1)));
  const i = Math.floor(n);
  const f = n - i;
  const [ax, ay] = pts[i];
  const [bx, by] = pts[i + 1];
  return { x: ax + (bx - ax) * f, y: ay + (by - ay) * f, angle: Math.atan2(by - ay, bx - ax) };
};

/** Hatched sea band. */
export const Sea: React.FC<{ x: number; y: number; w: number; h: number; dark?: boolean; id: string }> = ({ x, y, w, h, dark, id }) => (
  <g>
    <defs>
      <pattern id={id} width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
        <line x1="0" y1="0" x2="0" y2="18" stroke={dark ? "#4A443B" : "#B9AE9A"} strokeWidth="2" />
      </pattern>
    </defs>
    <rect x={x} y={y} width={w} height={h} fill={dark ? C.seaDark : C.sea} />
    <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
  </g>
);
