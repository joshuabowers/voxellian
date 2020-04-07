import React, { useMemo } from 'react';
import { extendHex, defineGrid } from 'honeycomb-grid';
import { ReactThreeFiber } from 'react-three-fiber';
import { InstancedMesh, Vector3, CylinderBufferGeometry, Matrix4 } from 'three';
import { CellTypeFactory } from './CellTypeFactory';
import { CellType } from './CellType';

interface Cell {
  type: CellType;
  position: Vector3;
}

const Hex = extendHex({ size: 1, type: undefined as CellType | undefined });
const Grid = defineGrid(Hex);

export interface SurfaceProps {
  radius?: number;
  position?: Vector3 | [number, number, number] | undefined;
}

const createCellTypeFactory = () => {
  return new CellTypeFactory([
    {name: "water", occurrenceRate: 6, material: { color: 0x2277DD }},
    {name: "grass", occurrenceRate: 7, material: { color: 0x22CC77 }},
    {name: "sand", occurrenceRate: 4, material: { color: 0xAA9944 }},
    {name: "stone", occurrenceRate: 1, material: { color: 0x666677 }}  
  ]);
}

const createGrid = (factory: CellTypeFactory, radius: number) => {
  return Grid.hexagon({ radius: radius, onCreate: (hex) => {
    hex.type = factory.random();
  } });
}

const runCellularAutomata = (factory: CellTypeFactory, radius: number, generations: number) => {
  console.log( "Running cellular automata for", generations, "generations");
  const grid = createGrid(factory, radius);

  for( let g=0; g <= generations; g++ ) {

  }

  const cells = new Array<Cell>();
  grid.forEach( (hex, index) => {
    const point = hex.toPoint();
    if( !hex.type ){ throw new Error("CellType not set for hex"); }
    cells.push( { type: hex.type, position: new Vector3(point.x, 0, point.y) } );
  })
  return cells;
}

const createInstancedMesh = (type: CellType, cells: Cell[], totalCells: number) => {
  console.log( 
    "Creating instanced mesh for type", type, "; cells:", 
    cells.length, "; distribution:", cells.length / totalCells 
  );
  const geometry = new CylinderBufferGeometry(1,1,0.2, 6);
  const material = type.material;
  const mesh = new InstancedMesh(geometry, material, cells.length);
  cells.forEach( (cell, index) => {
    mesh.setMatrixAt( index, new Matrix4().setPosition( cell.position ) );
  } );
  return mesh;
}

const createInstancedMeshes = (cells: Cell[]) => {
  const meshes = new Array<InstancedMesh>();
  const totalCells = cells.length;

  const groups = cells.reduce((result, item) => {
    const group = result.get(item.type) || []
    result.set(item.type, [...group, item]);
    return result;
  }, new Map<CellType, Cell[]>())

  groups.forEach((cells, type) => {
    meshes.push( createInstancedMesh(type, cells, totalCells) )
  })

  return meshes;
}

export const Surface = ( props: SurfaceProps ) => {
  const factory = useMemo( () => createCellTypeFactory(), [] );
  const meshes = useMemo(
    () => {
      console.log( "CellTypeFactory:", factory );
      const cells = runCellularAutomata(factory, props.radius || 10, 5);
      return createInstancedMeshes(cells);
    }, [props, factory]
  );
  return (
    <group position={props.position}>
      {
        meshes.map((mesh, index) => <primitive key={index} object={mesh}/>)
      }
    </group>
  );
};
