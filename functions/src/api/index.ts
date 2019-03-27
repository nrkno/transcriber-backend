import {GetSignedUrlConfig} from "@google-cloud/storage"
import * as functions from "firebase-functions"
import serializeError from "serialize-error";
import database from "../database";
import {ProgressType} from "../enums";
import {ITranscript} from "../interfaces";
import {bucket} from "../transcription/storage"

const api = (() => {

    async function createTranscriptId(request: functions.Request, response: functions.Response) {
        const transcriptId = database.buildNewId();
        console.log("transcriptId: ", transcriptId);
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
        const contentType = request.header("Content-Type");
        if (!contentType) {
            response.status(422).send("Missing the Content-Type header parameter");
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
            status: {
                progress: ProgressType.Uploading
            },
            userId
        };

        const transcriptDoc = await database.updateTranscript(id, transcript);

        response.status(200).send(transcriptDoc);
    }

    async function getTranscript(request: functions.Request, response: functions.Response) {
        const transcriptId = request.query.transcriptId

        if (!transcriptId) {
            response.status(422).send("Missing the transcriptId query parameter")
        }

        try {
            const transcript = await database.getTranscript(transcriptId);
            response.status(200).send(transcript);
        } catch (error) {
            // Log error to console
            console.error("Failed to fetch transcript. transcriptId: ", transcriptId, ". Error: ", error);

            // Log error to Google Analytics
            // visitor.exception(error.message, true).send()

            response.status(500).send(serializeError(error))
        }
    }

    return {createTranscriptId, createTransctript, getTranscript, getUploadUrl}
})()

export default api
