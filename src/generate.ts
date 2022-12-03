import { Command } from 'commander';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { toWords } from 'number-to-words';
import { StringUtil } from './lib/util/string';

const program = new Command();

program
  .name('advent-of-code-2022 codegen')
  .option('--door <number>', 'Door to run', '1');

program.parse();

async function run() {
  const doorsDirectory = resolve('./src/doors');

  const existingDoors = (await readdir(doorsDirectory, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => parseInt(dirent.name));

  const lastDoor = Math.max(...existingDoors) || 0;
  const nextDoor = lastDoor + 1;
  const nextDoorAsWord = toWords(nextDoor);

  console.log('Generating door #' + nextDoor);

  const nextDoorDirectory = doorsDirectory + '/' + nextDoor;
  await mkdir(nextDoorDirectory);
  await writeFile(nextDoorDirectory + '/input.txt', '');

  const templateCode = `import { AbstractDoor } from '../../lib/AbstractDoor';

export default class Door${StringUtil.toTitleCase(
    nextDoorAsWord
  )} extends AbstractDoor {
    public async run() {}
}
  `;

  await writeFile(nextDoorDirectory + '/index.ts', templateCode);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

export {};
