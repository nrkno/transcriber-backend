import * as functions from "firebase-functions"
import database from "../database"

async function migrate(request: functions.Request, response: functions.Response) {
  // 1. Get all transcript ids

  console.log("transcripts")
  const transcripts = await database.getTranscripts()

  console.log(transcripts)

  // 2. For each transcript, rename document fields
  // 3. Rename results and fields

  response.sendStatus(200)
}

export default migrate
