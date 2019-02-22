import {GetSignedUrlConfig} from "@google-cloud/storage"
import * as functions from "firebase-functions"
import database from "../database";
import { bucket } from "../transcription/storage"



async function getUploadUrl(request: functions.Request, response: functions.Response) {
    const transcriptId = await database.buildNewId();
    const file = bucket.file(transcriptId);
    const config:GetSignedUrlConfig = {
        action: 'write',
        contentType: 'application/json',
        expires: '03-17-2025'
    }
    const data = await file.getSignedUrl(config)
    const url = data[0];
    response.status(200).send(url);
}

export default getUploadUrl
