import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';

class Map {
  constructor(
    public elevations: Uint8Array[],
    public startPosition: [number, number],
    public endPosition: [number, number]
  ) {}

  elevationAt([x, y]: [number, number]) {
    return this.elevations[y][x];
  }

  isOnMap([x, y]: [number, number]) {
    return (
      x >= 0 &&
      y >= 0 &&
      x < this.elevations[0].length &&
      y < this.elevations.length
    );
  }

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
    [toX, toY]: [number, number],
    map: Map
  ) {
    return this.getShortestRouteUntilConditionIsReached(
      from,
      map,
      ([x, y]) => x === toX && y === toY
    );
  }

  static getShortestRouteUntilConditionIsReached(
    start: [number, number],
    map: Map,
    condition: (point: [number, number]) => boolean,
    config: { maxUpwardsStepSize: number; maxDownwardsStepSize: number } = {
      maxDownwardsStepSize: Infinity,
      maxUpwardsStepSize: 1,
    }
  ) {
    const queue = new PriorityQueue<[number, number][]>();
    queue.enqueue(0, [start]);

    let whileLimit = 0;
    const alreadyVisitedPoints: [number, number][] = [];
    while (whileLimit < 100_000 && queue.hasNext) {
      const shortestPath = queue.dequeue()!;
      const headOfPath = shortestPath.at(-1)!;

      const [headX, headY] = headOfPath;

      // Are we at the goal?
      if (condition(headOfPath)) {
        return shortestPath;
      }

      // Create a point in every direction we can theoretically move
      const nextPointCandidates: [number, number][] = [
        [headX + 1, headY],
        [headX - 1, headY],
        [headX, headY + 1],
        [headX, headY - 1],
      ];

      const elevationAtHeadOfPath = map.elevationAt(headOfPath);
      for (const nextPointCandidate of nextPointCandidates) {
        const [x, y] = nextPointCandidate;

        // Skip points outside the map
        if (!map.isOnMap(nextPointCandidate)) {
          continue;
        }

        // Skip points with a too large elevation change
        const elevationAtCandidate = map.elevationAt(nextPointCandidate);
        const relativeElevation = elevationAtCandidate - elevationAtHeadOfPath;
        if (relativeElevation >= 0) {
          // We're going uphill
          if (relativeElevation > config.maxUpwardsStepSize) continue;
        } else {
          // We're going downhill
          if (Math.abs(relativeElevation) > config.maxDownwardsStepSize)
            continue;
        }

        // Skip already visited points
        if (
          alreadyVisitedPoints.some(
            ([pointX, pointY]) => pointX === x && pointY === y
          )
        ) {
          continue;
        }

        alreadyVisitedPoints.push([x, y]);

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
    const part2Result =
      NavigationSystem.getShortestRouteUntilConditionIsReached(
        map.endPosition,
        map,
        (point) => map.elevationAt(point) === 0,
        // We're plotting the reverse path from the top here, so we need to make sure that we flip our max elevation change restrictions
        // here, as the trail will be walked on in the other direction
        { maxDownwardsStepSize: 1, maxUpwardsStepSize: Infinity }
      );
    console.log(
      'Amount of steps required to reach a square at elevation "a" from the peak is:',
      part2Result?.length! - 1
    );
  }
}
