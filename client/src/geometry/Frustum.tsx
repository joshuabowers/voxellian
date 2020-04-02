import React, { FunctionComponent } from 'react';
import { HexagonalPlate } from './HexagonalPlate';
import { ReactThreeFiber } from 'react-three-fiber';

export interface FrustumProps {
  radius?: number;
  layers?: number;
};

const defaultFrustum: FrustumProps = {
  radius: 10,
  layers: 4
};

export const Frustum: FunctionComponent<FrustumProps> = (props) => {
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
