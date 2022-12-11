enum ConditionType {
  DIVISIBLE_BY = 'divisible',
}
function isConditionType(value: any): value is ConditionType {
  return Object.values(ConditionType).includes(value);
}

type Condition = {
  type: ConditionType;
  value: number;
};

export class Test {
  constructor(
    private condition: Condition,
    private whenTrueResult: number,
    private whenFalseResult: number
  ) {}

  static fromLines(lines: string[]) {
    const line1MatchResult = lines[0].match(/Test: (\w+) by (\d+)/);
    if (!line1MatchResult)
      throw Error('Failed to parse first line of test block!');

    const [_, operation, value] = line1MatchResult;
    if (!isConditionType(operation))
      throw Error('Encountered unkown test condition: ' + operation);
    const condition = { type: operation, value: parseInt(value) };

    const line2MatchResult = lines[1].match(/If true: throw to monkey (\d+)/);
    if (!line2MatchResult)
      throw Error('Failed to parse second line of test block!');

    const whenTrueResult = parseInt(line2MatchResult[1]);

    const line3MatchResult = lines[2].match(/If false: throw to monkey (\d+)/);
    if (!line3MatchResult)
      throw Error('Failed to parse third line of test block!');

    const whenFalseResult = parseInt(line3MatchResult[1]);

    return new Test(condition, whenTrueResult, whenFalseResult);
  }

  execute(value: number) {
    let result: boolean;

    switch (this.condition.type) {
      case ConditionType.DIVISIBLE_BY:
        result = !(value % this.condition.value);
        break;
    }

    return result ? this.whenTrueResult : this.whenFalseResult;
  }
}
