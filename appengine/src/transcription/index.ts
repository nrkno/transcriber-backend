import ua from "universal-analytics"
import database from "../../dist/database";
import {ProgressType, UpdateStatusType} from "../../dist/enums";
import {ISpeechRecognitionResult, IUpdateProgressResponse} from "../../dist/interfaces";
import {fetchSpeechRecognitionResuts} from "../../dist/speech";
import {saveParagraph} from "../../dist/transcription/persistence";
import {persistTranscribeProgressPercent} from "../../dist/transcription/transcribe";

function buildGoogleAnalyticsVisitor(): ua.Visitor {
  const accountId = "not-set"
  if (!accountId) {
    console.warn("Google Analytics account ID missing")
  }

  const visitor = ua(accountId)
  return visitor;
}

export async function updateFromGoogleSpeech(transcriptId: string): Promise<IUpdateProgressResponse> {

  // @ts-ignore
  const updated: IUpdateProgressResponse = {}
  if (!transcriptId) {
    updated.updateStatus = UpdateStatusType.TranscriptionIdMissing
    return updated
  } else {
    updated.transcriptId = transcriptId
  }

  const visitor: ua.Visitor = buildGoogleAnalyticsVisitor(); // Google Analytics
  try {
    const transcript = await database.getTranscript(transcriptId)
    if (transcript && transcript.speechData && transcript.metadata) {
      const transcodedDate = transcript.metadata.startTime // FIXME need right time
      const startDate = transcript.metadata.startTime
      const audioDuration = transcript.metadata.audioDuration
      const googleSpeechRef = transcript.speechData.reference
      if (googleSpeechRef) {
        // Fetch results from Google Operations
        const {speechRecognitionResults, speechRecognitionMetadata} = await fetchSpeechRecognitionResuts(googleSpeechRef);
        console.log(transcriptId, ", updateFromGoogleSpeech; speechRecognitionResults: ", speechRecognitionResults)
        if (speechRecognitionResults && speechRecognitionResults.length > 0) {
          if (speechRecognitionMetadata.progressPercent === 100) {
            // Process the Results
            const transcribedDate = processSpeechRecognitionResults(speechRecognitionResults, transcriptId, visitor, transcodedDate);
            console.log(transcriptId, ", updateFromGoogleSpeech; processedResults")
            // Delete existing paragraphs
            const deletedParagraphsDate = await deleteParagraphs(transcriptId)
            // Save recognition results to database
            const savedDate = await progressSaving(transcriptId, speechRecognitionResults, transcribedDate, visitor);
            console.log(transcriptId, ", updateFromGoogleSpeech; processedResults")
            // Done
            await progressDone(savedDate, startDate, visitor, transcriptId, audioDuration);
            console.log(transcriptId, ", updateFromGoogleSpeech; processedResults")
            updated.updateStatus = UpdateStatusType.UpdatedOk
            updated.lastUpdated = speechRecognitionMetadata.lastUpdateTime
          } else {
            updated.updateStatus = UpdateStatusType.SpeechRecognitionInProgress
            updated.lastUpdated = speechRecognitionMetadata.lastUpdateTime
          }
        } else {
          updated.updateStatus = UpdateStatusType.SpeechRecognitionMissing
          updated.transcriptionProgressPercent = speechRecognitionMetadata.progressPercent
          updated.lastUpdated = speechRecognitionMetadata.lastUpdateTime
          await persistTranscribeProgressPercent(speechRecognitionMetadata, transcriptId);
        }
      } else {
        updated.updateStatus = UpdateStatusType.SpeechRecognitionNotStarted
        console.log(transcriptId, ", updateFromGoogleSpeech; Missing 'transcript.speechData.reference' " +
          "in transcript document. TranscriptId: ", transcriptId)
      }

    } else {
      console.log("Failed to fetch transcript with speechData from transcriptId: ", transcriptId, ": transcript: ", transcript)
      updated.updateStatus = UpdateStatusType.UpdatedOk
    }
  } catch (error) {
    console.error(transcriptId, " updateFromGoogleSpeech; ", error)
    visitor.exception(error.message, true).send()
    await database.errorOccured(transcriptId, error)

    throw error
  }
  return updated

}

function processSpeechRecognitionResults(speechRecognitionResults: ISpeechRecognitionResult[], transcriptId: string,
                                         visitor: ua.Visitor, transcodedDate: number) {
  let numberOfWords = 0
  let accumulatedConfidence = 0
  for (const speechRecognitionResult of speechRecognitionResults) {
    // Accumulating number of words
    if (speechRecognitionResult.alternatives.length > 0) {
      numberOfWords += speechRecognitionResult.alternatives[0].words.length
      // Logging confidence to GA
      accumulatedConfidence += speechRecognitionResult.alternatives[0].confidence * speechRecognitionResult.alternatives[0].words.length
    }
  }

  console.log(transcriptId, "Number of words", numberOfWords)

  // If there are no transcribed words, we cancel the process here.
  if (numberOfWords === 0) {
    throw new Error("Fant ingen ord i lydfilen")
  }
  visitor.set("cm4", numberOfWords)

  // Calculating average confidence per word
  // Confidence will have high precision, i.e. 0.9290443658828735
  // We round it to two digits and log it as an integer, i.e. 9290,
  // since GA only supports decimal numbers for currency.
  const confidence = Math.round((accumulatedConfidence / numberOfWords) * 100 * 100)
  visitor.set("cm9", confidence)
  console.log(transcriptId, "Confidence", confidence)

  const transcribedDate = Date.now()
  const transcribedDuration = transcribedDate - transcodedDate

  visitor.set("cm6", Math.round(transcribedDuration / 1000))
  visitor.event("transcription", "transcribed", transcriptId).send()
  visitor.timing("transcription", "transcribing", Math.round(transcribedDuration), transcriptId).send()

  console.log(transcriptId, "Transcribed duration", transcribedDuration)
  return transcribedDate;
}

async function progressDone(savedDate, startDate, visitor, transcriptId, audioDuration: number) {
  const processDuration = savedDate - startDate
  visitor.set("cm8", Math.round(processDuration / 1000))

  visitor.event("transcription", "done", transcriptId, Math.round(audioDuration)).send()

  await database.setProgress(transcriptId, ProgressType.Done)
}

async function progressSaving(transcriptId, speechRecognitionResults, transcribedDate, visitor) {
  await database.setProgress(transcriptId, ProgressType.Saving)
  await saveParagraph(speechRecognitionResults, transcriptId)

  const savedDate = Date.now()
  const savedDuration = savedDate - transcribedDate

  console.log(transcriptId, "Saved duration", savedDuration)

  visitor.set("cm7", Math.round(savedDuration / 1000))
  visitor.event("transcription", "saved", transcriptId).send()
  visitor.timing("transcription", "saving", Math.round(savedDuration), transcriptId).send()
  return savedDate;
}

async function deleteParagraphs(transcriptId) {
  const paragraphsPath = `/transcripts/${transcriptId}/paragraphs`

  await database.deleteCollection(paragraphsPath, 10)
  return Date.now()
}

export default updateFromGoogleSpeech
