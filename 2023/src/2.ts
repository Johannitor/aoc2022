import { resolve } from 'path';
import { sum } from './shared/math.util';

// Load Input
const rawTextData = await Bun.file(
  resolve(import.meta.path, '../input/2.txt')
).text();
const lines = rawTextData.split('\n');

// Parse Input
interface Cubes {
  blue: number;
  green: number;
  red: number;
}
class Game {
  constructor(public id: number, public hands: Cubes[]) {}

  static parseLine(line: string) {
    const [gameInfo, handsRaw] = line.split(':').map((item) => item.trim());
    const gameId = Number(gameInfo.split(' ')[1]);

    const hands = handsRaw
      .split(';')
      .map((item) => item.trim())
      .map((rawHand) => {
        const handParts = rawHand.split(',').map((p) => p.trim());
        const hand: Cubes = { red: 0, green: 0, blue: 0 };

        handParts.forEach((part) => {
          const [number, color] = part.split(' ') as [
            string,
            'blue' | 'green' | 'red'
          ];
          hand[color] = Number(number);
        });

        return hand;
      });

    return new Game(gameId, hands);
  }
}
const games = lines.map((line) => Game.parseLine(line));

// Part 1
const proposedCubeAmounts = { green: 13, red: 12, blue: 14 };
const possibleGameIds: number[] = [];
games.forEach((game) => {
  if (
    game.hands.every(
      (hand) =>
        hand.green <= proposedCubeAmounts.green &&
        hand.red <= proposedCubeAmounts.red &&
        hand.blue <= proposedCubeAmounts.blue
    )
  ) {
    possibleGameIds.push(game.id);
  }
});

console.log('Solution Day 2 Part 1:', sum(possibleGameIds));

// Part 2
const minimumCubesPerGame: Cubes[] = games.map((game) => {
  let maxRed = 0;
  let maxGreen = 0;
  let maxBlue = 0;

  game.hands.forEach(({ red, green, blue }) => {
    if (red > maxRed) {
      maxRed = red;
    }

    if (green > maxGreen) {
      maxGreen = green;
    }

    if (blue > maxBlue) {
      maxBlue = blue;
    }
  });

  return { red: maxRed, green: maxGreen, blue: maxBlue };
});
const powerPerGame = minimumCubesPerGame.map(
  (cubes) => cubes.red * cubes.blue * cubes.green
);

console.log('Solution Day 2 Part 2:', sum(powerPerGame));
