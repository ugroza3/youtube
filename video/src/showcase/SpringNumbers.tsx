import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { springAt } from "../adapters/reactSpring";
import { Badge, C, Caption, fontFamily } from "./theme";

const CARDS = [
  { big: "≈20 000 л", small: "доп. центральный бак" },
  { big: "до 4 ч", small: "экономии по заявлению Qantas" },
  { big: "10.2027", small: "объявленный старт" },
];

const Card: React.FC<{ index: number; big: string; small: string }> = ({
  index,
  big,
  small,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000 - index * 250;
  // Wobbly spring: visible overshoot, like a card dropped on a table.
  const y = springAt(ms, {
    from: -700,
    to: 0,
    config: { tension: 180, friction: 11 },
  });
  const rot = springAt(ms, {
    from: index % 2 ? 14 : -14,
    to: 0,
    config: { tension: 120, friction: 8 },
  });
  return (
    <div
      style={{
        width: 480,
        height: 360,
        borderRadius: 32,
        background: C.white,
        color: C.night,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
        translate: `0 ${y}px`,
        rotate: `${rot}deg`,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 88, fontWeight: 800, color: C.red }}>{big}</div>
      <div
        style={{
          fontSize: 30,
          marginTop: 12,
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        {small}
      </div>
    </div>
  );
};

export const SpringNumbers: React.FC = () => (
  <AbsoluteFill style={{ background: C.navy }}>
    <Caption>Ключевые цифры</Caption>
    <AbsoluteFill
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 56,
      }}
    >
      {CARDS.map((c, i) => (
        <Card key={i} index={i} {...c} />
      ))}
    </AbsoluteFill>
    <Badge lib="react-spring" note="физика пружины: масса, натяжение, трение" />
  </AbsoluteFill>
);
