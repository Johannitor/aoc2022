export namespace StringUtil {
  export function toTitleCase(value: string): string {
    if (!value.length) return value;

    const firstChar = value[0];
    const rest = value.slice(1);

    return firstChar.toUpperCase() + rest;
  }
}
