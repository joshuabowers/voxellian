import React, { useRef } from 'react';
import { ReactThreeFiber, useFrame } from 'react-three-fiber';
import { Mesh } from 'three';

export function Cubel(props: any) {
  const mesh = useRef<ReactThreeFiber.Object3DNode<Mesh, typeof Mesh>>();

  useFrame(() => {
    if( mesh.current && mesh.current.rotateX && mesh.current.rotateY ){
      mesh.current.rotateX(0.01);
      mesh.current.rotateY(0.01);
    }
  });

  return (
    <mesh
      {...props}
      ref={mesh}
    >
      <boxBufferGeometry attach="geometry" args={[1,1,1]} />
      <meshStandardMaterial attach="material" color="green" />
    </mesh>
  )
}