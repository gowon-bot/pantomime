import e from "express";

export interface TileInput {
  rows?: number;
  columns?: number;
  truncate?: number;
  default?: any;
}

export type TiledArray<T> = T[][];

export class ArrayTiler<T> {
  tile(array: T[], input: TileInput = {}): TiledArray<T> {
    if (input.rows && input.columns) {
      return this.tileWithRowsAndColumns(array, input);
    } else if (input.rows) {
      return this.tileWithRows(array, input);
    } else if (input.columns) {
      return this.tileWithColumns(array, input);
    }

    return this.tileAutomatically(array, input);
  }

  private tileAutomatically(array: T[], input: TileInput): TiledArray<T> {
    const square = Math.ceil(Math.sqrt(array.length));

    return this.tileWithRowsAndColumns(array, {
      ...input,
      columns: square,
      rows: square,
    });
  }

  private tileWithRows(array: T[], input: TileInput): TiledArray<T> {
    const columns = Math.ceil(array.length / input.rows!);

    return this.tileWithRowsAndColumns(array, { ...input, columns });
  }

  private tileWithColumns(array: T[], input: TileInput): TiledArray<T> {
    const rows = Math.ceil(array.length / input.columns!);

    return this.tileWithRowsAndColumns(array, { ...input, rows });
  }

  private tileWithRowsAndColumns(array: T[], input: TileInput): TiledArray<T> {
    const tiledArray: TiledArray<T> = [];

    for (let row = 0; row < input.rows!; row++) {
      for (let column = 0; column < input.columns!; column++) {
        if (!tiledArray[row]) tiledArray[row] = [];

        if (column + row * input.columns! < array.length) {
          tiledArray[row][column] = array[column + row * input.columns!];
        } else if ("default" in input) {
          tiledArray[row][column] = input.default;
        }
      }
    }

    return tiledArray;
  }
}

export function printTiledArray(array: TiledArray<any>): void {
  console.table(array);
}
