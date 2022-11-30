export class Logger {
  static printCenteredText(
    width: number,
    text: string,
    modifierFn: (value: string) => string = (v) => v
  ) {
    let result = '';

    // Line will be completly occupied by the text -> no need for padding
    if (text.length >= width) {
      result = text;
    } else {
      const totalPaddingRequired = Math.max(0, width - text.length);
      const sidePadding = totalPaddingRequired / 2;

      // When padding can't be evenly divided between the sides, prefer a more left-aligned text
      result += ' '.repeat(Math.floor(sidePadding));
      result += text;
      result += ' '.repeat(Math.ceil(sidePadding));
    }

    console.log(modifierFn(result));
  }
}
