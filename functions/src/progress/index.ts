import * as functions from "firebase-functions";
import ua from "universal-analytics"
import database from "../database"
import {updateFromGoogleSpeech} from "../transcription";

async function updateProgress(data: any, context: functions.https.CallableContext) {
    // ----------------
    // Google analytics
    // ----------------

    const accountId = functions.config().analytics.account_id

    if (!accountId) {
        console.warn("Google Analytics account ID missing")
    }

    const visitor = ua(accountId)

    try {
        // Authentication / user information is automatically added to the request
        if (!context.auth) {
            throw new Error("Authentication missing")
        }
        // Check that transcript id is present
        const transcriptId = data.transcriptId
        if (!transcriptId) {
            throw new Error("Transcript id missing")
        }
        const transcript = await database.getTranscript(transcriptId)

        visitor.set("uid", transcript.userId)

        const userId = context.auth.uid

        // Check that the user owns the transcript
        if (transcript.userId !== userId) {
            throw new Error("User does not own the transcript. You can not update progress on, " + transcriptId)
        }

        console.log("refreshFromGoogleSpeech. transcriptionId: ", transcriptId)
        const status: string = await updateFromGoogleSpeech(transcriptId)
        return { success: true }


    } catch (error) {
        // Log error to console
        console.error(error)

        // Log error to Google Analytics
        visitor.exception(error.message, true).send()

        return { success: false }
    }
}
export default updateProgress
