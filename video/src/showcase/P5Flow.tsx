import type p5 from "p5";
import { AbsoluteFill } from "remotion";
import { P5Canvas } from "../adapters/P5Canvas";
import { Badge, C, Caption } from "./theme";

// Flow field: each line is integrated through Perlin noise whose z-axis is time.
const draw = (p: p5, t: number) => {
  p.noiseSeed(42);
  p.randomSeed(42);
  p.background(C.night);
  p.noFill();
  const cols = 70;
  const rows = 40;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = (i + 0.5) * (p.width / cols) + p.random(-10, 10);
      let y = (j + 0.5) * (p.height / rows) + p.random(-10, 10);
      const hot = p.random() < 0.08;
      p.stroke(hot ? p.color(228, 0, 0, 220) : p.color(154, 166, 200, 90));
      p.strokeWeight(hot ? 2.5 : 1.2);
      p.beginShape();
      for (let k = 0; k < 14; k++) {
        p.vertex(x, y);
        const a = p.noise(x * 0.0018, y * 0.0018, t * 0.35) * p.TWO_PI * 2;
        x += Math.cos(a) * 9;
        y += Math.sin(a) * 9;
      }
      p.endShape();
    }
  }
};

export const P5Flow: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <P5Canvas draw={draw} />
    <Caption top={440}>Почти сутки в воздухе</Caption>
    <Badge lib="p5.js" note="генеративный фон: поле потоков на шуме Перлина" />
  </AbsoluteFill>
);
