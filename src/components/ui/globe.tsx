"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Color, Fog, PerspectiveCamera, Scene, Vector3 } from "three";
import ThreeGlobe from "three-globe";

import countries from "@/data/globe.json";

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: any;
  }
}

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        threeGlobe: any;
        ambientLight: any;
        directionalLight: any;
        pointLight: any;
      }
    }
  }

  namespace JSX {
    interface IntrinsicElements {
      threeGlobe: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
    }
  }
}

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const CAMERA_Z = 300;

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: { lat: number; lng: number };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

export type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

type WorldProps = {
  globeConfig: GlobeConfig;
  data: Position[];
};

function GlobeCore({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<any>(null);
  const [pointData, setPointData] = useState<
    Array<{
      size: number;
      order: number;
      color: (t: number) => string;
      lat: number;
      lng: number;
    }>
  >([]);

  const config = useMemo(
    () => ({
      pointSize: 1,
      atmosphereColor: "#ffffff",
      showAtmosphere: true,
      atmosphereAltitude: 0.1,
      polygonColor: "rgba(255,255,255,0.65)",
      globeColor: "#0b1a5e",
      emissive: "#0b1a5e",
      emissiveIntensity: 0.2,
      shininess: 0.9,
      arcTime: 2000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      ...globeConfig,
    }),
    [globeConfig]
  );

  useEffect(() => {
    if (!globeRef.current) return;
    const globeMaterial = globeRef.current.globeMaterial();
    globeMaterial.color = new Color(config.globeColor);
    globeMaterial.emissive = new Color(config.emissive);
    globeMaterial.emissiveIntensity = config.emissiveIntensity;
    globeMaterial.shininess = config.shininess;
  }, [config]);

  useEffect(() => {
    const points: Array<{
      size: number;
      order: number;
      color: (t: number) => string;
      lat: number;
      lng: number;
    }> = [];
    for (const arc of data) {
      const rgb = hexToRgb(arc.color);
      if (!rgb) continue;
      const colorFn = (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`;
      points.push({
        size: config.pointSize,
        order: arc.order,
        color: colorFn,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: config.pointSize,
        order: arc.order,
        color: colorFn,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }
    setPointData(points);
  }, [data, config.pointSize]);

  useEffect(() => {
    if (!globeRef.current || pointData.length === 0) return;

    globeRef.current
      .hexPolygonsData((countries as any).features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(config.showAtmosphere)
      .atmosphereColor(config.atmosphereColor)
      .atmosphereAltitude(config.atmosphereAltitude)
      .hexPolygonColor(() => config.polygonColor);

    globeRef.current
      .arcsData(data)
      .arcStartLat((d: any) => d.startLat)
      .arcStartLng((d: any) => d.startLng)
      .arcEndLat((d: any) => d.endLat)
      .arcEndLng((d: any) => d.endLng)
      .arcColor((d: any) => d.color)
      .arcAltitude((d: any) => d.arcAlt)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.floor(Math.random() * 3)])
      .arcDashLength(config.arcLength)
      .arcDashInitialGap((d: any) => d.order)
      .arcDashGap(15)
      .arcDashAnimateTime(config.arcTime);

    globeRef.current
      .pointsData(data)
      .pointColor((d: any) => d.color)
      .pointsMerge(true)
      .pointAltitude(0)
      .pointRadius(2);

    globeRef.current
      .ringsData([])
      .ringColor((d: any) => (t: number) => d.color(t))
      .ringMaxRadius(config.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod((config.arcTime * config.arcLength) / config.rings);
  }, [config, data, pointData]);

  useEffect(() => {
    if (!globeRef.current || pointData.length === 0) return;
    const interval = setInterval(() => {
      if (!globeRef.current) return;
      const picks = randomNumbers(0, pointData.length, Math.floor((pointData.length * 4) / 5));
      globeRef.current.ringsData(pointData.filter((_, idx) => picks.includes(idx)));
    }, 2000);
    return () => clearInterval(interval);
  }, [pointData]);

  return <threeGlobe ref={globeRef} />;
}

function WebGLRendererConfig() {
  const { gl, size } = useThree();
  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0);
  }, [gl, size]);
  return null;
}

export function World({ globeConfig, data }: WorldProps) {
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);
  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, 1.2, 180, 1800)}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight || "#ffffff"} intensity={0.5} />
      <directionalLight color={globeConfig.directionalLeftLight || "#ffffff"} position={new Vector3(-400, 100, 400)} />
      <directionalLight color={globeConfig.directionalTopLight || "#ffffff"} position={new Vector3(-200, 500, 200)} />
      <pointLight color={globeConfig.pointLight || "#ffffff"} position={new Vector3(-200, 500, 200)} intensity={0.8} />
      <GlobeCore globeConfig={globeConfig} data={data} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={CAMERA_Z}
        maxDistance={CAMERA_Z}
        autoRotate={globeConfig.autoRotate ?? true}
        autoRotateSpeed={globeConfig.autoRotateSpeed ?? 0.7}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

function hexToRgb(hex: string) {
  const parsed = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!parsed) return null;
  return {
    r: Number.parseInt(parsed[1], 16),
    g: Number.parseInt(parsed[2], 16),
    b: Number.parseInt(parsed[3], 16),
  };
}

function randomNumbers(min: number, max: number, count: number) {
  const out: number[] = [];
  while (out.length < count) {
    const n = Math.floor(Math.random() * (max - min)) + min;
    if (!out.includes(n)) out.push(n);
  }
  return out;
}

