import React from "react";
import { LRLAP_PATH } from "../cards/Cards";
import { pointAt, polyline, Sea, ShipProfile } from "../ship";
import { C, E, FONT, ramp } from "../theme";
import { Stage, useT } from "../ui";
import { Callout, cubic, MechHeader, Pulse, Stamp, Steps } from "./common";

const GROUND = 860;
const COAST = 760;
const MUZZLE: [number, number] = [402, 849];
const TARGET: [number, number] = [1700, GROUND];

// Three flight phases, sampled as one polyline so the projectile can follow it.
const P1 = cubic(MUZZLE, [450, 790], [520, 720], [580, 690], 40);
const P2 = cubic([580, 690], [660, 630], [820, 520], [1000, 505], 50);
const P3 = cubic([1000, 505], [1300, 495], [1580, 640], TARGET, 80);
const PATH = [...P1, ...P2.slice(1), ...P3.slice(1)];
const N1 = P1.length - 1;
const N2 = N1 + P2.length - 1;
const NT = PATH.length - 1;
// The glide path it would take with no correction.
const GHOST = cubic([1000, 505], [1250, 500], [1420, 660], [1520, GROUND], 60);
// An ordinary shell: path fixed at firing.
const BALLISTIC = cubic(MUZZLE, [470, 680], [640, 640], [820, GROUND], 60);

const TERRAIN = `M${COAST},${GROUND} L${COAST + 40},${GROUND - 14} L900,${GROUND - 8} L1040,${GROUND - 30} L1180,${GROUND - 18} L1320,${GROUND - 40} L1480,${GROUND - 22} L1640,${GROUND - 12} L1920,${GROUND - 26} L1920,1080 L${COAST},1080 Z`;

