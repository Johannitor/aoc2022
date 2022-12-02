import { red } from 'colorette';
import { join } from 'node:path';
import { AbstractDoor } from '../../lib/AbstractDoor';

enum Shapes {
  Rock,
  Paper,
  Scissors,
}

const shapePointMap: Record<Shapes, number> = {
  [Shapes.Rock]: 1,
  [Shapes.Paper]: 2,
  [Shapes.Scissors]: 3,
};

enum ResultType {
  Draw,
  Win,
  Loose,
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

  pickShape() {
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

  getPoints() {
    const playerShape = this.pickShape();
    const matchResult = resultMap[playerShape][this.opponentShape];

    return shapePointMap[playerShape] + resultPointMap[matchResult];
  }
}

export default class DoorTwo extends AbstractDoor {
  public async run() {
    const strategyGuide: Match[] = [];

    for await (const line of this.readFileByLineInterator(
      join(__dirname, './input.txt')
    )) {
      const [opponentShape, suggestedMove] = line.split(' ');

      strategyGuide.push(
        new Match(this.parsePlayerMove(opponentShape), suggestedMove)
      );
    }

    console.log(`Found a total of ${red(strategyGuide.length)} games!`);

    let totalScore = 0;
    strategyGuide.forEach((match) => {
      totalScore += match.getPoints();
    });

    console.log(totalScore);
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
