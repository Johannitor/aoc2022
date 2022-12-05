import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline/promises';

export abstract class AbstractDoor {
  private readonly FORMAT_LOCALE = 'en-US';
  private readonly numberFormat = new Intl.NumberFormat(this.FORMAT_LOCALE);
  private readonly listFormatAnd = new Intl.ListFormat(this.FORMAT_LOCALE);
  private readonly listFormatOr = new Intl.ListFormat(this.FORMAT_LOCALE, {
    type: 'disjunction',
  });

  public abstract run(): Promise<void>;

  readFileByLineInterator(path: string) {
    // While this method is not the fastests (adds ~10ms), it offers a convenient API for
    // aoc challenges, as they mainly tend to require to read the input line by line.
    //
    // Faster replacement:
    // return (await readFile(path)).toString().split('\n')
    const readStream = createReadStream(path);

    return createInterface({ input: readStream, crlfDelay: Infinity });
  }

  formatInt(value: number): string {
    return this.numberFormat.format(value);
  }

  formatListAnd(value: string[]): string {
    return this.listFormatAnd.format(value);
  }

  formatListOr(value: string[]): string {
    return this.listFormatOr.format(value);
  }
}
