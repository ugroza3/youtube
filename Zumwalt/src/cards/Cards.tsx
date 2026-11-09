import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { ShipGlyph, ShipProfile } from "../ship";
import { C, clamp, E, FONT, ramp } from "../theme";
import { Body, Folio, Headline, Kicker, Marker, Rule, Source, Stage, useT } from "../ui";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** LRLAP outline after the BAE Systems reference image: slender body, nose canards, tail fins. Pointing right. */
export const LRLAP_PATH =
  "M0,-16 L420,-16 C480,-16 520,-8 548,0 C520,8 480,16 420,16 L0,16 Z " +
  "M360,-16 L392,-40 L404,-40 L392,-16 Z M360,16 L392,40 L404,40 L392,16 Z " +
  "M4,-16 L-6,-58 L18,-58 L60,-16 Z M4,16 L-6,58 L18,58 L60,16 Z";

// ───────────────────────────── 01 Title
export const Card01Title: React.FC = () => {
  const { t } = useT();
  const pin = ramp(t, 0.15, 1.3);
  return (
    <Stage push={0.025}>
      <Folio label="PART 01" />
      <div
        style={{
          position: "absolute",
          left: 830,
          top: 130,
          width: 900,
          padding: 14,
          background: "#F7F3EA",
          boxShadow: "0 18px 40px rgba(40,25,10,0.25)",
          rotate: `${interpolate(pin, [0, 1], [-4.5, -1.6])}deg`,
          translate: `0 ${(1 - pin) * 70}px`,
          opacity: pin,
        }}
      >
        <div style={{ overflow: "hidden", height: 420 }}>
          <Img
            src={staticFile("media/zumwalt_profile_ags.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 8%",
              scale: String(interpolate(t, [0, 8], [1.12, 1.0], clamp)),
              filter: "saturate(0.45) sepia(0.28) contrast(1.06)",
            }}
          />
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: 18, color: C.muted, marginTop: 10, letterSpacing: "0.04em" }}>
          DDG-1000 in its original configuration, two AGS turrets forward · U.S. Navy video
        </div>
      </div>
      <div style={{ position: "absolute", left: 192, top: 720 }}>
        <Kicker at={0.7}>The destroyer that lost its shells</Kicker>
        <Headline at={0.9} text="USS Zumwalt" size={210} style={{ marginTop: 6 }} />
        <Body at={1.6} size={40} style={{ marginTop: 8 }}>
          DDG-1000 · U.S. Navy guided-missile destroyer
        </Body>
      </div>
    </Stage>
  );
};

// ───────────────────────────── 02 Cost per round
export const Card02Cost: React.FC = () => {
  const { t } = useT();
  const n = interpolate(t, [0.6, 2.0], [0, 800000], { ...clamp, easing: E.outCubic });
  const draw = ramp(t, 1.4, 3.2, E.inOut);
  return (
    <Stage dark>
      <Folio label="THE PRICE" dark />
      <div style={{ position: "absolute", left: 192, top: 250 }}>
        <Kicker at={0.3} color={C.amber}>Projected cost of one LRLAP round · 2016</Kicker>
        <div
          style={{
            fontFamily: FONT.display,
            fontWeight: 800,
            fontSize: 300,
            lineHeight: 1,
            color: C.bone,
            marginTop: 20,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: C.accent, opacity: ramp(t, 2.0, 2.4), fontSize: 190, verticalAlign: "0.18em", marginRight: 24 }}>≥</span>${fmt(n)}
        </div>
        <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 84, color: C.bone, textTransform: "uppercase", marginTop: 18, opacity: ramp(t, 1.5, 2.0) }}>
          <Marker at={2.3} color={C.accent}>
            &nbsp;per round&nbsp;
          </Marker>
        </div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(1180 780) scale(0.95)">
          <path
            d={LRLAP_PATH}
            fill={C.bone}
            fillOpacity={ramp(t, 2.6, 3.4) * 0.12}
            stroke={C.bone}
            strokeWidth={3}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
            strokeLinejoin="round"
          />
        </g>
        <text x={1180} y={880} fill="#9C9488" fontFamily={FONT.mono} fontSize={20} letterSpacing="0.08em" opacity={ramp(t, 2.8, 3.3)}>
          LRLAP · LONG RANGE LAND-ATTACK PROJECTILE
        </text>
      </svg>
      <Source at={3.0} dark>
        A forecast, not the bill for a documented firing · Source: CRS RL32109
      </Source>
    </Stage>
  );
};

