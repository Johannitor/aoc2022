export const intersection = <T>(array1: T[], array2: T[]) =>
  array1.filter((item) => array2.includes(item));
