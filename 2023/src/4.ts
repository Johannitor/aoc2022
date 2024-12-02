import { resolve } from 'path';
import { splitAndTrim } from './shared/string.util';
import { intersection } from './shared/array';
import { sum } from './shared/math.util';

// Load Input
const rawTextData = await Bun.file(
  resolve(import.meta.path, '../input/4.txt')
).text();
const lines = rawTextData.split('\n');

// Parse cards
class Card {
  score: number;
  matchingNumbers: number;

  constructor(public winningNumbers: number[], public yourNumbers: number[]) {
    this.matchingNumbers = this.getMatchingNumbers();
    this.score = this.getScore();
  }

  private getMatchingNumbers() {
    return intersection(this.winningNumbers, this.yourNumbers).length;
  }

  private getScore() {
    if (!this.matchingNumbers) {
      return 0;
    }

    return 2 ** (this.matchingNumbers - 1);
  }

  static parse(line: string) {
    const [_, numbers] = splitAndTrim(line, ':');
    const [winningNumbersRaw, yourNumbersRaw] = splitAndTrim(numbers, '|');

    return new Card(
      winningNumbersRaw
        .split(' ')
        .filter(Boolean)
        .map((n) => Number(n.trim())),
      yourNumbersRaw
        .split(' ')
        .filter(Boolean)
        .map((n) => Number(n.trim()))
    );
  }
}
const cards = lines.map((line) => Card.parse(line));

// Part 1
const cardScores = cards.map((c) => c.score);
console.log('Solution Day 4 Part 1:', sum(cardScores));

// Part 2
const pileOfScratchcards: [number, Card][] = [];
cards.map((card) => pileOfScratchcards.push([1, card]));

let ownedCards = 0;
while (pileOfScratchcards.some(([amount]) => !!amount)) {
  for (let i = 0; i < pileOfScratchcards.length; i++) {
    const [amount, card] = pileOfScratchcards[i];

    // We don't have any of this card, skip it
    if (!amount) continue;

    // Add cards current amount to total of owned cards and empty pile of this card
    ownedCards += amount;
    pileOfScratchcards[i][0] = 0;

    // Card has no score, so no cards need to be added
    if (!card.matchingNumbers) continue;

    const startIndex = i + 1;
    for (
      let j = startIndex;
      j <
      Math.min(startIndex + card.matchingNumbers, pileOfScratchcards.length);
      j++
    ) {
      pileOfScratchcards[j][0] += amount;
    }
  }
}
console.log(ownedCards);
