import { resolve } from 'path';
import { Point } from './shared/point';
import { isNumber, sum } from './shared/math.util';

// Load Input
const rawTextData = await Bun.file(
  resolve(import.meta.path, '../input/3.txt')
).text();
const lines = rawTextData.split('\n');

// Extract number locations
const map = lines.map((line) => line.split(''));
const mapSize = { width: map[0].length, height: map.length };

class NumberLocation {
  constructor(
    public leftPosition: Point,
    public rightPosition: Point,
    public value: number
  ) {}
}

class SymbolLocation {
  constructor(public position: Point, public char: string) {}
}

const numbers: NumberLocation[] = [];
const symbols: SymbolLocation[] = [];
for (let y = 0; y < mapSize.height; y++) {
  const row = lines[y];
  let numberParts: string[] = [];

  for (let x = 0; x < mapSize.width; x++) {
    const item = row[x];

    if (isNumber(item)) {
      numberParts.push(item);

      // Create number location when right side of map is reached or the next value will be non numeric
      if (x === mapSize.width - 1 || !isNumber(row[x + 1])) {
        numbers.push(
          new NumberLocation(
            new Point(x - (numberParts.length - 1), y),
            new Point(x, y),
            Number(numberParts.join(''))
          )
        );
        numberParts = [];
      }
    } else if (item !== '.') {
      symbols.push(new SymbolLocation(new Point(x, y), item));
    }
  }
}

// Part 1
const numbersNextToSymbol: NumberLocation[] = [];
numbers.forEach((number) => {
  for (const symbol of symbols) {
    if (
      number.leftPosition.distanceTo(symbol.position) < 1.5 ||
      number.rightPosition.distanceTo(symbol.position) < 1.5
    ) {
      numbersNextToSymbol.push(number);
      break;
    }
  }
});

console.log(
  'Solution Day 3 Part 1:',
  sum(numbersNextToSymbol.map((num) => num.value))
);

// Part 2
const gears: [NumberLocation, NumberLocation][] = [];
symbols.forEach((symbol) => {
  if (symbol.char !== '*') return;

  const candidates: NumberLocation[] = [];
  // We can simply iterate over numbersNextToSymbol here as a small optimization
  for (const number of numbersNextToSymbol) {
    if (
      number.leftPosition.distanceTo(symbol.position) < 1.5 ||
      number.rightPosition.distanceTo(symbol.position) < 1.5
    ) {
      candidates.push(number);
    }
  }

  if (candidates.length === 2) {
    gears.push([candidates[0], candidates[1]]);
  }
});
console.log(
  'Solution Day 3 Part 2:',
  sum(gears.map(([num1, num2]) => num1.value * num2.value))
);
