import admin from "firebase-admin";
import database from "../database";
import {ITranscript} from "../interfaces";

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
    const transcripts = await database.findTransciptUpdatedTodayNotDone();
    console.log("updated, not done: ", JSON.stringify(transcripts));
    if (transcripts) {
      Object.values(transcripts).map((transcript) => {
        if (this.isTranscriptProcessing(transcript)) {
          if (this.hasTranscriptStoppedProgressing(transcript)) {
            transcriptIds.push(transcript.id);
          }
        }
      })
    }
    console.log("Eligable: ", JSON.stringify(transcriptIds))
    return transcriptIds
  }

  public async update(): Promise<string[]> {
    return this.findTranscriptIdsEligibleForUpdate();
  }

  protected hasTranscriptStoppedProgressing(transcript: ITranscript) {
    // True if lastUpdated is more than 10 minutes ago.
    let hasStoped: boolean = false;
    if (transcript.status && transcript.status.lastUpdated) {
      const lastUpdated = transcript.status.lastUpdated
      // @ts-ignore
      const lastUpdatedDate = lastUpdated.toDate();
      const tenMinutesAgo = new Date();
      tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
      if (lastUpdatedDate < tenMinutesAgo) {
        hasStoped = true;
      }
    }
    return hasStoped;
  }

  protected isTranscriptProcessing(transcript: ITranscript) {
    return true;
  }
}
