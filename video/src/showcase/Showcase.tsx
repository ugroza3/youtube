import { glTransition } from "@gl-transitions/remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AnimeTitle } from "./AnimeTitle";
import { P5Flow } from "./P5Flow";
import { PaperDiagram } from "./PaperDiagram";
import { ParticlesNight } from "./ParticlesNight";
import { PixiRoute } from "./PixiRoute";
import { SpringNumbers } from "./SpringNumbers";
import { ThreeGlobe } from "./ThreeGlobe";

export const SCENE = 90;
export const TRANSITION = 20;

const SCENES = [
  { id: "AnimeTitle", Scene: AnimeTitle },
  { id: "SpringNumbers", Scene: SpringNumbers },
  { id: "PixiRoute", Scene: PixiRoute },
  { id: "P5Flow", Scene: P5Flow },
  { id: "PaperDiagram", Scene: PaperDiagram },
  { id: "ParticlesNight", Scene: ParticlesNight },
  { id: "ThreeGlobe", Scene: ThreeGlobe },
];
const TRANSITIONS = [
  "CrossZoom",
  "Cube",
  "DirectionalWarp",
  "Dreamy",
  "CircleOpen",
  "FilmBurn",
] as const;

export const SHOWCASE_DURATION =
  SCENES.length * SCENE - TRANSITIONS.length * TRANSITION;

export const Showcase: React.FC = () => (
  <TransitionSeries>
    {SCENES.flatMap(({ id, Scene }, i) => [
      <TransitionSeries.Sequence key={id} name={id} durationInFrames={SCENE}>
        <Scene />
      </TransitionSeries.Sequence>,
      i < TRANSITIONS.length ? (
        <TransitionSeries.Transition
          key={`t${i}`}
          presentation={glTransition({ name: TRANSITIONS[i] })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />
      ) : null,
    ])}
  </TransitionSeries>
);

export const SHOWCASE_SCENES = SCENES;
