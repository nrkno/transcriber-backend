'use strict';

const transcription = require("./transcription/index");
const operations = require('./operations/index')
const {getTransciptById, findTransciptUpdatedTodayNotDone} = require('./database/index');
const process = require('process'); // Required to mock environment variables

const {format} = require('util');
const express = require('express');
const Multer = require('multer');
const bodyParser = require('body-parser');

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const {Storage} = require('@google-cloud/storage');
const functions = require('firebase-functions')

const storage = new Storage();

const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.json());

// Multer is required to process file uploads and make them available via
// req.files.
const multer = Multer({
                        storage: Multer.memoryStorage(),
                        limits: {
                          fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
                        },
                      });

// A bucket is a container for objects (files).
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

app.get('/admin/transcripts/update', async (req, res) => {
  console.log("run cron job")
  try {
    const transcripts = await findTransciptUpdatedTodayNotDone();
    res.status(200).send("done")
  } catch (error) {
    console.error("Failed to fetch transcripts. Error: ", error);

    // Log error to Google Analytics
    // visitor.exception(error.message, true).send()

    res.status(500).send(serializeError(error))
  }
})

app.get('/api/transcripts/:transcriptId', async (req, res) => {
  const transcriptId = req.params.transcriptId;

  console.log("Find transcript by id: ", transcriptId)

  if (!transcriptId) {
    res.status(422).send("Missing the transcriptId query parameter")
  }
  try {
    const document = await database.getTransciptById(transcriptId);
    console.log("Doc received: ", document)
    if (document) {
      const googleSpeechRef = document.speechData.reference
      const data = await operations(googleSpeechRef)
      console.log("getOpertation; operationName: ", googleSpeechRef, "; data: ", JSON.stringify(data))
      const response = {
        "transcript": document,
        "google-operations": data
      }
      res.status(200).send(JSON.stringify(response))

    } else {
      res.status(404).send("No transcript found: " + transcriptId)
    }

  } catch (error) {
    // Log error to console
    console.error("Failed to fetch transcript. transcriptId: ", transcriptId, ". Error: ", error);

    // Log error to Google Analytics
    // visitor.exception(error.message, true).send()

    res.status(500).send(serializeError(error))
  }


})
// Display a form for uploading files.
app.get('/', (req, res) => {
  res.render('form.pug');
});

// Process the file upload and upload to Google Cloud Storage.
app.post('/upload', multer.single('file'), (req, res, next) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream({
                                              resumable: false,
                                            });

  blobStream.on('error', err => {
    next(err);
  });

  blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );
    res.status(200).send(publicUrl);
  });

  blobStream.end(req.file.buffer);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_storage_app]

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

module.exports = app;
