#!/bin/sh
export GOOGLE_APPLICATION_CREDENTIALS="./google-cloud-auth.json"
curl -i -X GET \
   -H "Authorization:Bearer  $(gcloud auth application-default print-access-token)" \
   -H "Content-Type:Content-Type: application/json; charset=utf-8" \
 'https://speech.googleapis.com/v1/operations/3090750687115944046'
