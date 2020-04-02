import React, { useRef, useState } from 'react';
import { ReactThreeFiber, Dom } from 'react-three-fiber';
import { Mesh, Vector3 } from 'three';
import { ToolTip } from 'components/ToolTip';
import { CubeCoordinates } from 'honeycomb-grid';

export interface HexelProps {
  position: Vector3;
  color: string | number;
  coordinates: CubeCoordinates;
}

export function Hexel(props: HexelProps) {
  const mesh = useRef<ReactThreeFiber.Object3DNode<Mesh, typeof Mesh>>();
  // const [isHovered, setHover] = useState(false);
  // const [pointerPosition, setPointer] = useState<Vector3>();
  const coordinates = `(${props.coordinates.q}, ${props.coordinates.r}, ${props.coordinates.s})`;

  return (
    <group>
      <mesh
        position={props.position}
        ref={mesh}
        // onPointerOver={e => {
        //   e.stopPropagation();
        //   setHover(true);
        // }}
        // onPointerOut={e => {
        //   e.stopPropagation();
        //   setHover(false);
        // }}
        // onPointerMove={e => {
        //   e.stopPropagation();
        //   setPointer(e.point);
        // }}
      >
        <cylinderBufferGeometry attach="geometry" args={[1,1,1, 6]} />
        <meshStandardMaterial attach="material" color={props.color} />
      </mesh>
      {/* <Dom position={pointerPosition}>
        <ToolTip isVisible={isHovered} title={coordinates}>
          <ul>
            <li>Position: {props.position.toArray().join(',')}</li>
          </ul>
        </ToolTip>
      </Dom> */}
    </group>
  )
}