# Transcriber Backend on Google AppEngine

Ideas from https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/appengine/storage/standard

## Fetch firebase_config

``` 
firebase functions:config:get > your_firebase_config-priv.json
export FIREBASE_CONFIG=<path/to/your_firebase_config-priv.json>
```
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
npm run deploy
```

### Verify
https://<your-project-id>.appspot.com
Select and upload file.
Download file from the url that was printed.

## Cron

Update [cron.yaml](cron.yaml) then
```
gcloud app deploy cron.yaml
```

## Development
Note: Code is also copied from the functions/src directory. 

```
npm run dev
```
