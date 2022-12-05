import { ParsedDatabasePassword } from './types';
import { StringUtil } from '../../utils/StringUtil';

const readline = require('readline');
const fs = require('fs');


export function parseInputData(): Promise<ParsedDatabasePassword[]> {
  return new Promise((res) => {
    let passwords: ParsedDatabasePassword[] = [];
    const readInterface = readline.createInterface(fs.createReadStream('days/2/input.txt'));

    readInterface.on('line', function (line) {
      passwords.push(parseInputLine(line));
    });

    readInterface.on('close', () => {
      res(passwords);
    });
  });
}

function parseInputLine(line: string): ParsedDatabasePassword {
  const [policy, password] = line.split(':')
    .map(part => part.trim());
  const [range, character] = policy.split(' ');
  const [min, max] = range.split('-')
    .map(p => Number(p));

  return {
    password,
    policy: {
      character,
      count: {
        min,
        max
      }
    }
  };
}

export function isPasswordValid(databasePassword: ParsedDatabasePassword, ruleset: number = 1) {
  const { password, policy: { character, count: { min, max } } } = databasePassword;

  switch (ruleset) {
    case 1:
      const charInPasswordCount = StringUtil.charAppearancesInTerm(password, character, { max: max + 1 });

      return charInPasswordCount >= min && charInPasswordCount <= max;
    case 2:
      const matchesAtMinPosition = password[min - 1] === character;
      const matchesAtMaxPosition = password[max - 1] === character;

      return (matchesAtMinPosition && !matchesAtMaxPosition) || (!matchesAtMinPosition && matchesAtMaxPosition);
  }
}
