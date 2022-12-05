const readline = require('readline');
const fs = require('fs');

export function readFileByLines(filepath: string): Promise<string[]> {
  return new Promise((res) => {
    let lines: string[] = [];

    const readInterface = readline.createInterface(fs.createReadStream(filepath));

    readInterface.on('line', (line: string) => {
      lines.push(line);
    });

    readInterface.on('close', () => {
      res(lines);
    });
  });
}
