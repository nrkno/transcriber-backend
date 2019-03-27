/**
 * @file Authenticate user from Authorization header
 * @author Bard Lind (bard.lind@gmail.com)
 */
import {GetSignedUrlConfig} from "@google-cloud/storage"
import cookieParser from "cookie-parser"
import cors from "cors";
import express, {response} from "express";
import admin from "firebase-admin"
import * as functions from "firebase-functions"
import serializeError from "serialize-error";
import database from "../database";
import {ProgressType} from "../enums";
import {ITranscript} from "../interfaces";
import {bucket} from "../transcription/storage";

const app = express();


// Only initialise the app once
if (!admin.apps.length) {
    admin.initializeApp(functions.config().firebase)
} else {
    admin.app()
}
// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = (req, res, next) => {
    console.log('Check if request is authorized with Firebase ID token');

    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
            'Make sure you authorize your request by providing the following HTTP header:',
            'Authorization: Bearer <Firebase ID Token>',
            'or by passing a "__session" cookie.');
        res.status(403).send('Unauthorized');
        return;
    }

    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        console.log('Found "Authorization" header');
        // Read the ID Token from the Authorization header.
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else if (req.cookies) {
        console.log('Found "__session" cookie');
        // Read the ID Token from cookie.
        idToken = req.cookies.__session;
    } else {
        // No cookie
        res.status(403).send('Unauthorized');
        return;
    }
    admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
        console.log('ID Token correctly decoded', decodedIdToken);
        req.user = decodedIdToken;
        return next();
    }).catch((error) => {
        console.error('Error while verifying Firebase ID token:', error);
        res.status(403).send('Unauthorized');
    });
};

app.use(cors());
app.use(cookieParser());
app.use(validateFirebaseIdToken);
app.get('/hello', (req, res) => {
    res.status(200).send(`Hello ${req.user.user_id}`);
});
app.post('/transcriptId', (request, res) => { // TODO bli naming
    const transcriptId = database.buildNewId();
    console.log("transcriptId: ", transcriptId);
    res.status(200).send(transcriptId);

});
app.post('/uploadUrl', (request, resp) => {
    const transcriptId = request.query.transcriptId;
    if (!transcriptId) {
        resp.status(422).send("Missing the transcriptId query parameter");
    }
    const userId = request.user.user_id;
    if (!userId) {
        resp.status(422).send("Missing the user_id from your authorization token.");
    }
    const file = bucket.file("media/" + userId + "/" + transcriptId + "-original");
    const contentType = request.header("Content-Type");
    if (!contentType) {
        resp.status(422).send("Missing the Content-Type header parameter");
    }
    const config: GetSignedUrlConfig = {
        action: 'write',
        contentType,
        expires: '03-17-2025'
    }
    const data = file.getSignedUrl(config).then((signedUrlData) => {
        const url = signedUrlData[0];
        resp.status(201).send(url);
    }).catch((err) => {
        console.error("Failed to create uploadUrl. Reason: ", err);
        resp.status(412).send("Failed to create uploadUrl for transcriptId: " + transcriptId);
    })

});
app.post('/transcripts/:transcriptId', (request, resp) => {
    const transcriptId = request.params.transcriptId;
    if (!transcriptId) {
        resp.status(422).send("Missing the transcriptId query parameter");
    }
    console.log("Create Transcript from body: ", request.body);
    let mimeType = request.query.originalMimeType;
    if (!mimeType) {
       mimeType = request.body.originalMimeType
    }
    if (!mimeType) {
        resp.status(422).send("Missing the originalMimeType body parameter.");
    }
    const userId = request.user.user_id;
    if (!userId) {
        resp.status(422).send("Missing the user_id from your authorization token.");
    }
    const transcript: ITranscript = {
        metadata: {
            languageCodes: ["nb-NO"],
            originalMimeType: mimeType
        },
        status: {
            progress: ProgressType.Uploading
        },
        userId
    };

    database.updateTranscript(transcriptId, transcript).then((transcriptDoc) => {
        const locationUri = "/api/transcripts/" + transcriptId;
        resp.location(locationUri).status(202).send("Follow location header to find transcription status.");
    }).catch((error) => {
        console.error("Failed to create uploadUrl. Reason: ", error);
        resp.status(412).send("Failed to create transcription Doc for transcriptId: " + transcriptId);
    });
});
app.get('/transcripts/:transcriptId', async (req, resp) => {
    const transcriptId = req.params.transcriptId;

    if (!transcriptId) {
        resp.status(422).send("Missing the transcriptId query parameter")
    }

    try {
        const transcript = await database.getTranscript(transcriptId);
        console.log("Found transcript: ", transcript);
        if (transcript && transcript.userId) {
            if (transcript.userId === req.user.user_id) {
                resp.status(200).send(transcript);
            } else {
                console.log("Transcript ", transcriptId, " was found. The userId's do not match. from IdToken: ", req.user.user_id,
                    " from transcript: ", transcript.userId);
                resp.send(404)
            }
        } else {
            console.log("Transcript ", transcriptId,  " does not exist.");
            resp.send(404)
        }

    } catch (error) {
        // Log error to console
        console.error("Failed to fetch transcript. transcriptId: ", transcriptId, ". Error: ", error);

        // Log error to Google Analytics
        // visitor.exception(error.message, true).send()

        resp.status(500).send(serializeError(error))
    }
})

export default app
