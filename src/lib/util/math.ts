export namespace MathUtil {
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
}
