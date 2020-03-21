import React from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ReactThreeFiber, useLoader } from 'react-three-fiber';

interface AssetDetails {
  url: string;
}

export type AssetProps = AssetDetails & ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;

/**
 * Loads a GLTF asset located at url. 
 */
export const Asset = (props: AssetProps) => {
  const gltf = useLoader( GLTFLoader, props.url );
  return <primitive object={gltf.scene} {...props} />;
}