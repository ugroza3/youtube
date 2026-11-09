import { Application } from "pixi.js";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type PixiScene = {
  setup: (app: Application) => void;
  update: (t: number, frame: number) => void;
};

/** PixiJS v8 with the ticker disabled; the stage is redrawn from the frame time only. */
export const PixiCanvas: React.FC<{
  create: () => PixiScene;
  background?: string;
}> = ({ create, background = "#000" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<{
    app: Application;
    scene: PixiScene;
  } | null>(null);
  const [handle] = useState(() => delayRender("PixiJS init"));

  useEffect(() => {
    let cancelled = false;
    const app = new Application();
    app
      .init({
        canvas: canvasRef.current!,
        width,
        height,
        background,
        antialias: true,
        autoStart: false,
        preference: "webgl",
        resolution: 1,
        preserveDrawingBuffer: true,
      })
      .then(() => {
        if (cancelled) return;
        app.ticker.stop();
        const scene = create();
        scene.setup(app);
        setState({ app, scene });
        continueRender(handle);
      });
    return () => {
      cancelled = true;
      // Free the WebGL context; long renders mount and unmount scenes many times per tab.
      if (app.renderer) app.destroy({ removeView: false }, { children: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!state) return;
    state.scene.update(frame / fps, frame);
    state.app.render();
  }, [state, frame, fps]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0 }}
    />
  );
};
