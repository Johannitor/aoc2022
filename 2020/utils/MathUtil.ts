export class MathUtil {
  static sum(...items: number[]): number {
    let output = 0;
    for(let item of items) {
      output += item;
    }
    return output;
  }

  static product(...items: number[]): number {
    let output = 1;
    for(let item of items) {
      output *= item;
    }
    return output;
  }
}
