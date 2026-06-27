/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo, type ReactNode } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
  useFBO,
  MeshTransmissionMaterial,
} from '@react-three/drei';
import { easing } from 'maath';

interface FluidGlassProps {
  mode?: 'lens' | 'bar' | 'cube';
  lensProps?: any;
  barProps?: any;
  cubeProps?: any;
  children?: ReactNode;
}

export default function FluidGlass({ mode = 'lens', lensProps = {}, barProps = {}, cubeProps = {}, children }: FluidGlassProps) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;
  const { ...modeProps } = rawOverrides;

  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
      <Wrapper modeProps={modeProps}>
        {children}
      </Wrapper>
    </Canvas>
  );
}

const ModeWrapper = memo(function ModeWrapper({
  children,
  geometry,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  ...props
}: any) {
  const ref = useRef<any>(null);
  const buffer = useFBO();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef(1);

  useEffect(() => {
    geometry.computeBoundingBox();
    geoWidthRef.current = geometry.boundingBox.max.x - geometry.boundingBox.min.x || 1;
  }, [geometry]);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;
    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

    if (modeProps.scale == null) {
      const maxWorld = v.width * 0.9;
      const desired = maxWorld / geoWidthRef.current;
      ref.current.scale.setScalar(Math.min(1.5, desired));
    } else {
      ref.current.scale.setScalar(modeProps.scale);
    }

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    gl.setClearColor(0x000000, 0);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

  return (
    <>
      {createPortal(children, scene)}
      
      {/* Refractive Object */}
      <mesh ref={ref} rotation-x={Math.PI / 2} geometry={geometry} {...props}>
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.15}
          thickness={thickness ?? 5}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.1}
          background={new THREE.Color(0x000000)} // Use a fallback color for refraction if transparent
          {...extraMat}
        />
      </mesh>
    </>
  );
});

// Generated Geometries instead of GLTF to avoid missing asset errors
const LENS_GEO = new THREE.CylinderGeometry(2, 2, 0.3, 64);
const CUBE_GEO = new THREE.BoxGeometry(3, 3, 3);
const BAR_GEO = new THREE.BoxGeometry(6, 1, 1);

function Lens({ modeProps, ...p }: any) {
  return <ModeWrapper geometry={LENS_GEO} followPointer modeProps={modeProps} {...p} />;
}

function Cube({ modeProps, ...p }: any) {
  return <ModeWrapper geometry={CUBE_GEO} followPointer modeProps={modeProps} {...p} />;
}

function Bar({ modeProps = {}, ...p }: any) {
  const defaultMat = {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.15,
    color: '#ffffff',
    attenuationColor: '#ffffff',
    attenuationDistance: 0.25
  };

  return (
    <ModeWrapper
      geometry={BAR_GEO}
      lockToBottom
      followPointer={false}
      modeProps={{ ...defaultMat, ...modeProps }}
      {...p}
    />
  );
}
