import React from "react";
import { pointAt, polyline, Sea, SHIP, ShipProfile } from "../ship";
import { C, E, FONT, ramp } from "../theme";
import { Source, Stage, useT } from "../ui";
import { Callout, cubic, MechHeader, Stamp, Steps } from "./common";

// Part A geometry
const SX = 260;
const SS = 1.4;
const WL = 760;
const DECK = WL - 34 * SS;
const VOL = { x: SX + 640 * SS, w: (830 - 640) * SS, y: DECK, h: 110 };

// Part C geometry
const PWL = 900;
const PSHIP_X = 170;
const PSHIP_W = 260;
const TUBE: [number, number] = [PSHIP_X + 700 * (PSHIP_W / 1000), PWL - 34 * (PSHIP_W / 1000)];
const COLD = cubic(TUBE, [TUBE[0], TUBE[1] - 40], [TUBE[0], TUBE[1] - 80], [TUBE[0], TUBE[1] - 110], 20);
const BOOST = cubic(COLD[COLD.length - 1], [TUBE[0] + 20, 600], [560, 500], [900, 490], 60);
const GLIDE: [number, number][] = cubic([900, 490], [1150, 480], [1350, 560], [1760, 680], 90).map(([x, y], i, arr) => {
  const f = i / (arr.length - 1);
  return [x, y + Math.sin(f * Math.PI * 3) * 28 * Math.max(0, f - 0.25)];
});

const CAPTIONS: { a: number; b: number; text: string }[] = [
  { a: 12.8, b: 13.6, text: "Gas pushes the missile out of the tube" },
  { a: 13.6, b: 16.0, text: "The motor ignites only after it leaves; booster stages accelerate it" },
  { a: 16.0, b: 16.8, text: "The glide body separates" },
  { a: 16.8, b: 20.6, text: "It glides in the atmosphere faster than Mach 5, and can change its path" },
  { a: 20.6, b: 30, text: "Heat, control and accuracy still have to be managed for the whole flight" },
];

