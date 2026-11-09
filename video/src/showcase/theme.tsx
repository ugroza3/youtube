import { loadFont } from "@remotion/google-fonts/Inter";
import { AbsoluteFill } from "remotion";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "800"],
  subsets: ["latin", "cyrillic"],
});

export const C = {
  night: "#0b1026",
  navy: "#14204a",
  red: "#e40000",
  white: "#ffffff",
  muted: "#9aa6c8",
};

/** Library name label in the corner, so the showcase makes clear which tool draws what. */
export const Badge: React.FC<{ lib: string; note?: string }> = ({
  lib,
  note,
}) => (
  <AbsoluteFill
    style={{ justifyContent: "flex-end", padding: 72, pointerEvents: "none" }}
  >
    <div
      style={{
        fontFamily,
        color: C.white,
        display: "flex",
        gap: 16,
        alignItems: "baseline",
      }}
    >
      <span
        style={{
          background: C.red,
          padding: "8px 18px",
          borderRadius: 8,
          fontWeight: 800,
          fontSize: 32,
        }}
      >
        {lib}
      </span>
      {note ? (
        <span style={{ fontSize: 28, color: C.muted }}>{note}</span>
      ) : null}
    </div>
  </AbsoluteFill>
);

export const Caption: React.FC<{ children: React.ReactNode; top?: number }> = ({
  children,
  top = 96,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily,
      fontWeight: 800,
      fontSize: 72,
      color: C.white,
      textShadow: "0 4px 24px rgba(0,0,0,0.6)",
    }}
  >
    {children}
  </div>
);
