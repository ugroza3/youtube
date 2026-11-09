import type React from "react";
import { M1GuidedRound } from "./M1GuidedRound";
import { M2Shape } from "./M2Shape";
import { M3Power } from "./M3Power";
import { M4Series } from "./M4Series";
import { M5Cps } from "./M5Cps";

export const MECHANISMS: { id: string; C: React.FC; sec: number }[] = [
  { id: "Mech01-GuidedRound", C: M1GuidedRound, sec: 20 },
  { id: "Mech02-StealthShape", C: M2Shape, sec: 23 },
  { id: "Mech03-PowerNetwork", C: M3Power, sec: 24 },
  { id: "Mech04-SmallClassCost", C: M4Series, sec: 26 },
  { id: "Mech05-CPSLaunch", C: M5Cps, sec: 26 },
];
