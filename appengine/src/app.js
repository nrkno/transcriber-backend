'use strict';

const express = require('express');

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
// const {Storage} = require('@google-cloud/storage');
// const functions = require('firebase-functions')


const app = express();

/*
app.get('/admin/transcripts/update', async (req, res) => {
  console.log("run cron job")
  try {
    const transcripts = await findTransciptUpdatedTodayNotDone();
    res.status(200).send("updated " + transcripts)
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


});
*/
// Display a form for uploading files.
app.get('/', (req, res) => {
  res.send("🎉 Hello TypeScript! 🎉");
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});



module.exports = app;
