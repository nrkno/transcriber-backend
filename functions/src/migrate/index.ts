import * as functions from "firebase-functions"
import database from "../database"

async function migrate(request: functions.Request, response: functions.Response) {
  // 1. Get all transcript ids

  console.log("transcripts")
  const transcripts = await database.getTranscripts()

  // 2. For each transcript, rename document fields

  for (const transcript of transcripts) {
    console.log("FØR", transcript)

    const status = transcript.process || undefined
    status.progress = status.step || undefined
    status.step = undefined

    transcript.status = status
    transcript.process = undefined

    console.log("ETTER", transcript)
  }

  // 3. Rename results and fields

  response.sendStatus(200)
}

export default migrate
