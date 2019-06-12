# Transcriber Backend on Google AppEngine

Ideas from https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/appengine/storage/standard


## Setup

```
gcloud auth application-default login
gsutil mb gs://<your-bucket-name>
gsutil defacl set public-read gs://<your-bucket-name>
gcloud init
export GOOGLE_CLOUD_PROJECT=<your-project-id>
export GCLOUD_STORAGE_BUCKET=<your-bucket-name>
npm install
npm start
```

### Verify
http://localhost:8080
Select and upload file.
Download file from the url that was printed.

## Deploy

```
gcloud app deploy
```

### Verify
https://<your-project-id>.appspot.com
Select and upload file.
Download file from the url that was printed.
