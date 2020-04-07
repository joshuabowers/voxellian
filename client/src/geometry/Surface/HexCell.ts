import { ICell } from "./CellularAutomata";
import { CellType } from "./CellType";
import { Vector3 } from "three";

export class HexCell implements ICell<CellType> {
  type: CellType;
  position: Vector3;

  constructor( type: CellType, position: Vector3 ) {
    this.type = type;
    this.position = position;
  }

  clone( replacementType: CellType ) {
    return new HexCell( replacementType, this.position );
  }
}