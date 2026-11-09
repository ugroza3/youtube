import paper from "paper";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export type PaperScopeT = paper.PaperScope;
export type PaperPathT = paper.Path;

/** Paper.js scope that rebuilds the vector scene for every frame (no onFrame handlers). */
export const PaperCanvas: React.FC<{
  draw: (scope: paper.PaperScope, t: number) => void;
}> = ({ draw }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scope, setScope] = useState<paper.PaperScope | null>(null);

  useEffect(() => {
    const s = new paper.PaperScope();
    s.setup(canvasRef.current!);
    s.view.viewSize = new s.Size(width, height);
    setScope(s);
    return () => s.remove();
  }, [width, height]);

  useLayoutEffect(() => {
    if (!scope) return;
    scope.activate();
    scope.project.clear();
    draw(scope, frame / fps);
    scope.view.update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, frame, fps]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      data-paper-hidpi="off"
      style={{ position: "absolute", inset: 0, width, height }}
    />
  );
};
