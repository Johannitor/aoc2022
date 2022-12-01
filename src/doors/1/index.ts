import { red, yellow } from 'colorette';
import { join } from 'node:path';
import { AbstractDoor } from '../../lib/AbstractDoor';
import { ArrayUtil } from '../../lib/util/array';
import { MathUtil } from '../../lib/util/math';

class ElfPouch {
  public carriedFood: number[] = [];

  get totalCalories(): number {
    return this.carriedFood.reduce((item, acc) => acc + item, 0);
  }

  addFood(calorieAmount: number): void {
    this.carriedFood.push(calorieAmount);
  }
}

export default class DoorOne extends AbstractDoor {
  public async run() {
    console.log(yellow('PART 1'));
    console.log('> Collecting food from all pouches and pockets of Elfs...');

    const elfs: ElfPouch[] = [];
    let currentPouch = new ElfPouch();

    for await (const line of this.readFileByLineInterator(
      join(__dirname, './input.txt')
    )) {
      if (line) {
        const food = parseInt(line.trim());

        if (Number.isNaN(food) || food <= 0)
          throw Error(
            'Found a strange food item... Aborting search to not violate any health codes.'
          );

        currentPouch.addFood(food);
        continue;
      }

      elfs.push(currentPouch);
      currentPouch = new ElfPouch();
    }

    if (!elfs.length)
      throw Error(
        "All Elfs weren't carrying any food... They must be up to something"
      );

    console.log('* Collected all food items and counted their calories! \n');

    console.log('> Sorting all Elfs by the amount of Calories carried...');
    ArrayUtil.sortByKey(elfs, 'totalCalories', 'DESC');

    console.log(
      '* The Elf carrying the most Calories is carrying a total of ' +
        red(this.formatInt(elfs.at(0)?.totalCalories!)) +
        ' Calories! \n'
    );

    console.log(yellow('PART 2'));
    console.log(
      '> Searching for the 3 Elfs with the highest total Calorie count...'
    );

    const top3totalCalories = elfs
      .slice(0, 3)
      .map((pouch) => pouch.totalCalories);

    console.log(
      `* The Elfs carrying the highest total Calories carried are carrying ${red(
        this.formatListAnd(
          top3totalCalories.reverse().map((pouch) => this.formatInt(pouch))
        )
      )} Calories. Adding up to a total of ${red(
        this.formatInt(MathUtil.sum(...top3totalCalories))
      )} Calories. \n`
    );
  }
}
