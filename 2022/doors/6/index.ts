import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';
import { StringUtil } from '@shared/utils/string';

class Analyzer {
  constructor(private dataStream: string) {}

  getIndexAfterPacketWithXUniqueChars(x: number) {
    // Skip positions that will result in undersize packages
    for (let i = x - 1; i < this.dataStream.length; ++i) {
      const lastFourChars = this.dataStream.slice(i - x + 1, i + 1);

      if (!StringUtil.containsDuplicateChars(lastFourChars)) return i + 1;
    }
  }
}

export default class DoorSix extends AbstractDoor {
  public async run() {
    // ##### PREPARE
    let signatData = await this.readFile(join(__dirname, './input.txt'));

    // ##### PART 1
    Logger.partHeader(1);
    const analyzer = new Analyzer(signatData);
    console.log(analyzer.getIndexAfterPacketWithXUniqueChars(4));

    // ##### PART 2
    Logger.partHeader(2);
    // We can simply resure part 1's analyzer
    console.log(analyzer.getIndexAfterPacketWithXUniqueChars(14));
  }
}
