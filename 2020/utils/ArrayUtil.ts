export class ArrayUtil {
  static repeatToArray<T>(value: T, times: number): T[] {
    return new Array(times).fill(value);
  }

  static getLastItem<T>(array: T[]): T {
    if (!array.length) {
      return null;
    }

    return array[array.length - 1];
  }
}
