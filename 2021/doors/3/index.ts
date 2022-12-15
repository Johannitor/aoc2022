import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';

function flipBits(value: number, bitCount: number): number {
  return parseInt(
    value
      .toString(2)
      .split('')
      .map((c) => !+c)
      .join(),
    2
  );
}

function mostOccuringBitPerPosition(array: number[], bitCount: number) {
  const total1BitsPerPosition = Array.from({ length: bitCount }, () => 0);

  array.forEach((item) => {
    for (let index = 0; index < bitCount; ++index) {
      if ((1 << index) & item) {
        ++total1BitsPerPosition[total1BitsPerPosition.length - 1 - index];
      }
    }
  });

  return parseInt(
    total1BitsPerPosition
      .map((bits) => (bits > Math.floor(array.length / 2) ? '1' : '0'))
      .join(''),
    2
  );
}

export default class DoorThree extends AbstractDoor {
  public async run() {
    let bitCount = 0;
    const readings: number[] = [];

    // ##### PREPARE
    for await (const line of this.readFileByLineInterator(
      join(__dirname, './input.txt')
    )) {
      if (!bitCount) bitCount = line.length;

      readings.push(parseInt(line, 2));
    }

    // ##### PART 1
    Logger.partHeader(1);
    const total1BitsPerPosition = mostOccuringBitPerPosition(
      readings,
      bitCount
    );

    const gammaRate = total1BitsPerPosition;
    const epsilonRate = parseInt(
      gammaRate
        .toString(2)
        .split('')
        .map((c) => !+c)
        .join(),
      2
    );
    console.log('Result: ', gammaRate * epsilonRate);

    // ##### PART 2
    Logger.partHeader(2);
    console.log('TODO');
  }
}
