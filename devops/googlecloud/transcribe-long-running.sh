#!/bin/sh
#set GOOGLE_APPLICATION_CREDENTIALS="./transcribe-baardl-auth.json"
curl -X POST \
     -H "Authorization: Bearer "$(gcloud auth application-default print-access-token) \
     -H "Content-Type: application/json; charset=utf-8" \
     --data "{
  'config': {
    'language_code': 'no-NO'
  },
  'audio':{
    'uri':'gs://gs://staging.transcribe-baardl.appspot.com/hvitemenn-01-min.mp3'
  }
}" "https://speech.googleapis.com/v1/speech:longrunningrecognize"
