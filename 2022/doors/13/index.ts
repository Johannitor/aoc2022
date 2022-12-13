import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';
import { MathUtil } from '@shared/utils/math';

type DeepArrayOf<T> = T | DeepArrayOf<T>[];

enum CompareResult {
  CONTINUE = 'continue',
  RIGHT = 'right',
  WRONG = 'wrong',
}

function comparePair(
  pair: [DeepArrayOf<number>, DeepArrayOf<number>]
): CompareResult {
  let leftSide = pair[0];
  let rightSide = pair[1];

  // If both values are integers, the lower integer should come first.
  if (!Array.isArray(leftSide) && !Array.isArray(rightSide)) {
    // If the left integer is lower than the right integer, the inputs
    // are in the right order.
    if (leftSide < rightSide) return CompareResult.RIGHT;

    // If the left integer is higher than the right integer, the inputs
    // are not in the right order.
    if (leftSide > rightSide) return CompareResult.WRONG;

    // Otherwise, the inputs are the same integer; continue checking the
    // next part of the input.
    return CompareResult.CONTINUE;
  }

  // If exactly one value is an integer,
  if (!Array.isArray(leftSide) || !Array.isArray(rightSide)) {
    // convert the integer to a list which contains that integer as its only value,
    if (!Array.isArray(leftSide)) leftSide = [leftSide];
    if (!Array.isArray(rightSide)) rightSide = [rightSide];

    // then retry the comparison.
    return comparePair([leftSide, rightSide]);
  }

  // If both values are lists, compare the first value of each list, then the second
  // value, and so on.
  const maxLengthBetweenSides = Math.max(leftSide.length, rightSide.length);
  for (let i = 0; i < maxLengthBetweenSides; ++i) {
    // If the left list runs out of items first, the inputs are in the right order.
    if (leftSide[i] === undefined) return CompareResult.RIGHT;

    // If the right list runs out of items first, the inputs are not in the right order.
    if (rightSide[i] === undefined) return CompareResult.WRONG;

    // If the lists are the same length -> implied

    // and no comparison makes a decision about the order,
    const compareResult = comparePair([leftSide[i], rightSide[i]]);
    if (compareResult !== CompareResult.CONTINUE) return compareResult;

    // continue checking the next part of the input.
    // -> next direct neighbor within sides is tested by next for loop iteration
  }

  // -> if no decision could be made within the sides, instruct calling context to check
  // next positions
  return CompareResult.CONTINUE;
}

export default class DoorThirteen extends AbstractDoor {
  public async run() {
    // ##### PREPARE
    const examplePart1 = await this.parseFile('example-input.txt');
    const examplePart1Result = examplePart1
      .map((e, i) => [i + 1, comparePair(e)])
      .filter(([_, result]) => result !== CompareResult.WRONG)
      .map(([index]) => index as number);

    console.log('Example Part 1: ', MathUtil.sum(...examplePart1Result), '\n');

    // ##### PART 1
    Logger.partHeader(1);
    const input = await this.parseFile('input.txt');
    const part1Result = input
      .map((e, i) => [i + 1, comparePair(e)])
      .filter(([_, result]) => result === CompareResult.RIGHT)
      .map(([index]) => index as number);

    console.log(MathUtil.sum(...part1Result));

    // ##### PART 2
    Logger.partHeader(2);
    const examplePart2 = (await this.parseFile('input.txt')).flat();

    // Add divider packages into pool of packages
    const dividerPackages = [[[2]], [[6]]];
    examplePart2.push(...dividerPackages);

    // Sort packages
    examplePart2.sort((a, b) =>
      comparePair([a, b]) === CompareResult.RIGHT ? -1 : 1
    );

    // Find indecies of divider packages
    const [indexFirstPackage, indexSecondPackage] = dividerPackages.map(
      (dividerPackage) => {
        return (
          1 +
          examplePart2.findIndex(
            (transmission) =>
              JSON.stringify(transmission) === JSON.stringify(dividerPackage)
          )
        );
      }
    );
    console.log(indexFirstPackage * indexSecondPackage);
  }

  async parseFile(file: string) {
    const content = await this.readFile(join(__dirname, './' + file));

    const pairs = content
      .trim()
      .split('\n\n')
      .map(
        (pair) =>
          pair
            .split('\n')
            .map((entry) => JSON.parse(entry) as DeepArrayOf<number>) as [
            DeepArrayOf<number>,
            DeepArrayOf<number>
          ]
      );

    return pairs;
  }
}
