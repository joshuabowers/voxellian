import React from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from 'react-three-fiber';

interface AssetDetails {
  url: string;
}

export type AssetProps = AssetDetails & Partial<THREE.Object3D>;

/**
 * Loads a GLTF asset located at url. 
 */
export const Asset = (props: AssetProps) => {
  const gltf = useLoader( GLTFLoader, props.url );
  return <primitive object={gltf.scene} {...props} />;
}