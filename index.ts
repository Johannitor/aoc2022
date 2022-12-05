import { bold, italic, red, white } from 'colorette';
import { Command } from 'commander';
import { AbstractDoor } from './lib/AbstractDoor';
import { Logger } from './lib/Logger';

const printWidth = 64;

function printTitle() {
  const headlineModifier = (v: string) => bold(red(v));

  console.clear();
  console.log(headlineModifier('#'.repeat(printWidth)));
  console.log(headlineModifier(' '.repeat(printWidth)));
  Logger.centeredText(printWidth, 'Advent of Code 2022', headlineModifier);
  Logger.centeredText(printWidth, 'by Johann Lochbaum', (v) =>
    italic(headlineModifier(v))
  );
  console.log(headlineModifier(' '.repeat(printWidth)));
  console.log(headlineModifier('#'.repeat(printWidth)));
  console.log();
}

const program = new Command();

program
  .name('advent-of-code-2022')
  .option('--door <number>', 'Door to run', '1');

program.parse();

async function run() {
  printTitle();

  const doorNumber = parseInt(program.opts().door);
  if (Number.isNaN(doorNumber) || doorNumber < 1 || doorNumber > 24)
    throw new Error('Not a valid door number!');

  console.log(white(`Running door #${doorNumber}`));
  console.log('-'.repeat(printWidth));
  console.log();

  const doorImport = await import('./doors/' + program.opts().door).catch(
    () => undefined
  );
  if (!doorImport)
    throw new Error(`Door ${doorNumber} is not implemented yet!`);
  if (!doorImport.default)
    throw new Error(`Door ${doorNumber} is missing a default export!`);

  const door: AbstractDoor = new doorImport.default();

  const startMs = Date.now();
  await door.run();
  const endMs = Date.now();
  console.log(`It took a total of ${endMs - startMs}ms to run this door!`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

export {};
