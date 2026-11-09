import { stagger } from "animejs";
import { AbsoluteFill } from "remotion";
import { useRef } from "react";
import { useAnimeTimeline } from "../adapters/anime";
import { Badge, C, fontFamily } from "./theme";

const TITLE = "QANTAS A350-1000ULR";

export const AnimeTitle: React.FC = () => {
  const root = useRef<HTMLDivElement>(null);

  useAnimeTimeline((tl) => {
    const q = (s: string) => root.current!.querySelectorAll<HTMLElement>(s);
    // Before a child's start anime leaves the element untouched, so pin start states at 0.
    tl.set(q(".ch, .sub"), { opacity: 0 }, 0).set(q(".bar"), { scaleX: 0 }, 0);
    tl.add(q(".ch"), {
      opacity: [0, 1],
      translateY: [80, 0],
      rotate: [-12, 0],
      duration: 700,
      delay: stagger(40),
      ease: "outExpo",
    })
      .add(q(".bar"), { scaleX: [0, 1], duration: 900, ease: "inOutQuad" }, 600)
      .add(
        q(".sub"),
        {
          opacity: [0, 1],
          translateY: [24, 0],
          duration: 600,
          ease: "outCubic",
        },
        1100,
      )
      .add(
        q(".count"),
        {
          innerHTML: [0, 22],
          modifier: (v: number) => Math.round(v),
          duration: 1200,
          ease: "outQuad",
        },
        1100,
      );
  });

  return (
    <AbsoluteFill
      style={{
        background: C.night,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      <div ref={root} style={{ textAlign: "center", color: C.white }}>
        <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: 4 }}>
          {TITLE.split("").map((c, i) => (
            <span
              key={i}
              className="ch"
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {c}
            </span>
          ))}
        </div>
        <div
          className="bar"
          style={{
            height: 8,
            background: C.red,
            margin: "32px auto",
            width: 900,
            transformOrigin: "left",
          }}
        />
        <div className="sub" style={{ fontSize: 56, color: C.muted }}>
          <span className="count" style={{ color: C.white, fontWeight: 800 }}>
            0
          </span>{" "}
          часа без посадки
        </div>
      </div>
      <Badge lib="anime.js" note="таймлайн, stagger, счётчик" />
    </AbsoluteFill>
  );
};
