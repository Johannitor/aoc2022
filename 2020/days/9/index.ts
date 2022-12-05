import * as path from 'path';
import { readFileByLines } from '../../utils/readFileByLine';
import { checkIfNumberIsSumOfTwoNumbersInArray } from './functions';

// anonymous async function to be able to use await on top-level
(async function () {
  console.log('### Advent of Code 2020 - Day 9: Encoding Error ###', '\n');

  console.log('* Reading input-file...');
  const numbers = (await readFileByLines(path.resolve(__dirname, './input.txt'))).map(line => parseInt(line));

  console.log();
  console.log('>>> Part 1');

  console.log('* Checking numbers...');

  let invalidNumberIndex = -1;
  // loop over all numbers starting from index 25
  for (let i = 25; i < numbers.length; i++) {
    if (!checkIfNumberIsSumOfTwoNumbersInArray(numbers[i], numbers)) {
      invalidNumberIndex = i;
      break;
    }
  }

  if (invalidNumberIndex === -1) {
    throw new Error('Couldn\'t find an invalid number!');
  }

  let invalidNumber = numbers[invalidNumberIndex];

  console.log(`Number ${invalidNumber} at index ${invalidNumberIndex} doesn't have a sum of two numbers of the preamble`);

  console.log();
  console.log('>>> Part 2');

  console.log(`* Finding a contiguous set of numbers in list that add up to ${invalidNumber}...`);

  let currentNumbers = [];
  let subtotal = 0;
  let foundSet = false;

  for (let i = 0; i < invalidNumberIndex; i++) {

    currentNumbers = [];
    subtotal = 0;

    for (let j = i; j < invalidNumberIndex; j++) {
      const item = numbers[j];
      subtotal += item;
      currentNumbers.push(item);

      if (subtotal === invalidNumber) {
        foundSet = true;
        break;
      } else if (subtotal > invalidNumber) {
        break;
      }
    }

    if (foundSet) {
      break;
    }
  }

  if (!foundSet) {
    throw new Error('Couldn\'t find a contiguous set of numbers!');
  }

  const smallestNumber = Math.min(...currentNumbers);
  const largestNumber = Math.max(...currentNumbers);

  console.log(`Found a contiguous set of ${currentNumbers.length} numbers that add up to ${invalidNumber}.`);
  console.log('- Smallest number:', smallestNumber);
  console.log('- Largest number:', largestNumber);
  console.log('- Sum of both numbers:', smallestNumber + largestNumber);
}())
