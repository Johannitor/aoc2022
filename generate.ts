import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { toWords } from 'number-to-words';
import { StringUtil } from './lib/util/string';

async function getInputForDay(day: number): Promise<string> {
  const sessionToken = process.env.SESSION_TOKEN;
  if (!sessionToken) throw new Error('Env variable SESSION_TOKEN missing!');

  const result = await fetch(`https://adventofcode.com/2022/day/${day}/input`, {
    headers: {
      cookie: `session=${sessionToken}`,
    },
  });

  if (!result.ok) {
    switch (result.status) {
      case 400:
        throw new Error(
          'Authentication failed! Did you set the SESSION_TOKEN env properly?'
        );

      case 404:
        throw new Error('Input not available yet :(');

      default:
        console.log(await result.text());
        throw new Error('Unkown error :o');
    }
  }

  return await result.text();
}

async function run() {
  const doorsDirectory = resolve('./src/doors');

  const existingDoors = (await readdir(doorsDirectory, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => parseInt(dirent.name));

  const lastDoor = Math.max(...existingDoors) || 0;
  const nextDoor = lastDoor + 1;
  const nextDoorAsWord = toWords(nextDoor);

  console.log('>> Generating next door #' + nextDoor);

  console.log('Getting challenge input...');
  const doorInput = await getInputForDay(nextDoor);

  console.log('Generating files...');
  const nextDoorDirectory = doorsDirectory + '/' + nextDoor;
  await mkdir(nextDoorDirectory);
  await writeFile(nextDoorDirectory + '/input.txt', doorInput);

  const templateCode = `import { join } from 'node:path';
import { AbstractDoor } from '../../lib/AbstractDoor';
import { Logger } from '../../lib/Logger';

export default class Door${StringUtil.toTitleCase(
    nextDoorAsWord
  )} extends AbstractDoor {
    public async run() {
      // ##### PREPARE
      for await (const line of this.readFileByLineInterator(
        join(__dirname, './input.txt')
      )) {
      }

      // ##### PART 1
      Logger.partHeader(1);
      console.log('TODO');

      // ##### PART 2
      Logger.partHeader(2);
      console.log('TODO');
    }
}
  `;

  await writeFile(nextDoorDirectory + '/index.ts', templateCode);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

export {};
