enum OperationVariableType {
  STATIC = 'static',
  VALUE = 'value',
}

type OperationVariableDefinition =
  | { type: OperationVariableType.STATIC; value: number }
  | { type: OperationVariableType.VALUE };

enum Operant {
  MULTIPLY = '*',
  ADD = '+',
}

function isOperant(value: any): value is Operant {
  return Object.values(Operant).includes(value);
}

export class Operation {
  constructor(
    private operant: Operant,
    private leftSide: OperationVariableDefinition,
    private rightSide: OperationVariableDefinition
  ) {}

  static fromString(operationString: string) {
    const matchResult = operationString.match(/new = (.+) (.) (.+)/);
    if (!matchResult) throw Error('Failed to parse operation!');

    const [_, leftSide, operant, rightSide] = matchResult;

    if (!isOperant(operant)) throw Error(`Found unkown operant: ${operant}`);

    function parseSide(side: string): OperationVariableDefinition {
      if (side === 'old') {
        return {
          type: OperationVariableType.VALUE,
        };
      }

      return {
        type: OperationVariableType.STATIC,
        value: parseInt(side),
      };
    }

    return new Operation(operant, parseSide(leftSide), parseSide(rightSide));
  }

  private getValueForSide(side: OperationVariableDefinition, value: number) {
    switch (side.type) {
      case OperationVariableType.STATIC:
        return side.value;

      case OperationVariableType.VALUE:
        return value;
    }
  }

  run(value: number): number {
    const leftSideValue = this.getValueForSide(this.leftSide, value);
    const rightSideValue = this.getValueForSide(this.rightSide, value);

    switch (this.operant) {
      case Operant.ADD:
        return leftSideValue + rightSideValue;

      case Operant.MULTIPLY:
        return leftSideValue * rightSideValue;
    }
  }
}
