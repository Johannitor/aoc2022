import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';

class Map {
  constructor(
    public elevations: Uint8Array[],
    public startPosition: [number, number],
    public endPosition: [number, number]
  ) {}

  static fromLines(lines: string[]) {
    const elevations: Uint8Array[] = [];
    let startPosition: [number, number] | undefined;
    let endPosition: [number, number] | undefined;

    for (let y = 0; y < lines.length; ++y) {
      const line = lines[y];
      const parsedRow = new Uint8Array(line.length);

      for (let x = 0; x < line.length; ++x) {
        let point = line[x];

        if (point === 'S') {
          startPosition = [x, y];
          point = 'a';
        } else if (point === 'E') {
          endPosition = [x, y];
          point = 'z';
        }

        parsedRow[x] = point.charCodeAt(0) - 'a'.charCodeAt(0);
      }

      elevations.push(parsedRow);
    }

    if (!startPosition || !endPosition)
      throw Error('Did not find start or end point in map!');

    return new Map(elevations, startPosition, endPosition);
  }
}

class PriorityQueue<T> {
  private storage: [number, T][] = [];

  get hasNext() {
    return !!this.storage.length;
  }

  toString() {
    return this.storage
      .map(([prio, value]) => `[${prio}] ${String(value)}`)
      .join('; ');
  }

  enqueue(priority: number, item: T) {
    this.storage.push([priority, item]);

    if (this.storage.length > 1) {
      this.storage.sort(([a], [b]) => a - b);
    }
  }

  dequeue(): T | undefined {
    if (!this.storage.length) return undefined;

    return this.storage.shift()![1];
  }
}

class NavigationSystem {
  static getShortestRouteBetween(
    from: [number, number],
    to: [number, number],
    map: Map
  ) {
    const queue = new PriorityQueue<[number, number][]>();
    queue.enqueue(0, [from]);

    let whileLimit = 0;
    const visitedPoints: [number, number][] = [];
    while (whileLimit < 100_000 && queue.hasNext) {
      const shortestPath = queue.dequeue()!;
      const headOfPath = shortestPath.at(-1)!;

      const [headX, headY] = headOfPath;

      // Are we at the goal?
      if (headX === to[0] && headY === to[1]) {
        return shortestPath;
      }

      // Create a point in every direction we can theoretically move
      const possibleSurroundingPoints = [
        [headX + 1, headY],
        [headX - 1, headY],
        [headX, headY + 1],
        [headX, headY - 1],
      ];

      const elevationAtLastPoint = map.elevations[headY][headX];
      for (const [x, y] of possibleSurroundingPoints) {
        // Skip points outside the map
        if (
          x < 0 ||
          y < 0 ||
          x >= map.elevations[0].length ||
          y >= map.elevations.length
        ) {
          continue;
        }

        // Skip points with a too large elevation change
        const elevationAtPoint = map.elevations[y][x];
        const relativeElevation = elevationAtPoint - elevationAtLastPoint;
        if (relativeElevation > 1) {
          continue;
        }

        // Skip already visited points
        if (
          visitedPoints.some(([pointX, pointY]) => pointX === x && pointY === y)
        ) {
          continue;
        }

        visitedPoints.push([x, y]);

        const pathWithNewPoint: [number, number][] = [...shortestPath, [x, y]];
        queue.enqueue(pathWithNewPoint.length, pathWithNewPoint);
      }
    }
  }
}

export default class DoorTwelve extends AbstractDoor {
  public async run() {
    // ##### PREPARE
    const exampleMap = Map.fromLines(
      (await this.readFile(join(__dirname, './example-input.txt')))
        .split('\n')
        .filter(Boolean)
    );
    const map = Map.fromLines(
      (await this.readFile(join(__dirname, './input.txt')))
        .split('\n')
        .filter(Boolean)
    );

    // ##### PART 1
    Logger.partHeader(1);
    const part1Result = NavigationSystem.getShortestRouteBetween(
      map.startPosition,
      map.endPosition,
      map
    );
    console.log(
      'Amount of steps required to reach goal on shortest path:',
      part1Result?.length! - 1
    );

    // ##### PART 2
    Logger.partHeader(2);
    console.log('TODO');
  }
}
