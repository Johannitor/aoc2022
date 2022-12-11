import { Operation } from './operation';
import { Test } from './test';

export class MonkeyFactory {
  static fromDefinition(value: string): Monkey {
    /* EXAMPLE
      Monkey 0:
        Starting items: 79, 98
        Operation: new = old * 19
        Test: divisible by 23
          If true: throw to monkey 2
          If false: throw to monkey 3
      */
    const lines = value.split('\n');
    if (lines.length < 6) {
      console.error(lines);

      throw Error(
        'String given to monkey parser does not contain the right amount of lines!'
      );
    }

    // NOTE: We can ignore optional results here as we have ensured the length before
    lines.shift(); // Line 1 just contains the identifier, which is not needed in our case
    const items = this.parseItems(lines.shift()!);
    const operation = this.parseOperation(lines.shift()!);
    const test = Test.fromLines(lines);

    return new Monkey(items, operation, test);
  }

  private static parseItems(line: string): number[] {
    const matchResults = line.matchAll(/\d+/g);

    const items: number[] = [];
    for (const matchResult of matchResults) {
      items.push(parseInt(matchResult[0]));
    }

    return items;
  }

  private static parseOperation(line: string) {
    const prefix = 'Operation: ';
    const prefixIndex = line.indexOf(prefix);

    return Operation.fromString(line.slice(prefixIndex + prefix.length));
  }
}

export class Monkey {
  inspectionsCount: number = 0;

  constructor(
    public items: number[],
    private operation: Operation,
    public test: Test
  ) {}

  catchItem(item: number) {
    this.items.push(item);
  }

  doMonkeyThingsToFirstItemAndThrow(part: number = 1, superModulo?: number) {
    let firstItem = this.items.shift();
    if (!firstItem) return;

    // inspect item
    ++this.inspectionsCount;
    firstItem = this.operation.run(firstItem);

    // get bored with item
    if (part === 1) {
      firstItem = Math.floor(firstItem / 3);
    } else {
      firstItem = Math.floor(firstItem % superModulo!);
    }

    // throw item
    return { item: firstItem, to: this.test.execute(firstItem) };
  }
}
