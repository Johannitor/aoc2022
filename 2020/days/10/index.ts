import * as path from 'path';
import { readFileByLines } from '../../utils/readFileByLine';
import { ArrayUtil } from '../../utils/ArrayUtil';
import { mapContinuousOnesToCombinationAmount } from './functions';

// anonymous async function to be able to use await on top-level
(async function () {
  console.log('### Advent of Code 2020 - Day 10: Adapter Array ###', '\n');

  console.log('* Reading input-file...');
  const adapters = (await readFileByLines(path.resolve(__dirname, './input.txt')))
    .map(line => parseInt(line))

  const adaptersSorted = adapters.sort((a, b) => a - b);

  console.log();
  console.log('>>> Part 1');

  console.log('* Finding 1 and 3 jolt differences between adapters and multiply them together');

  let spacings: Record<number, number> = {};

  for (let i = 0; i < adaptersSorted.length; ++i) {
    const space = adaptersSorted[i] - adaptersSorted[i - 1];

    if (spacings[space]) {
      spacings[space]++;
    } else {
      spacings[space] = 1;
    }
  }

  spacings[adaptersSorted[0]]++; // add difference from outlet to first adapter
  spacings[3]++; // add difference from last adapter to build in adapter

  console.log(spacings[1] * spacings[3]);

  console.log();

  // Only solved this after looking up a solution
  console.log('>>> Part 2');

  console.log('* Finding amount of possible adapter combinations...');

  let continuousOnes = 0;
  let possibleCombinations = 1;
  const adaptersWithFinalOne = [0, ...adaptersSorted, (ArrayUtil.getLastItem(adaptersSorted) + 3)];

  for (let i = 1; i < adaptersWithFinalOne.length; ++i) {
    if (adaptersWithFinalOne[i] - adaptersWithFinalOne[i - 1] === 1) {
      continuousOnes++;
    } else {
      if (continuousOnes) {
        possibleCombinations *= mapContinuousOnesToCombinationAmount(continuousOnes);
        continuousOnes = 0;
      }
    }
  }

  console.log(possibleCombinations);
}())
