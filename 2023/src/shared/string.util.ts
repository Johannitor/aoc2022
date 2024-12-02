export const wordIsAtPosition = (
  value: string,
  word: string,
  index: number
) => {
  const valueAfterIndex = value.substring(index);

  return valueAfterIndex.startsWith(word);
};

export const splitAndTrim = (value: string, splitter: string) =>
  value.split(splitter).map((s) => s.trim());
