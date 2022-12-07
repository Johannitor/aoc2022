import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';
import { MathUtil } from '@shared/utils/math';

abstract class FsNode {
  abstract get size(): number;
}

class DirectoryNode extends FsNode {
  readonly subDirectories = new Map<string, DirectoryNode>();
  readonly files: FileNode[] = [];

  constructor(
    public readonly name: string,
    public readonly parentDir?: DirectoryNode
  ) {
    super();
  }

  get size(): number {
    return this.getSizeOfSubDirectories() + this.getTotalSizeOfFiles();
  }

  private getSizeOfSubDirectories(): number {
    let totalSize = 0;

    for (const subdirectory of this.subDirectories.values()) {
      totalSize += subdirectory.size;
    }

    return totalSize;
  }

  private getTotalSizeOfFiles(): number {
    return this.files.reduce<number>((acc, file) => acc + file.size, 0);
  }
}

class FileNode extends FsNode {
  constructor(public readonly name: string, private readonly _size: number) {
    super();
  }

  get size(): number {
    return this._size;
  }
}

class TerminalUtil {
  static isCommand(line: string[]) {
    return line[0] === '$';
  }
}

export default class DoorSeven extends AbstractDoor {
  public async run() {
    // ##### PREPARE
    const terminalOutput: string[][] = [];
    for await (const line of this.readFileByLineInterator(
      join(__dirname, './input.txt')
    )) {
      terminalOutput.push(line.split(' '));
    }

    const fileSystem = new DirectoryNode('');
    let currentDirectory = fileSystem;

    let lsOutputBuffer: string[][] = [];
    let collectingOutputForLs = false;

    for (let i = 0; i < terminalOutput.length; i++) {
      const line = terminalOutput[i];

      // Line is an input
      if (TerminalUtil.isCommand(line)) {
        // Remove command marker
        line.shift();

        switch (line.shift()) {
          case 'ls':
            // Clear previous buffer and start output collection
            lsOutputBuffer = [];
            collectingOutputForLs = true;
            break;

          case 'cd':
            const directory = line.shift();
            if (!directory)
              throw Error('Called cd command without a directory parameter!');

            switch (directory) {
              // Navigate to root directory
              case '/':
                currentDirectory = fileSystem;
                break;

              // Navigate to parent directory
              case '..':
                currentDirectory = currentDirectory.parentDir!;
                break;

              // Navigate to subdirectory
              default:
                const directoryToEntry =
                  currentDirectory.subDirectories.get(directory);

                if (!directoryToEntry)
                  throw Error(`Directory ${directory} does not exist!`);

                currentDirectory = directoryToEntry;
            }
            break;
        }
      } else if (collectingOutputForLs) {
        // Collect output data from ls command
        lsOutputBuffer.push(line);

        // If there is no next line or the next line is a command, finish data collection and
        // create nodes
        const nextLine = terminalOutput[i + 1];
        if (!nextLine || nextLine[0] === '$') {
          // Toggle collection
          collectingOutputForLs = false;

          // Build nodes based on ls output
          lsOutputBuffer.forEach(([dirOrSize, name]) => {
            // First section is 'dir' => create a directory
            if (dirOrSize === 'dir') {
              currentDirectory.subDirectories.set(
                name,
                new DirectoryNode(name, currentDirectory)
              );
            }
            // Otherwiese first section is the size and we create a file
            else {
              const size = +dirOrSize;
              currentDirectory.files.push(new FileNode(name, size));
            }
          });
        }
      } else {
        throw new Error('Recieved unprocessable line from terminal!');
      }
    }

    let directorySizes: number[] = [];
    function discoverSubdirectories(directory: DirectoryNode) {
      for (let subDir of directory.subDirectories.values()) {
        const dirSize = subDir.size;

        directorySizes.push(dirSize);

        discoverSubdirectories(subDir);
      }
    }
    discoverSubdirectories(fileSystem);

    // ##### PART 1
    Logger.partHeader(1);
    console.log(MathUtil.sum(...directorySizes.filter((v) => v <= 100_000)));

    // ##### PART 2
    Logger.partHeader(2);

    // Determine how much space we need to cleanup
    const totalSpace = 70_000_000;
    const requiredSpace = 30_000_000;
    const usedSpace = fileSystem.size;
    const freeSpace = totalSpace - usedSpace;
    const missingFreeSpace = requiredSpace - freeSpace;

    // Prepare items for algorithm by sorting them in ascending order
    directorySizes.sort((a, b) => a - b);

    // Go through each item and find the first one thats larger than the space we need to
    // clear
    let lastValue: number = -1;
    for (const size of directorySizes) {
      lastValue = size;

      if (size > missingFreeSpace) break;
    }
    console.log(lastValue);
  }
}
