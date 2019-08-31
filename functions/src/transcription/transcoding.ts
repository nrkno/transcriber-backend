/**
 * @file Converts uploaded audio to mono channel using FFmpeg
 * @author Andreas Schjønhaug
 */

import ffmpeg_static from "ffmpeg-static"
import ffprobe_static from "ffprobe-static"
import ffmpeg from "fluent-ffmpeg"
import fs from "fs"
import os from "os"
import path from "path"
import database from "../database"
import {IMetadata, ITranscript} from "../interfaces";
import { hoursMinutesSecondsToSeconds } from "./helpers"
import { bucket, bucketName } from "./storage"


/**
 * Using ffprobe to get metadata about the file
 * @param tempFilePath
 */

export async function metadata(tempFilePath: string) {
  return new Promise<ffmpeg.FfprobeData>((resolve, reject) => {
    ffmpeg(tempFilePath).ffprobe((error, data) => {
      if (error) {
        reject(error)
      }

      resolve(data)
    })
  })
}

/**
 * Using exiftool to get metadata about the file
 * @param tempFilePath
 */

export async function getMetadata(tempFilePath: string) {
  const exiftool = require("node-exiftool")
  const exiftoolBin = require('dist-exiftool')
  const ep = new exiftool.ExiftoolProcess(exiftoolBin)
  return new Promise<{data: object[]|null, error: string|null}>((resolve, reject) => {
    ep
        .open()
        .then(() => ep.readMetadata(tempFilePath, ["-File:all"]))
        .then((metadata: {data: object[]|null, error: string|null}) => resolve(metadata))
        .then(() => ep.close())
        .catch((error: any) => reject(error))
  })
}

/**
 * Utility method to convert audio to mono channel using FFMPEG.
 *
 * Command line equivalent:
 * ffmpeg -i input -y -ac 1 -vn -f flac output
 *
 */
async function reencodeToFlacMono(tempFilePath: string, targetTempFilePath: string, transcriptId: string) {
  return new Promise((resolve, reject) => {
    ffmpeg(tempFilePath)
      .setFfmpegPath(ffmpeg_static.path)
      .audioChannels(1)
      .noVideo()
      .format("flac")
      /*DEBUG
      .on("start", commandLine => {
        console.log("flac: Spawned Ffmpeg with command: " + commandLine)
      })*/
      .on("error", err => {
        reject(err)
      })
      .on("end", () => {
        resolve()
      })
      .save(targetTempFilePath)
  })
}

/**
 * Utility method to convert audio to MP4.
 *
 * Command line equivalent:
 * ffmpeg -i input -y -ac 2 -vn -f mp4 output.m4a
 *
 */
async function reencodeToM4a(input: string, output: string) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .setFfmpegPath(ffmpeg_static.path)
      .audioChannels(2)
      .noVideo()
      .format("mp4")
      /* DEBUG
      .on("start", commandLine => {
        console.log("mp4: Spawned Ffmpeg with command: " + commandLine)
      })*/
      .on("error", err => {
        reject(err)
      })
      .on("end", () => {
        resolve()
      })
      .save(output)
  })
}

/**
 * When an audio is uploaded in the Storage bucket we generate a mono channel audio automatically using
 * node-fluent-ffmpeg.
 */
