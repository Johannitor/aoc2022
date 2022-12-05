import { MapObjectEnum, MapType } from './types';

const readline = require('readline');
const fs = require('fs');

export function parseInputData(): Promise<MapType> {
  return new Promise((res) => {
    let objects: MapType = [];

    const readInterface = readline.createInterface(fs.createReadStream('days/3/input.txt'));

    readInterface.on('line', function (line) {
      objects.push([
        ...line.split('')
          .map(char => {
            switch (char) {
              case '#':
                return MapObjectEnum.TREE;
              case '.':
                return MapObjectEnum.OPEN;
            }
          })
      ])
    });

    readInterface.on('close', () => {
      res(objects);
    });
  });
}
