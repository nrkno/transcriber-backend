import database from "../database";

export class ProgressUpdater {
  private greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  public greet(): string {
    return "Hello, " + this.greeting;
  }

  public async findTranscriptIdsEligibleForUpdate(): Promise<string[]> {
    const transcriptIds = []
    const count = await database.findTransciptUpdatedTodayNotDone();
    console.log("Eligable: ", JSON.stringify(count));
    transcriptIds.push(JSON.stringify(count));
    return transcriptIds
  }

  public async update(): Promise<string[]> {
    return this.findTranscriptIdsEligibleForUpdate();
  }
}
