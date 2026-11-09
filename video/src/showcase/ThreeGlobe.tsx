import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { Badge, C, Caption } from "./theme";

const toVec = (lat: number, lon: number, r: number) => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
};

const SYD = toVec(-33.87, 151.21, 2);
const LON = toVec(51.47, -0.45, 2);

// Great-circle arc lifted above the surface; the cities are ~150° apart, so a straight bezier would cut through the globe.
const arcPoint = (t: number) => {
  const q = new THREE.Quaternion().setFromUnitVectors(
    SYD.clone().normalize(),
    LON.clone().normalize(),
  );
  const step = new THREE.Quaternion().slerp(q, t);
  return SYD.clone()
    .normalize()
    .applyQuaternion(step)
    .multiplyScalar(2 + 0.45 * Math.sin(Math.PI * t));
};

// Rotation that turns the middle of the route towards the camera.
const FACE_ROUTE = new THREE.Euler().setFromQuaternion(
  new THREE.Quaternion().setFromUnitVectors(
    arcPoint(0.5).normalize(),
    new THREE.Vector3(0, 0.25, 1).normalize(),
  ),
);

const Arc: React.FC<{ progress: number }> = ({ progress }) => {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        Array.from({ length: 65 }, (_, i) => arcPoint(i / 64)),
      ),
    [],
  );
  const geom = useMemo(
    () => new THREE.TubeGeometry(curve, 200, 0.02, 8, false),
    [curve],
  );
  // Reveal the tube by limiting how many indices are drawn.
  const count = Math.floor(geom.index!.count * progress);
  geom.setDrawRange(0, count - (count % 3));
  const head = curve.getPoint(Math.max(0.001, progress));
  return (
    <>
      <mesh geometry={geom}>
        <meshBasicMaterial color={C.red} />
      </mesh>
      <mesh position={head}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </>
  );
};

export const ThreeGlobe: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;
  const progress = interpolate(t, [0.4, 2.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 60%, #1c2a5e, #070a18)",
      }}
    >
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 1.2, 6.4], fov: 45 }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 3, 5]} intensity={1.6} />
        <group rotation={[0, (t - 1.5) * 0.1, 0]}>
          <group rotation={FACE_ROUTE}>
            <mesh>
              <sphereGeometry args={[2, 64, 64]} />
              <meshStandardMaterial
                color="#1d3a8a"
                roughness={0.8}
                metalness={0.1}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[2.005, 36, 18]} />
              <meshBasicMaterial
                color="#6f86c9"
                wireframe
                transparent
                opacity={0.18}
              />
            </mesh>
            {[SYD, LON].map((v, i) => (
              <mesh key={i} position={v}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            ))}
            <Arc progress={progress} />
          </group>
        </group>
      </ThreeCanvas>
      <Caption>Глобус: свет, материал, камера</Caption>
      <Badge lib="three.js" note="@remotion/three + react-three-fiber" />
    </AbsoluteFill>
  );
};
