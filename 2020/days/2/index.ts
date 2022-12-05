import { isPasswordValid, parseInputData } from './functions';
import { ParsedDatabasePassword } from './types';

// anonymous async function to be able to use await on top-level
(async function () {
  console.log('### Advent of Code 2020 - Day 2: Password Philosophy ###', '\n');
  console.log('>>> Part 1');

  let passwords: ParsedDatabasePassword[];
  console.log('* Parsing file...');
  passwords = await parseInputData();
  console.log(`File was parsed successfully. Found ${passwords.length} passwords.`);

  console.log('* Counting valid passwords...');
  let validPasswordsCount = 0;

  for (let password of passwords) {
    if (isPasswordValid(password, 1)) {
      ++validPasswordsCount;
    }
  }

  console.log('Valid password count:', validPasswordsCount);

  console.log();
  console.log('>>> Part 2');
  console.log('* Reusing parsed data from step 1...');
  console.log('* Counting valid passwords...');
  validPasswordsCount = 0;

  for (let password of passwords) {
    if (isPasswordValid(password, 2)) {
      ++validPasswordsCount;
    }
  }

  console.log('Valid password count:', validPasswordsCount);
}())
