import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, E, FONT, ramp } from "./theme";

export const useT = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return { t: frame / fps, frame, fps, dur: durationInFrames / fps };
};

/** Film grain cycled at 12 fps (the stepped texture look of editorial explainers). */
export const Grain: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const { frame, fps } = useT();
  const i = Math.floor(frame / (fps / 12)) % 6;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: dark ? "screen" : "multiply", opacity: dark ? 0.07 : 0.16 }}>
      <Img src={staticFile(`grain/g${i}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

/** Background with vignette, grain and a very slow camera push on the content. */
export const Stage: React.FC<{ dark?: boolean; push?: number; children: React.ReactNode }> = ({
  dark,
  push = 0.03,
  children,
}) => {
  const { t, dur } = useT();
  const s = 1 + push * ramp(t, 0, dur, E.linear);
  return (
    <AbsoluteFill style={{ background: dark ? C.charcoal : C.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(s) }}>{children}</AbsoluteFill>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: dark
            ? "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)"
            : "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 60%, rgba(60,40,20,0.16) 100%)",
        }}
      />
      <Grain dark={dark} />
    </AbsoluteFill>
  );
};

/** Small uppercase mono label revealed with a left-to-right wipe. */
export const Kicker: React.FC<{ at: number; color?: string; size?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  at,
  color = C.accent,
  size = 26,
  style,
  children,
}) => {
  const { t } = useT();
  const p = ramp(t, at, at + 0.6);
  return (
    <div
      style={{
        fontFamily: FONT.mono,
        fontWeight: 500,
        fontSize: size,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color,
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Condensed headline; each word rises out of a mask, 90 ms apart. */
export const Headline: React.FC<{
  at: number;
  text: string;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ at, text, size = 150, color = C.ink, weight = 800, style }) => {
  const { t } = useT();
  return (
    <div
      style={{
        fontFamily: FONT.display,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 0.92,
        letterSpacing: "-0.01em",
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {text.split(" ").map((w, i) => {
        const p = ramp(t, at + i * 0.09, at + i * 0.09 + 0.7);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", marginRight: "0.22em", paddingBottom: "0.04em" }}>
            <span style={{ display: "inline-block", translate: `0 ${(1 - p) * 105}%` }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

/** Marker highlight sweeping behind inline text. */
export const Marker: React.FC<{ at: number; color?: string; dur?: number; children: React.ReactNode }> = ({
  at,
  color = C.amber,
  dur = 0.5,
  children,
}) => {
  const { t } = useT();
  const p = ramp(t, at, at + dur, E.inOut);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{
          position: "absolute",
          left: "-0.12em",
          right: "-0.12em",
          top: "18%",
          bottom: "6%",
          background: color,
          transformOrigin: "left center",
          scale: `${p} 1`,
          zIndex: 0,
          rotate: "-0.6deg",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </span>
  );
};

export const Body: React.FC<{ at: number; size?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  at,
  size = 40,
  color = C.inkSoft,
  style,
  children,
}) => {
  const { t } = useT();
  const p = ramp(t, at, at + 0.6);
  return (
    <div
      style={{
        fontFamily: FONT.sans,
        fontSize: size,
        lineHeight: 1.3,
        color,
        opacity: p,
        translate: `0 ${(1 - p) * 18}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Source / caveat line, bottom left, in the title-safe area. */
export const Source: React.FC<{ at: number; dark?: boolean; children: React.ReactNode }> = ({ at, dark, children }) => {
  const { t } = useT();
  return (
    <div
      style={{
        position: "absolute",
        left: 192,
        bottom: 96,
        fontFamily: FONT.mono,
        fontSize: 22,
        letterSpacing: "0.04em",
        color: dark ? "#9C9488" : C.muted,
        opacity: ramp(t, at, at + 0.5),
      }}
    >
      {children}
    </div>
  );
};

/** Horizontal rule drawn from the left. */
export const Rule: React.FC<{ at: number; width: number; color?: string; thick?: number; style?: React.CSSProperties }> = ({
  at,
  width,
  color = C.ink,
  thick = 3,
  style,
}) => {
  const { t } = useT();
  return (
    <div
      style={{
        width,
        height: thick,
        background: color,
        transformOrigin: "left",
        scale: `${ramp(t, at, at + 0.8, E.inOut)} 1`,
        ...style,
      }}
    />
  );
};

/** Pill label used for steps and modes. */
export const Chip: React.FC<{ active: number; label: string; dark?: boolean; style?: React.CSSProperties }> = ({
  active,
  label,
  dark,
  style,
}) => {
  const base = dark ? C.charcoalUp : C.paperDeep;
  const fg = dark ? C.bone : C.ink;
  return (
    <div
      style={{
        fontFamily: FONT.mono,
        fontWeight: 600,
        fontSize: 24,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "10px 18px",
        borderRadius: 6,
        background: active > 0.5 ? C.accent : base,
        color: active > 0.5 ? "#fff" : fg,
        opacity: 0.45 + 0.55 * active,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {label}
    </div>
  );
};

/** Top-left running tag, like a page header in a magazine. */
export const Folio: React.FC<{ label: string; dark?: boolean }> = ({ label, dark }) => {
  const { t } = useT();
  return (
    <div
      style={{
        position: "absolute",
        left: 192,
        top: 96,
        display: "flex",
        gap: 18,
        alignItems: "center",
        fontFamily: FONT.mono,
        fontSize: 22,
        letterSpacing: "0.14em",
        color: dark ? "#9C9488" : C.muted,
        opacity: ramp(t, 0.1, 0.6),
      }}
    >
      <span style={{ width: 14, height: 14, background: C.accent, display: "inline-block" }} />
      USS ZUMWALT · DDG-1000 <span style={{ opacity: 0.5 }}>/</span> {label}
    </div>
  );
};
