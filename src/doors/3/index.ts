import { join } from 'node:path';
import { AbstractDoor } from '../../lib/AbstractDoor';

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

    let prioritySum = 0;

    backpacks.forEach((backpack) => {
      prioritySum += getItemPriority(backpack.getCommonItemInPockets());
    });
    console.log(prioritySum);
  }
}
