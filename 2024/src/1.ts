import { resolve } from 'path';
import { sum } from './shared/math.util';

// Load Input
const rawTextData = await Bun.file(
  resolve(import.meta.path, '../input/1.txt')
).text();
const lines = rawTextData.trim().split('\n');

// Part 1
const list1: number[] = [];
const list2: number[] = [];
lines.forEach((line) => {
  const [list1Entry, list2Entry] = line
    .split(' ')
    .filter(Boolean)
    .map((v) => Number(v.trim()));

  if (!list1Entry || !list2Entry) {
    throw Error('Encountered line with less than 2 segments');
  }

  list1.push(list1Entry);
  list2.push(list2Entry);
});

const sortedList1 = list1.toSorted();
const sortedList2 = list2.toSorted();

const distances = [];
for (let i = 0; i < list1.length; i++) {
  distances.push(Math.abs(sortedList1[i] - sortedList2[i]));
}

console.log('The total distance between the lists is:', sum(distances));

// Part 2
const list2Occurences = sortedList2.reduce<Record<number, number>>(
  (acc, item) => {
    if (!acc[item]) {
      acc[item] = 1;
    } else {
      ++acc[item];
    }

    return acc;
  },
  {} as Record<number, number>
);

let similarityScore = 0;
for (const item of sortedList1) {
  similarityScore += item * (list2Occurences[item] ?? 0);
}
console.log('The similarity score of the lists is:', similarityScore);
