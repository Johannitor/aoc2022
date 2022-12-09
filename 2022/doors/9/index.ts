import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';

class Point {
  constructor(public x: number, public y: number) {}

  static fromString(value: string) {
    const [x, y] = value.split(',');

    return new Point(parseInt(x), parseInt(y));
  }

  toString() {
    return this.x + ',' + this.y;
  }
}

enum Direction {
  UP = 'U',
  DOWN = 'D',
  LEFT = 'L',
  RIGHT = 'R',
}
function isDirection(value: any): value is Direction {
  return Object.values(Direction).includes(value);
}

class Movement {
  constructor(public direction: Direction, public amount: number) {}

  static fromString(value: string) {
    const [direction, amount] = value.split(' ');

    if (!isDirection(direction))
      throw Error(`Encountered unknown direction: ${direction}`);

    return new Movement(direction, parseInt(amount));
  }
}

class Map {
  public knots: Point[];

  constructor(knotCount: number) {
    this.knots = Array.from({ length: knotCount }, () => new Point(0, 0));
  }

  // Visited points will be stored as strings as Typescript does not support a custom equals method :(
  private visitedPoints = new Set<string>();

  moveHead(movement: Movement) {
    const head = this.knots[0];

    for (let i = 0; i < movement.amount; ++i) {
      switch (movement.direction) {
        case Direction.UP:
          --head.y;
          break;

        case Direction.RIGHT:
          ++head.x;
          break;

        case Direction.DOWN:
          ++head.y;
          break;

        case Direction.LEFT:
          --head.x;
          break;
      }

      this.updateTailPosition(1);
    }
  }

  updateTailPosition(knotIndex: number) {
    const currentKnot = this.knots[knotIndex];
    const previousKnot = this.knots[knotIndex - 1];

    const dx = previousKnot.x - currentKnot.x;
    const dy = previousKnot.y - currentKnot.y;

    if (Math.abs(dx) > 1 && Math.abs(dy) > 1) {
      currentKnot.x += dx > 0 ? 1 : -1;
      currentKnot.y += dy > 0 ? 1 : -1;
    } else if (Math.abs(dx) > 1) {
      currentKnot.y = previousKnot.y;

      currentKnot.x += dx > 0 ? 1 : -1;
    } else if (Math.abs(dy) > 1) {
      currentKnot.x = previousKnot.x;

      currentKnot.y += dy > 0 ? 1 : -1;
    }

    if (knotIndex === this.knots.length - 1) {
      this.visitedPoints.add(currentKnot.toString());
    } else {
      this.updateTailPosition(knotIndex + 1);
    }
  }

  visitedPointsCount() {
    return this.visitedPoints.size;
  }
}

export default class DoorNine extends AbstractDoor {
  public async run() {
    // ##### PART 1
    Logger.partHeader(1);
    console.log(await this.runPart1('./input.txt', 2));

    // ##### PART 2
    Logger.partHeader(2);
    console.log(await this.runPart1('./input.txt', 10));
  }

  private async runPart1(file: string, knotCount: number) {
    const movements: Movement[] = [];
    for await (const line of this.readFileByLineInterator(
      join(__dirname, file)
    )) {
      movements.push(Movement.fromString(line));
    }

    const map = new Map(knotCount);
    movements.forEach((movement) => {
      map.moveHead(movement);
    });

    return map.visitedPointsCount();
  }
}
