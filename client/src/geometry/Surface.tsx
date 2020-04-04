import React, { FunctionComponent, useMemo } from 'react';
import { extendHex, defineGrid } from 'honeycomb-grid';
import { ReactThreeFiber } from 'react-three-fiber';
import { InstancedMesh, Vector3, CylinderBufferGeometry, MeshStandardMaterial, Matrix4, Group } from 'three';

export enum Type {
  grass,
  dirt,
  lake,
}

interface Cell {
  type: Type;
  position: Vector3;
}

const Hex = extendHex({ size: 1, type: Type.grass });
const Grid = defineGrid(Hex);

export function randEnumValue<T>(enumObj: T): T[keyof T] {
  const enumNumericKeys = Object.keys(enumObj)
    .map(n => Number.parseInt(n))
    .filter(n => (Number.isNaN(n)));
  const enumValues = Object.values(enumObj);
  const i = Math.floor(Math.random() * enumNumericKeys.length);
  return enumValues[i];
}

export interface SurfaceProps {
  radius?: number;
  position?: Vector3 | [number, number, number] | undefined;
}

const typeColor = (type: Type): number => {
  const t = Type[type];
  switch(Type[type] as unknown as number){
    case Type.dirt:
      return 0xAA9944;
    case Type.grass:
      return 0x22CC77;
    case Type.lake:
      return 0x2277DD;
    default:
      return 0xFF00FF;
  }
}

const createGrid = (radius: number) => {
  return Grid.hexagon({ radius: radius, onCreate: (hex) => {
    hex.type = randEnumValue(Type);
  } });
}

const runCellularAutomata = (radius: number, generations: number) => {
  console.log( "Running cellular automata for", generations, "generations");
  const grid = createGrid(radius);

  for( let g=0; g <= generations; g++ ) {

  }

  const cells = new Array<Cell>();
  grid.forEach( (hex, index) => {
    const point = hex.toPoint();
    cells.push( { type: hex.type, position: new Vector3(point.x, 0, point.y) } );
  })
  return cells;
}

const createInstancedMesh = (type: Type, cells: Cell[]) => {
  console.log( "Creating instanced mesh for type", type, "; color:", typeColor(type), "; cells:", cells.length );
  const geometry = new CylinderBufferGeometry(1,1,0.2, 6);
  const material = new MeshStandardMaterial({ color: typeColor(type) });
  const mesh = new InstancedMesh(geometry, material, cells.length);
  cells.forEach( (cell, index) => {
    mesh.setMatrixAt( index, new Matrix4().setPosition( cell.position ) );
  } );
  return mesh;
}

const createInstancedMeshes = (cells: Cell[]) => {
  const meshes = new Array<InstancedMesh>();

  const groups = cells.reduce((result, item) => {
    const group = result.get(item.type) || []
    result.set(item.type, [...group, item]);
    return result;
  }, new Map<Type, Cell[]>())

  groups.forEach((cells, type) => {
    meshes.push( createInstancedMesh(type, cells) )
  })

  return meshes;
}

export const Surface = ( props: SurfaceProps ) => {
  const meshes = useMemo(
    () => {
      const cells = runCellularAutomata(props.radius || 10, 5);
      return createInstancedMeshes(cells);
    }, [props]
  );
  return (
    <group position={props.position}>
      {
        meshes.map((mesh, index) => <primitive key={index} object={mesh}/>)
      }
    </group>
  );
};
