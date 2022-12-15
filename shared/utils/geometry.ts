export namespace GoemetryUtil {
  interface PointLike {
    x: number;
    y: number;
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
}
