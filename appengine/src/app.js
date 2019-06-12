/**
 * Copyright 2016, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';


const transcription = require("./transcription/index");
const database = require('./database/index')

const process = require('process'); // Required to mock environment variables

// [START gae_storage_app]
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

// Instantiate a storage client
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

app.get('/transcripts/:transcriptId', async (req, res) => {
  const transcriptId = req.params.transcriptId;

  console.log("Find transcript by id: ", transcriptId)

  if (!transcriptId) {
    res.status(422).send("Missing the transcriptId query parameter")
  }

  const document = await database(transcriptId);
  console.log("Doc received: ", document)
/*
  try {
    const transcript = await database.getTranscript(transcriptId);
    transcript.id = transcriptId;
    const paragraphs = await database.getParagraphs(transcriptId);
    transcript.paragraphs = paragraphs;
    console.log("Found transcript: ", transcript);
    if (transcript && transcript.userId) {
      if (transcript.userId === req.user.user_id) {
        res.contentType("application/json").status(200).send(transcript);
      } else {
        console.log("Transcript ", transcriptId, " was found. The userId's do not match. from IdToken: ", req.user.user_id,
                    " from transcript: ", transcript.userId);
        res.send(404)
      }
    } else {
      console.log("Transcript ", transcriptId,  " does not exist.");
      res.send(404)
    }

  } catch (error) {
    // Log error to console
    console.error("Failed to fetch transcript. transcriptId: ", transcriptId, ". Error: ", error);

    // Log error to Google Analytics
    // visitor.exception(error.message, true).send()

    res.status(500).send(serializeError(error))
  }
  */
res.status(200).send("Got: " + transcriptId)
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
