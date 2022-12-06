export namespace StringUtil {
  export function toTitleCase(value: string): string {
    if (!value.length) return value;

    const firstChar = value[0];
    const rest = value.slice(1);

    return firstChar.toUpperCase() + rest;
  }

  export function containsDuplicateChars(value: string): boolean {
    const usedChars: string[] = [];

    for (let i = 0; i < value.length; ++i) {
      // Don't run check for first item, as we won't have anything to compare to
      if (i) {
        if (usedChars.includes(value[i])) return true;
      }

      usedChars.push(value[i]);
    }

    return false;
  }
}
