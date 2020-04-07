import { Matrix4, Material, MeshStandardMaterial, MeshStandardMaterialParameters } from "three";

export interface ICellType {
  readonly id?: Symbol;
  name: string;
  transformation?: Matrix4;
  material?: Material | MeshStandardMaterialParameters;
  occurrenceRate: number;
}

function isMaterial(x:any): x is Material {
  return x instanceof Material;
}

/**
 * Represents type information for cells within a grid.
 */
export class CellType implements ICellType {
  id: Symbol;
  name: string;
  transformation: Matrix4;
  material: Material;
  occurrenceRate: number;

  constructor(props: ICellType) {
    this.id = Symbol.for(props.name);
    this.name = props.name;
    this.occurrenceRate = props.occurrenceRate;
    this.transformation = props.transformation || new Matrix4();
    this.material = isMaterial(props.material) 
      ? props.material : new MeshStandardMaterial(props.material);
  }
}
