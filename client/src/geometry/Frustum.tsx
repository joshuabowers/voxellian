import React from 'react';
import { ReactThreeFiber } from 'react-three-fiber';
import { HexagonalPlate } from './HexagonalPlate';

export interface FrustumProps {
  radius?: number;
  layers?: number;
};

const defaultFrustum: FrustumProps = {
  radius: 10,
  layers: 4
};

export const Frustum = (props: FrustumProps) => {
  const { radius, layers } = {...defaultFrustum, ...props};
  if( !radius || !layers ){ throw new Error("radius or layers missing."); }
  const plates = [...Array(layers).keys()].map( layer => (
    <HexagonalPlate key={layer} 
                    radius={radius - layer} 
                    z={layer}
                    color={layer > 0 ? 0x664422 : 0x228855}
    />
  ));

  return (
    <group>
      { plates }
    </group>
  );
};