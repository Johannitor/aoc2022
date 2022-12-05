export function findValuePairsForCondition<T, V>(
  array1: T[],
  array2: V[],
  condition: (a: T, b: V) => boolean,
  options?: {
    limit?: number,
    arraysAreEqual?: boolean,
  }
): [T,V][] {
  const {limit, arraysAreEqual} = options;
  const output: [T,V][] = [];

  for(let i = 0; i < array1.length; ++i) {
    // If both arrays are equal, we can start the second for-loop at the current item as all combinations
    // with the items before have already been checked
    for(let j = (arraysAreEqual ? i : 0); j < array1.length; ++j) {
      if(condition(array1[i], array2[j])) {
        output.push([array1[i], array2[j]]);
        // if there is a limit and we are currently at or above the limit, exit out early to save cycles
        if(limit && output.length >= limit) {
          return output;
        }
      }
    }
  }

  return output;
}
