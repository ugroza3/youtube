import { Container, Graphics } from "pixi.js";
import { AbsoluteFill } from "remotion";
import { PixiCanvas, type PixiScene } from "../adapters/PixiCanvas";
import { mulberry32 } from "../adapters/random";
import { Badge, C, Caption } from "./theme";

const W = 1920;
const H = 1080;
const A = { x: 1560, y: 820 }; // "Sydney" (schematic)
const B = { x: 380, y: 330 }; // "London" (schematic)
const CTRL = { x: 900, y: 40 };

const bez = (t: number) => ({
  x: (1 - t) ** 2 * A.x + 2 * (1 - t) * t * CTRL.x + t ** 2 * B.x,
  y: (1 - t) ** 2 * A.y + 2 * (1 - t) * t * CTRL.y + t ** 2 * B.y,
});

const createScene = (): PixiScene => {
  const dots = new Graphics();
  const route = new Graphics();
  const trail = new Container();
  const plane = new Graphics();
  const rnd = mulberry32(7);
  const stars = Array.from({ length: 2500 }, () => ({
    x: rnd() * W,
    y: rnd() * H,
    p: rnd() * Math.PI * 2,
  }));
  const trailDots = Array.from({ length: 160 }, () =>
    new Graphics().circle(0, 0, 4).fill(0xffffff),
  );

  return {
    setup(app) {
      app.stage.addChild(dots, route, trail, plane);
      trailDots.forEach((d) => trail.addChild(d));
      plane.poly([24, 0, -18, -14, -10, 0, -18, 14]).fill(C.red);
      [A, B].forEach((p) => route.circle(p.x, p.y, 14).fill(C.white));
    },
    update(t) {
      dots.clear();
      for (const s of stars) {
        const a = 0.25 + 0.25 * Math.sin(s.p + t * 2);
        dots.rect(s.x, s.y, 2, 2).fill({ color: 0x9aa6c8, alpha: a });
      }
      const prog = Math.min(1, t / 2.6);
      route.clear();
      [A, B].forEach((p) => route.circle(p.x, p.y, 14).fill(C.white));
      route.moveTo(A.x, A.y);
      for (let i = 1; i <= 100 * prog; i++) {
        const q = bez(i / 100);
        route.lineTo(q.x, q.y);
      }
      route.stroke({ width: 6, color: C.red, alpha: 0.9 });
      trailDots.forEach((d, i) => {
        const tt = Math.max(0, prog - i * 0.004);
        const q = bez(tt);
        d.position.set(
          q.x + Math.sin(i * 1.7 + t * 6) * i * 0.15,
          q.y + Math.cos(i * 1.3 + t * 6) * i * 0.15,
        );
        d.alpha = (1 - i / trailDots.length) * 0.8;
        d.scale.set(1 - i / trailDots.length);
      });
      const p = bez(prog);
      const n = bez(Math.min(1, prog + 0.01));
      plane.position.set(p.x, p.y);
      plane.rotation = Math.atan2(n.y - p.y, n.x - p.x);
    },
  };
};

export const PixiRoute: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <PixiCanvas create={createScene} background={C.night} />
    <Caption>Сидней → Лондон без пересадки</Caption>
    <div
      style={{
        position: "absolute",
        right: 72,
        bottom: 80,
        color: C.muted,
        fontSize: 28,
        fontFamily: "Inter",
      }}
    >
      Маршрут показан условно
    </div>
    <Badge lib="PixiJS" note="2 500 точек + шлейф на WebGL" />
  </AbsoluteFill>
);
