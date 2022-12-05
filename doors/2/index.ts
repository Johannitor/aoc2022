import { red, whiteBright } from 'colorette';
import { join } from 'node:path';
import { AbstractDoor } from '../../lib/AbstractDoor';
import { Logger } from '../../lib/Logger';

enum Shapes {
  Rock = 'rock',
  Paper = 'paper',
  Scissors = 'scissorts',
}

const shapePointMap: Record<Shapes, number> = {
  [Shapes.Rock]: 1,
  [Shapes.Paper]: 2,
  [Shapes.Scissors]: 3,
};

enum ResultType {
  Draw = 'draw',
  Win = 'win',
  Loose = 'loose',
}

const resultPointMap: Record<ResultType, number> = {
  [ResultType.Loose]: 0,
  [ResultType.Draw]: 3,
  [ResultType.Win]: 6,
};

const resultMap: Record<Shapes, Record<Shapes, ResultType>> = {
  [Shapes.Rock]: {
    [Shapes.Rock]: ResultType.Draw,
    [Shapes.Paper]: ResultType.Loose,
    [Shapes.Scissors]: ResultType.Win,
  },
  [Shapes.Paper]: {
    [Shapes.Rock]: ResultType.Win,
    [Shapes.Paper]: ResultType.Draw,
    [Shapes.Scissors]: ResultType.Loose,
  },
  [Shapes.Scissors]: {
    [Shapes.Rock]: ResultType.Loose,
    [Shapes.Paper]: ResultType.Win,
    [Shapes.Scissors]: ResultType.Draw,
  },
};

class Match {
  constructor(public opponentShape: Shapes, public suggestedMove: string) {}

  getPoints(part: 1 | 2) {
    const playerShape =
      part === 1 ? this.pickShapePartOne() : this.pickShapePartTwo();
    const matchResult = resultMap[playerShape][this.opponentShape];

    return shapePointMap[playerShape] + resultPointMap[matchResult];
  }

  private pickShapePartOne() {
    switch (this.suggestedMove.toUpperCase()) {
      case 'X':
        return Shapes.Rock;

      case 'Y':
        return Shapes.Paper;

      case 'Z':
        return Shapes.Scissors;

      default:
        throw Error('Unknown instruction found!');
    }
  }

  private pickShapePartTwo() {
    switch (this.suggestedMove.toUpperCase()) {
      case 'X':
        return this.findMoveByExpectedResult(
          this.opponentShape,
          ResultType.Loose
        );

      case 'Y':
        return this.findMoveByExpectedResult(
          this.opponentShape,
          ResultType.Draw
        );

      case 'Z':
        return this.findMoveByExpectedResult(
          this.opponentShape,
          ResultType.Win
        );

      default:
        throw Error('Unknown instruction found!');
    }
  }

  private findMoveByExpectedResult(
    opponentShape: Shapes,
    expectedResult: ResultType
  ) {
    return Object.values(Shapes).find(
      (shape) => resultMap[shape][opponentShape] === expectedResult
    )!;
  }
}

export default class DoorTwo extends AbstractDoor {
  public async run() {
    Logger.segmentStart('Analyzing strategy guide...');
    const strategyGuide: Match[] = [];

    for await (const line of this.readFileByLineInterator(
      join(__dirname, './input.txt')
    )) {
      const [opponentShape, suggestedMove] = line.split(' ');

      strategyGuide.push(
        new Match(this.parsePlayerMove(opponentShape), suggestedMove)
      );
    }

    Logger.segmentFinish(
      `Finished analyzing ${whiteBright(
        this.formatInt(strategyGuide.length)
      )} strategies.\n`
    );

    // ##### PART 1
    Logger.partHeader(1);
    Logger.segmentStart('Calculating total score using suggested shapes...');
    let totalScorePart1 = 0;
    strategyGuide.forEach((match) => {
      totalScorePart1 += match.getPoints(1);
    });

    Logger.segmentFinish(
      `Using the suggested shapes, the total score is ${red(
        this.formatInt(totalScorePart1)
      )} \n`
    );

    // ##### PART 2
    Logger.partHeader(2);
    Logger.segmentStart(
      'Calculating total score by achieving suggested result...'
    );
    let totalScorePart2 = 0;
    strategyGuide.forEach((match) => {
      totalScorePart2 += match.getPoints(2);
    });

    Logger.segmentFinish(
      `Using the suggested results, the total score is ${red(
        this.formatInt(totalScorePart2)
      )} \n`
    );
  }

  private parsePlayerMove(move: string): Shapes {
    switch (move.toUpperCase()) {
      case 'A':
        return Shapes.Rock;

      case 'B':
        return Shapes.Paper;

      case 'C':
        return Shapes.Scissors;

      default:
        throw Error('Encountered unsupported player move!');
    }
  }
}
