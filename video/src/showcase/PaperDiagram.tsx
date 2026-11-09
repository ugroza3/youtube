import { AbsoluteFill, Easing, interpolate } from "remotion";
import {
  PaperCanvas,
  type PaperPathT,
  type PaperScopeT,
} from "../adapters/PaperCanvas";
import { Badge, C, Caption, fontFamily } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Draws a path's stroke progressively using a dash pattern. */
const reveal = (path: PaperPathT, p: number) => {
  const L = path.length;
  path.dashArray = [L, L];
  path.dashOffset = L * (1 - p);
};

// Functional top-view schematic. Shapes are generic, not the real A350 geometry.
const draw = (s: PaperScopeT, t: number) => {
  const { Path, Point, Size, Rectangle, Color, PointText } = s;
  const cx = 960;
  const cy = 600;
  const p = interpolate(t, [0.2, 1.8], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const tankP = interpolate(t, [1.8, 2.6], [0, 1], clamp);

  const stroke = new Color(C.white);
  const fuselage = new Path.Rectangle(
    new Rectangle(new Point(cx - 620, cy - 46), new Size(1240, 92)),
    new Size(46, 46),
  );
  const wing = new Path([
    new Point(cx - 120, cy - 46),
    new Point(cx + 140, cy - 46),
    new Point(cx - 120, cy - 430),
    new Point(cx - 200, cy - 430),
  ]);
  wing.closed = true;
  const wing2 = wing.clone() as PaperPathT;
  wing2.scale(1, -1, new Point(cx, cy));
  const tail = new Path([
    new Point(cx - 520, cy - 46),
    new Point(cx - 420, cy - 46),
    new Point(cx - 560, cy - 200),
    new Point(cx - 600, cy - 200),
  ]);
  tail.closed = true;
  const tail2 = tail.clone() as PaperPathT;
  tail2.scale(1, -1, new Point(cx, cy));

  for (const part of [fuselage, wing, wing2, tail, tail2]) {
    part.strokeColor = stroke;
    part.strokeWidth = 4;
    reveal(part, p);
  }

  const tank = new Path.Rectangle(
    new Rectangle(new Point(cx - 260, cy - 32), new Size(130, 64)),
    new Size(10, 10),
  );
  tank.fillColor = new Color(C.red);
  tank.fillColor.alpha = tankP;
  tank.strokeColor = new Color(C.red);
  tank.strokeWidth = 3;

  const leader = new Path([
    new Point(cx - 195, cy + 32),
    new Point(cx - 195, cy + 230),
    new Point(cx + 60, cy + 230),
  ]);
  leader.strokeColor = new Color(C.red);
  leader.strokeWidth = 3;
  reveal(leader, tankP);

  const label = new PointText(new Point(cx + 80, cy + 242));
  label.content = "доп. задний центральный бак ≈ 20 000 л";
  label.fillColor = new Color(C.white);
  label.fillColor.alpha = tankP;
  label.fontFamily = fontFamily;
  label.fontSize = 36;
};

export const PaperDiagram: React.FC = () => (
  <AbsoluteFill style={{ background: C.navy }}>
    <PaperCanvas draw={draw} />
    <Caption>Где спрятано лишнее топливо</Caption>
    <div
      style={{
        position: "absolute",
        right: 72,
        bottom: 80,
        color: C.muted,
        fontSize: 28,
        fontFamily,
      }}
    >
      Схема
    </div>
    <Badge lib="Paper.js" note="векторные контуры, отрисовка штрихом" />
  </AbsoluteFill>
);
