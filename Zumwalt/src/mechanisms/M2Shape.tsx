import React from "react";
import { C, E, FONT, lerp, ramp } from "../theme";
import { Body, Stage, useT } from "../ui";
import { Callout, MechHeader, Stamp } from "./common";

type V = [number, number];

// Cross-sections (relative to the waterline centre), same vertex count so they can morph.
const UPRIGHT: V[] = [
  [-180, 0], [-180, -80], [-90, -80], [-90, -260], [-30, -260], [-30, -340],
  [30, -340], [30, -260], [90, -260], [90, -80], [180, -80], [180, 0],
];
const TUMBLEHOME: V[] = [
  [-180, 0], [-150, -90], [-112, -90], [-48, -300], [-20, -300], [-20, -300],
  [20, -300], [20, -300], [48, -300], [112, -90], [150, -90], [180, 0],
];

/** First hit of a ray (origin o, direction d) with the polygon; returns hit point and reflected direction. */
const trace = (o: V, d: V, poly: V[]) => {
  let best: { p: V; r: V; dist: number } | null = null;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const ex = b[0] - a[0];
    const ey = b[1] - a[1];
    const den = d[0] * ey - d[1] * ex;
    if (Math.abs(den) < 1e-9) continue;
    const s = ((a[0] - o[0]) * ey - (a[1] - o[1]) * ex) / den;
    const u = ((a[0] - o[0]) * d[1] - (a[1] - o[1]) * d[0]) / den;
    if (s <= 1e-6 || u < 0 || u > 1) continue;
    if (best && s >= best.dist) continue;
    const len = Math.hypot(ex, ey);
    let nx = -ey / len;
    let ny = ex / len;
    if (nx * d[0] + ny * d[1] > 0) {
      nx = -nx;
      ny = -ny;
    }
    const k = 2 * (d[0] * nx + d[1] * ny);
    best = { p: [o[0] + d[0] * s, o[1] + d[1] * s], r: [d[0] - k * nx, d[1] - k * ny], dist: s };
  }
  return best;
};

const SHIP_X = 1240;
const WL = 760;
const RADAR: V = [330, 520];
const RAY_H = [-40, -130, -190, -245, -295];

