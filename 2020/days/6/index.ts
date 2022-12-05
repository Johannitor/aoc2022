import * as path from 'path';
import { readFileByGroups } from '../../utils/readFileByGroups';
import { getNonUniqueChars, getUniqueChars } from './functions';

// anonymous async function to be able to use await on top-level
(async function () {
  console.log('### Advent of Code 2020 - Day 6: Custom Customs ###', '\n');

  console.log('* Parsing input-file...');
  const groups = await readFileByGroups(path.resolve(__dirname, './input.txt'));

  console.log();
  console.log('>>> Part 1');

  console.log('* Calculating total amount of right answers...');

  let totalRightAnswers = 0;
  for (let group of groups) {
    totalRightAnswers += getUniqueChars(group).length;
  }

  console.log(`${totalRightAnswers} where answered correctly.`);

  console.log();
  console.log('>>> Part 2');

  console.log('* Calculating total amount of right answers...');

  totalRightAnswers = 0;
  for (let group of groups) {
    totalRightAnswers += getNonUniqueChars(group).length;
  }

  console.log(`For ${totalRightAnswers} answers every group member chose yes.`);
}())
