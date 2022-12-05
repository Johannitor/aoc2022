import * as path from 'path';
import { readFileByLines } from '../../utils/readFileByLine';
import { parseLine } from './functions';
import { ArrayUtil } from '../../utils/ArrayUtil';

// anonymous async function to be able to use await on top-level
(async function () {
  console.log('### Advent of Code 2020 - Day 7: Handy Haversacks ###', '\n');

  console.log('* Reading input-file...');
  const lines = await readFileByLines(path.resolve(__dirname, './input.txt'));

  console.log('* Parsing bags...');
  const bags = lines.map(line => parseLine(line));

  console.log();
  console.log('>>> Part 1');

  console.log('* Finding bags that fit a `shiny gold` bag...');

  let targetBags = ['shiny gold']; // bags to find starts with shiny gold bag
  let hasFoundSomething;

  do {
    hasFoundSomething = false; // set hasFoundSomething to false

    for (let bag of bags) {
      // check if one the the bags items matches on of the target bags
      if (bag.items.some(item => targetBags.some(targetBag => targetBag === item.name))) {
        // check if bag is already in target list
        if (!targetBags.some(targetBag => targetBag === bag.name)) {
          targetBags.push(bag.name);
          hasFoundSomething = true;
        }
      }
    }
  } while (hasFoundSomething); // only run until there is a loop that doesn't find a bag

  // sub one as targetBags list also contains initial shiny gold bag which doesn't fit itself
  console.log(`Found ${targetBags.length - 1} bags that will fit an shiny gold bag.`);


  console.log();
  console.log('>>> Part 2');

  console.log('* Finding amount of bags that will fit inside a `shiny gold` bag...');

  let queue = [bags.find(bag => bag.name === 'shiny gold')];
  let containedBags = 0;

  do {
    const item = queue.shift(); // get first bag

    if (item) {
      for (let { count, name } of item.items) { // loop over possible bag contents
        containedBags += count; // add space for bag to total count
        // find bag object and add it as many times as it will fit into the parent bag into the queue
        queue.push(...ArrayUtil.repeatToArray(bags.find(bag => bag.name === name), count))
      }
    }
  } while (queue.length);

  console.log(`A shiny gold bag will fit ${containedBags} other bags`);
}())

// NOTE: This could be vastly improved by changing bag array to an map as then we wouldn't need to search for the bag object
// every time. Unfortunately I didn't have the time to change it
