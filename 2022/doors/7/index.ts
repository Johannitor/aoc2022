import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';
import { MathUtil } from '@shared/utils/math';
import { bold, italic, red, underline, white, yellow } from 'colorette';
import { printWidth } from '../..';

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

  // NOTE: This try to replicate the folder view seen inside the challenge
  toString(depth: number = 0) {
    let subDirsString = '';
    for (const subDir of this.subDirectories.values()) {
      subDirsString += subDir.toString(depth + 1);
    }

    let filesString = '';
    for (let file of this.files) {
      filesString += file.toString(depth + 1);
      filesString += '\n';
    }

    return (
      `${' '.repeat(depth * 2)}- ${white(this.name)} (dir)\n` +
      subDirsString +
      filesString
    );
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

  toString(depth: number) {
    return `${' '.repeat(depth * 2)}- ${white(this.name)} (file, size=${
      this._size
    })`;
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

    const fileSystem = new DirectoryNode('/');
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

    let directorySizes: { size: number; name: string }[] = [];
    function discoverSubdirectories(directory: DirectoryNode) {
      for (let subDir of directory.subDirectories.values()) {
        const { size } = subDir;
        let nameSegments = [];
        let currentDir: DirectoryNode | undefined = subDir;
        do {
          nameSegments.push(currentDir.name);
          currentDir = currentDir.parentDir;
        } while (currentDir);

        directorySizes.push({ size, name: nameSegments.reverse().join('/') });

        discoverSubdirectories(subDir);
      }
    }
    discoverSubdirectories(fileSystem);

    console.log(white(bold('Directory overview')));
    console.log(fileSystem.toString());

    console.log('-'.repeat(printWidth));
    console.log();

    // ##### PART 1
    Logger.partHeader(1);
    Logger.segmentStart(
      'Collecting all directories with a total size smaller than 100k'
    );
    const directoriesBelowSizeLimit = directorySizes.filter(
      (v) => v.size <= 100_000
    );
    Logger.segmentFinish(
      `Found a total of ${red(
        this.formatInt(directoriesBelowSizeLimit.length)
      )} directories below size limit totaling a szie of ${red(
        this.formatInt(
          directoriesBelowSizeLimit.reduce((acc, d) => acc + d.size, 0)
        )
      )}`
    );

    // ##### PART 2
    Logger.partHeader(2);

    Logger.segmentStart(
      'Calculating how much disk space needs to be freed up...'
    );
    // Determine how much space we need to cleanup
    const totalSpace = 70_000_000;
    const requiredSpace = 30_000_000;
    const usedSpace = fileSystem.size;
    const freeSpace = totalSpace - usedSpace;
    const missingFreeSpace = requiredSpace - freeSpace;

    Logger.segmentFinish(
      `A total of ${red(
        this.formatInt(missingFreeSpace)
      )} bytes need to be cleared.`
    );

    // Prepare items for algorithm by sorting them in ascending order
    directorySizes.sort((a, b) => a.size - b.size);

    Logger.segmentStart(
      'Determining best single directory to delete in order to free up enough space...'
    );
    // Go through each item and find the first one thats larger than the space we need to
    // clear
    let lastDir: { name: string; size: number } | null = null;
    for (const dir of directorySizes) {
      lastDir = dir;

      if (lastDir?.size > missingFreeSpace) break;
    }
    Logger.segmentFinish(
      `Smallest directory freeing up enough space is ${white(
        underline(lastDir?.name!)
      )} with a size of ${red(this.formatInt(lastDir?.size!))}`
    );
  }
}
