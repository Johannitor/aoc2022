export class Point {
  constructor(public x: number, public y: number) {}

  distanceTo(otherPoint: Point) {
    return Math.sqrt(
      (this.x - otherPoint.x) ** 2 + (this.y - otherPoint.y) ** 2
    );
  }
}