// ───────────────────────────── 03 Range
export const Card03Range: React.FC = () => {
  const { t } = useT();
  const nm = interpolate(t, [0.6, 2.0], [0, 63], { ...clamp, easing: E.outCubic });
  const x0 = 300;
  const x1 = 1640;
  const per = (x1 - x0) / 66;
  const bar = ramp(t, 1.2, 3.4, E.inOut);
  const head = x0 + bar * 63 * per;
  return (
    <Stage>
      <Folio label="RANGE" />
      <div style={{ position: "absolute", left: 192, top: 220 }}>
        <Kicker at={0.3}>LRLAP qualification tests · 2013</Kicker>
        <div style={{ display: "flex", alignItems: "baseline", gap: 36, marginTop: 10 }}>
          <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 320, lineHeight: 0.95, color: C.ink, fontVariantNumeric: "tabular-nums" }}>
            <span style={{ opacity: ramp(t, 2.0, 2.4), color: C.accent }}>&gt;</span>
            {Math.round(nm)}
          </div>
          <div>
            <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 96, lineHeight: 1, textTransform: "uppercase", color: C.ink, opacity: ramp(t, 1.0, 1.5) }}>
              nautical miles
            </div>
            <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 96, lineHeight: 1.05, textTransform: "uppercase", opacity: ramp(t, 2.2, 2.7) }}>
              <Marker at={2.4}>≈ 116 km</Marker>
            </div>
          </div>
        </div>
        <Body at={2.8} size={36} style={{ marginTop: 18 }}>
          Guided flight to the aim point, well beyond the horizon
        </Body>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <ShipProfile x={x0 - 150} y={862} width={140} fill={1} stroke={C.ink} fillColor={C.ink} draw={ramp(t, 0.8, 1.6)} strokeWidth={1} />
        <line x1={x0} y1={860} x2={head} y2={860} stroke={C.ink} strokeWidth={4} />
        {Array.from({ length: 7 }, (_, i) => {
          const x = x0 + i * 10 * per;
          const on = head >= x - 1;
          return (
            <g key={i} opacity={on ? 1 : 0}>
              <line x1={x} y1={846} x2={x} y2={874} stroke={C.ink} strokeWidth={2} />
              <text x={x} y={912} textAnchor="middle" fontFamily={FONT.mono} fontSize={22} fill={C.muted}>
                {i * 10}
              </text>
            </g>
          );
        })}
        <g opacity={ramp(t, 3.3, 3.7)}>
          <circle cx={x0 + 63 * per} cy={860} r={14} fill={C.accent} />
          <text x={x0 + 63 * per} y={820} textAnchor="middle" fontFamily={FONT.mono} fontWeight={600} fontSize={24} fill={C.accent}>
            &gt;63 NMI
          </text>
        </g>
      </svg>
      <Source at={3.4}>Developer's claim · BAE Systems, 30 Sept 2013</Source>
    </Stage>
  );
};

// ───────────────────────────── 04 Power
export const Card04Power: React.FC = () => {
  const { t } = useT();
  const mw = interpolate(t, [0.6, 2.0], [0, 78], { ...clamp, easing: E.outCubic });
  const draw = ramp(t, 1.6, 3.0, E.inOut);
  const flow = -t * 60;
  const branch = ramp(t, 2.6, 3.4, E.inOut);
  return (
    <Stage>
      <Folio label="POWER" />
      <div style={{ position: "absolute", left: 192, top: 220 }}>
        <Kicker at={0.3}>Integrated power system</Kicker>
        <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 320, lineHeight: 0.95, color: C.ink, fontVariantNumeric: "tabular-nums", marginTop: 10 }}>
          <span style={{ opacity: ramp(t, 2.0, 2.4) }}>≈</span>
          {Math.round(mw)}
          <span style={{ fontSize: 150, marginLeft: 24 }}>MW</span>
        </div>
        <Body at={1.8} size={40} style={{ maxWidth: 1100 }}>
          of <Marker at={2.3}>generating capacity</Marker> on one shared electrical network
        </Body>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={192} y1={800} x2={192 + 900 * draw} y2={800} stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
        <line x1={192} y1={800} x2={192 + 900 * draw} y2={800} stroke={C.amber} strokeWidth={4} strokeDasharray="14 18" strokeDashoffset={flow} />
        {[
          { x: 560, label: "PROPULSION" },
          { x: 960, label: "SENSORS & SHIP SYSTEMS" },
        ].map((b, i) => (
          <g key={i} opacity={branch}>
            <line x1={b.x} y1={800} x2={b.x} y2={800 + 70 * branch} stroke={C.ink} strokeWidth={6} />
            <line x1={b.x} y1={800} x2={b.x} y2={800 + 70 * branch} stroke={C.amber} strokeWidth={3} strokeDasharray="10 14" strokeDashoffset={flow} />
            <text x={b.x} y={910} textAnchor="middle" fontFamily={FONT.mono} fontWeight={600} fontSize={24} letterSpacing="0.08em" fill={C.ink}>
              {b.label}
            </text>
          </g>
        ))}
        <text x={192} y={770} fontFamily={FONT.mono} fontSize={22} fill={C.muted} opacity={ramp(t, 2.0, 2.5)} letterSpacing="0.08em">
          TURBINES → GENERATORS → COMMON BUS
        </text>
      </svg>
      <Source at={3.2}>Source: GE Power Conversion</Source>
    </Stage>
  );
};

