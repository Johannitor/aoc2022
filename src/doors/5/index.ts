import { join } from 'node:path';
import { AbstractDoor } from '../../lib/AbstractDoor';
import { Logger } from '../../lib/Logger';
import { ArrayUtil } from '../../lib/util/array';

class Warehouse {
  protected constructor(private _stacks: Crate[][]) {}

  static fromHeader(rawHeaderLines: string[]) {
    // Step 1: Reverse header to be able to build stacks from the bottom up
    const [stackIndecies, ...stackContents] = [...rawHeaderLines].reverse();

    // Step 2: Find indecies of stack labels && prepare an empty stack array for each found label
    const stackPositions: number[] = [];
    const stacks: Crate[][] = [];
    for (const match of stackIndecies.matchAll(/(\d)/g)) {
      stackPositions.push(match.index!);
      stacks.push([]);
    }

    // Step 3: Retrieve crate information
    for (const stackColumn of stackContents) {
      stackPositions.forEach((position, index) => {
        // Get string of crate (as Create.fromString() also expects the brackets to be included, we need to also get
        // the chars directly before and after the position)
        const crateString = stackColumn
          .substring(position - 1, position + 2)
          .trim();

        // Some stacks may not reach to the top, so no crate will be able to be created
        if (!crateString) return;

        stacks[index].push(Crate.fromString(crateString));
      });
    }

    return new Warehouse(stacks);
  }

  public operateCrane(instruction: CraneInstruction): void {
    for (
      let moveOperation = 0;
      moveOperation < instruction.amount;
      ++moveOperation
    ) {
      // Step 1: Grab item from top of from-stack
      const grabbedItem = this._stacks[instruction.fromIndex].pop();
      if (!grabbedItem)
        throw new Error('Attemped to grab an item from an empty stack!');

      // Step 2: Place item on top of to-stack
      this._stacks[instruction.toIndex].push(grabbedItem);
    }
  }

  public getTopItems(): Crate[] {
    return this._stacks.map((stack) => ArrayUtil.getLastItem(stack)!);
  }
}

class Crate {
  protected constructor(private _content: string) {}

  static fromString(crateString: string) {
    // Example: [A]
    const crateContent = crateString.match(/\[([A-Z])\]/);
    if (!crateContent)
      throw new Error(
        `Could not create crate from string (crateString: ${crateString})`
      );

    return new Crate(crateContent[1]);
  }
  toString() {
    return this._content.toString();
  }
}

class CraneInstruction {
  protected constructor(
    public readonly fromIndex: number,
    public readonly toIndex: number,
    public readonly amount: number
  ) {}

  static fromString(instructionString: string) {
    // Example: move 12 from 9 to 3
    // Instruction regex match layout: [input string, amount, from, to]
    const instruction = instructionString.match(
      /move (\d+) from (\d+) to (\d+)/
    );
    if (!instruction)
      throw new Error(
        `Could not create CraneInstruction from string (instructionString: ${instructionString})`
      );

    const amount = +instruction[1];
    const from = +instruction[2] - 1;
    const to = +instruction[3] - 1;

    // NOTE: We substract 1 from the from and to indecies, as they are 1-indexed in the instruction
    return new CraneInstruction(from, to, amount);
  }
}

export default class DoorFive extends AbstractDoor {
  public async run() {
    let isReadingHeader = true;
    const headerLines: string[] = [];
    const instructions: CraneInstruction[] = [];

    // ##### PREPARE
    for await (const line of this.readFileByLineInterator(
      join(__dirname, './input.txt')
    )) {
      if (!line) {
        isReadingHeader = false;
        continue;
      }

      if (isReadingHeader) {
        headerLines.push(line);
        continue;
      }

      instructions.push(CraneInstruction.fromString(line));
    }

    // ##### PART 1
    Logger.partHeader(1);
    const warehousePart1 = Warehouse.fromHeader(headerLines);
    instructions.forEach((instruction) =>
      warehousePart1.operateCrane(instruction)
    );
    console.log(
      warehousePart1
        .getTopItems()
        .map((item) => item.toString())
        .join('')
    );

    // ##### PART 2
    Logger.partHeader(2);
    console.log('TODO');
  }
}
