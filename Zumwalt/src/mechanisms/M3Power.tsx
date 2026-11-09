import React from "react";
import { C, E, FONT, ramp } from "../theme";
import { Chip, Source, Stage, useT } from "../ui";
import { Callout, integrate, keyframes, MechHeader, Stamp } from "./common";

const BUS_X = 960;

type Box = { x: number; y: number; w: number; h: number; label: string; sub?: string };
const TURB: Box = { x: 192, y: 470, w: 250, h: 150, label: "GAS TURBINES", sub: "burn fuel" };
const GEN: Box = { x: 540, y: 470, w: 250, h: 150, label: "GENERATORS", sub: "make electricity" };
const PROP: Box = { x: 1120, y: 340, w: 300, h: 110, label: "PROPULSION MOTORS" };
const SENS: Box = { x: 1120, y: 520, w: 300, h: 110, label: "SENSORS & WEAPONS" };
const SERV: Box = { x: 1120, y: 700, w: 300, h: 110, label: "SHIP SERVICES", sub: "always on" };
const NEW: Box = { x: 1500, y: 520, w: 228, h: 110, label: "NEW EQUIPMENT" };

// Shares of the load in each mode (illustrative only).
const T_A = 5.5;
const T_B = 10.5;
const share = (t: number) => ({
  prop: keyframes(t, [4, T_A, T_A + 1, T_B, T_B + 1], [0.34, 0.34, 0.72, 0.72, 0.3]),
  sens: keyframes(t, [4, T_A, T_A + 1, T_B, T_B + 1], [0.33, 0.33, 0.14, 0.14, 0.56]),
  serv: 0.14,
});

const BoxEl: React.FC<{ b: Box; at: number; dashed?: boolean; hl?: number }> = ({ b, at, dashed, hl = 0 }) => {
  const { t } = useT();
  const p = ramp(t, at, at + 0.45, E.back);
  const lp = ramp(t, at + 0.9, at + 1.3);
  return (
    <g opacity={ramp(t, at, at + 0.3)} transform={`translate(${b.x + b.w / 2} ${b.y + b.h / 2}) scale(${0.85 + 0.15 * p}) translate(${-b.x - b.w / 2} ${-b.y - b.h / 2})`}>
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={6} fill={dashed ? "none" : C.paperDeep} stroke={hl > 0.5 ? C.accent : C.ink} strokeWidth={hl > 0.5 ? 5 : 3} strokeDasharray={dashed ? "12 8" : undefined} />
      <text x={b.x + b.w / 2} y={b.y + b.h / 2 + (b.sub ? -4 : 9)} textAnchor="middle" fontFamily={FONT.mono} fontWeight={600} fontSize={24} letterSpacing="0.05em" fill={C.ink} opacity={lp}>
        {b.label}
      </text>
      {b.sub ? (
        <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 30} textAnchor="middle" fontFamily={FONT.sans} fontSize={22} fill={C.inkSoft} opacity={lp}>
          {b.sub}
        </text>
      ) : null}
    </g>
  );
};

/** Connector with a flowing dash whose width and speed follow the share of power. */
const Flow: React.FC<{ d: string; at: number; w: number; offset: number; len?: number }> = ({ d, at, w, offset, len = 1 }) => {
  const { t } = useT();
  const draw = ramp(t, at, at + 0.7, E.inOut);
  return (
    <g>
      <path d={d} fill="none" stroke={C.ink} strokeWidth={4 + w} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      {t > at + 0.7 ? (
        <path d={d} fill="none" stroke={C.amber} strokeWidth={Math.max(2, w * 0.55)} strokeLinecap="butt" strokeDasharray={`${18 * len} ${16 * len}`} strokeDashoffset={-offset} />
      ) : null}
    </g>
  );
};