// ───────────────────────────── 05 32 → 3
export const Card05Fleet: React.FC = () => {
  const { t } = useT();
  const cut = 3.0;
  return (
    <Stage>
      <Folio label="THE CLASS" />
      <div style={{ position: "absolute", left: 192, top: 190 }}>
        <Kicker at={0.3}>Original plan → ships built</Kicker>
        <div style={{ display: "flex", alignItems: "baseline", gap: 30, fontFamily: FONT.display, fontWeight: 800, fontSize: 230, lineHeight: 1, marginTop: 6 }}>
          <span style={{ color: interpolate(ramp(t, cut, cut + 0.6), [0, 1], [0, 1]) > 0.5 ? C.muted : C.ink, opacity: ramp(t, 0.5, 1.0) }}>32</span>
          <span style={{ fontSize: 140, color: C.muted, opacity: ramp(t, cut, cut + 0.4) }}>→</span>
          <span style={{ color: C.accent, opacity: ramp(t, cut + 0.3, cut + 0.8), translate: `0 ${(1 - ramp(t, cut + 0.3, cut + 0.9)) * 40}px`, display: "inline-block" }}>3</span>
        </div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 32 }, (_, i) => {
          const col = i % 8;
          const row = Math.floor(i / 8);
          const x = 225 + col * 185;
          const y = 560 + row * 84;
          const appear = ramp(t, 0.7 + i * 0.03, 1.1 + i * 0.03, E.back);
          const kept = i < 3;
          const ghost = kept ? 0 : ramp(t, cut + 0.1 + (31 - i) * 0.012, cut + 0.5 + (31 - i) * 0.012, E.outCubic);
          return (
            <g key={i} opacity={appear * (1 - 0.55 * ghost)} transform={`translate(0 ${(1 - appear) * 20})`}>
              <ShipGlyph x={x} y={y} width={165} color={kept && t > cut ? C.accent : C.ink} outline={ghost > 0.5} />
            </g>
          );
        })}
      </svg>
      <Body at={cut + 1.0} size={34} style={{ position: "absolute", left: 192, top: 900, maxWidth: 1400 }}>
        Plans shrank step by step. No finished ships were scrapped.
      </Body>
      <Source at={cut + 1.2}>Source: GAO-25-108225 (2025)</Source>
    </Stage>
  );
};

// ───────────────────────────── 06 $10.6B per ship
export const Card06Bill: React.FC = () => {
  const { t } = useT();
  const v = interpolate(t, [0.6, 1.9], [0, 10.6], { ...clamp, easing: E.outCubic });
  const split = ramp(t, 2.6, 3.6, E.inOut);
  const shipX = [1080, 1320, 1560];
  return (
    <Stage dark>
      <Folio label="THE BILL" dark />
      <div style={{ position: "absolute", left: 192, top: 210 }}>
        <Kicker at={0.3} color={C.amber}>GAO estimate · 2025</Kicker>
        <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 230, lineHeight: 1, color: C.bone, marginTop: 10, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
          ${v.toFixed(1)} BILLION
        </div>
        <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 84, color: C.accent, opacity: ramp(t, 1.6, 2.1), textTransform: "uppercase", lineHeight: 1 }}>
          per ship
        </div>
      </div>
      <div style={{ position: "absolute", left: 192, top: 600, width: 760 }}>
        <Body at={1.8} size={38} color={C.bone}>
          Program cost estimate per ship: development, testing and construction of the whole class, divided by three ships.
        </Body>
        <Body at={2.6} size={34} color={C.amber} style={{ marginTop: 26 }}>
          Not the shipyard's price for one hull.
        </Body>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {shipX.map((x, i) => {
          const fromX = 1000 + i * 240;
          const left = interpolate(split, [0, 1], [fromX, x - 90]);
          const top = interpolate(split, [0, 1], [640, 760]);
          return (
            <g key={i} opacity={ramp(t, 1.9, 2.4)}>
              <rect x={left} y={top} width={interpolate(split, [0, 1], [240, 180])} height={64} fill={C.amber} />
              <rect x={x - 90} y={830} width={180} height={34} fill={C.bone} opacity={ramp(t, 3.4, 3.9)} />
              <ShipGlyph x={x - 100} y={925} width={200} color={C.bone} />
            </g>
          );
        })}
        <text x={1000} y={625} fontFamily={FONT.mono} fontSize={20} fill={C.amber} letterSpacing="0.08em" opacity={ramp(t, 2.0, 2.5) * (1 - split)}>
          DEVELOPMENT OF THE CLASS
        </text>
        <g opacity={ramp(t, 3.6, 4.1)} fontFamily={FONT.mono} fontSize={18} letterSpacing="0.06em">
          <rect x={990} y={722} width={16} height={16} fill={C.amber} />
          <text x={1016} y={737} fill={C.amber}>SHARE OF DEVELOPMENT</text>
          <rect x={1290} y={722} width={16} height={16} fill={C.bone} />
          <text x={1316} y={737} fill={C.bone}>CONSTRUCTION</text>
        </g>
      </svg>
      <Source at={3.2} dark>
        Source: GAO-25-108225, March 2025 · illustration not to scale
      </Source>
    </Stage>
  );
};

