export class ProgressUpdater {
  private greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  public greet(): string {
    return "Hello, " + this.greeting;
  }

  public findTranscriptIdsEligibleForUpdate(): string[] {
    const transcriptIds = []
    transcriptIds.push("555446")
    return transcriptIds
  }

  public update(): string[] {
    return this.findTranscriptIdsEligibleForUpdate();
  }
}
