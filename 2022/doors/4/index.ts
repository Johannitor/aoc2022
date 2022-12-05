import { red, white } from 'colorette';
import { join } from 'node:path';
import { AbstractDoor } from '@shared/lib/AbstractDoor';
import { Logger } from '@shared/lib/Logger';

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

  private isStartingWithin(job: CleanupJob): boolean {
    return job.rangeStart <= this.rangeStart && job.rangeEnd >= this.rangeStart;
  }

  private isEndingWithin(job: CleanupJob): boolean {
    return job.rangeStart <= this.rangeEnd && job.rangeEnd >= this.rangeEnd;
  }

  // Checks if this jobs range is completly within the job-parameters range
  public isCompletlyWithin(job: CleanupJob): boolean {
    return this.isStartingWithin(job) && this.isEndingWithin(job);
  }

  // Checks if this jobs range has a overlap with the job-parameters range
  public hasOverlapWith(job: CleanupJob): boolean {
    // jobs have a partial overlap or this-job is completly within job-parameter
    if (this.isStartingWithin(job) || this.isEndingWithin(job)) return true;

    // job-parameter is compleatly within this-job
    if (this.rangeStart < job.rangeStart && this.rangeEnd > job.rangeEnd)
      return true;

    return false;
  }
}

export default class DoorFour extends AbstractDoor {
  public async run() {
    Logger.segmentStart('Analyzing assignments list...');

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
    Logger.segmentFinish(
      `Found a total of ${white(this.formatInt(jobPairs.length))} job pairs!`
    );

    // ##### PART 1
    Logger.partHeader(1);
    Logger.segmentStart(
      'Determining the amount of job pairs where one jobs range is completly covered by the other jobs range...'
    );
    let pairsWithFullOverlaps = 0;
    for (const [job1, job2] of jobPairs) {
      if (job1.isCompletlyWithin(job2) || job2.isCompletlyWithin(job1)) {
        pairsWithFullOverlaps++;
      }
    }
    Logger.segmentFinish(
      `Found ${red(this.formatInt(pairsWithFullOverlaps))} job pairs!`
    );

    // ##### PART 2
    Logger.partHeader(2);
    Logger.segmentStart(
      'Determining the amount of job pairs where their ranges overlap ...'
    );
    let pairsWithPartialOverlaps = 0;
    for (const [job1, job2] of jobPairs) {
      if (job1.hasOverlapWith(job2)) {
        pairsWithPartialOverlaps++;
      }
    }
    Logger.segmentFinish(
      `Found ${red(this.formatInt(pairsWithPartialOverlaps))} job pairs!`
    );
  }
}
