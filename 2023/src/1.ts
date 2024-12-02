import { resolve } from 'path';
import { sum } from './shared/math.util';
import { wordIsAtPosition } from './shared/string.util';

// Load Input
const rawTextData = await Bun.file(
  resolve(import.meta.path, '../input/1.txt')
).text();
const lines = rawTextData.split('\n');

// Part 1
function getCalibrationValue(line: string): number {
  let leftPointer = 0;
  let rightPointer = line.length - 1;

  while (Number.isNaN(Number(line[leftPointer]))) {
    leftPointer++;
  }

  while (Number.isNaN(Number(line[rightPointer]))) {
    rightPointer--;
  }

  return Number(line[leftPointer] + line[rightPointer]);
}

const calibrationValues = lines.map((line) => getCalibrationValue(line));
console.log('Solution Day 1 Part 1:', sum(calibrationValues));

// Part 2
const wordToNumberMap: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};
const wordNumberPairs = Object.entries(wordToNumberMap);
function getCalibrationValueV2(line: string) {
  function getValueAtPointer(pointer: number) {
    const valueAsInt = Number(line[pointer]);
    if (!Number.isNaN(valueAsInt)) {
      return valueAsInt;
    }

    for (const [word, number] of wordNumberPairs) {
      if (wordIsAtPosition(line, word, pointer)) {
        return number;
      }
    }

    return undefined;
  }

  let leftPointer = 0;
  let leftValue: number | undefined;

  do {
    leftValue = getValueAtPointer(leftPointer);
    leftPointer++;
  } while (leftValue === undefined);

  let rightPointer = line.length - 1;
  let rightValue: number | undefined;
  do {
    rightValue = getValueAtPointer(rightPointer);
    rightPointer--;
  } while (rightValue === undefined);

  return leftValue * 10 + rightValue;
}
const calibrationValuesV2 = lines.map((line) => getCalibrationValueV2(line));
console.log('Solution Day 1 Part 2:', sum(calibrationValuesV2));
