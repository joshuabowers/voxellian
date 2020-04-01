import React, { useMemo } from 'react';
import { ReactThreeFiber } from 'react-three-fiber';
import { defineGrid, extendHex } from 'honeycomb-grid';
import { Vector3 } from 'three';

export interface HexagonalPlateProps {
  radius: number;
  z: number;
  color: number | string;
}

export const HexagonalPlate = (props: HexagonalPlateProps) => {
  const hexes = useMemo(() => {
    console.log("Computing hexes:", props);
    const Hex = extendHex({ size: 1, color: props.color });
    const Grid = defineGrid(Hex);
    const grid = Grid.hexagon({radius: props.radius});
    const result = Array<JSX.Element>();
    grid.forEach( hex => {
      const point = hex.toPoint();
      const coordinates = hex.toString();
      const position = new Vector3( point.x, -props.z, point.y );
      result.push(
        <mesh key={coordinates} position={position}>
          <cylinderBufferGeometry attach='geometry' args={[1,1,1, 6]}/>
          <meshStandardMaterial attach='material' color={hex.color} />       
        </mesh>
      );
    })
    return result;
  }, [props.radius, props.z]);

  return (
    <group>
      {hexes}
    </group>
  );
};