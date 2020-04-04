import React, { FunctionComponent, useMemo } from 'react';
import { extendHex, defineGrid } from 'honeycomb-grid';
import { Matrix4, InstancedMesh, CylinderBufferGeometry, MeshStandardMaterial } from 'three';

export interface FrustumProps {
  radius?: number;
  layers?: number;
};

const defaultFrustum: FrustumProps = {
  radius: 10,
  layers: 4
};

const createGridStack = ({ radius, size, height, layers }: 
  { radius: number; size: number; height: number; layers: number; }) => {
  console.log("Computing frustum hexagon grid stack");
  const result = Array<Matrix4>();
  for(let i=0; i < layers; i++){
    const layer = i * height;
    const scalar = size - (i * 0.01);
    const scale = new Matrix4().makeScale(scalar, 1, scalar);

    const Hex = extendHex({ size: scalar });
    const Grid = defineGrid(Hex);
    const grid = Grid.hexagon({ radius: radius });

    grid.forEach( hex => {
      const point = hex.toPoint();
      const translate = new Matrix4().makeTranslation(point.x, -layer, point.y);
      const final = translate.multiply(scale);
      result.push( final );
    } );
  }
  return result;
}

const createFrustumMesh = ({ stack, height, size }: 
  { stack: Matrix4[]; height: number; size: number; }) => {
  console.log("Computing mesh instances; count:", stack.length);
  const geometry = new CylinderBufferGeometry(size, size, height, 6);
  const material = new MeshStandardMaterial({ color: 0x664422 });
  const result = new InstancedMesh(geometry, material, stack.length);

  stack.forEach( (matrix, index) => {
    result.setMatrixAt(index, matrix);
  } );

  result.instanceMatrix.needsUpdate = true;

  return result;
}

export const Frustum: FunctionComponent<FrustumProps> = (props) => {
  const { radius, layers } = {...defaultFrustum, ...props};
  if( !radius || !layers ){ throw new Error("radius or layers missing."); }
  const [ size, height ] = [ 1, 0.2 ]

  const stack = useMemo(
    () => createGridStack({ radius, size, height, layers }), 
    [radius, size, height, layers]
  );

  const mesh = useMemo(
    () => createFrustumMesh({ stack, height, size }),
    [stack, height, size]
  );

  return (
    <primitive object={mesh} />
  );
};
