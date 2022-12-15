import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';
import { ArrayUtil } from '@shared/utils/array';
import { GeometryUtil } from '@shared/utils/geometry';
import { Screen } from '@shared/lib/Screen';

class Point {
  constructor(public x: number, public y: number) {}

  static fromString(value: string) {
    const [x, y] = value.split(',').map((v) => Number(v));

    return new Point(x, y);
  }
}

abstract class Shape {
  abstract parts: Point[];

  abstract isPartOf(point: Point): boolean;
}

class RockShape implements Shape {
  parts: Point[];
  lowestPoint: Point;

  constructor(cornerPoints: Point[]) {
    this.parts = ArrayUtil.groupPairwise(cornerPoints)!
      .map(([point1, point2]) => {
        return [point1, ...GeometryUtil.plotLineBetween(point1, point2)];
      })
      .flat();
    this.parts.push(cornerPoints.at(-1)!);

    this.lowestPoint = ArrayUtil.maxByFn(cornerPoints, (point) => point.y);
  }

  isPartOf(point: Point) {
    return this.parts.some((p) => p.x === point.x && p.y === point.y);
  }
}

class FloorShape implements Shape {
  parts: Point[] = [];

  constructor(private yLevel: number) {}

  isPartOf(point: Point): boolean {
    return point.y === this.yLevel;
  }
}

class Sandbox {
  grainsOfSand: Point[] = [];

  constructor(public shapes: Shape[]) {}

  // returns false when grain settled and true when grain fell intro void
  addNewSandGrainUntil(until: (point: Point) => boolean): boolean {
    const sandGrain = new Point(500, 0);

    while (this.moveGrain(sandGrain)) {
      if (until(sandGrain)) return true;
    }

    this.grainsOfSand.push(sandGrain);

    return until(sandGrain);
  }

  addNewSandGrainsUntil(until: (point: Point) => boolean) {
    let sandGrains = 0;

    while (!this.addNewSandGrainUntil(until)) {
      ++sandGrains;
    }

    return sandGrains;
  }

  print() {
    const screen = new Screen();
    this.grainsOfSand.forEach((grain) => screen.drawAt(grain, 'o'));
    this.shapes.forEach((shape) =>
      shape.parts.forEach((part) => screen.drawAt(part, '#'))
    );

    console.log(screen.toResizedString());
  }

  // Returns true when grain could be moved and false when grain could not be moved
  private moveGrain(grain: Point): boolean {
    const nextYPos = grain.y + 1;

    // Try to move below
    if (this.canMoveTo({ x: grain.x, y: nextYPos })) {
      grain.y = nextYPos;
      return true;
    }

    // Try to move diagonal left
    if (this.canMoveTo({ x: grain.x - 1, y: nextYPos })) {
      grain.x -= 1;
      grain.y = nextYPos;
      return true;
    }

    // Try to move diagonal right
    if (this.canMoveTo({ x: grain.x + 1, y: nextYPos })) {
      grain.x += 1;
      grain.y = nextYPos;
      return true;
    }

    // Could not move :(
    return false;
  }

  private canMoveTo(position: Point) {
    return (
      !this.shapes.some((shape) => shape.isPartOf(position)) &&
      !this.grainsOfSand.some(
        (grain) => grain.x === position.x && grain.y === position.y
      )
    );
  }
}

export default class DoorFourteen extends AbstractDoor {
  public async run() {
    const exampleShapes = await this.readAndParseFile('./example-input.txt');
    const exampleVoidStartsAt = Math.max(
      ...exampleShapes.map((shape) => shape.lowestPoint.y)
    );

    // ##### PART 1
    const part1ExampleSandbox = new Sandbox(exampleShapes);
    console.log(
      'Example part1:',
      part1ExampleSandbox.addNewSandGrainsUntil(
        (point) => point.y > exampleVoidStartsAt
      ),
      '\n'
    );

    const shapes = await this.readAndParseFile('./input.txt');
    const voidStartsAt = Math.max(
      ...shapes.map((shape) => shape.lowestPoint.y)
    );

    Logger.partHeader(1);
    const part1Sandbox = new Sandbox(shapes);
    console.log(
      part1Sandbox.addNewSandGrainsUntil((point) => point.y > voidStartsAt)
    );

    // ##### PART 2
    const exampleFloor = new FloorShape(exampleVoidStartsAt + 2);
    const part2ExampleSandbox = new Sandbox([...exampleShapes, exampleFloor]);
    console.log(
      'Example part1:',
      part2ExampleSandbox.addNewSandGrainsUntil(
        (point) => point.x === 500 && point.y === 0
      ) + 1, // Add one as last grain of sand won't be counted
      '\n'
    );

    Logger.partHeader(2);
    const floor = new FloorShape(voidStartsAt + 2);
    const part2Sandbox = new Sandbox([...shapes, floor]);
    console.log(
      part2Sandbox.addNewSandGrainsUntil(
        (point) => point.x === 500 && point.y === 0
      ) + 1 // Add one as last grain of sand won't be counted
    );
  }

  async readAndParseFile(file: string) {
    const shapes: RockShape[] = [];

    for await (const line of this.readFileByLineInterator(
      join(__dirname, file)
    )) {
      const points = line
        .split(' -> ')
        .map((element) => Point.fromString(element));

      shapes.push(new RockShape(points));
    }

    return shapes;
  }
}
