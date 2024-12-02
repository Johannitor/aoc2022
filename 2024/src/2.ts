import { resolve } from 'path';

// Load Input
const rawTextData = await Bun.file(
  resolve(import.meta.path, '../input/2.txt')
).text();
const lines = rawTextData.trim().split('\n');

const reports = lines.map((line) =>
  line.split(' ').map((level) => Number(level))
);

// Functions

function compareAdjacentLevels(
  level1: number,
  level2: number,
  reportNumbersAreAscending: boolean
) {
  // Check if step size is at least one or at most three
  const distanceBetweenLevels = Math.abs(level1 - level2);
  if (distanceBetweenLevels < 1 || distanceBetweenLevels > 3) {
    return false;
  }

  // Check if levels are following the order fo the whole report
  if (reportNumbersAreAscending) {
    if (level1 >= level2) {
      return false;
    }
  } else {
    if (level1 <= level2) {
      return false;
    }
  }

  return true;
}

function areReportNumbersAscending(report: number[]) {
  let upSteps = 0;
  let downSteps = 0;

  const halfReportSize = Math.ceil(report.length / 2);

  for (let i = 1; i < report.length; i++) {
    const l = report[i - 1];
    const r = report[i];

    if (l < r) {
      upSteps++;
    } else {
      downSteps++;
    }

    // Exit early when either half of the array are either up or down steps already
    if (upSteps > halfReportSize || downSteps > halfReportSize) {
      break;
    }
  }

  return upSteps > downSteps;
}

function reportIsSafePart(report: number[], maxBadLevels: number) {
  const reportNumbersAreAscending = areReportNumbersAscending(report);
  let badLevels = 0;
  let leftCursor = 0;
  let rightCursor = 1;

  while (rightCursor < report.length) {
    // Check if the levels are within spec
    if (
      compareAdjacentLevels(
        report[leftCursor],
        report[rightCursor],
        reportNumbersAreAscending
      )
    ) {
      // When they are: move left cursor to the position of the right cursor and advance right cursor
      leftCursor = rightCursor;
      rightCursor++;
    } else {
      // When they are not:
      // In crease bad level amount and abort when threshhold is exceeded
      badLevels++;
      if (badLevels > maxBadLevels) {
        return false;
      }

      // Check if the levels are good when we skip one value to the right
      if (
        compareAdjacentLevels(
          report[leftCursor],
          report[rightCursor + 1],
          reportNumbersAreAscending
        )
      ) {
        rightCursor++;
        continue;
      }

      // Check if the levels are good when we skip one value to the left
      if (
        compareAdjacentLevels(
          report[leftCursor - 1],
          report[rightCursor],
          reportNumbersAreAscending
        )
      ) {
        leftCursor--;
        continue;
      }

      return false;
    }
  }

  return true;
}

// # Part 1
let part1SafeReports = 0;
for (const report of reports) {
  if (reportIsSafePart(report, 0)) {
    part1SafeReports++;
  }
}
console.log(`Part 1: ${part1SafeReports} reports are safe`);

// # Part 2
let part2SafeReports = 0;
for (const report of reports) {
  if (reportIsSafePart(report, 1)) {
    part2SafeReports++;
  }
}
console.log(`Part 2: ${part2SafeReports} reports are safe`);
