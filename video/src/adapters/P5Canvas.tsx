import p5 from "p5";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/** p5.js in instance mode with noLoop(); draw(p, t) must depend on t only (seed noise/random inside). */
export const P5Canvas: React.FC<{ draw: (p: p5, t: number) => void }> = ({
  draw,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const hostRef = useRef<HTMLDivElement>(null);
  const tRef = useRef(0);
  const [inst, setInst] = useState<p5 | null>(null);
  const [handle] = useState(() => delayRender("p5 setup"));

  useEffect(() => {
    let ready = false;
    const instance = new p5((p: p5) => {
      p.setup = () => {
        p.pixelDensity(1);
        p.createCanvas(width, height);
        p.noLoop();
        if (!ready) {
          ready = true;
          setInst(p);
          continueRender(handle);
        }
      };
      p.draw = () => draw(p, tRef.current);
    }, hostRef.current!);
    return () => instance.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!inst) return;
    tRef.current = frame / fps;
    const h = delayRender(`p5 frame ${frame}`);
    // redraw() may return a promise in p5 2.x
    Promise.resolve(inst.redraw() as unknown).then(() => continueRender(h));
  }, [inst, frame, fps]);

  return <div ref={hostRef} style={{ position: "absolute", inset: 0 }} />;
};
