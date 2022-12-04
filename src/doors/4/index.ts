import { red } from 'colorette';
import { throws } from 'node:assert';
import { join } from 'node:path';
import { AbstractDoor } from '../../lib/AbstractDoor';
import { Logger } from '../../lib/Logger';

class CleanupJob {
  private _assignedSections?: number[];

  constructor(
    public readonly rangeStart: number,
    public readonly rangeEnd: number
  ) {}

  /** @param range A string containing the range of sections. Note: End value is inclusive. Format: <startOfRange>-<endOfRange> */
  static fromRangeString(range: string): CleanupJob {
    const [start, end] = range.split('-');

    return new CleanupJob(parseInt(start), parseInt(end));
  }

  get assignedSections(): number[] {
    if (!this._assignedSections) {
      this._assignedSections = [];

      for (let i = this.rangeStart; i < this.rangeEnd + 1; ++i) {
        this.assignedSections.push(i);
      }
    }

    return this.assignedSections;
  }

  // Checks if this jobs range is completly within the job-parameters range
  public isCompletlyCoveredBy(job: CleanupJob): boolean {
    return job.rangeStart <= this.rangeStart && job.rangeEnd >= this.rangeEnd;
  }
}

export default class DoorFour extends AbstractDoor {
  public async run() {
    const jobPairs: [CleanupJob, CleanupJob][] = [];
    for await (const line of this.readFileByLineInterator(
      join(__dirname, './input.txt')
    )) {
      const [job1, job2] = line.split(',');

      jobPairs.push([
        CleanupJob.fromRangeString(job1),
        CleanupJob.fromRangeString(job2),
      ]);
    }
    console.log(`Found ${red(this.formatInt(jobPairs.length))} job pairs!`);

    // ##### PART 1
    Logger.partHeader(1);

    let pairsWithOverlaps = 0;
    for (const [job1, job2] of jobPairs) {
      if (job1.isCompletlyCoveredBy(job2) || job2.isCompletlyCoveredBy(job1)) {
        pairsWithOverlaps++;
      }
    }
    console.log(pairsWithOverlaps);
  }
}
