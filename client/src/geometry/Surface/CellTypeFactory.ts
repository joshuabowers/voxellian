import { CellType, ICellType } from './CellType';

function isString(x: any): x is string {
  return typeof x === "string";
}

export class CellTypeFactory {
  private cellTypes: Map<Symbol, CellType>;
  private distribution: Map<number, Symbol>;

  constructor( cellTypes: ICellType[] ) {
    this.cellTypes = new Map<Symbol, CellType>();
    cellTypes.forEach( cellType => this.addCellType( cellType ) );
    this.distribution = this.calculateDistribution();
  }

  private addCellType( props: ICellType ) {
    const cellType = new CellType( props );
    this.cellTypes.set( cellType.id, cellType );
  }

  private calculateDistribution() {
    const distribution = new Map<number, Symbol>();
    const sortedTypes = [...this.cellTypes.values()].sort((a,b) => {
      return a.occurrenceRate - b.occurrenceRate;
    });

    let sum = 0;
    this.cellTypes.forEach(cellType => {
      sum += cellType.occurrenceRate;
    });
    sortedTypes.forEach(cellType => {
      distribution.set( cellType.occurrenceRate / sum, cellType.id )
    })

    return distribution;
  }

  for( identifier: Symbol | string ) {
    const id = isString(identifier) ? Symbol.for( identifier ) : identifier
    return this.cellTypes.get(id);
  }

  random() {
    const randomValue = Math.random();
    let selected: Symbol | undefined;
    let last = 0, sum = 0;;
    
    for( const likelihood of this.distribution.keys() ){
      last = likelihood;
      sum += likelihood;
      if( randomValue < sum ) {
        selected = this.distribution.get(likelihood);
        break;
      }
    }
    
    if( !selected ){ selected = this.distribution.get(last); }
    if( !selected ){ throw new Error('Should not occur: undefined when attempting to get random value.'); }
    const result = this.cellTypes.get(selected);
    if( !result ) { throw new Error(`missing CellType for id: ${selected}`)};
    return result;
  }
}
