import { join } from 'node:path';
import { AbstractDoor } from '../../lib/AbstractDoor';
import { Logger } from '../../lib/Logger';

class Backpack {
  private pockets: [string[], string[]];

  constructor(contents: string) {
    const itemCount = contents.length;
    const perPocketItemCount = Math.floor(itemCount / 2);

    this.pockets = [
      contents.slice(0, perPocketItemCount).split(''),
      contents.slice(perPocketItemCount).split(''),
    ];
  }

  get contents() {
    return this.pockets.flat();
  }

  getCommonItemInPockets() {
    const [pocket1, pocket2] = this.pockets;

    const commonItem = pocket1.find((item1) =>
      pocket2.some((item2) => item1 === item2)
    );
    if (!commonItem)
      throw Error('Did not find a common item in pockets of bagpack');

    return commonItem;
  }
}

function getItemPriority(item: string) {
  const itemAscii = item.charCodeAt(0);

  if (item === item.toLowerCase()) {
    return itemAscii - 'a'.charCodeAt(0) + 1;
  }

  return itemAscii - 'A'.charCodeAt(0) + 27;
}

export default class DoorThree extends AbstractDoor {
  public async run() {
    const backpacks: Backpack[] = [];

    for await (const line of this.readFileByLineInterator(
      join(__dirname, './input.txt')
    )) {
      backpacks.push(new Backpack(line));
    }

    // ####### PART 1
    Logger.partHeader(1);
    let prioritySumPart1 = 0;
    backpacks.forEach((backpack) => {
      prioritySumPart1 += getItemPriority(backpack.getCommonItemInPockets());
    });
    console.log(prioritySumPart1);

    // ####### PART 2
    Logger.partHeader(2);
    let prioritySumPart2 = 0;
    for (let i = 0; i < backpacks.length; i += 3) {
      const [backpack1, backpack2, backpack3] = backpacks
        .slice(i, i + 3)
        .map((backpack) => backpack.contents);

      const commonItem = backpack1.find(
        (item) => backpack2.includes(item) && backpack3.includes(item)
      );
      if (!commonItem)
        throw Error(`Group #${i} has no common item in bagpacks!`);

      prioritySumPart2 += getItemPriority(commonItem);
    }
    console.log(prioritySumPart2);
  }
}
