import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';

interface Point {
  x: number;
  y: number;
}

enum ViewingDirection {
  DOWN = 'DOWN',
  UP = 'UP',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

class TreeHeightMap {
  public mapSize: { x: number; y: number };

  private constructor(private _mapData: Uint8Array[]) {
    this.mapSize = { x: _mapData[0].length, y: _mapData.length };
  }

  static fromString(value: string) {
    const map: Uint8Array[] = [];

    for (let line of value.split('\n')) {
      if (!line) continue;

      map.push(Uint8Array.from(line.split('').map((v) => parseInt(v))));
    }

    return new TreeHeightMap(map);
  }

  private pointIsOnMap({ x, y }: Point) {
    return x >= 0 && x < this.mapSize.x && y >= 0 && y < this.mapSize.y;
  }

  private pointIsOnEdge({ x, y }: Point) {
    return (
      x === 0 || y === 0 || x === this.mapSize.x - 1 || y === this.mapSize.y - 1
    );
  }

  private valueAt({ x, y }: Point) {
    return this._mapData[y][x];
  }

  treeIsVisibleFromAnyEdge(point: Point) {
    if (!this.pointIsOnMap(point))
      throw Error(
        `Attempted to access point outside of map! (Coordinates: ${point.x},${point.y})`
      );

    // Points on the edge will always be visible
    if (this.pointIsOnEdge(point)) return true;

    // Check if point is visible in any direction
    return Object.values(ViewingDirection).some((direction) =>
      this.treeIsVisibleFromEdge(point, direction)
    );
  }

  private treeIsVisibleFromEdge(
    point: Point,
    viewingDirection: ViewingDirection
  ) {
    let startX: number = point.x;
    let endX: number = point.x + 1;
    let startY: number = point.y;
    let endY: number = point.y + 1;

    switch (viewingDirection) {
      case ViewingDirection.DOWN:
        // Compare points on y axis from top edge to point
        startY = 0;
        endY = point.y;
        break;
      case ViewingDirection.UP:
        // Compare points on y axis from point to bottom edge
        startY = point.y + 1;
        endY = this.mapSize.y;
        break;
      case ViewingDirection.RIGHT:
        // Compare points on x axis from left edge to point
        startX = 0;
        endX = point.x;
        break;
      case ViewingDirection.LEFT:
        // Compare points on x axis from point to right edge
        startX = point.x + 1;
        endX = this.mapSize.x;
        break;
    }

    const treeSizeAtPoint = this.valueAt(point);
    // Check if any tree between the point and the edge is equal
    // in height or larger that the the tree at the point
    for (let cy = startY; cy < endY; ++cy) {
      for (let cx = startX; cx < endX; ++cx) {
        if (this.valueAt({ x: cx, y: cy }) >= treeSizeAtPoint) {
          return false;
        }
      }
    }

    // Couldn't find a larger tree -> tree at point is visible from edge
    return true;
  }

  calcScenicScoreForPoint(point: Point) {
    if (!this.pointIsOnMap(point))
      throw Error(
        `Attempted to access point outside of map! (Coordinates: ${point.x},${point.y})`
      );

    return Object.values(ViewingDirection).reduce<number>(
      (acc, direction) => acc * this.treesVisibleInDirection(point, direction),
      1
    );
  }

  private treesVisibleInDirection(
    point: Point,
    viewingDirection: ViewingDirection
  ) {
    const treeSizeAtPoint = this.valueAt(point);
    let visibleTrees = 0;

    switch (viewingDirection) {
      case ViewingDirection.UP:
        for (let y = point.y - 1; y >= 0; --y) {
          ++visibleTrees;

          if (this.valueAt({ x: point.x, y }) >= treeSizeAtPoint) {
            break;
          }
        }
        break;
      case ViewingDirection.DOWN:
        for (let y = point.y + 1; y < this.mapSize.x; ++y) {
          ++visibleTrees;

          if (this.valueAt({ x: point.x, y }) >= treeSizeAtPoint) {
            break;
          }
        }
        break;
      case ViewingDirection.LEFT:
        for (let x = point.x - 1; x >= 0; --x) {
          ++visibleTrees;

          if (this.valueAt({ x, y: point.y }) >= treeSizeAtPoint) {
            break;
          }
        }
        break;
      case ViewingDirection.RIGHT:
        for (let x = point.x + 1; x < this.mapSize.x; ++x) {
          ++visibleTrees;

          if (this.valueAt({ x, y: point.y }) >= treeSizeAtPoint) {
            break;
          }
        }
        break;
    }

    return visibleTrees;
  }
}

export default class DoorEight extends AbstractDoor {
  public async run() {
    console.log(
      'Example part 1:',
      await this.runPart1OnMap('./example-input.txt'),
      '\n'
    );

    // ##### PART 1
    Logger.partHeader(1);
    console.log(await this.runPart1OnMap('./input.txt'));

    console.log();
    console.log(
      'Example part 2:',
      await this.runPart2OnMap('./example-input.txt'),
      '\n'
    );

    // ##### PART 2
    Logger.partHeader(2);
    console.log(await this.runPart2OnMap('./input.txt'));
  }

  private async runPart1OnMap(mapFile: string) {
    const input = await this.readFile(join(__dirname, mapFile));
    const map = TreeHeightMap.fromString(input);

    const { x: mapSizeX, y: mapSizeY } = map.mapSize;

    // Check for every position if it is visible from the edge
    const treesVisibleFromOutsideTheGrid = [];
    for (let cy = 0; cy < mapSizeY; ++cy) {
      for (let cx = 0; cx < mapSizeX; ++cx) {
        const point = { x: cx, y: cy };

        if (map.treeIsVisibleFromAnyEdge(point)) {
          treesVisibleFromOutsideTheGrid.push(point);
        }
      }
    }

    return treesVisibleFromOutsideTheGrid.length;
  }

  private async runPart2OnMap(mapFile: string) {
    const input = await this.readFile(join(__dirname, mapFile));
    const map = TreeHeightMap.fromString(input);

    const { x: mapSizeX, y: mapSizeY } = map.mapSize;

    // Check for every position if it is visible from the edge
    const scenicScoreOfTrees = [];
    for (let cy = 0; cy < mapSizeY; ++cy) {
      for (let cx = 0; cx < mapSizeX; ++cx) {
        const scenicScore = map.calcScenicScoreForPoint({ x: cx, y: cy });

        scenicScoreOfTrees.push(scenicScore);
      }
    }

    return Math.max(...scenicScoreOfTrees);
  }
}
