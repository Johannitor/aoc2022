import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';
import { StringUtil } from '@shared/utils/string';

class Part1Analyzer {
  constructor(private dataStream: string) {}

  getIndexAfterMarker() {
    // Because we require the packet to be 4 chars, we can start at the fourth one
    for (let i = 3; i < this.dataStream.length; ++i) {
      const lastFourChars = this.dataStream.slice(i - 3, i + 1);

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
    const analyzerPart1 = new Part1Analyzer(signatData);
    console.log(analyzerPart1.getIndexAfterMarker());

    // ##### PART 2
    Logger.partHeader(2);
    console.log('TODO');
  }
}
