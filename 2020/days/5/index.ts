// anonymous async function to be able to use await on top-level
import { findMissingSeatId, parseSeat } from './functions';
import { readFileByLines } from '../../utils/readFileByLine';
import * as path from 'path';

(async function () {
  console.log('### Advent of Code 2020 - Day 5: Binary Boarding ###', '\n');

  console.log('* Parsing input-file...');
  const lines = await readFileByLines(path.resolve(__dirname, './input.txt'));

  console.log();
  console.log('>>> Part 1');

  console.log('* Parsing binary space partitioning strings...');
  const seats = lines.map(line => parseSeat(line));
  console.log('Successfully parsed all seats.')

  console.log('* Finding seat with highest id...');
  seats.sort((a, b) => a.seatId - b.seatId);
  console.log(`Highest seat ID is ${seats[seats.length - 1].seatId}`);

  console.log();
  console.log('>>> Part 2');

  console.log('* Finding missing seat ID...');
  console.log(`Missing seat ID is ${findMissingSeatId(seats)}`);
}())
