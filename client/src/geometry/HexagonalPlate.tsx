import React, { useMemo } from 'react';
import { defineGrid, extendHex } from 'honeycomb-grid';
import { Vector3 } from 'three';
import { Hexel } from './Hexel';

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
      const position = new Vector3( point.x, -props.z + (-0.5 + Math.random()), point.y );
      result.push(
        <Hexel 
          key={coordinates} 
          coordinates={hex} 
          position={position} 
          color={hex.color} />
      );
    })
    return result;
  }, [props]);

  return (
    <group>
      {hexes}
    </group>
  );
};