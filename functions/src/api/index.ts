import {GetSignedUrlConfig} from "@google-cloud/storage"
import * as functions from "firebase-functions"
import database from "../database";
import {ITranscript} from "../interfaces";
import {bucket} from "../transcription/storage"
import {Step} from "../enums";

const api = (() => {

    async function getUploadUrl(request: functions.Request, response: functions.Response) {
        const transcriptId = await database.buildNewId();
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
        const transcript: ITranscript = { metadata: { languageCodes: ["nb-NO"] }, userId: "baardl", process: { step: Step.Uploading} }

        const transcriptDoc = await database.updateTranscript(id, transcript);

        response.status(200).send(transcriptDoc);
    }

    return {createTransctript, getUploadUrl}
})()

export default api
