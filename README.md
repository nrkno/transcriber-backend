# Transcriber

Transcriber is a web app using Google speech-to-text API for transcribing audio files. Transcoding, transcription and database is handled by Cloud functions and Firebase, while React JS is used for the web frontend.

## How to use this API

1. Generate upload url: 
```
curl -H "Content-Type: audio/*" \ 
  "https://<region>-<project-id>.cloudfunctions.net/getUploadUrl"
  ```
2. Upload an audio file 
```
curl -X PUT --data-binary @$FILE_PATH \
    -H "Content-Type: audio/*" \
    "<upload-url>"
```
3. Transcribe: `curl https://<region>-<project-id>.cloudfunctions.net/swagger`
4. Export transcriptions: `curl https://<region>-<project-id>.cloudfunctions.net/swagger`

## Tech overview

* [Google Cloud Storage](https://cloud.google.com/storage/)
* [Cloud Functions for Firebase](https://firebase.google.com/docs/functions/)
* [Cloud Speech-to-text](https://cloud.google.com/speech-to-text/)
* [Cloud Firestore](https://firebase.google.com/docs/firestore/)


## Set up

- Create a [Firebase project](https://console.firebase.google.com/)
- Turn on the Firestore database and Storage.
-- TODO how to do this? Prefer cli/.sh
-- TODO enable security for generating uploadUrl
- Copy [.firebaserc_sample] to .firebaserc
- Edit `.firebaserc` with the name of your Firebase project.
- Install the Firebase CLI: `npm install -g firebase-tools`

### Firebase Storage
- Use the default bucket in Firebase Storage, or create a new one
TODO how to define default bucket in config

### Deploy environment variables
set up environment variables with the name of the bucket you just created, along with your Google Analytics account ID:

```
> firebase functions:config:set \
bucket.name="name-of-bucket" \
webserver.domainname="https://www.example.com"

```
### Enable Google Speech
- Enable the [Google Speech API](https://console.developers.google.com/apis/api/speech.googleapis.com/overview).

## Config
`
cd functions
firebase functions:config:set bucket.name=transcribe-baardl`

### Testing

Create a `.env` file in the `test` folder with the following attributes:

```
FIREBASE_DATABASE_URL = https:...
FIREBASE_UPLOADS_BUCKET = name-of-uploads-bucket
FIREBASE_TRANSCODED_BUCKET = name-of-transcoded-bucket
```

## Deployment

### Configuration
```
> firebase functions:config:set \
analytics.account_id="UA-XXXXXX-XX" \
bucket.name="name-of-bucket" \
sendgrid.apikey="api key" \
sendgrid.email="you@email.com" \
sendgrid.name="Your name" \
webserver.domainname="https://www.example.com"

```
### Deploy code

TODO From which directory?

```sh
cd functions
npm run deploy
```
or?
```sh
firebase deploy
```
## Verifications

TODO eg `curl https://<region>-<project-id>.cloudfunctions.net/health`

## API Documentation

TODO Use Swagger  `curl https://<region>-<project-id>.cloudfunctions.net/swagger`

## Google Analytics

Exceptions are logged.

#### Transcription

##### Custom dimensions

- cd1: Language codes
- cd2: Original MIME type
- cd3: Industry NAICS code of audio
- cd4: Interaction type
- cd5: Microphone distance
- cd6: Original media type
- cd7: Recording device name
- cd8: Recording device type

##### Custom metrics

- cm1: Number of audio topic words
- cm2: Number of speech contexts phrases
- cm3: Audio duration
- cm4: Number of words
- cm5: Transcoding duration
- cm6: Transcribing duration
- cm7: Saving duration
- cm8: Process duration (transcoding + transcribing + saving)
- cm9: Confidence

##### Events

| Category      | Action        | Label         | Value          |
| ------------- | ------------- | ------------- | -------------- |
| transcription | transcoded    | transcript id |                |
| transcription | transcribed   | transcript id |                |
| transcription | saved         | transcript id |                |
| transcription | done          | transcript id | audio duration |
| api           | authorization | idtoken       | token          |
| api           | authorization | customtoken   | token          |

##### User timings

- transcription → transcoding
- transcription → transcribing
- transcription → saving

#### Export

##### Events

| Category   | Action             | Label         |
| ---------- | ------------------ | ------------- |
| transcript | exported           | [type]        |
| transcript | deleted            | step          |
| email      | transcription done | transcript id |
