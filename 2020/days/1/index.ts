import { puzzleInput } from './puzzle-1-input.const';
import { findValuePairsForCondition } from './functions';
import { MathUtil } from '../../utils/MathUtil';

console.log('### Advent of Code 2020 - Day 1: Report Repair ###', '\n');
console.log('>>> Part 1');

const expenseReportNumbers = puzzleInput;
const expectedSum = 2020;

console.log(`* Searching for 2 numbers that sum up to ${2020}...`);

const number = findValuePairsForCondition(
  expenseReportNumbers,
  expenseReportNumbers,
  (a, b) => MathUtil.sum(a, b) === expectedSum,
  {
    limit: 1,
    arraysAreEqual: true
  }
);
console.log(`Found matching pair!`);
console.log('Product of both numbers:', MathUtil.product(...number[0]));


console.log();
console.log('>>> Part 2');

console.log(`* Searching for 3 numbers that sum up to ${2020}...`);

console.log(`- Step 1: Find all pairs of numbers that sum up to less than ${2020}...`);
const candidatesUnderGoal = findValuePairsForCondition(
  expenseReportNumbers,
  expenseReportNumbers,
  (a, b) => (a + b) < expectedSum,
  {
    arraysAreEqual: true
  }
);
console.log(`Found ${candidatesUnderGoal.length} matching pairs`);

console.log(`- Step 2: Find a third number that will sum up to ${2020} with the first two ones...`);
const tripletCandidates = findValuePairsForCondition(
  candidatesUnderGoal,
  expenseReportNumbers,
  (a, b) => MathUtil.sum(...a, b) === expectedSum,
  {
    limit: 1,
    arraysAreEqual: false
  }
);
const flattenedTripletCandidate = [...tripletCandidates[0][0], tripletCandidates[0][1]];

console.log(`Found matching triplet: ${flattenedTripletCandidate}`);
console.log(`Product of all three numbers: ${MathUtil.product(...flattenedTripletCandidate)}`);
