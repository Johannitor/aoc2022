export function mapContinuousOnesToCombinationAmount(ones: number) {
  switch (ones) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 4;
    case 4:
      return 7;
    default:
      throw new Error(`${ones} amount of ones was not implemented...`)
  }
}