const Missile: React.FC<{ x: number; y: number; angle: number; flame?: boolean; glow?: number; glideOnly?: boolean; t: number }> = ({
  x,
  y,
  angle,
  flame,
  glow = 0,
  glideOnly,
  t,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${(angle * 180) / Math.PI})`}>
    {glow > 0 ? (
      <>
        <ellipse cx={-6} cy={0} rx={46 + 10 * glow} ry={20 + 6 * glow} fill={C.accent} opacity={0.25 * glow} />
        <ellipse cx={2} cy={0} rx={28} ry={11} fill={C.amber} opacity={0.5 * glow} />
      </>
    ) : null}
    {flame ? <path d={`M-58,-6 L${-110 - 20 * Math.abs(Math.sin(t * 37))},0 L-58,6 Z`} fill={C.amber} /> : null}
    {glideOnly ? (
      <path d="M-18,-7 L14,-3 L24,0 L14,3 L-18,7 Z" fill={C.bone} />
    ) : (
      <path d="M-58,-7 L10,-7 L10,-6 L30,-4 L42,0 L30,4 L10,6 L10,7 L-58,7 Z" fill={C.bone} />
    )}
  </g>
);

export const M5Cps: React.FC = () => {
  const { t } = useT();
  const partA = 1 - ramp(t, 7.0, 7.5, E.in);
  const partB = ramp(t, 7.6, 8.0) * (1 - ramp(t, 12.0, 12.4, E.in));
  const partC = ramp(t, 12.3, 12.8);

  // Part A
  const lift = ramp(t, 3.2, 4.4, E.in);
  const tubes = ramp(t, 4.4, 5.4, E.inOut);

  // Part B
  const mH = 440;
  const grow = ramp(t, 7.9, 9.0, E.out);

  // Part C
  let pos = { x: TUBE[0], y: TUBE[1], angle: -Math.PI / 2 };
  let phase: "none" | "cold" | "boost" | "glide" = "none";
  if (t >= 12.8 && t < 13.6) {
    phase = "cold";
    pos = pointAt(COLD, ramp(t, 12.8, 13.6, E.outCubic));
  } else if (t >= 13.6 && t < 16.0) {
    phase = "boost";
    pos = pointAt(BOOST, ramp(t, 13.6, 16.0, E.inOut));
  } else if (t >= 16.0) {
    phase = "glide";
    pos = pointAt(GLIDE, ramp(t, 16.0, 22.5, E.inOut));
  }
  const sep1 = pointAt(BOOST, 0.5);
  const sep2 = BOOST[BOOST.length - 1];
  const fall = (at: number, from: { x: number; y: number }, i: number) => {
    const k = Math.max(0, t - at);
    if (t < at || k > 1.6) return null;
    return (
      <g key={i} opacity={1 - k / 1.6} transform={`translate(${from.x - 40 * k} ${from.y + 140 * k * k}) rotate(${-30 + 140 * k})`}>
        <rect x={-30} y={-7} width={36} height={14} fill="#8E867A" />
      </g>
    );
  };
  const trail = (
    <>
      <path d={polyline(COLD, phase === "cold" ? ramp(t, 12.8, 13.6, E.outCubic) : t >= 13.6 ? 1 : 0)} stroke="#9C9488" strokeWidth={3} fill="none" strokeDasharray="4 8" />
      <path d={polyline(BOOST, phase === "boost" ? ramp(t, 13.6, 16.0, E.inOut) : t >= 16 ? 1 : 0)} stroke={C.amber} strokeWidth={4} fill="none" opacity={0.85} />
      <path d={polyline(GLIDE, phase === "glide" ? ramp(t, 16.0, 22.5, E.inOut) : 0)} stroke={C.accent} strokeWidth={4} fill="none" strokeDasharray="18 10" />
    </>
  );
  const glow = ramp(t, 16.8, 18.0);

  return (
    <Stage dark>
      <MechHeader n={5} kicker="Conventional Prompt Strike (CPS)" title="From guns to a hypersonic missile" dark titleSize={90} />
      <Stamp at={1} text="Schematic · not to scale" dark />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="hatch5" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="14" stroke={C.amber} strokeWidth="3" />
          </pattern>
          <pattern id="tubes5" width="34" height="10" patternUnits="userSpaceOnUse">
            <rect x="4" y="0" width="22" height="10" fill={C.accent} />
          </pattern>
        </defs>

        {/* ── Part A: what replaced the guns */}
        <g opacity={partA}>
          <Sea id="m5seaA" x={0} y={WL} w={1920} h={320} dark />
          <path
            d={`M${SX},${WL} L${SX + 8},${WL + 50} Q${SX + 60},${WL + 80} ${SX + 160},${WL + 80} L${SX + 1300},${WL + 80} Q${SX + 1380},${WL + 70} ${SX + 1400},${WL}`}
            fill="none"
            stroke="#6B645A"
            strokeWidth={2}
            strokeDasharray="8 8"
            opacity={ramp(t, 1.6, 2.2)}
          />
          <ShipProfile x={SX} y={WL} width={1400} draw={ramp(t, 0.6, 2.0, E.inOut)} fill={ramp(t, 1.6, 2.2)} stroke={C.bone} fillColor={C.charcoalUp} hideWeapons />
          {/* Old guns lifting out */}
          <g transform={`translate(${SX} ${WL - 120 * lift}) scale(${SS})`} opacity={1 - lift}>
            <path d={SHIP.ags} fill={C.charcoalUp} stroke={C.bone} strokeWidth={2.5 / SS} opacity={ramp(t, 1.6, 2.2)} />
          </g>
          {/* New launcher housing */}
          <g transform={`translate(${SX} ${WL}) scale(${SS})`} opacity={tubes}>
            <path d={SHIP.cps} fill={C.charcoalUp} stroke={C.accent} strokeWidth={3 / SS} />
          </g>
          {/* Below-deck volume */}
          <rect x={VOL.x} y={VOL.y} width={VOL.w} height={VOL.h} fill="url(#hatch5)" opacity={ramp(t, 2.0, 2.6) * 0.8 * (1 - tubes)} />
          <rect x={VOL.x} y={VOL.y} width={VOL.w} height={VOL.h} fill="url(#tubes5)" opacity={tubes} />
          <rect x={VOL.x} y={VOL.y} width={VOL.w} height={VOL.h} fill="none" stroke={tubes > 0.5 ? C.accent : C.amber} strokeWidth={3} opacity={ramp(t, 2.0, 2.6)} />
          <Callout at={2.4} x={VOL.x + VOL.w / 2} y={WL + 150} text="THE GUNS ALSO FILLED SPACE BELOW DECK" anchor="middle" color={C.amber} size={24} until={4.2} />
          <Callout at={5.2} x={VOL.x + VOL.w / 2} y={WL + 150} text="LARGE LAUNCH TUBES REUSE THAT VOLUME" sub="Refit at Pascagoula, from August 2023" anchor="middle" color={C.accent} size={24} />
        </g>

        {/* ── Part B: scale */}
        <g opacity={partB}>
          <line x1={700} y1={840} x2={1400} y2={840} stroke="#6B645A" strokeWidth={3} />
          <g>
            <rect x={840} y={840 - mH * grow} width={64} height={mH * grow} fill={C.bone} />
            <path d={`M840,${840 - mH * grow} L872,${840 - mH * grow - 60 * grow} L904,${840 - mH * grow} Z`} fill={C.bone} />
          </g>
          {Array.from({ length: 4 }, (_, i) => {
            const p = ramp(t, 8.6 + i * 0.3, 9.0 + i * 0.3, E.back);
            const y = 840 - (i + 1) * 125;
            return (
              <g key={i} opacity={p}>
                <rect x={1000} y={y} width={300} height={125} fill="none" stroke={C.amber} strokeWidth={3} />
                <rect x={1030} y={y + 35} width={50} height={55} fill="none" stroke={C.amber} strokeWidth={2} opacity={0.6} />
                <rect x={1125} y={y + 35} width={50} height={55} fill="none" stroke={C.amber} strokeWidth={2} opacity={0.6} />
                <rect x={1220} y={y + 35} width={50} height={55} fill="none" stroke={C.amber} strokeWidth={2} opacity={0.6} />
                <text x={1320} y={y + 72} fontFamily={FONT.mono} fontSize={22} fill={C.amber}>
                  {i + 1}
                </text>
              </g>
            );
          })}
          <Callout at={9.8} x={960} y={900} text="ROUGHLY THE HEIGHT OF A FOUR-STORY BUILDING" sub="Scale comparison as described by GAO" anchor="middle" color={C.bone} size={26} />
        </g>

        {/* ── Part C: flight principle */}
        <g opacity={partC}>
          <Sea id="m5seaC" x={0} y={PWL} w={1920} h={36} dark />
          <ShipProfile x={PSHIP_X} y={PWL} width={PSHIP_W} variant="cps" stroke={C.bone} fillColor={C.charcoalUp} strokeWidth={1.2} weaponsColor={C.accent} />
          {t >= 12.8 && t < 14.2
            ? [0, 1, 2, 3].map((i) => {
                const k = ramp(t, 12.8 + i * 0.1, 14.0 + i * 0.1, E.outCubic);
                return <circle key={i} cx={TUBE[0] + (i - 1.5) * 16 * k} cy={TUBE[1] - 10} r={8 + 40 * k} fill={C.bone} opacity={0.35 * (1 - k)} />;
              })
            : null}
          {trail}
          {fall(14.8, sep1, 1)}
          {fall(16.0, { x: sep2[0], y: sep2[1] }, 2)}
          {phase !== "none" ? (
            <Missile x={pos.x} y={pos.y} angle={pos.angle} flame={phase === "boost"} glideOnly={phase === "glide"} glow={phase === "glide" ? glow : 0} t={t} />
          ) : null}
          <Callout at={14.9} x={sep1.x + 30} y={sep1.y + 60} text="STAGE DROPS AWAY" color="#9C9488" size={18} until={16.4} />
        </g>
      </svg>
      <div style={{ opacity: partC }}>
        <Steps labels={["Cold-gas launch", "Ignition", "Boost", "Separation", "Hypersonic glide"]} activeAt={[12.8, 13.6, 14.2, 16.0, 16.8]} x={192} y={350} dark showAt={12.4} />
        {CAPTIONS.map((c, i) => {
          const o = ramp(t, c.a, c.a + 0.3) * (1 - ramp(t, c.b - 0.2, c.b));
          return (
            <div key={i} style={{ position: "absolute", left: 192, top: 425, fontFamily: FONT.sans, fontSize: 34, color: C.bone, opacity: o, maxWidth: 1500 }}>
              {c.text}
            </div>
          );
        })}
      </div>
      <Source at={1.2} dark>
        {t < 12.3
          ? "Sources: HII (Jan 2026), GAO-26-107974 · launcher layout schematic, not a technical drawing"
          : "Ship launch is a plan: first CPS flight from DDG-1000 scheduled FY2027 · cold-gas launch ground-tested 2025"}
      </Source>
    </Stage>
  );
};
