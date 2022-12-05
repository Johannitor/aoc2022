export namespace ArrayUtil {
  export function maxByFn<T>(array: T[], accessFn: (item: T) => number) {
    let largestItemIndex = 0;
    let largestItemValue = -Infinity;

    array.forEach((item, index) => {
      const itemValue = accessFn(item);

      if (itemValue > largestItemValue) {
        largestItemValue = itemValue;
        largestItemIndex = index;
      }
    });

    return array[largestItemIndex];
  }

  // NOTE: As Array.sort is an in place algorithm, this method will also sort items in place
  export function sortByKey<T>(
    array: T[],
    key: keyof T,
    order: 'ASC' | 'DESC' = 'ASC'
  ): void {
    array.sort((a, b) => {
      if (a[key] === b[key]) return 0;

      const orderModifier = order === 'ASC' ? 1 : -1;

      if (a[key] > b[key]) {
        return 1 * orderModifier;
      }

      return -1 * orderModifier;
    });
  }

  export function getLastItem<T>(array: T[]): T | undefined {
    if (!array.length) return undefined;

    return array[array.length - 1];
  }
}
