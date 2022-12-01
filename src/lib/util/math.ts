export namespace MathUtil {
  export function sum(...values: number[]) {
    return values.reduce((value, acc) => acc + value, 0);
  }
}
