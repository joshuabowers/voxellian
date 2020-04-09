import React, { useMemo } from 'react';
// import { extendHex, defineGrid } from 'honeycomb-grid';
import { ReactThreeFiber } from 'react-three-fiber';
import { InstancedMesh, Vector3, CylinderBufferGeometry, Matrix4, DoubleSide } from 'three';
import { CellTypeFactory } from './CellTypeFactory';
import { CellType } from './CellType';
import { CellularAutomata } from './CellularAutomata';
import { HexCell } from './HexCell';
import { HexagonalCollection } from './HexagonalCollection';
import { profile } from 'utility/profile';

export interface SurfaceProps {
  radius?: number;
  position?: Vector3 | [number, number, number] | undefined;
}

const createCellTypeFactory = () => {
  return new CellTypeFactory([
    {
      name: "water", occurrenceRate: 6, 
      material: { color: 0x2277DD, transparent: true, opacity: 0.7, side: DoubleSide },
      transformation: new Matrix4().multiplyMatrices( 
        new Matrix4().makeScale(1, 0.5, 1), 
        new Matrix4().makeTranslation(0, -0.1, 0)
      )
    },
    {name: "grass", occurrenceRate: 7, material: { color: 0x22CC77 }},
    {name: "sand", occurrenceRate: 4, material: { color: 0xAA9944 }},
    {name: "stone", occurrenceRate: 1, material: { color: 0x666677 }}  
  ]);
}

const createHexagonalCollection = ( radius: number, factory: CellTypeFactory ) => {
  return new HexagonalCollection( radius, factory );
}

const createCellularAutomata = ( 
  collection: HexagonalCollection, 
  factory: CellTypeFactory 
) => {
  return new CellularAutomata( collection, [
    { neighborType: factory.for('grass'), density: 5, resultType: factory.for('grass') },
    { neighborType: factory.for('water'), density: 5, resultType: factory.for('water') },
    { neighborType: factory.for('water'), density: 2, resultType: factory.for('sand') },
    { neighborType: factory.for('sand'), density: 3, resultType: factory.for('grass') }
  ] );
}

const createSurface = (radius: number) => {
  const factory = profile( 'createCellTypeFactory', () => createCellTypeFactory() );
  const collection = profile( 'createHexagonalCollection', () => createHexagonalCollection( radius, factory ) );
  const automata = profile( 'createCellularAutomata', () => createCellularAutomata( collection, factory ) );
  const cells = profile( 'automata.run', () => automata.run( 1 ) as HexCell[] );
  return profile( 'createInstancedMeshes', () => createInstancedMeshes(cells) );
}

const createInstancedMesh = (type: CellType, cells: HexCell[], totalCells: number) => {
  console.log( 
    "Creating instanced mesh for type", type, "; cells:", 
    cells.length, "; distribution:", cells.length / totalCells 
  );
  const geometry = new CylinderBufferGeometry(1,1,0.2, 6);
  geometry.applyMatrix4(type.transformation);
  const material = type.material;
  const mesh = new InstancedMesh(geometry, material, cells.length);
  cells.forEach( (cell, index) => {
    mesh.setMatrixAt( index, new Matrix4().setPosition( cell.position ) );
  } );
  return mesh;
}

const createInstancedMeshes = (cells: HexCell[]) => {
  const meshes = new Array<InstancedMesh>();
  const totalCells = cells.length;

  const groups = cells.reduce((result, item) => {
    const group = result.get(item.type) || []
    result.set(item.type, [...group, item]);
    return result;
  }, new Map<CellType, HexCell[]>())

  groups.forEach((cells, type) => {
    meshes.push( createInstancedMesh(type, cells, totalCells) )
  })

  return meshes;
}

export const Surface = ( props: SurfaceProps ) => {
  // const factory = useMemo( () => createCellTypeFactory(), [] );
  // const collection = useMemo( () => createHexagonalCollection( props.radius || 10, factory ), [props, factory] )
  // const automata = useMemo( () => createCellularAutomata( collection, factory ), [collection, factory] )
  // const meshes = useMemo(
  //   () => {
  //     const cells = automata.run( 1 ) as HexCell[];
  //     return createInstancedMeshes(cells);
  //   }, [automata]
  // );
  const meshes = useMemo(
    () => createSurface( props.radius || 10 ),
    [props]
  );
  return (
    <group position={props.position}>
      {
        meshes.map((mesh, index) => <primitive key={index} object={mesh}/>)
      }
    </group>
  );
};
