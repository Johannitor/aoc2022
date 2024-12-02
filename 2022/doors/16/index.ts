import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';
import { PriorityQueue } from '@shared/lib/PriorityQueue';
import { ArrayUtil } from '@shared/utils/array';

class Valve {
  constructor(
    public readonly id: string,
    public readonly flowRate: number,
    public readonly connectedTo: string[]
  ) {}

  static fromString(value: string): Valve {
    const matchResult = value.match(
      /Valve (\w{2}) has flow rate=(\d+); tunnels lead to valves ((?:(?:\w{2})(?:, ){0,1})+)/
    );
    if (!matchResult)
      throw Error(`Failed to parse vale from string (${value})`);

    const [_, id, flowRate, connectedTo] = matchResult;

    return new Valve(id, parseInt(flowRate), connectedTo.split(', '));
  }
}

class MoveOperation {
  constructor(public readonly to: Valve) {
    console.log(`Moved to: ${to.id}`);
  }
}

class OpenOperation {
  constructor(public readonly valve: Valve) {
    console.log(`Opened: ${valve.id}`);
  }
}

export default class DoorSixteen extends AbstractDoor {
  public async run() {
    const exampleValves = await this.parseValves('./example-input.txt');

    // ##### PART 1
    Logger.partHeader(1);
    console.log('TODO');

    // ##### PART 2
    Logger.partHeader(2);
    console.log('TODO');
  }

  private async parseValves(file: string) {
    const valveMap = new Map<string, Valve>();

    (await this.readFile(join(__dirname, file)))
      .split('\n')
      .filter(Boolean)
      .forEach((valveString) => {
        const valve = Valve.fromString(valveString);
        valveMap.set(valve.id, valve);
      });

    return valveMap;
  }

  private solvePartOne(valves: Map<string, Valve>) {
    let bestSolution: { releasedPressure: number; valves: Valve[] } = {
      releasedPressure: 0,
      valves: [],
    };

    for (let valve of valves.values()) {
      const queue = new PriorityQueue<(MoveOperation | OpenOperation)[]>();
      queue.enqueue(0, [new MoveOperation(valve)]);

      while (queue.hasNext) {
        const subject = queue.dequeueLast()!;

        const lastOperation = ArrayUtil.getLastItem(subject);

        // Last operation was a move, so try to open valve we're currently standing at
        if (lastOperation instanceof MoveOperation) {
          // Check if valve is alread open
          if (
            !subject.some(
              (item) =>
                item instanceof OpenOperation &&
                item.valve.id === lastOperation.to.id
            )
          ) {
            subject.push(new OpenOperation(lastOperation.to));
          }
        } else {
        }
      }
    }
  }
}
