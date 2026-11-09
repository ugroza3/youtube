import { Composition, Folder } from "remotion";
import {
  SCENE,
  Showcase,
  SHOWCASE_DURATION,
  SHOWCASE_SCENES,
} from "./showcase/Showcase";

const video = { fps: 30, width: 1920, height: 1080 };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="LibraryShowcase"
      component={Showcase}
      durationInFrames={SHOWCASE_DURATION}
      {...video}
    />
    <Folder name="Showcase-scenes">
      {SHOWCASE_SCENES.map(({ id, Scene }) => (
        <Composition
          key={id}
          id={id}
          component={Scene}
          durationInFrames={SCENE}
          {...video}
        />
      ))}
    </Folder>
  </>
);
