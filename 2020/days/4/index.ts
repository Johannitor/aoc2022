import { parseInputData, parsePassport } from './functions';

// anonymous async function to be able to use await on top-level
(async function () {
  console.log('### Advent of Code 2020 - Day 4: Passport Processing ###', '\n');

  console.log('* Parsing input-file...');
  const objects = await parseInputData();
  console.log('Input-file successfully parsed!');
  console.log(`Loaded ${objects.length} passports`);

  console.log();
  console.log('>>> Part 1');

  console.log('* Validating passports...');
  let passports: PassportType[] = [];
  let invalidPassports = 0;

  objects.forEach(object => {
    const parsed = parsePassport(object);

    if (parsed) {
      passports.push(parsed);
    } else {
      invalidPassports++;
    }
  });

  console.log(`${passports.length} valid passports. ${invalidPassports} invalid passports.`)

  console.log();
  console.log('>>> Part 2');

  console.log('* Validating passports with patterns...');
  passports = [];
  invalidPassports = 0;

  objects.forEach(object => {
    const parsed = parsePassport(object, true);

    if (parsed) {
      passports.push(parsed);
    } else {
      invalidPassports++;
    }
  });

  console.log(`${passports.length} valid passports. ${invalidPassports} invalid passports.`)
}())
