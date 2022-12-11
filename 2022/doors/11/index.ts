import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';
import { MonkeyFactory } from './lib/monkey';

export default class DoorEleven extends AbstractDoor {
  public async run() {
    // ##### PART 1
    Logger.partHeader(1);
    console.log(
      'example-input.txt:',
      await this.runForFile('./example-input.txt', 20)
    );
    console.log('input.txt: ', await this.runForFile('./input.txt', 20));

    // ##### PART 2
    Logger.partHeader(2);
    console.log('TODO');
  }

  private async runForFile(filename: string, rounds: number) {
    const file = await this.readFile(join(__dirname, filename));
    const monkeyDefinitions = file.split('\n\n').filter(Boolean);

    const monkeys = monkeyDefinitions.map((definition) =>
      MonkeyFactory.fromDefinition(definition)
    );

    for (let i = 0; i < rounds; ++i) {
      for (const monkey of monkeys) {
        while (monkey.items.length) {
          const flyingItem = monkey.doMonkeyThingsToFirstItemAndThrow();

          if (flyingItem) monkeys[flyingItem.to].catchItem(flyingItem.item);
        }
      }
    }

    const inspectionCountsSorted = monkeys
      .map((m) => m.inspectionsCount)
      .sort((a, b) => a - b);
    const [count1, count2] = inspectionCountsSorted.slice(-2);

    return count1 * count2;
  }
}
