import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';
import { MathUtil } from '@shared/utils/math';

export default class DoorOne extends AbstractDoor {
  public async run() {
    const messurements: number[] = [];
    // ##### PREPARE
    for await (const line of this.readFileByLineInterator(
      join(__dirname, './input.txt')
    )) {
      messurements.push(parseInt(line));
    }

    // ##### PART 1
    Logger.partHeader(1);
    let positiveDeltaSteps = 0;

    for (let i = 0; i < messurements.length - 1; i++) {
      if (messurements[i] < messurements[i + 1]) positiveDeltaSteps++;
    }
    console.log(positiveDeltaSteps);

    // ##### PART 2
    Logger.partHeader(2);
    let groupedPositiveDeltaSteps = 0;

    const itemsToSumBy = 3;
    for (
      let leftSideIndex = 0;
      leftSideIndex < messurements.length - itemsToSumBy;
      leftSideIndex++
    ) {
      const leftSideItems = messurements.slice(
        leftSideIndex,
        leftSideIndex + itemsToSumBy
      );
      const leftSideTotal = MathUtil.sum(...leftSideItems);

      const rightSideIndex = leftSideIndex + 1;
      const rightSideItems = messurements.slice(
        rightSideIndex,
        rightSideIndex + itemsToSumBy
      );
      const rightSideTotal = MathUtil.sum(...rightSideItems);

      if (leftSideTotal < rightSideTotal) groupedPositiveDeltaSteps++;
    }

    console.log(groupedPositiveDeltaSteps);
  }
}