export const M1GuidedRound: React.FC = () => {
  const { t } = useT();
  // Fraction of the full path flown.
  const u =
    t < 5
      ? 0
      : t < 6.6
        ? (ramp(t, 5, 6.6, E.outCubic) * N1) / NT
        : t < 9
          ? (N1 + ramp(t, 6.6, 9, E.inOut) * (N2 - N1)) / NT
          : (N2 + ramp(t, 9, 14, E.inOut) * (NT - N2)) / NT;
  const pos = pointAt(PATH, u);
  const flying = t >= 5 && t < 14;
  const boosting = t >= 6.6 && t < 9;
  const guiding = t >= 9.2 && t < 14;
  const land = ramp(t, 0.6, 1.8, E.inOut);
  return (
    <Stage>
      <MechHeader n={1} kicker="How the LRLAP round flew" title="Fired, boosted, steered" />
      <Stamp at={1} text="Principle · not to scale" />
      <Steps labels={["Gun launch", "Rocket boost", "Guided glide"]} activeAt={[5, 6.6, 9]} x={192} y={380} showAt={1.2} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g style={{ clipPath: `inset(0 ${(1 - land) * 100}% 0 0)` }}>
          <Sea id="m1sea" x={0} y={GROUND} w={COAST} h={220} />
          <path d={TERRAIN} fill={C.sage} />
          <line x1={0} y1={GROUND} x2={1920} y2={GROUND} stroke={C.ink} strokeWidth={2} opacity={0.4} />
        </g>
        <ShipProfile x={180} y={GROUND} width={240} draw={ramp(t, 0.8, 1.9, E.inOut)} fill={ramp(t, 1.6, 2.2)} strokeWidth={1.5} />
        <Callout at={1.6} x={COAST + 12} y={GROUND + 44} text="COAST" color={C.ink} size={22} />

        {/* Aim point */}
        <g opacity={ramp(t, 1.8, 2.3)}>
          <circle cx={TARGET[0]} cy={TARGET[1]} r={22} fill="none" stroke={C.accent} strokeWidth={3} />
          <line x1={TARGET[0] - 34} y1={TARGET[1]} x2={TARGET[0] + 34} y2={TARGET[1]} stroke={C.accent} strokeWidth={3} />
          <line x1={TARGET[0]} y1={TARGET[1] - 34} x2={TARGET[0]} y2={TARGET[1] + 34} stroke={C.accent} strokeWidth={3} />
        </g>
        <Callout at={2.0} x={TARGET[0]} y={TARGET[1] - 52} text="AIM POINT" anchor="middle" color={C.accent} size={22} />

        {/* Ordinary shell for comparison */}
        <path
          d={polyline(BALLISTIC, ramp(t, 2.6, 3.9, E.inOut))}
          fill="none"
          stroke={C.inkSoft}
          strokeWidth={3}
          strokeDasharray="10 10"
          opacity={1 - 0.6 * ramp(t, 5.0, 5.6)}
        />
        <Pulse at={3.9} x={820} y={GROUND} color={C.inkSoft} r={40} />
        <Callout at={3.6} x={640} y={610} text="ORDINARY SHELL" sub="Path fixed at the moment of firing" anchor="middle" color={C.inkSoft} until={5.4} size={24} />

        {/* Uncorrected glide (ghost) and the correction */}
        <path d={polyline(GHOST, ramp(t, 9.3, 10.6, E.inOut))} fill="none" stroke={C.muted} strokeWidth={2} strokeDasharray="4 10" opacity={0.9 - 0.5 * ramp(t, 14, 15)} />
        <Callout at={10.4} x={1500} y={818} text="UNCORRECTED" anchor="end" color={C.muted} size={20} />

        {/* LRLAP trail */}
        <path d={polyline(PATH, u)} fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
        {t >= 5 ? <Pulse at={5} x={MUZZLE[0]} y={MUZZLE[1]} color={C.amber} r={30} /> : null}

        {/* GPS / inertial guidance */}
        <g opacity={ramp(t, 9.2, 9.8) * (1 - ramp(t, 14, 14.6))}>
          <g transform="translate(1480 560)">
            <rect x={-14} y={-14} width={28} height={28} fill={C.ink} />
            <rect x={-60} y={-8} width={40} height={16} fill={C.inkSoft} />
            <rect x={20} y={-8} width={40} height={16} fill={C.inkSoft} />
          </g>
          {guiding ? (
            <line x1={1480} y1={580} x2={pos.x} y2={pos.y} stroke={C.accent} strokeWidth={2} strokeDasharray="3 9" strokeDashoffset={-t * 40} />
          ) : null}
        </g>
        <Callout at={9.8} x={1480} y={526} text="GPS + INERTIAL GUIDANCE" anchor="middle" color={C.ink} size={22} until={14} />
        <Callout at={11.2} x={1050} y={474} text="COURSE CORRECTED IN FLIGHT" anchor="middle" color={C.accent} size={22} until={14.2} />

        {/* Projectile */}
        {flying ? (
          <g transform={`translate(${pos.x} ${pos.y}) rotate(${(pos.angle * 180) / Math.PI}) scale(0.1)`}>
            {boosting ? <path d="M0,-14 L-260,0 L0,14 Z" fill={C.accent} opacity={0.6 + 0.4 * Math.abs(Math.sin(t * 40))} /> : null}
            <path d={LRLAP_PATH} fill={C.ink} transform="translate(-274 0)" />
          </g>
        ) : null}
        <Pulse at={14} x={TARGET[0]} y={TARGET[1]} color={C.accent} r={80} />

        {/* Range bracket */}
        <g opacity={ramp(t, 14.6, 15.0)}>
          <path
            d={`M300,900 L300,920 L${300 + (TARGET[0] - 300) * ramp(t, 14.6, 15.8, E.inOut)},920`}
            fill="none"
            stroke={C.ink}
            strokeWidth={3}
          />
          <line x1={TARGET[0]} y1={900} x2={TARGET[0]} y2={920} stroke={C.ink} strokeWidth={3} opacity={ramp(t, 15.6, 15.8)} />
        </g>
        <Callout at={15.8} x={860} y={962} text="> 63 NAUTICAL MILES ≈ 116 KM" anchor="middle" color={C.ink} size={26} />
      </svg>
      <div style={{ position: "absolute", right: 192, bottom: 96, fontFamily: FONT.mono, fontSize: 20, color: C.ink, opacity: 0.75 * ramp(t, 16, 16.5) }}>
        Range: developer's claim, BAE Systems 2013
      </div>
    </Stage>
  );
};
