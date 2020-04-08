import { ICollection } from "./CellularAutomata";
import { HexCell } from "./HexCell";
import { extendHex, defineGrid, Grid, Hex } from 'honeycomb-grid';
import { CellTypeFactory } from "./CellTypeFactory";
import { Vector3 } from "three";

export class HexagonalCollection implements ICollection<HexCell> {
  private static Hex = extendHex<HexCell>();
  private static Grid = defineGrid(HexagonalCollection.Hex);

  private grid: Grid<Hex<HexCell>>;
  radius: number;
  cellTypeFactory: CellTypeFactory;

  constructor( radius: number, factory: CellTypeFactory, original?: Grid<Hex<HexCell>> ) {
    this.radius = radius;
    this.cellTypeFactory = factory;
    if( original ){
      this.grid = original;
    } else {
      this.grid = HexagonalCollection.Grid.hexagon({ 
        radius,
        onCreate: hex => { 
          const point = hex.toPoint();
          hex.type = factory.random();
          hex.position = new Vector3(point.x, 0, point.y);
        }
      });    
    }
  }

  forEach( callback: (cell: HexCell, index: number) => void ) {
    this.grid.forEach( (cell, index) => 
      callback( this.convertHexToCell( cell ), index ) 
    );
  }

  neighborsOf( cell: HexCell ) {
    return this.grid.neighborsOf( this.convertCellToHex( cell ) );
  }

  set( index: number, cell: HexCell ) {
    this.grid.set(index, this.convertCellToHex( cell ))
  }

  get( index: number ) {
    return this.grid.get(index) as HexCell;
  }

  clone( copy?: boolean ) {
    const copied = copy ? HexagonalCollection.Grid(this.grid) : HexagonalCollection.Grid();
    return new HexagonalCollection(this.radius, this.cellTypeFactory, copied);
  }

  toArray() {
    const result = new Array<HexCell>();
    this.forEach( cell => result.push( cell ) );
    return result;
  }

  private convertHexToCell( hex: Hex<HexCell> ) {
    return new HexCell(hex.type, hex.position);
  }

  private convertCellToHex( cell: HexCell ) {
    return HexagonalCollection.Hex(cell.position.x, cell.position.z, cell);
  }
}