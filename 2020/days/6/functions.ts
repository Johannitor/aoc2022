export function getUniqueChars(strings: string[]) {
  const chars = strings
    .join('') // join separate strings into a huge complete one
    .split(''); // split string into separate chars

  const uniqueChars = new Set(chars); // remove duplicates by converting array into set

  return [...uniqueChars].join(''); // rejoin all chars into a string by converting set back into array and then joining it
}

export function getNonUniqueChars(strings: string[]) {
  let charAppearancesMap: Record<string, number> = {};

  for (let string of strings) {
    const chars = string.split('');
    chars.forEach(char => {
      if (charAppearancesMap[char]) {
        charAppearancesMap[char] += 1;
      } else {
        charAppearancesMap[char] = 1;
      }
    })
  }

  let charsThatAppearedMultipleTimes = [];
  Object.entries(charAppearancesMap)
    .forEach(([char, appearances]) => {
      if (appearances === strings.length) {
        charsThatAppearedMultipleTimes.push(char);
      }
    })

  return charsThatAppearedMultipleTimes.join('');
}
