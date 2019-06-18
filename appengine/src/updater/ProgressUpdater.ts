import admin from "firebase-admin";
import database from "../../dist/database";
import {ITranscript} from "../../dist/interfaces";
import {updateFromGoogleSpeech} from "../transcription";

export class ProgressUpdater {
  private greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  public async update(): Promise<string[]> {
    const eligibleTranscriptIds: string[] = await this.findTranscriptIdsEligibleForUpdate();
    // console.debug("eligibleTranscriptIds: ", eligibleTranscriptIds)
    for (const transcriptId of eligibleTranscriptIds) {
      console.debug("updateProgress for transcriptId: ", transcriptId);
      const updateResponse = await updateFromGoogleSpeech(transcriptId);
      console.debug("updateProgress done for transcriptId: ", transcriptId, " ; response: ", updateResponse);
    }
    return eligibleTranscriptIds;
  }

  public async findTranscriptIdsEligibleForUpdate(): Promise<string[]> {
    const transcriptIds = []
    const transcripts = await database.findTransciptUpdatedTodayNotDone();
    console.debug("transcripts created last two days, not done: ", JSON.stringify(transcripts));
    if (transcripts) {
      Object.values(transcripts).map((transcript) => {
        if (this.isTranscriptProcessing(transcript)) {
          if (this.hasTranscriptStoppedProgressing(transcript)) {
            transcriptIds.push(transcript.id);
          }
        }
      })
    }
    if (transcriptIds && transcriptIds.length > 0) {
      console.debug("eligibleTranscriptIds: ", JSON.stringify(transcriptIds));
    }
    return transcriptIds
  }

  protected isTranscriptProcessing(transcript: ITranscript) {
    return true;
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

}
