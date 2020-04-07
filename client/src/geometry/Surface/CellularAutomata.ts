import { Vector3 } from "three";

export interface ICell<TCellType> {
  type: TCellType;
  position: Vector3;
}

export interface ICollection<TCell> {
  forEach(callback: (cell: TCell, index: number) => void ): void
  neighborsOf(cell: TCell): TCell[];
  set(index: number, cell: TCell): void;
  get(index: number): TCell;
  clone(): ICollection<TCell>;
  toArray(): TCell[];
}

export interface IFactory<TCellType> {
  for( identifier: Symbol | string ): TCellType;
  random(): TCellType;
}

export class CellularAutomata<
  TCellType, 
  TCell extends ICell<TCellType>, 
  TCollection extends ICollection<TCell>, 
  TCellTypeFactory extends IFactory<TCellType>
> {
  currentGeneration: TCollection;
  private factory: TCellTypeFactory;

  constructor( cells: TCollection, factory: TCellTypeFactory ) {
    this.currentGeneration = cells;
    this.factory = factory;
  }

  addRule( neighborType: TCellType, density: number, resultType: TCellType ) {

  }

  run( generations: number ) {
    for( let g = 0; g < generations; g++ ){
      const next = this.currentGeneration.clone() as TCollection;
      this.currentGeneration.forEach( (cell, index) => {
        const neighbors = this.currentGeneration.neighborsOf( cell );
        /** todo: apply rules */
        next.set( index, cell );
      });
      this.currentGeneration = next;
    }

    return this.currentGeneration.toArray();
  }
}