import { red, underline, whiteBright, yellow } from 'colorette';
import { join } from 'node:path';
import { AbstractDoor } from '../../lib/AbstractDoor';
import { Logger } from '../../lib/Logger';
import { ArrayUtil } from '../../lib/util/array';
import { MathUtil } from '../../lib/util/math';

class ElfPouch {
  public carriedFood: number[] = [];

  constructor(public identifier: number) {}

  get totalCalories(): number {
    return this.carriedFood.reduce((item, acc) => acc + item, 0);
  }

  addFood(calorieAmount: number): void {
    this.carriedFood.push(calorieAmount);
  }
}

export default class DoorOne extends AbstractDoor {
  public async run() {
    Logger.segmentStart('Analyzing list of Elf pouch contents...');

    const elves: ElfPouch[] = [];
    let currentPouch = new ElfPouch(elves.length);

    for await (const line of this.readFileByLineInterator(
      join(__dirname, './input.txt')
    )) {
      // Append to current elves inventory
      if (line) {
        const food = parseInt(line.trim());

        if (Number.isNaN(food) || food <= 0)
          throw Error(
            'Found a strange food item... Aborting search due to risk of health code violation.'
          );

        currentPouch.addFood(food);
        continue;
      }

      // Add elf to list and start a new one
      elves.push(currentPouch);
      currentPouch = new ElfPouch(elves.length);
    }

    if (!elves.length)
      throw Error(
        'None of the Elves is carrying any food... They must be up to something O_O'
      );

    const totalFoodItems = elves.reduce(
      (acc, elf) => acc + elf.carriedFood.length,
      0
    );
    Logger.segmentFinish(
      `Finished analyzing ${whiteBright(
        this.formatInt(totalFoodItems)
      )} food items of ${whiteBright(this.formatInt(elves.length))} Elves. \n`
    );

    // ##### PART 1
    Logger.partHeader(1);
    Logger.segmentStart(
      'Calculating total amount of Calories carried by each Elf...'
    );
    // Sort elves by totalCalories to be able to get top values more easily
    ArrayUtil.sortByKey(elves, 'totalCalories', 'DESC');

    const elfWithMostTotalCalories = elves.at(0)!;
    Logger.segmentFinish(
      `The Elf carrying the most Calories is ${red(
        '#' + elfWithMostTotalCalories.identifier
      )} with a total of ${red(
        this.formatInt(elfWithMostTotalCalories.totalCalories!)
      )} Calories!\n`
    );

    // ##### PART 2
    Logger.partHeader(2);
    Logger.segmentStart(
      'Searching for the three Elves carrying the most Calories...'
    );

    const top3Elves = elves.slice(0, 3);
    const totalCaloriesOfTop3 = top3Elves.map((pouch) => pouch.totalCalories);

    Logger.segmentFinish(
      `The three Elves carrying the most Calories are: ${red(
        this.formatListAnd(
          top3Elves.map(
            (elf) =>
              `#${elf.identifier} (${this.formatInt(elf.totalCalories)} cal)`
          )
        )
      )}. Adding up to a total of ${red(
        this.formatInt(MathUtil.sum(...totalCaloriesOfTop3))
      )} Calories. \n`
    );
  }
}
