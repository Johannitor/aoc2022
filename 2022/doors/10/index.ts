import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';

abstract class Instruction {
  protected cyclesRan = 0;

  cycle() {
    ++this.cyclesRan;
  }

  reset() {
    this.isComplete = false;
    this.cyclesRan = 0;
  }

  abstract isComplete: boolean;
  abstract execute(registers: CPU): void;
}

class NoopInstruction extends Instruction {
  isComplete = false;

  execute() {
    if (this.cyclesRan === 1) {
      this.isComplete = true;
    }
  }
}

class AddxInstruction extends Instruction {
  isComplete = false;

  constructor(private addend: number) {
    super();
  }

  execute(cpu: CPU) {
    if (this.cyclesRan === 2) {
      cpu.xRegister += this.addend;

      this.isComplete = true;
    }
  }
}

function parseInstruction(instructionString: string): Instruction {
  const [operation, value] = instructionString.split(' ');

  switch (operation?.toUpperCase()) {
    case 'NOOP':
      return new NoopInstruction();

    case 'ADDX':
      return new AddxInstruction(parseInt(value));

    default:
      throw Error(`Encountered unkown instruction: ${operation}`);
  }
}

class CPU {
  xRegister: number = 1;

  cyclesRan: number = 0;
  private instructionIndex: number = 0;

  constructor(private instructions: Instruction[]) {}

  get canRun(): boolean {
    return !!this.currentInstruction;
  }

  private get currentInstruction(): Instruction | undefined {
    return this.instructions[this.instructionIndex];
  }

  cycle(count: number = 1) {
    for (let i = 0; i < count; ++i) {
      this.currentInstruction?.execute(this);

      if (this.currentInstruction?.isComplete) ++this.instructionIndex;

      this.currentInstruction?.cycle();

      ++this.cyclesRan;
    }
  }

  // Cycles CPU until targeted cycle count is reached
  cycleTo(targetCycleCount: number) {
    if (targetCycleCount < this.cyclesRan)
      throw Error("CPU can't time travel! (yet?)");

    this.cycle(targetCycleCount - this.cyclesRan);
  }
}

class GPU {
  private readonly xPixelCount = 40;
  private readonly yPixelCount = 6;

  private readonly videoMemory: number[][];

  constructor(private readonly cpu: CPU) {
    // Initialize videoMemory based on size of screen
    this.videoMemory = Array.from(
      { length: this.yPixelCount },
      () => new Array(this.xPixelCount)
    );
  }

  cycle() {
    const pixelIndex = this.cpu.cyclesRan - 1;
    const registerValue = this.cpu.xRegister;

    const spritePositions = [
      registerValue,
      registerValue - 1,
      registerValue + 1,
    ];

    const currentX = pixelIndex % this.xPixelCount;

    if (spritePositions.includes(currentX)) {
      const currentY = Math.floor(pixelIndex / this.xPixelCount);

      this.videoMemory[currentY][currentX] = 1;
    }
  }

  render() {
    return this.videoMemory
      .map((row) => row.map((pixel) => (pixel ? '\u2588' : ' ')))
      .join('\n');
  }
}

export default class DoorTen extends AbstractDoor {
  public async run() {
    // ##### PREPARE
    let instructions: Instruction[] = [];
    for await (const line of this.readFileByLineInterator(
      join(__dirname, './input.txt')
    )) {
      instructions.push(parseInstruction(line));
    }

    // ##### PART 1
    Logger.partHeader(1);
    const cycleCountsToCheck = [20, 60, 100, 140, 180, 220];
    const part1Cpu = new CPU(instructions);

    const part1Values: [number, number][] = cycleCountsToCheck.map(
      (targetCycleCount) => {
        part1Cpu.cycleTo(targetCycleCount);

        return [part1Cpu.cyclesRan, part1Cpu.xRegister];
      }
    );
    const part1Result = part1Values.reduce<number>(
      (acc, [cycle, xRegisterValue]) => acc + cycle * xRegisterValue,
      0
    );

    console.log(part1Result);

    // This is not the best solution, but we need to reset all instructions after the
    // first part as they store some internal state which will break the 2nd run
    instructions.forEach((instruction) => instruction.reset());

    // ##### PART 2
    Logger.partHeader(2);
    const part2Cpu = new CPU(instructions);
    const part2Gpu = new GPU(part2Cpu);

    while (part2Cpu.canRun) {
      part2Cpu.cycle();
      part2Gpu.cycle();
    }

    console.log(part2Gpu.render());
  }
}