// ───────────────────────────── 07 Timeline
const EVENTS = [
  { year: "2013", text: "LRLAP passes qualification tests" },
  { year: "2016", text: "Commissioned · LRLAP purchases stopped" },
  { year: "2020", text: "Final delivery · SM-2 test launch" },
  { year: "2023", text: "Guns removed for refit at Pascagoula" },
  { year: "2026", text: "Builder's sea trials after refit" },
  { year: "FY2027", text: "First CPS flight from the ship (planned)" },
];

export const Card07Timeline: React.FC = () => {
  const { t } = useT();
  const x0 = 300;
  const step = 264;
  const y = 640;
  const lineP = ramp(t, 1.0, 5.0, E.inOut);
  const lineEnd = x0 + lineP * step * 5;
  const solidEnd = Math.min(lineEnd, x0 + step * 4);
  return (
    <Stage>
      <Folio label="TIMELINE" />
      <div style={{ position: "absolute", left: 192, top: 190 }}>
        <Kicker at={0.2}>Two guns, one refit</Kicker>
        <Headline at={0.35} text="From guns to launch tubes" size={120} style={{ marginTop: 8 }} />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={x0} y1={y} x2={solidEnd} y2={y} stroke={C.ink} strokeWidth={5} />
        {lineEnd > x0 + step * 4 ? (
          <line x1={x0 + step * 4} y1={y} x2={lineEnd} y2={y} stroke={C.ink} strokeWidth={5} strokeDasharray="12 12" />
        ) : null}
        {EVENTS.map((e, i) => {
          const x = x0 + i * step;
          const reach = (x - x0) / (step * 5);
          const at = 1.0 + reach * 4.0;
          const pop = ramp(t, at, at + 0.45, E.back);
          const txt = ramp(t, at + 0.15, at + 0.7);
          const planned = i === EVENTS.length - 1;
          const above = i % 2 === 0;
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={16 * pop}
                fill={planned ? C.paper : i === 3 ? C.accent : C.ink}
                stroke={planned ? C.accent : "none"}
                strokeWidth={4}
              />
              <g opacity={txt} transform={`translate(0 ${(1 - txt) * (above ? 14 : -14)})`}>
                <line x1={x} y1={above ? y - 26 : y + 26} x2={x} y2={above ? y - 60 : y + 60} stroke={C.rule} strokeWidth={2} />
                <text x={x} y={above ? y - 140 : y + 120} textAnchor="middle" fontFamily={FONT.display} fontWeight={800} fontSize={60} fill={planned ? C.accent : C.ink}>
                  {e.year}
                </text>
                <foreignObject x={x - 125} y={above ? y - 128 : y + 132} width={250} height={90}>
                  <div style={{ fontFamily: FONT.sans, fontSize: 22, lineHeight: 1.25, color: C.inkSoft, textAlign: "center" }}>{e.text}</div>
                </foreignObject>
              </g>
            </g>
          );
        })}
      </svg>
      <Rule at={0.6} width={1536} color={C.rule} thick={2} style={{ position: "absolute", left: 192, top: 405 }} />
      <Source at={5.4}>Sources: BAE Systems · CRS RL32109 · U.S. Navy · HII · GAO-26-107974</Source>
    </Stage>
  );
};

export const CARDS = [
  { id: "Card01-Title", C: Card01Title, sec: 8 },
  { id: "Card02-CostPerRound", C: Card02Cost, sec: 7 },
  { id: "Card03-Range", C: Card03Range, sec: 7 },
  { id: "Card04-Power", C: Card04Power, sec: 7 },
  { id: "Card05-32to3", C: Card05Fleet, sec: 7.5 },
  { id: "Card06-ProgramCost", C: Card06Bill, sec: 8 },
  { id: "Card07-Timeline", C: Card07Timeline, sec: 9 },
];

