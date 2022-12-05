import { BagItem, BagType } from './types';

export function removeBagFromString(lineWithBag: string) {
  return lineWithBag.replace(/(\w?)bag(s?)/, '')
    .trim()
}

function parseBagItems(itemsString: string): BagItem[] {
  const items = itemsString.split(',');

  return items.map(item => {
    const [count, ...name] = item.trim()
      .split(' ');

    return { count: Number(count), name: removeBagFromString(name.join(' ')) }
  })
}

export function parseLine(line: string): BagType {
  let bag: BagType = {} as BagType;

  const [currentBag, bagItems] = line.replace('.', '')
    .split('contain')
    .map(part => part.trim());

  bag.name = removeBagFromString(currentBag);

  if (bagItems !== 'no other bags') {
    bag.items = parseBagItems(bagItems);
  } else {
    bag.items = [];
  }

  return bag;
}
