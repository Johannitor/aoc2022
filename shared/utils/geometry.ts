export namespace GeometryUtil {
  interface PointLike {
    x: number;
    y: number;
  }

  export class Point implements PointLike {
    constructor(public x: number, public y: number) {}

    // Calculates manhattan distance to other point
    distanceTo(other: PointLike) {
      return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    }

    toCsv(): string {
      return `${this.x},${this.y}`;
    }
  }

  export function plotLineBetween<T extends PointLike>(
    { x: startX, y: startY }: T,
    end: T
  ): PointLike[] {
    const { x: endX, y: endY } = end;
    const result: PointLike[] = [];

    for (let y = Math.min(startY, endY); y < Math.max(startY, endY) + 1; ++y) {
      for (
        let x = Math.min(startX, endX);
        x < Math.max(startX, endX) + 1;
        ++x
      ) {
        result.push({ x, y });
      }
    }
    // Remove start point from list
    result.shift();

    return result;
  }

  // NOTE: Radius is based on manhattan distance
  export function circleAround(point: PointLike, radius: number): Point[] {
    const result: Point[] = [];

    for (let dX = -radius; dX < radius + 1; ++dX) {
      const newX = point.x + dX;
      const dY = Math.abs(dX) - radius;

      // We're on the very far left or right side, so we just need to add one point
      if (!dY) {
        result.push(new Point(newX, point.y));
      } else {
        result.push(
          new Point(newX, point.y + dY),
          new Point(newX, point.y - dY)
        );
      }
    }

    return result;
  }
}
