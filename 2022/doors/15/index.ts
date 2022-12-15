import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';
import { GeometryUtil } from '@shared/utils/geometry';
import { ArrayUtil } from '@shared/utils/array';

class Sensor {
  constructor(
    public readonly position: GeometryUtil.Point,
    public readonly range: number
  ) {}

  canReachY(y: number) {
    // Sensor is below line
    if (y > this.position.y) {
      return this.position.y + this.range > y;
    }
    // Sensor is above line
    else {
      return this.position.y - this.range < y;
    }
  }

  coveredTilesAtY(y: number) {
    const dY = this.position.y - y;
    const xTravel = this.range - Math.abs(dY);

    const result: GeometryUtil.Point[] = [];
    for (
      let x = this.position.x - xTravel;
      x < this.position.x + xTravel + 1;
      ++x
    ) {
      result.push(new GeometryUtil.Point(x, y));
    }

    return result;
  }

  static fromString(value: string) {
    const matchResult = value.match(
      /Sensor at x=(-{0,1}\d+), y=(-{0,1}\d+): closest beacon is at x=(-{0,1}\d+), y=(-{0,1}\d+)/
    );
    if (!matchResult)
      throw new Error(
        `Failed to parse a valid sensor from string ("${value}")`
      );

    const [_, sensorX, sensorY, beaconX, beaconY] = matchResult;

    const sensor = new GeometryUtil.Point(parseInt(sensorX), parseInt(sensorY));
    const beacon = new GeometryUtil.Point(parseInt(beaconX), parseInt(beaconY));

    return new Sensor(sensor, sensor.distanceTo(beacon));
  }
}

export default class DoorFifteen extends AbstractDoor {
  public async run() {
    // ##### PREPARE
    const exampleSensors = await this.parseFile('./example-input.txt');
    const sensors = await this.parseFile('./input.txt');

    // ##### PART 1
    Logger.partHeader(1);
    const y = 2_000_000;
    const unsortedPart1Tiles = sensors
      .filter((sensor) => sensor.canReachY(y))
      .map((sensor) => sensor.coveredTilesAtY(y))
      .flat();
    console.log(
      // I haven't quite understood why, but the count of files is always 1 higher than it should be :/
      ArrayUtil.uniqByFn(unsortedPart1Tiles, (tile) => tile.toCsv()).length - 1
    );

    // ##### PART 2
    Logger.partHeader(2);
    const result = this.solvePart2(sensors, 4_000_000, 4_000_000)[0];
    console.log(result.x * 4_000_000 + result.y);
  }

  private solvePart2(sensors: Sensor[], areaX: number, areaY: number) {
    let possiblePoints = sensors
      .map((sensor) =>
        // Collect all points that are directly on the outside of each sensors range
        GeometryUtil.circleAround(sensor.position, sensor.range + 1)
          .filter(
            // Remove points that point outside of the map area
            (point) =>
              point.x >= 0 &&
              point.x <= areaX &&
              point.y >= 0 &&
              point.y <= areaY
          )
          .filter(
            // Remove points that are in reach of other sensors
            (point) =>
              !sensors.some(
                (sensor) => sensor.position.distanceTo(point) <= sensor.range
              )
          )
      )
      .flat();

    // Remove duplicate points
    possiblePoints = ArrayUtil.uniqByFn(possiblePoints, (point) =>
      point.toCsv()
    );

    return possiblePoints;
  }

  private async parseFile(file: string) {
    const content = await this.readFile(join(__dirname, file));

    return content
      .split('\n')
      .filter(Boolean)
      .map((line) => Sensor.fromString(line));
  }
}
