import { parseInputData } from './functions';
import { MapUtil } from './MapUtil';
import { MathUtil } from '../../utils/MathUtil';
import { HoppingResult } from './types';

// anonymous async function to be able to use await on top-level
(async function () {
  console.log('### Advent of Code 2020 - Day 3: Password Philosophy ###', '\n');

  console.log('* Parsing input-file...');
  const map = await parseInputData();
  console.log('Input-file succesfully parsed!');

  console.log();
  console.log('>>> Part 1');

  console.log('* Jumping to the other side of the forest with 3 right 1 down pattern...')
  const mapUtil = new MapUtil(map);
  const { totalJumps, hitTrees } = mapUtil.jumpToBottom(3, 1);
  console.log(`Route took a total of ${totalJumps} jumps. ${hitTrees} trees where hit on the way.`);

  console.log();
  console.log('>>> Part 2');

  const patterns: [number, number][] = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]];
  let results: HoppingResult[] = [];

  console.log('* Calculating all available paths...')
  patterns.forEach(pattern => {
    console.log(`> Right ${pattern[0]} - Down ${pattern[1]}`);
    results.push(mapUtil.jumpToBottom(...pattern));
    console.log(`Route took a total of ${totalJumps} jumps. ${hitTrees} trees where hit on the way.`);
  })

  console.log('Calculation finished.')
  console.log(`Hit trees of all patterns multiplied together: ${MathUtil.product(...results.map(res => res.hitTrees))}`)
}())
