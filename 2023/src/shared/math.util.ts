export const sum = (values: number[]) =>
  values.reduce((acc, value) => acc + value, 0);

export const isNumber = (value: string) => /^\d+$/.test(value);
