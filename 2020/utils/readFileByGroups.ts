const readline = require('readline');
const fs = require('fs');

export function readFileByGroups(filepath: string): Promise<string[][]> {
  return new Promise((res) => {
    let groups: string[][] = [];
    let currentGroup: string[] = [];

    const readInterface = readline.createInterface(fs.createReadStream(filepath));

    readInterface.on('line', (line: string) => {
      if (line) {
        currentGroup.push(line);
      } else {
        groups.push(currentGroup);
        currentGroup = [];
      }
    });

    readInterface.on('close', () => {
      groups.push(currentGroup);
      res(groups);
    });
  });
}
