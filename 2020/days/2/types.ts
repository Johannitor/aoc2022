export interface ParsedDatabasePassword {
  policy: {
    count: {
      min: number,
      max: number,
    },
    character: string,
  },
  password: string,
}
