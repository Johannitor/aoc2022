import { red, yellow } from 'colorette';
import { join } from 'node:path';
import { AbstractDoor } from '../../lib/AbstractDoor';
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
    console.log('> Analyzing all pouches and pockets of Elfs...');

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

    console.log('< Found all snacks and successfully analyzed them!');

    console.log(
      'The Elf carrying the most Calories is carrying a total of ' +
        red(MathUtil.maxByFn(elfs, (elf) => elf.totalCalories).totalCalories) +
        ' Calories! \n'
    );
  }
}
