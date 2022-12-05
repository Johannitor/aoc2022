const readline = require('readline');
const fs = require('fs');

export function parseInputData(): Promise<string[]> {
  return new Promise((res) => {
    let objects: string[] = [];

    let currentObject = '';

    const readInterface = readline.createInterface(fs.createReadStream('days/4/input.txt'));

    readInterface.on('line', function (line) {
      if (line) {
        currentObject += line + ' ';
      } else {
        objects.push(currentObject.trim());
        currentObject = '';
      }
    });

    readInterface.on('close', () => {
      if (currentObject) {
        objects.push(currentObject.trim());
      }
      res(objects);
    });
  });
}

const REQUIRED_FIELDS = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

const VALIDATORS: Record<string, RegExp> = {
  byr: /^(200[0-2]|19[2-9]\d)$/,
  iyr: /^(20(1\d|20))$/,
  eyr: /^(20(2\d|30))$/,
  hgt: /^((59|6\d|7[0-6])in|1([5-8]\d|9[0-3])cm)$/,
  hcl: /^(#([0-9a-f]{6}))$/,
  ecl: /^(amb|blu|brn|gry|grn|hzl|oth)$/,
  pid: /^(\d{9})$/,
  cid: /^(.*)$/
}

export function parsePassport(rawPassportString: string, validate?: boolean): PassportType | null {
  const attributes = rawPassportString.split(' ')
    .map(attribute => attribute.split(':'));

  const hasRequiredAttributes = REQUIRED_FIELDS.every(field => attributes.some(attribute => attribute[0] === field));

  if (!hasRequiredAttributes) {
    return null;
  }

  let passport = {} as PassportType;

  for (let attribute of attributes) {
    if (attribute[0]) {
      if (validate && !VALIDATORS[attribute[0]].test(attribute[1])) {
        return null;
      }
      passport[attribute[0]] = attribute[1];
    }
  }

  return passport;
}
