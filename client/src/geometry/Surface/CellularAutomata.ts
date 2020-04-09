import { Vector3 } from "three";
import { profile } from 'utility/profile';

export interface ICell<TCellType> {
  type: TCellType;
  position: Vector3;
  clone( replacementType: TCellType ): ICell<TCellType>
}

export interface ICollection<TCell> {
  forEach(callback: (cell: TCell, index: number) => void ): void
  neighborsOf(cell: TCell): TCell[];
  set(index: number, cell: TCell): void;
  get(index: number): TCell;
  clone( copy?: boolean ): ICollection<TCell>;
  toArray(): TCell[];
  length(): number;
}

export interface IFactory<TCellType> {
  for( identifier: Symbol | string ): TCellType;
  random(): TCellType;
}

export interface ICellularAutomataRule<TCellType> {
  neighborType: TCellType;
  density: number;
  resultType: TCellType;
}

class Rule<TCellType> implements ICellularAutomataRule<TCellType> {
  neighborType: TCellType;
  density: number;
  resultType: TCellType;

  constructor( props: ICellularAutomataRule<TCellType> ) {
    this.neighborType = props.neighborType;
    this.density = props.density;
    this.resultType = props.resultType;
  }
}

export class CellularAutomata<
  TCellType, 
  TCell extends ICell<TCellType>, 
  TCollection extends ICollection<TCell>
> {
  currentGeneration: TCollection;
  private rules: Rule<TCellType>[];

  constructor( cells: TCollection, rules?: ICellularAutomataRule<TCellType>[] ) {
    this.currentGeneration = cells;
    this.rules = rules || new Array<Rule<TCellType>>();
  }

  addRule( neighborType: TCellType, density: number, resultType: TCellType ) {
    const rule = new Rule({ neighborType, density, resultType });
    this.rules.push( rule );
  }

  run( generations: number ) {
    console.log( 'Running automata for', generations, 'generations' );
    profile( 'All generations', () => {
      for( let g = 0; g < generations; g++ ){
        console.log( 'Current generation:', g );
        profile( `Generation ${g}`, () => {
          const next = profile( 'TCollection.clone', () => this.currentGeneration.clone( false ) as TCollection );
          const count = this.currentGeneration.length();
          for( let index = 0; index < count; index++ ){
            const cell = this.currentGeneration.get(index);
            // const neighbors = this.currentGeneration.neighborsOf( cell );
            const neighbors = new Array<TCell>();
            const densities = this.calculateDensities( neighbors );
            const replacementType = this.applyRules( cell, densities );
            const replacement = cell.clone( replacementType );
            next.set( index, replacement as TCell );
          }
          // this.currentGeneration.forEach( (cell, index) => {
          //   profile( `Cell[${index}]`, () => {
          //   } );
          // });
          this.currentGeneration = next;  
        } );
      }  
    } );

    return this.currentGeneration.toArray();
  }

  private calculateDensities( neighbors: TCell[] ) {
    const densities = new Map<TCellType, number>();

    neighbors.forEach( cell => {
      if( cell ) {
        const density = densities.get( cell.type ) || 0;
        densities.set( cell.type, density + 1 );  
      }
    } );

    return densities;
  }

  private applyRules( currentCell: TCell, densities: Map<TCellType, number> ) {
    let replacementType = currentCell.type;

    this.rules.forEach( rule => {
      const neighborDensity = densities.get( rule.neighborType )
      if( neighborDensity && neighborDensity > rule.density ) {
        replacementType = rule.resultType;
      }
    } );

    return replacementType;
  }
}