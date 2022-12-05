export class ValueUtil {
  static toggleBetween<T extends {
    [id: number]: string
  }>(
    value: T,
    valueOne: T,
    valueTwo: T
  ): T {
    if (value === valueOne) {
      return valueTwo;
    } else {
      return valueOne;
    }
  }
}
