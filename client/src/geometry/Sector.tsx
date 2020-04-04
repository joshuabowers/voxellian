import React, { FunctionComponent, useRef } from 'react';
import { useFrame, ReactThreeFiber } from 'react-three-fiber';
import { Frustum } from './Frustum';
import { Surface } from './Surface';
import { Group, Vector3 } from 'three';

export interface SectorProps {

}

type GroupNode = ReactThreeFiber.Object3DNode<Group, typeof Group>;

export const Sector: FunctionComponent<SectorProps> = (props) => {
  const group = useRef<GroupNode>();
  useFrame(() => {
    if( group && group.current && group.current.rotateY ){
      group.current.rotateY(0.001);
    }
  })

  return (
    <group ref={group}>
      <Frustum/>
      <Surface position={[0, 0.2, 0]}/>
    </group>
  )
}