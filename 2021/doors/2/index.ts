import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';
import { red } from 'colorette';

enum MovementDirection {
  FORWARD = 'forward',
  DOWN = 'down',
  UP = 'up',
}

function isMovementDirection(value: any): value is MovementDirection {
  return Object.values(MovementDirection).includes(value);
}

class Ship {
  public horizontalPosition: number = 0;
  public depth: number = 0;

  move(direction: MovementDirection, amount: number) {
    switch (direction) {
      case MovementDirection.FORWARD:
        this.horizontalPosition += amount;
        break;

      case MovementDirection.UP:
        this.depth -= amount;
        break;

      case MovementDirection.DOWN:
        this.depth += amount;
        break;
    }
  }
}

class Part2Ship extends Ship {
  public aim: number = 0;

  override move(direction: MovementDirection, amount: number) {
    switch (direction) {
      case MovementDirection.FORWARD:
        this.horizontalPosition += amount;
        this.depth += this.aim * amount;
        break;

      case MovementDirection.UP:
        this.aim -= amount;
        break;

      case MovementDirection.DOWN:
        this.aim += amount;
        break;
    }
  }
}

export default class DoorTwo extends AbstractDoor {
  public async run() {
    const movementInstructions: [MovementDirection, number][] = [];
    // ##### PREPARE
    for await (const line of this.readFileByLineInterator(
      join(__dirname, './input.txt')
    )) {
      const [direction, amount] = line.split(' ');

      if (!isMovementDirection(direction))
        throw new Error(
          `Encountered unkown direction to move in: ${direction}`
        );

      movementInstructions.push([direction, parseInt(amount)]);
    }

    // ##### PART 1
    Logger.partHeader(1);
    const part1Ship = new Ship();
    movementInstructions.forEach(([direction, amount]) =>
      part1Ship.move(direction, amount)
    );
    console.log(
      `After following all instructions, the ship has a horizontal position of ${red(
        this.formatInt(part1Ship.horizontalPosition)
      )} and a depth of ${red(this.formatInt(part1Ship.horizontalPosition))}`
    );
    console.log('Result: ', part1Ship.horizontalPosition * part1Ship.depth);

    // ##### PART 2
    Logger.partHeader(2);
    const part2Ship = new Part2Ship();
    movementInstructions.forEach(([direction, amount]) =>
      part2Ship.move(direction, amount)
    );
    console.log(
      `After following all instructions, the ship has a horizontal position of ${red(
        this.formatInt(part2Ship.horizontalPosition)
      )} and a depth of ${red(this.formatInt(part2Ship.horizontalPosition))}`
    );
    console.log('Result: ', part2Ship.horizontalPosition * part2Ship.depth);
  }
}
