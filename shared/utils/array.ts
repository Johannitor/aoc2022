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

  export function minByFn<T>(array: T[], accessFn: (item: T) => number) {
    let smallestItemIndex = 0;
    let smallestItemValue = Infinity;

    array.forEach((item, index) => {
      const itemValue = accessFn(item);

      if (itemValue < smallestItemValue) {
        smallestItemValue = itemValue;
        smallestItemIndex = index;
      }
    });

    return array[smallestItemIndex];
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

  export function groupPairwise<T>(array: T[]): [T, T][] | undefined {
    // Atleast 2 elements are required to be able to groupBy
    if (array.length < 2) return undefined;

    const result: [T, T][] = [];
    for (let i = 1; i < array.length; ++i) {
      result.push([array[i - 1], array[i]] satisfies [T, T]);
    }

    return result;
  }

  export function uniqByFn<T>(array: T[], fn: (item: T) => string) {
    const resultMap = new Map<string, T>();

    array.forEach((item) => {
      const key = fn(item);
      if (!resultMap.has(key)) resultMap.set(key, item);
    });

    return Array.from(resultMap.values());
  }
}
