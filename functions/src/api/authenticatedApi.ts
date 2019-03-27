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
import database from "../database";
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
    } else if(req.cookies) {
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
app.get('/uploadUrl', (request, response1) => {
    const transcriptId = request.query.transcriptId;
    if (!transcriptId) {
        response1.status(422).send("Missing the transcriptId query parameter");
    }
    const userId = request.user.user_id;
    if (!userId) {
        response1.status(422).send("Missing the user_id from your authorization token.");
    }
    const file = bucket.file("media/" + userId + "/" + transcriptId + "-original");
    const contentType = request.header("Content-Type");
    if (!contentType) {
        response1.status(422).send("Missing the Content-Type header parameter");
    }
    const config: GetSignedUrlConfig = {
        action: 'write',
        contentType,
        expires: '03-17-2025'
    }
    const data = file.getSignedUrl(config).then((signedUrlData) => {
        const url = signedUrlData[0];
        response1.status(200).send(url);
    }).catch( (err) => {
        console.error("Failed to create uploadUrl. Reason: ", err);
        response1.status(412).send("Failed to create uploadUrl for transcriptId: ", transcriptId);
    })

})
export default app
