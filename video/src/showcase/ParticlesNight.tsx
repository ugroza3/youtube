import type { ISourceOptions } from "@tsparticles/engine";
import { AbsoluteFill } from "remotion";
import { ParticlesCanvas } from "../adapters/ParticlesCanvas";
import { Badge, C, Caption } from "./theme";

const options: ISourceOptions = {
  background: { color: C.night },
  particles: {
    number: { value: 160 },
    color: { value: [C.white, C.muted, C.red] },
    size: { value: { min: 1, max: 4 } },
    opacity: { value: { min: 0.3, max: 0.9 } },
    links: {
      enable: true,
      distance: 140,
      color: C.muted,
      opacity: 0.25,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1.6,
      direction: "none",
      outModes: { default: "bounce" },
    },
  },
};

export const ParticlesNight: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <ParticlesCanvas options={options} seed={3} />
    <Caption top={440}>Ночь над океаном</Caption>
    <Badge lib="tsParticles" note="частицы и связи, шаг симуляции = кадр" />
  </AbsoluteFill>
);
