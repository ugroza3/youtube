import React from "react";
import { ShipGlyph } from "../ship";
import { C, E, FONT, lerp, ramp } from "../theme";
import { Body, Source, Stage, useT } from "../ui";
import { Callout, MechHeader, Stamp } from "./common";

const BX = 360;
const BW = 1200;
const BY = 380;
const BH = 90;
const ROW_Y = 820;
const SLOT = BW / 32;
const BIG = [660, 960, 1260];

const Shell: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <g opacity={o} transform={`translate(${x} ${y})`}>
    <path d="M0,0 L0,-34 Q0,-50 7,-56 Q14,-50 14,-34 L14,0 Z" fill={C.ink} />
  </g>
);

export const M4Series: React.FC = () => {
  const { t } = useT();
  const partA = 1 - ramp(t, 15.8, 16.3, E.in);
  const partC = ramp(t, 16.3, 16.9);

  const blockIn = ramp(t, 1.0, 1.7, E.inOut);
  const ghost = ramp(t, 8.8, 9.6);
  const gather = ramp(t, 9.8, 10.8, E.inOut);
  const split3 = ramp(t, 11.0, 12.2, E.inOut);

  // Part C
  const barH = lerp(40, 400, ramp(t, 20.4, 22.0, E.out));

  return (
    <Stage>
      <MechHeader n={4} kicker="Why a smaller class costs more per ship" title="Spreading the bill" />
      <Stamp at={1} text="Illustrative · not to scale" />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g opacity={partA}>
          {/* Development block: whole, split across 32, or across 3 */}
          {Array.from({ length: 32 }, (_, i) => {
            const whole = { x: BX + i * SLOT, y: BY, w: SLOT, h: BH };
            const on32 = { x: BX + i * SLOT + 3, y: ROW_Y - 100, w: SLOT - 6, h: BH };
            const k = Math.min(2, Math.floor(i / 11));
            const sub = i - [0, 11, 22][k];
            const n = k === 2 ? 10 : 11;
            const on3 = { x: BIG[k] - 100 + (sub * 200) / n, y: ROW_Y - 290, w: 200 / n + 0.6, h: (BH * BW) / 3 / 200 };
            const stag = ramp(t, 3.2 + i * 0.012, 4.4 + i * 0.012, E.inOut) * (1 - ramp(t, 7.6, 8.6, E.inOut));
            const a = { x: lerp(whole.x, on32.x, stag), y: lerp(whole.y, on32.y, stag), w: lerp(whole.w, on32.w, stag), h: lerp(whole.h, on32.h, stag) };
            const r = {
              x: lerp(a.x, on3.x, split3),
              y: lerp(a.y, on3.y, split3),
              w: lerp(a.w, on3.w, split3),
              h: lerp(a.h, on3.h, split3),
            };
            return <rect key={i} x={r.x} y={r.y} width={r.w * (i / 32 <= blockIn ? 1 : 0)} height={r.h} fill={C.amber} />;
          })}
          <text x={BX + 24} y={BY + 56} fontFamily={FONT.mono} fontWeight={600} fontSize={24} letterSpacing="0.06em" fill={C.ink} opacity={ramp(t, 1.5, 1.9) * (1 - ramp(t, 3.0, 3.3))}>
            DEVELOPMENT: NEW GUN · POWER SYSTEM · SOFTWARE · TESTS
          </text>

          {/* Ships */}
          {Array.from({ length: 32 }, (_, i) => {
            const kept = i === 0 || i === 11 || i === 22;
            const k = i === 0 ? 0 : i === 11 ? 1 : 2;
            const x0 = BX + i * SLOT + 2;
            const w0 = SLOT - 4;
            const x = kept ? lerp(x0, BIG[k] - 120, gather) : x0;
            const w = kept ? lerp(w0, 240, gather) : w0;
            const appear = ramp(t, 1.8 + i * 0.025, 2.2 + i * 0.025, E.back);
            const o = appear * (kept ? 1 : 1 - 0.75 * ghost) * (kept ? 1 : 1 - ramp(t, 10.6, 11.0));
            return (
              <g key={i} opacity={o}>
                <ShipGlyph x={x} y={ROW_Y} width={w} color={kept && ghost > 0.5 ? C.accent : C.ink} outline={!kept && ghost > 0.5} />
              </g>
            );
          })}
          <Callout at={4.4} x={960} y={ROW_Y + 60} text="SHARED BY 32 SHIPS: A THIN SLICE EACH" anchor="middle" size={26} until={7.6} />
          <Callout at={12.0} x={960} y={ROW_Y + 60} text="SHARED BY 3 SHIPS: A HEAVY SHARE EACH" anchor="middle" color={C.accent} size={26} until={15.6} />
          <g opacity={ramp(t, 13.2, 13.7) * (1 - ramp(t, 15.6, 16))}>
            {["SPARES", "TRAINING", "DOCUMENTATION", "SHORE SUPPORT"].map((s, i) => (
              <g key={s} transform={`translate(${470 + i * 250} ${ROW_Y + 110})`}>
                <rect x={0} y={-26} width={225} height={38} rx={4} fill="none" stroke={C.inkSoft} strokeWidth={2} />
                <text x={112} y={0} textAnchor="middle" fontFamily={FONT.mono} fontSize={18} fill={C.inkSoft} letterSpacing="0.06em">
                  {s}
                </text>
              </g>
            ))}
          </g>
        </g>

        {/* Part C: rounds */}
        <g opacity={partC}>
          <g transform="translate(192 460)">
            <path d="M0,220 L0,80 L70,40 L70,80 L140,40 L140,80 L210,40 L210,80 L280,40 L280,220 Z" fill={C.paperDeep} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
            <rect x={230} y={-20} width={30} height={70} fill={C.ink} />
            <rect x={40} y={150} width={60} height={70} fill={C.ink} />
          </g>
          <Callout at={16.8} x={192} y={730} text="DEDICATED PRODUCTION LINE" sub="Its fixed costs stay" size={22} />
          {Array.from({ length: 60 }, (_, i) => {
            const col = i % 15;
            const row = Math.floor(i / 15);
            const keep = i < 6;
            const o = ramp(t, 17.0 + i * 0.012, 17.3 + i * 0.012) * (keep ? 1 : 1 - 0.85 * ramp(t, 19.6 + (59 - i) * 0.008, 20.2 + (59 - i) * 0.008));
            return <Shell key={i} x={640 + col * 44} y={520 + row * 76} o={o} />;
          })}
          <Callout at={17.4} x={640} y={800} text="ROUNDS NEEDED FOR 32 SHIPS" size={22} until={19.6} />
          <Callout at={20.4} x={640} y={800} text="ROUNDS NEEDED FOR 3 SHIPS" color={C.accent} size={22} />
          <g opacity={ramp(t, 17.6, 18.0)}>
            <line x1={1440} y1={760} x2={1640} y2={760} stroke={C.ink} strokeWidth={3} />
            <rect x={1490} y={760 - barH} width={100} height={barH} fill={C.accent} />
          </g>
          <Callout at={17.8} x={1540} y={800} text="FIXED COST" sub="per round" anchor="middle" size={22} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 192, top: 880, opacity: partC }}>
        <Body at={22.2} size={38} color={C.ink}>
          Same fixed costs, spread over far fewer rounds.
        </Body>
      </div>
      <Source at={1.5}>Schematic of cost sharing · no real proportions implied</Source>
    </Stage>
  );
};
