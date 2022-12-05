export function checkIfNumberIsSumOfTwoNumbersInArray(number: number, array: number[]): boolean {
  const length = array.length;

  for (let i = 0; i < length; i++) {
    for (let j = i; j < length; j++) {
      if (array[i] + array[j] === number) {
        return true;
      }
    }
  }

  return false;
}
