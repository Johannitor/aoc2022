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
  private head = new Point(0, 0);
  private tail = new Point(0, 0);

  // Visited points will be stored as strings as Typescript does not support a custom equals method :(
  private visitedPoints = new Set<string>();

  moveHead(movement: Movement) {
    for (let i = 0; i < movement.amount; ++i) {
      switch (movement.direction) {
        case Direction.UP:
          --this.head.y;
          break;

        case Direction.RIGHT:
          ++this.head.x;
          break;

        case Direction.DOWN:
          ++this.head.y;
          break;

        case Direction.LEFT:
          --this.head.x;
          break;
      }

      this.updateTailPosition();
    }
  }

  updateTailPosition() {
    const dx = this.head.x - this.tail.x;
    const dy = this.head.y - this.tail.y;

    if (Math.abs(dx) > 1) {
      this.tail.y = this.head.y;

      this.tail.x += dx > 0 ? 1 : -1;
    } else if (Math.abs(dy) > 1) {
      this.tail.x = this.head.x;

      this.tail.y += dy > 0 ? 1 : -1;
    }

    this.visitedPoints.add(this.tail.toString());
  }

  visitedPointsCount() {
    return this.visitedPoints.size;
  }
}

export default class DoorNine extends AbstractDoor {
  public async run() {
    // ##### PART 1
    Logger.partHeader(1);
    console.log(await this.runPart1('./input.txt'));

    // ##### PART 2
    Logger.partHeader(2);
    console.log('TODO');
  }

  async runPart1(file: string) {
    const movements: Movement[] = [];
    for await (const line of this.readFileByLineInterator(
      join(__dirname, file)
    )) {
      movements.push(Movement.fromString(line));
    }

    const map = new Map();
    movements.forEach((movement) => {
      map.moveHead(movement);
    });

    return map.visitedPointsCount();
  }
}
