interface Point {
  x: number;
  y: number;
}

export class Screen {
  _data: string[][] = [];

  get data() {
    return this._data.map((row) => [...row]);
  }

  private stringifyData(data: string[][]) {
    return data.map((row) => row.join('')).join('\n');
  }

  toString() {
    return this.stringifyData(this._data);
  }

  toResizedString() {
    const data = this.data;

    const linesToRemoveFromTop =
      data.findIndex(
        (row) => !row.some((item) => item === this.backgroundTile)
      ) - 1;
    if (linesToRemoveFromTop > 0) data.splice(0, linesToRemoveFromTop);

    let linesToRemoveFromLeft = 0;
    for (let i = 0; i < data[0].length; ++i) {
      if (data.some((row) => row[i] !== this.backgroundTile)) {
        linesToRemoveFromLeft = i - 1;
        break;
      }
    }

    if (linesToRemoveFromLeft > 0)
      data.forEach((row) => row.splice(0, linesToRemoveFromLeft));

    // Right and bottom are not needed as we grow in these directions

    return this.stringifyData(data);
  }

  constructor(private backgroundTile: string = '.') {}

  drawAt(point: Point, char: string) {
    this.expandToFit(point);

    this._data[point.y][point.x] = char;
  }

  private expandToFit(point: Point) {
    const width = this._data[0]?.length || 0;
    const height = this._data.length;

    if (point.y > height - 1) {
      const missingTiles = point.y - height + 2;
      const row = Array.from({ length: width }, () => this.backgroundTile);

      this._data.push(...Array.from({ length: missingTiles }, () => [...row]));
    }

    if (point.x > width - 1) {
      const missingTiles = point.x - width + 2;
      const newItems = Array.from(
        { length: missingTiles },
        () => this.backgroundTile
      );

      for (const row of this._data) {
        row.push(...newItems);
      }
    }
  }
}
