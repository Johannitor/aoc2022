import { PlaneSeatType } from './types';

export function calculateNumberFromPattern(pattern: string, lowerChar: string, upperChar: string) {
  let base = 0;
  let top = 2 ** pattern.length;

  for (let i = 0; i < pattern.length; ++i) {
    const halfWidth = (top - base) / 2;
    if (pattern[i] === lowerChar) {
      top = top - halfWidth;
    } else if (pattern[i] === upperChar) {
      base = base + halfWidth;
    }
  }

  return base;
}

export function parseSeat(pattern: string): PlaneSeatType {
  // separate columns and rows pattern
  const rowPattern = pattern.substring(0, 7);
  const columnPattern = pattern.substring(7);

  // calculate column and row
  const row = calculateNumberFromPattern(rowPattern, 'F', 'B');
  const column = calculateNumberFromPattern(columnPattern, 'L', 'R');

  // calculate seatId and return everything
  return {
    row,
    column,
    seatId: (row * 8) + column,
    id: pattern
  }
}

export function findMissingSeatId(sortedSeats: PlaneSeatType[]): number {
  // set currentId to one lower than the lowest known seat id
  let currentId = sortedSeats[0].seatId - 1;

  // loop through sorted seats
  for (let seat of sortedSeats) {
    // check if id of current seat is one higher than the previous one
    if (seat.seatId - currentId === 1) {
      // if it is, go to the next seat
      currentId++;
    } else {
      // if it isn't, the seat id after the last seat is missing so return it and break the loop (add 1 as currentId is the
      // id of the last know existing seat so the missing seat is the one after it)
      return currentId + 1;
    }
  }

}
