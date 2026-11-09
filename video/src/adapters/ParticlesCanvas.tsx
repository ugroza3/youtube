import {
  setRandom,
  tsParticles,
  type Container,
  type ISourceOptions,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { mulberry32 } from "./random";

let slimLoaded: Promise<void> | null = null;
let nextId = 0;

type Steppable = {
  canvas: {
    render: { drawParticles: (d: { value: number; factor: number }) => void };
  };
};

/**
 * tsParticles with autoPlay off. The simulation is stepped with a fixed delta per video frame;
 * seeking backwards re-creates the container with the same seed, so every frame is reproducible.
 */
export const ParticlesCanvas: React.FC<{
  options: ISourceOptions;
  seed?: number;
}> = ({ options, seed = 1 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const hostRef = useRef<HTMLDivElement>(null);
  const sim = useRef<{ container: Container; frame: number } | null>(null);
  const [id] = useState(() => `tsp-${nextId++}`);
  const [ready, setReady] = useState(false);

  const create = async () => {
    sim.current?.container.destroy();
    setRandom(mulberry32(seed));
    const container = await tsParticles.load({
      id,
      element: hostRef.current!,
      options: {
        ...options,
        autoPlay: false,
        detectRetina: false,
        fullScreen: { enable: false },
      },
    });
    sim.current = { container: container!, frame: 0 };
  };

  const step = () => {
    const value = 1000 / fps;
    (
      sim.current!.container as unknown as Steppable
    ).canvas.render.drawParticles({
      value,
      factor: (60 * value) / 1000,
    });
    sim.current!.frame++;
  };

  useEffect(() => {
    const h = delayRender("tsParticles init");
    (slimLoaded ??= loadSlim(tsParticles)).then(create).then(() => {
      setReady(true);
      continueRender(h);
    });
    return () => sim.current?.container.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;
    const h = delayRender(`tsParticles frame ${frame}`);
    (async () => {
      if (sim.current!.frame > frame + 1) await create();
      while (sim.current!.frame <= frame) step();
      continueRender(h);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, frame]);

  return (
    <div
      ref={hostRef}
      id={id}
      style={{ position: "absolute", inset: 0, width, height }}
    />
  );
};
