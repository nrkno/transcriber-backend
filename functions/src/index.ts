/**
 * @file Google Cloud function
 * @author Andreas Schjønhaug
 */

import * as functions from "firebase-functions"
import api from "./api"
import app from "./api/authenticatedApi";
import deleteTranscript from "./deleteTranscript"
import exportTranscript from "./exportTranscript"
import transcription from "./transcription"

// --------------------
// Create transcription
// --------------------

exports.transcription = functions
  .region("europe-west1")
  .runWith({
    memory: "2GB",
    timeoutSeconds: 540,
  })
  .firestore.document("transcripts/{transcriptId}")
  .onCreate(transcription)

// --------------------
// Delete transcription
// --------------------

exports.deleteTranscript = functions
  .region("europe-west1")
  .runWith({
    memory: "2GB",
    timeoutSeconds: 540,
  })
  .https.onCall(deleteTranscript);

// --------------------
// API
// --------------------
exports.createTranscriptId = functions.region("europe-west1").https.onRequest(api.createTranscriptId);
exports.getTranscript = functions.region("europe-west1").https.onRequest(api.getTranscript);
exports.getUploadUrl = functions.region("europe-west1").https.onRequest(api.getUploadUrl);
exports.transcriptions = functions.region("europe-west1").https.onRequest(api.createTransctript);
exports.api = functions.region("europe-west1").https.onRequest(app);

// ------
// Export
// ------

exports.exportTranscript = functions.region("europe-west1").https.onRequest(exportTranscript)

// Catch unhandled rejections
process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error(new Error(`Unhandled Rejection at: Promise: ${promise} with reason: ${reason.stack || reason}`))
})
