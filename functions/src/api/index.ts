import {GetSignedUrlConfig} from "@google-cloud/storage"
import * as functions from "firebase-functions"
import database from "../database";
import {Step} from "../enums";
import {ITranscript} from "../interfaces";
import {bucket} from "../transcription/storage"

const api = (() => {

    async function createTranscriptId(request: functions.Request, response: functions.Response) {
        const transcriptId = await database.buildNewId();
        response.status(200).send(transcriptId);
    }
    async function getUploadUrl(request: functions.Request, response: functions.Response) {
        const transcriptId = request.query.transcriptId;
        if (!transcriptId) {
            response.status(422).send("Missing the transcriptId query parameter");
        }
        const userId = request.query.userId;
        if (!userId) {
            response.status(422).send("Missing the userId query parameter");
        }
        const file = bucket.file("media/" + userId + "/" + transcriptId + "-original");
        let contentType = request.header("Content-Type");
        if (!contentType) {
            contentType = "application/json"
        }
        const config: GetSignedUrlConfig = {
            action: 'write',
            contentType,
            expires: '03-17-2025'
        }
        const data = await file.getSignedUrl(config)
        const url = data[0];
        response.status(200).send(url);
    }

    async function createTransctript(request: functions.Request, response: functions.Response) {
        const id = request.query.transcriptId;
        const mimeType = request.query.originalMimeType;
        const userId = request.query.userId;
        if (!userId) {
            response.status(422).send("Missing the userId query parameter");
        }
        const transcript: ITranscript = {
            metadata: {
                languageCodes: ["nb-NO"],
                originalMimeType: mimeType
            },
            process: {
                step: Step.Uploading
            },
            userId
        };

        const transcriptDoc = await database.updateTranscript(id, transcript);

        response.status(200).send(transcriptDoc);
    }

    return {createTranscriptId, createTransctript, getUploadUrl}
})()

export default api
