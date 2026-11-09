import { createTimeline, type Timeline } from "animejs";
import { useLayoutEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Builds a paused anime.js timeline once and seeks it to the current frame.
 * Elements animated by anime must not also receive the same style props from React.
 */
export const useAnimeTimeline = (build: (tl: Timeline) => void) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tlRef = useRef<Timeline | null>(null);

  useLayoutEffect(() => {
    const tl = createTimeline({ autoplay: false });
    build(tl);
    tlRef.current = tl;
    return () => {
      tl.revert();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    tlRef.current?.seek((frame / fps) * 1000);
  }, [frame, fps]);
};