export const M2Shape: React.FC = () => {
  const { t } = useT();

  // ── Part A: flashlight and mirror
  const partA = 1 - ramp(t, 8.0, 8.6, E.in);
  const mirrorAngle = lerp(0, 32, ramp(t, 4.6, 6.0, E.inOut)); // degrees
  const MC: V = [1300, 560];
  const mRad = (mirrorAngle * Math.PI) / 180;
  const mx = Math.sin(mRad) * 170;
  const my = Math.cos(mRad) * 170;
  const mirror: V[] = [
    [MC[0] - mx, MC[1] - my],
    [MC[0] + mx, MC[1] + my],
  ];
  const LAMP: V = [430, 560];
  const beamIn = ramp(t, 1.2, 2.4, E.inOut);
  const hitA = trace(LAMP, [1, 0], [mirror[0], mirror[1], [mirror[1][0] + 1, mirror[1][1]], [mirror[0][0] + 1, mirror[0][1]]]);
  const beamOut = ramp(t, 2.4, 3.4, E.inOut);
  const back = hitA ? Math.max(0, -hitA.r[0]) * Math.max(0, 1 - Math.abs(hitA.r[1]) * 3) : 0;
  const glare = ramp(t, 3.2, 3.6) * back;

  // ── Part B: radar and cross-section
  const partB = ramp(t, 8.6, 9.4);
  const morph = ramp(t, 13.6, 15.0, E.inOut);
  const poly: V[] = UPRIGHT.map((p, i) => [SHIP_X + lerp(p[0], TUMBLEHOME[i][0], morph), WL + lerp(p[1], TUMBLEHOME[i][1], morph)]);
  const rayIn = ramp(t, 10.0, 11.2, E.inOut);
  const rayOut = ramp(t, 11.2, 12.4, E.inOut);
  const rays = RAY_H.map((h) => {
    const o: V = [RADAR[0] + 40, WL + h];
    const hit = trace(o, [1, 0], poly);
    return { o, hit };
  });
  const returning = rays.filter((r) => r.hit && r.hit.r[0] < -0.95).length;
  const blip = rayOut > 0.95 ? returning / RAY_H.length : 0;
  const tumbleNote = ramp(t, 17.6, 18.4);

  return (
    <Stage dark>
      <MechHeader n={2} kicker="Why the ship looks like this" title="Sending the echo elsewhere" dark />
      <Stamp at={1} text="Simplified diagram" dark />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* ── Part A */}
        <g opacity={partA}>
          <g transform={`translate(${LAMP[0]} ${LAMP[1]})`}>
            <rect x={-150} y={-22} width={110} height={44} rx={6} fill={C.bone} />
            <path d="M-40,-22 L0,-40 L0,40 L-40,22 Z" fill={C.bone} />
          </g>
          <circle cx={LAMP[0]} cy={LAMP[1]} r={20 + 70 * glare} fill={C.amber} opacity={0.55 * glare} />
          <line x1={mirror[0][0]} y1={mirror[0][1]} x2={mirror[1][0]} y2={mirror[1][1]} stroke={C.bone} strokeWidth={10} strokeLinecap="round" opacity={ramp(t, 0.8, 1.2)} />
          {hitA ? (
            <>
              <line x1={LAMP[0]} y1={LAMP[1]} x2={lerp(LAMP[0], hitA.p[0], beamIn)} y2={LAMP[1]} stroke={C.amber} strokeWidth={6} />
              {beamOut > 0 ? (
                <line
                  x1={hitA.p[0]}
                  y1={hitA.p[1]}
                  x2={hitA.p[0] + hitA.r[0] * 900 * beamOut}
                  y2={hitA.p[1] + hitA.r[1] * 900 * beamOut}
                  stroke={C.amber}
                  strokeWidth={6}
                  strokeDasharray="22 12"
                  strokeDashoffset={-t * 120}
                />
              ) : null}
            </>
          ) : null}
          <Callout at={3.2} x={LAMP[0] - 90} y={680} text="FACING YOU: BRIGHT GLARE" anchor="start" color={C.amber} until={4.6} size={26} />
          <Callout at={6.0} x={760} y={780} text="TILTED: THE GLARE GOES ELSEWHERE" anchor="middle" color={C.amber} until={8.0} size={26} />
        </g>

        {/* ── Part B */}
        <g opacity={partB}>
          {/* Sea */}
          <rect x={0} y={WL} width={1920} height={320} fill={C.seaDark} />
          <line x1={0} y1={WL} x2={1920} y2={WL} stroke="#6B645A" strokeWidth={2} />
          {/* Radar */}
          <g transform={`translate(${RADAR[0]} ${RADAR[1]})`}>
            <line x1={0} y1={0} x2={0} y2={WL - RADAR[1]} stroke={C.bone} strokeWidth={6} />
            <path d="M-10,-70 Q40,0 -10,70 Z" fill={C.bone} />
            <circle cx={10} cy={0} r={8} fill={C.charcoal} />
          </g>
          <Callout at={9.2} x={RADAR[0]} y={WL + 50} text="RADAR" anchor="middle" color={C.bone} size={22} />
          {/* Echo scope */}
          <g transform="translate(580 400)" opacity={ramp(t, 9.4, 9.9)}>
            <rect x={-80} y={-60} width={160} height={120} rx={8} fill="#11100E" stroke="#4A453E" strokeWidth={2} />
            <line x1={-64} y1={30} x2={64} y2={30} stroke="#4A453E" strokeWidth={2} />
            <rect x={-18} y={30 - 80 * blip} width={36} height={80 * blip} fill={C.accent} />
            <text x={0} y={52} textAnchor="middle" fontFamily={FONT.mono} fontSize={14} fill="#9C9488">
              ECHO
            </text>
          </g>
          {/* Ship cross-section */}
          <path d={`M${poly.map((p) => p.join(",")).join(" L")} Z`} fill={C.charcoalUp} stroke={C.bone} strokeWidth={4} strokeLinejoin="round" />
          <path
            d={`M${poly[0].join(",")} L${poly[1].join(",")}`}
            stroke={C.accent}
            strokeWidth={8}
            strokeLinecap="round"
            opacity={tumbleNote}
          />
          {/* Rays (clipped below the header; cleared before the tumblehome annotation) */}
          <defs>
            <clipPath id="belowHeader">
              <rect x={0} y={350} width={1920} height={730} />
            </clipPath>
          </defs>
          <g clipPath="url(#belowHeader)" opacity={1 - ramp(t, 17.0, 17.5)}>
          {rays.map(({ o, hit }, i) =>
            hit ? (
              <g key={i}>
                <line x1={o[0]} y1={o[1]} x2={lerp(o[0], hit.p[0], rayIn)} y2={o[1]} stroke={C.amber} strokeWidth={3} opacity={0.85} />
                {rayOut > 0 ? (
                  <line
                    x1={hit.p[0]}
                    y1={hit.p[1]}
                    x2={hit.p[0] + hit.r[0] * 1100 * rayOut}
                    y2={hit.p[1] + hit.r[1] * 1100 * rayOut}
                    stroke={C.amber}
                    strokeWidth={3}
                    strokeDasharray="16 10"
                    strokeDashoffset={-t * 90}
                  />
                ) : null}
              </g>
            ) : null,
          )}
          </g>
          <Callout at={9.6} x={SHIP_X} y={WL + 70} text="UPRIGHT WALLS, OPEN MASTS" sub="Energy comes straight back to the radar" anchor="middle" color={C.bone} until={13.4} size={26} />
          <Callout at={14.8} x={SHIP_X} y={WL + 70} text="FACES LEAN INWARD" sub="More of the energy is sent away from the radar" anchor="middle" color={C.bone} size={26} />
          {/* Tumblehome angle */}
          <g opacity={tumbleNote}>
            <line x1={SHIP_X - 180} y1={WL} x2={SHIP_X - 180} y2={WL - 150} stroke="#9C9488" strokeWidth={2} strokeDasharray="6 8" />
            <path d={`M${SHIP_X - 180},${WL - 110} A110,110 0 0 1 ${SHIP_X - 180 + 110 * Math.sin(0.32)},${WL - 110 * Math.cos(0.32)}`} fill="none" stroke={C.accent} strokeWidth={3} />
          </g>
          <Callout at={17.8} x={SHIP_X - 420} y={WL - 190} text="TUMBLEHOME" sub="Hull sides lean inward above the waterline" anchor="end" color={C.accent} size={26} />
        </g>
      </svg>
      <Body at={19} size={23} color="#9C9488" style={{ position: "absolute", left: 192, bottom: 96, maxWidth: 1560, fontFamily: FONT.mono }}>
        Simplified. Real returns depend on angle, radar type and conditions. The ship does not disappear.
      </Body>
    </Stage>
  );
};
