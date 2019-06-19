# Transcriber Backend on Google AppEngine

## Fetch firebase_config

``` 
firebase functions:config:get > your_firebase_config-priv.json
export FIREBASE_CONFIG=<path/to/your_firebase_config-priv.json>
```
## Setup

```
gcloud auth application-default login
gcloud init
gcloud config set project [project-id]
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
