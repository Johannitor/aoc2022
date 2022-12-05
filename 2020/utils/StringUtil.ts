export class StringUtil {
  static charAppearancesInTerm(term: string, char: string, options?: { max?: number }) {
    let appearances = 0;

    for (let i = 0; i < term.length; ++i) {
      if (term[i] === char) {
        ++appearances;

        if (options?.max && options.max < appearances) {
          break;
        }
      }
    }

    return appearances;
  }
}
