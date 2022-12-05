import * as path from 'path';
import { readFileByLines } from '../../utils/readFileByLine';
import { parseLine } from './functions';
import { OperationTypeEnum } from './types';
import { ValueUtil } from '../../utils/ValueUtil';

// anonymous async function to be able to use await on top-level
(async function () {
  console.log('### Advent of Code 2020 - Day 8: Handheld Halting ###', '\n');

  console.log('* Reading input-file...');
  const lines = await readFileByLines(path.resolve(__dirname, './input.txt'));

  console.log('* Parsing instructions...');
  const instructions = lines.map(line => parseLine(line));

  console.log();
  console.log('>>> Part 1');

  console.log('* Running instructions until an instruction is called a second time...');

  let accumulator = 0;
  let currentInstructionIndex = 0;
  let alreadyRunInstructionIndices = [];

  // loop until an instruction is run twice
  while (!alreadyRunInstructionIndices.includes(currentInstructionIndex)) {
    alreadyRunInstructionIndices.push(currentInstructionIndex);

    const currentInstruction = instructions[currentInstructionIndex];
    switch (currentInstruction.operation) {
      case OperationTypeEnum.ACCUMULATOR:
        accumulator += currentInstruction.argument;
      case OperationTypeEnum.NO_OPERATION:
        currentInstructionIndex++;
        break;

      case OperationTypeEnum.JUMP:
        currentInstructionIndex += currentInstruction.argument;
        break;
    }
  }

  console.log(`Before an instruction could get called a second time the accumulator is ${accumulator}`);

  console.log();
  console.log('>>> Part 2');

  console.log('* Try to change nop to jmp and the other way around until program can run without loops...');

  accumulator = 0;
  currentInstructionIndex = 0;
  alreadyRunInstructionIndices = [];

  let hitEndOfInstructions = false;
  let jmpNopAppearanceToChange = 0;
  let currentJmpNopAppearance = 0;

  // loop until an instruction outside the list was tried to be run (program finished)
  // or
  // every instruction of the list would have been switched (this would also include acc instructions, this condition
  // is primarily used to prevent an infinite loop in our own program)
  while (!hitEndOfInstructions && jmpNopAppearanceToChange < instructions.length) {
    currentJmpNopAppearance = 0;
    accumulator = 0;
    currentInstructionIndex = 0;
    alreadyRunInstructionIndices = [];

    // loop until an instruction is run twice
    while (!alreadyRunInstructionIndices.includes(currentInstructionIndex)) {
      alreadyRunInstructionIndices.push(currentInstructionIndex);

      const currentInstruction = instructions[currentInstructionIndex];

      let operationToRun = currentInstruction.operation;
      if ([
        OperationTypeEnum.JUMP,
        OperationTypeEnum.NO_OPERATION
      ].includes(currentInstruction.operation)) {
        // switch operation when required
        if (currentJmpNopAppearance === jmpNopAppearanceToChange) {
          operationToRun = ValueUtil.toggleBetween(operationToRun, OperationTypeEnum.NO_OPERATION, OperationTypeEnum.JUMP);
        }
        currentJmpNopAppearance++;
      }

      switch (operationToRun) {
        case OperationTypeEnum.ACCUMULATOR:
          accumulator += currentInstruction.argument;
        case OperationTypeEnum.NO_OPERATION:
          currentInstructionIndex++;
          break;

        case OperationTypeEnum.JUMP:
          currentInstructionIndex += currentInstruction.argument;
          break;
      }

      // if the next instruction would be outside of the list, end loop
      if (currentInstructionIndex >= instructions.length) {
        hitEndOfInstructions = true;
        break;
      }
    }
    jmpNopAppearanceToChange++;
  }

  console.log(
    `After changing the faulty instruction the program terminated successfully with an accumulator value of ${accumulator}.`
  );
}())
