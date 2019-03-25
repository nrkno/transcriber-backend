import admin from "firebase-admin"
import * as functions from "firebase-functions"
import database from "../database"

async function migrate(request: functions.Request, response: functions.Response) {
  // 1. Get all transcript ids

  console.log("transcripts")
  const transcripts = await database.getTranscripts()

  // 2. For each transcript, rename document fields

  for (const [transcriptId, transcript] of Object.entries(transcripts)) {
    console.log("FØR trans", transcript, transcriptId)

    const status = transcript.process || undefined
    if (status !== undefined) {
      status.progress = status.step || "DONE"
      status.step = admin.firestore.FieldValue.delete()

      transcript.status = status

      await database.updateTranscript(transcriptId, transcript)
      console.log("oppdaterte", transcriptId, transcript)
    }

    // 3. Rename results and fields
    const results = await database.getResults(transcriptId)

    for (const [resultId, result] of Object.entries(results)) {
      result.words = result.words.map(word => {
        return {
          ...word,
          text: word.word,
        }
      })

      await database.setParagraph(transcriptId, resultId, result)

      // console.log("Satte paragrah", resultId, result)
    }
  }

  response.sendStatus(200)
}

export default migrate
