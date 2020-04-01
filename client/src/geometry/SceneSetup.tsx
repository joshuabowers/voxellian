import React from 'react';
import { ReactThreeFiber, useThree, extend } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>
    }
  }
}

extend({ OrbitControls })

export const SceneSetup = () => {
  const {camera, gl: {domElement}} = useThree();
  return (
    <>
      <orbitControls args={[camera, domElement]} 
        maxDistance={20} minDistance={10} />
      <ambientLight />
      <pointLight position={[10,10,10]} />
    </>
  )
};
