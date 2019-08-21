import {MailData} from "@sendgrid/helpers/classes/mail"
import admin from "firebase-admin"
import * as functions from "firebase-functions"
import ua from "universal-analytics"
import database from "../database"
import {ProgressType, UpdateStatusType} from "../enums"
import {ISpeechRecognitionResult, ITranscript, IUpdateProgressResponse} from "../interfaces"
import sendEmail from "../sendEmail"
import {fetchSpeechRecognitionResuts} from "../speech";
import {saveParagraph} from "./persistence"
import {transcode} from "./transcoding"
import {persistTranscribeProgressPercent, transcribe} from "./transcribe"

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

function processSpeechRecognitionResults(speechRecognitionResults: ISpeechRecognitionResult[], transcriptId: string, visitor: ua.Visitor, transcodedDate: number) {
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

async function prepareAndSendEmail(transcript, transcriptId, visitor) {
  const domainname: string = functions.config().webserver.domainname

  if (domainname === undefined) {
    throw new Error("Domain name missing from config")
  }

  // Get user

  const userRecord = await admin.auth().getUser(transcript.userId)

  const {email, displayName} = userRecord

  if (email === undefined) {
    throw new Error("E-mail missing from user")
  }

  const mailData: MailData = {
    from: {
      email: "Will be populated in sendEmail(..)",
      name: "Will be populated in sendEmail(..)",
    },
    subject: `${transcript.name} er ferdig transkribert`,
    text: `Filen ${transcript.name} er ferdig transkribert. Du finner den på ${domainname}/transcripts/${transcriptId} `,
    to: {
      email,
      name: displayName,
    },
  }

  await sendEmail(mailData)
  visitor.event("email", "transcription done", transcriptId).send()
}

function buildGoogleAnalyticsVisitor(): ua.Visitor {
  const accountId = functions.config().analytics.account_id

  if (!accountId) {
    console.warn("Google Analytics account ID missing")
  }

  const visitor = ua(accountId)
  return visitor;
}

async function transcription(documentSnapshot: FirebaseFirestore.DocumentSnapshot /*, eventContext*/) {
  console.log("Start: ", documentSnapshot.id)

  // ----------------
  // Google analytics
  // ----------------

  const visitor = buildGoogleAnalyticsVisitor();


  try {
    const startDate = Date.now()

    const transcriptId = documentSnapshot.id

    // Because of indempotency, we need to fetch the transcript from
    // the server and check if it's already in process
    console.log("transcription: getProgress: transcriptionId: ", transcriptId)
    const progress = await database.getProgress(transcriptId)
    console.log("transcription: getProgress: progress: ", progress)
    if (progress !== ProgressType.Uploading) {
      console.warn("Transcript already processed, returning. TranscriptId: ", transcriptId)
      return
    }

    // Check for mandatory fields

    let transcript = documentSnapshot.data() as ITranscript

    if (transcript === undefined) {
      throw Error("Transcript missing")
    } else if (transcript.userId === undefined) {
      throw Error("User id missing")
    } else if (transcript.metadata === undefined) {
      throw Error("Metadata missing")
    } else if (transcript.metadata.languageCodes === undefined) {
      throw Error("Language codes missing")
    } else if (transcript.metadata.originalMimeType === undefined) {
      throw Error("Original mime type missing")
    }

    // Setting user id

    visitor.set("uid", transcript.userId)

    // Setting custom dimensions

    visitor.set("cd1", transcript.metadata.languageCodes.join(","))
    visitor.set("cd2", transcript.metadata.originalMimeType)

    if (transcript.metadata.industryNaicsCodeOfAudio) {
      visitor.set("cd3", transcript.metadata.industryNaicsCodeOfAudio)
    }

    if (transcript.metadata.interactionType) {
      visitor.set("cd4", transcript.metadata.interactionType)
    }

    if (transcript.metadata.microphoneDistance) {
      visitor.set("cd5", transcript.metadata.microphoneDistance)
    }

    if (transcript.metadata.originalMediaType) {
      visitor.set("cd6", transcript.metadata.originalMediaType)
    }

    if (transcript.metadata.recordingDeviceName) {
      visitor.set("cd7", transcript.metadata.recordingDeviceName)
    }

    if (transcript.metadata.recordingDeviceType) {
      visitor.set("cd8", transcript.metadata.recordingDeviceType)
    }

    // Setting custom metrics

    visitor.set("cm1", transcript.metadata.audioTopic ? transcript.metadata.audioTopic.split(" ").length : 0)
    visitor.set("cm2", transcript.metadata.speechContexts ? transcript.metadata.speechContexts[0].phrases.length : 0)

    // -----------------
    // Step 1: Transcode
    // -----------------

    await database.setProgress(transcriptId, ProgressType.Analysing)
    const { audioDuration, gsUri } = await transcode(transcriptId, transcript.userId)

    // -----------------------------------------------------------------------
    // Check if transcript has been deleted by user while transcribing
    // -----------------------------------------------------------------------
    transcript = await database.getTranscript(transcriptId)
    if (!transcript || (transcript && !transcript.metadata)) {
      console.log(transcriptId, "Transcript deleted by user, will not save.")
      await database.deleteTranscript(transcriptId)
      return
    }

    await database.updateFlacFileLocation(transcriptId, gsUri)
    visitor.set("cm3", Math.round(audioDuration))

    const transcodedDate = Date.now()
    const transcodedDuration = transcodedDate - startDate

    visitor.set("cm5", Math.round(transcodedDuration / 1000))
    visitor.event("transcription", "transcoded", transcriptId).send()
    visitor.timing("transcription", "transcoding", Math.round(transcodedDuration), transcriptId).send()

    console.log(transcriptId, "Transcoded duration", transcodedDuration)

    // ------------------
    // Step 2: Transcribe
    // ------------------

    await database.setProgress(transcriptId, ProgressType.Transcribing)
    const speechRecognitionResults = await transcribe(transcriptId, transcript, gsUri)

    // -----------------------------------------------------------------------
    // Check if transcript has been deleted by user while transcribing
    // -----------------------------------------------------------------------
    transcript = await database.getTranscript(transcriptId)
    if (!transcript || (transcript && !transcript.metadata)) {
      console.log(transcriptId, "Transcript deleted by user, will not save.")
      await database.deleteTranscript(transcriptId)
      return
    }

    const transcribedDate = processSpeechRecognitionResults(speechRecognitionResults, transcriptId, visitor, transcodedDate);

    // ------------
    // Step 3: Save
    // ------------
    const savedDate = await progressSaving(transcriptId, speechRecognitionResults, transcribedDate, visitor);

    // Done
    await progressDone(savedDate, startDate, visitor, transcriptId, audioDuration);

    // -------------------
    // Step 4: Send e-mail
    // -------------------
    await prepareAndSendEmail(transcript, transcriptId, visitor);

  } catch (error) {
    // Log error to console

    console.error(error)

    // Log error to Google Analytics

    visitor.exception(error.message, true).send()

    // Log error to database
    console.log("Write error to database. Id: ", documentSnapshot.id, ", error: ", error)
    await database.errorOccured(documentSnapshot.id, error)

    throw error
  }
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
  const visitor:ua.Visitor = buildGoogleAnalyticsVisitor()
  try {

    const transcript = await database.getTranscript(transcriptId)
    if (transcript && transcript.speechData && transcript.metadata) {
      const transcodedDate = transcript.metadata.startTime
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
            // Save to recocnition results to database
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
        console.log(transcriptId, ", updateFromGoogleSpeech; Missing 'transcript.speechData.reference' in transcript document. TranscriptId: ", transcriptId)
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



export default transcription