export async function transcode(transcriptId: string, userId: string): Promise<ITranscript> {

  // -----------------------------------
  // 1. Check that we have an audio file
  // -----------------------------------

  const mediaPath = path.join("media", userId)

  const file = bucket.file(path.join(mediaPath, `${transcriptId}-original`))

  const [fileMetadata] = await file.getMetadata()

  const contentType = fileMetadata.contentType

  // Exit if this is triggered on a file that is not audio.
  if (contentType === undefined || (!contentType.startsWith("audio/") && !contentType.startsWith("video/") && contentType !== "application/mxf")) {
    throw Error("Uploaded file is not an audio or video file")
  }

  // ------------------------------
  // 2. Download file and transcode
  // ------------------------------

  const tempFilePath = path.join(os.tmpdir(), transcriptId)

  await file.download({ destination: tempFilePath })


  // ----------------
  // 3. Get metadata
  // ----------------

  // Setting up ffmpeg
  ffmpeg.setFfmpegPath(ffmpeg_static.path)
  ffmpeg.setFfprobePath(ffprobe_static.path)

  const ffProbeData = await metadata(tempFilePath)
  console.log("ffProbeData", ffProbeData)

  const {
    audioDuration,
    fileExtension,
    originalMimeType,
    timecode,
  } = getInfoFromffProbeData(ffProbeData)

  console.log(transcriptId, "audioDuration", audioDuration)

  const exiftoolData = await getMetadata(tempFilePath)
  console.log("exiftoolData:  ", exiftoolData)

  const info = getInfoFromExiftoolData(exiftoolData)
  console.log("framesPerSecond:  ", info.framesPerSecond)
  console.log("timecode:  ", info.timecode)

  let data: IMetadata = { audioDuration, fileExtension, originalMimeType }

  if (timecode !== 0) {
    data = { ...data, timecode }
  } else if (info.timecode !== 0) {
    data = { ...data, timecode: info.timecode }
  }

  if (info.framesPerSecond !== 0) {
    data = { ...data, framesPerSecond: info.framesPerSecond }
  }

  // Transcode to m4a

  const playbackFileName = `${transcriptId}-playback.m4a`
  const playbackTempFilePath = path.join(os.tmpdir(), playbackFileName)

  await reencodeToM4a(tempFilePath, playbackTempFilePath)

  const playbackStorageFilePath = path.join(mediaPath, playbackFileName)

  const [playbackFile] = await bucket.upload(playbackTempFilePath, {
    destination: playbackStorageFilePath,
    resumable: false,
  })

  const playbackGsUrl = "gs://" + path.join(bucketName, mediaPath, playbackFileName)

  await database.setPlaybackGsUrl(transcriptId, playbackGsUrl)

  // Transcode to FLAC mono

  const transcribeFileName = `${transcriptId}-transcribed.flac`
  const transcribeTempFilePath = path.join(os.tmpdir(), transcribeFileName)

  await reencodeToFlacMono(tempFilePath, transcribeTempFilePath, transcriptId)

  const targetStorageFilePath = path.join(mediaPath, transcribeFileName)

  await bucket.upload(transcribeTempFilePath, {
    destination: targetStorageFilePath,
    resumable: false,
  })

  // Once the audio has been uploaded delete the local file to free up disk space.
  fs.unlinkSync(tempFilePath)
  fs.unlinkSync(playbackTempFilePath)
  fs.unlinkSync(transcribeTempFilePath)

  const transcript: ITranscript = {
    metadata: data,
    speechData: {
      flacFileLocationUri: `gs://${bucketName}/${targetStorageFilePath}`,
    }
  }

  return transcript
}

function getInfoFromffProbeData(ffProbeData: ffmpeg.FfprobeData) {
  let timecode = 0
  let originalMimeType = ""

  // Trying to calculate timecode
  if (ffProbeData.streams.length > 0) {
    const stream = ffProbeData.streams[0]
    const sampleRate = stream.sample_rate
    originalMimeType = stream.codec_type + "/" + stream.codec_name

    if (ffProbeData.format.tags) {
      const timeReference = ffProbeData.format.tags.time_reference

      if (sampleRate && timeReference) {
        timecode = (timeReference / sampleRate) * 1e9
      }
    }
  }
  const audioDuration = ffProbeData.format.duration
  const fileExtension = ffProbeData.format.format_name

  return {
    audioDuration,
    fileExtension,
    originalMimeType,
    timecode,
  }
}

function getInfoFromExiftoolData(metadata: {data: object[]|null, error: string|null}) {
  let framesPerSecond = 0
  let timecode = 0
  let startTimecodeTimeValue = null
  const data = metadata.data
  const tags: any = (data && data.length > 0)? data[0]: null
  if (tags && tags.hasOwnProperty("StartTimeScale")) {
    framesPerSecond = tags["StartTimeScale"]
  }

  if (tags && tags.hasOwnProperty("StartTimecodeTimeValue")) {
    startTimecodeTimeValue = tags["StartTimecodeTimeValue"]
  }

  if (framesPerSecond !== 0 && startTimecodeTimeValue !== null) {
    const timeArray = startTimecodeTimeValue.split(":")
    if (timeArray.length === 4) {
      timecode = (parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseInt(timeArray[2]) +
          parseInt(timeArray[3])/framesPerSecond) * 1e9
    }
  }

  return {
    framesPerSecond,
    timecode
  }
}
