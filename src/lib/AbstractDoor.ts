import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';

export abstract class AbstractDoor {
  public abstract run(): Promise<void>;

  readFileByLineInterator(path: string) {
    const readStream = createReadStream(path);

    return createInterface({ input: readStream, crlfDelay: Infinity });
  }
}
