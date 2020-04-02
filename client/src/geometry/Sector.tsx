import React, { FunctionComponent, useRef } from 'react';
import { useFrame, ReactThreeFiber } from 'react-three-fiber';
import { Frustum } from './Frustum';
import { Group } from 'three';

export interface SectorProps {

}

type GroupNode = ReactThreeFiber.Object3DNode<Group, typeof Group>;

export const Sector: FunctionComponent<SectorProps> = (props) => {
  const group = useRef<GroupNode>();
  useFrame(() => {
    if( group && group.current && group.current.rotateY ){
      group.current.rotateY(0.005);
    }
  })

  return (
    <group ref={group}>
      <Frustum/>
    </group>
  )
}