export const M3Power: React.FC = () => {
  const { t } = useT();
  const s = share(t);
  const flowOn = (x: number) => (x < 4 ? 0 : 1);
  const off = (key: "prop" | "sens" | "serv") => integrate(t, (tt) => flowOn(tt) * 40 * (0.4 + 3 * share(tt)[key]));
  const offMain = integrate(t, (tt) => flowOn(tt) * 160);
  const propAngle = integrate(t, (tt) => flowOn(tt) * 900 * share(tt).prop);
  const W = (x: number) => 4 + 34 * x;
  const newOn = ramp(t, 15.5, 16.2);
  const newFlow = ramp(t, 17.0, 17.6);
  const offNew = integrate(t, (tt) => (tt > 17.4 ? 40 : 0));
  const modeA = ramp(t, T_A, T_A + 0.3) * (1 - ramp(t, T_B, T_B + 0.3));
  const modeB = ramp(t, T_B, T_B + 0.3);
  const checks = ["SPACE", "COOLING", "CONNECTION"];
  return (
    <Stage>
      <MechHeader n={3} kicker="≈78 MW · integrated power system" title="One network, many loads" />
      <Stamp at={1} text="Shares shown schematically" />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* Bus */}
        <line x1={BUS_X} y1={340} x2={BUS_X} y2={340 + 470 * ramp(t, 2.0, 2.8, E.inOut)} stroke={C.ink} strokeWidth={16} strokeLinecap="round" />
        <Callout at={2.6} x={BUS_X} y={318} text="SHARED NETWORK" anchor="middle" size={22} />

        <Flow d={`M${TURB.x + TURB.w},545 L${GEN.x},545`} at={2.4} w={10} offset={offMain} />
        <Flow d={`M${GEN.x + GEN.w},545 L${BUS_X},545`} at={2.7} w={18} offset={offMain} />
        <Flow d={`M${BUS_X},395 L${PROP.x},395`} at={3.0} w={W(s.prop)} offset={off("prop")} />
        <Flow d={`M${BUS_X},575 L${SENS.x},575`} at={3.15} w={W(s.sens)} offset={off("sens")} />
        <Flow d={`M${BUS_X},755 L${SERV.x},755`} at={3.3} w={W(s.serv)} offset={off("serv")} />
        <Flow d={`M${PROP.x + PROP.w},395 L1560,395`} at={3.45} w={W(s.prop) * 0.7} offset={off("prop")} />

        <BoxEl b={TURB} at={1.0} />
        <BoxEl b={GEN} at={1.25} />
        <BoxEl b={PROP} at={1.5} />
        <BoxEl b={SENS} at={1.75} />
        <BoxEl b={SERV} at={2.0} hl={ramp(t, 20, 20.3)} />

        {/* Propeller */}
        <g transform={`translate(1600 395)`} opacity={ramp(t, 3.4, 3.9)}>
          <g transform={`rotate(${propAngle})`}>
            {[0, 120, 240].map((a) => (
              <ellipse key={a} cx={0} cy={-30} rx={13} ry={30} fill={C.ink} transform={`rotate(${a})`} />
            ))}
          </g>
          <circle r={11} fill={C.accent} />
        </g>
        <Callout at={3.8} x={1600} y={480} text="PROPELLERS" anchor="middle" size={20} />

        {/* New equipment */}
        <g opacity={newOn}>
          <path
            d={`M${BUS_X},480 L${NEW.x + NEW.w / 2},480 L${NEW.x + NEW.w / 2},${NEW.y}`}
            fill="none"
            stroke={C.ink}
            strokeWidth={6}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - ramp(t, 16.2, 17.0, E.inOut)}
          />
          {newFlow > 0 ? (
            <path d={`M${BUS_X},480 L${NEW.x + NEW.w / 2},480 L${NEW.x + NEW.w / 2},${NEW.y}`} fill="none" stroke={C.amber} strokeWidth={3} strokeDasharray="14 12" strokeDashoffset={-offNew} opacity={newFlow} />
          ) : null}
        </g>
        {t > 15.5 ? <BoxEl b={NEW} at={15.5} dashed /> : null}
        {checks.map((c, i) => {
          const at = 17.6 + i * 0.45;
          const p = ramp(t, at, at + 0.35, E.back);
          return (
            <g key={c} opacity={p} transform={`translate(${NEW.x} ${NEW.y + NEW.h + 40 + i * 40})`}>
              <rect x={0} y={-18} width={22} height={22} fill="none" stroke={C.ink} strokeWidth={2} />
              <path d={`M4,-8 L10,-2 L${4 + 16 * p},-16`} fill="none" stroke={C.accent} strokeWidth={4} />
              <text x={34} y={0} fontFamily={FONT.mono} fontSize={20} fill={C.ink} letterSpacing="0.06em">
                {c}?
              </text>
            </g>
          );
        })}
        <Callout at={20.3} x={SERV.x + SERV.w / 2} y={SERV.y + SERV.h + 44} text="NEVER FREE: THE SHIP'S OWN LOADS" anchor="middle" color={C.accent} size={20} />
      </svg>
      <div style={{ position: "absolute", left: 192, top: 760, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
        <Chip active={modeA} label="Fast transit" style={{ opacity: ramp(t, 5, 5.4) * (0.45 + 0.55 * modeA) }} />
        <Chip active={modeB} label="Slower speed, heavy sensor load" style={{ opacity: ramp(t, 10, 10.4) * (0.45 + 0.55 * modeB) }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 192,
          top: 680,
          fontFamily: FONT.mono,
          fontSize: 20,
          color: C.muted,
          letterSpacing: "0.08em",
          opacity: ramp(t, 4.6, 5.0),
        }}
      >
        LINE WIDTH = SHARE OF POWER
      </div>
      <Source at={4}>Source: GE Power Conversion (≈78 MW) · shares are illustrative, not measured values</Source>
    </Stage>
  );
};
