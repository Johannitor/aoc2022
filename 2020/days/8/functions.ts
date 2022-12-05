import { Instruction, OperationTypeEnum } from './types';

export function parseLine(line: string): Instruction {
  const [operation, argument] = line.split(' ');

  return {
    operation: operation as OperationTypeEnum,
    argument: parseInt(argument),
  }
}
