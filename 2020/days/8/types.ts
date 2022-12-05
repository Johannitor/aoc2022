export type Instruction = {
  operation: OperationTypeEnum,
  argument: number,
}

export enum OperationTypeEnum {
  ACCUMULATOR = 'acc',
  JUMP = 'jmp',
  NO_OPERATION = 'nop'
}
