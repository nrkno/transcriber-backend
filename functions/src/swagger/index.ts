// import {GetSignedUrlConfig} from "@google-cloud/storage"
// import * as functions from "firebase-functions"
// import serializeError from "serialize-error";
// import database from "../database";
// import {ProgressType} from "../enums";
// import {ITranscript} from "../interfaces";
// import {bucket} from "../transcription/storage"

import express from "express";

import swaggerUi from "swagger-ui-express";

import swaggerDocument from "../api/api-swagger.json";

const swaggerApp = express();
swaggerApp.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default swaggerApp
