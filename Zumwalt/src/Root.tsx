import { Composition, Folder } from "remotion";
import { CARDS } from "./cards/Cards";
import { MECHANISMS } from "./mechanisms";
import { FPS, H, W } from "./theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Cards">
      {CARDS.map(({ id, C, sec }) => (
        <Composition key={id} id={id} component={C} durationInFrames={Math.round(sec * FPS)} fps={FPS} width={W} height={H} />
      ))}
    </Folder>
    <Folder name="Mechanisms">
      {MECHANISMS.map(({ id, C, sec }) => (
        <Composition key={id} id={id} component={C} durationInFrames={Math.round(sec * FPS)} fps={FPS} width={W} height={H} />
      ))}
    </Folder>
  </>
);
