import admin from "firebase-admin"
import {
    AudioEncoding,
    InteractionType,
    MicrophoneDistance,
    OriginalMediaType,
    ProgressType,
    RecordingDeviceType,
    UpdateStatusType
} from "./enums"

// -----------
// Transcript
// -----------

interface ITranscript {
  id?: string
  createdAt?: admin.firestore.FieldValue | admin.firestore.Timestamp
  name?: string
  playbackGsUrl?: string
  status?: IStatus
  metadata?: IMetadata
  speechData?: IGoogleSpeechMetadata
  paragraphs?: IParagraph[]
  speakerNames?: {
    [key: number]: string
  }
  userId?: string
}

interface IStatus {
  error?: any
  percent?: number | admin.firestore.FieldValue
  progress?: ProgressType
  lastUpdated?: admin.firestore.FieldValue | admin.firestore.Timestamp
}

interface IGoogleSpeechMetadata {
  reference?: string
  flacFileLocationUri?: string
}

interface IMetadata {
  audioDuration?: number
  audioTopic?: string
  channelLayout?: string
  fileExtension?: string
  industryNaicsCodeOfAudio?: number
  interactionType?: InteractionType
  languageCodes?: string[]
  microphoneDistance?: MicrophoneDistance
  originalMediaType?: OriginalMediaType
  originalMimeType?: string
  framesPerSecond?: number
  recordingDeviceName?: string
  recordingDeviceType?: RecordingDeviceType
  speechContexts?: ISpeechContext[]
  startTime?: number
  timecode?: number
}

interface ISpeechContext {
  phrases: string[]
}

interface IParagraph {
  speaker?: number
  startTime: number
  words: IWord[]
}

interface IWord {
  confidence: number
  deleted?: boolean
  endTime: number
  startTime: number
  text: string
}

// -----------------
// Google Speech API
// -----------------

interface ILongRunningRegonize {
  audio: IRecognitionAudio
  config: IRecognitionConfig
}

interface IRecognitionAudio {
  content?: string
  uri?: string
}

interface ISpeechRecognitionMetadata {
  progressPercent: number,
  startTime: number,
  lastUpdateTime: number
}


interface ISpeechRecognitionResult {
  alternatives: ISpeechRecognitionAlternative[]
}

interface ISpeechRecognitionAlternative {
  transcript: string
  confidence: number
  words: IWordInfo[]
}

interface IWordInfo {
  confidence: number
  word: string
  endTime: ITime
  startTime?: ITime
}

interface ITime {
  nanos?: number
  seconds?: string
}

interface IRecognitionConfig {
  alternativeLanguageCodes?: string[]
  audioChannelCount?: number
  diarizationSpeakerCount?: number
  enableAutomaticPunctuation?: boolean
  enableSeparateRecognitionPerChannel?: boolean
  enableSpeakerDiarization?: boolean
  enableWordConfidence?: boolean
  enableWordTimeOffsets?: boolean
  encoding?: AudioEncoding
  languageCode: string
  maxAlternatives?: number
  metadata?: IRecognitionMetadata
  model?: string
  profanityFilter?: boolean
  sampleRateHertz?: number
  speechContexts?: ISpeechContext[]
  useEnhanced?: boolean
}

interface IRecognitionMetadata {
  audioTopic?: string // An arbitrary description of the subject matter discussed in the audio file. Examples include "Guided tour of New York City," "court trial hearing," or "live interview between 2 people."
  industryNaicsCodeOfAudio?: number // The industry vertical of the audio file, as a 6-digit NAICS code.
  interactionType?: InteractionType // The use case of the audio.
  microphoneDistance?: MicrophoneDistance // The distance of the microphone from the speaker.
  // NOT IN USE obfuscatedId?: string //	The privacy-protected ID of the user, to identify number of unique users using the service.
  originalMediaType?: OriginalMediaType // The original media of the audio, either audio or video.
  originalMimeType?: string // The MIME type of the original audio file. Examples include audio/m4a, audio/x-alaw-basic, audio/mp3, audio/3gpp, or other audio file MIME type.
  recordingDeviceName?: string // The device used to make the recording. This arbitrary string can include names like 'Pixel XL', 'VoIP', 'Cardioid Microphone', or other value.
  recordingDeviceType?: RecordingDeviceType // The kind of device used to capture the audio, including smartphones, PC microphones, vehicles, etc.
}

// -----------------
// Update Progress
// -----------------
interface IUpdateProgressResponse {
  lastUpdated?: number
    transcriptionProgressPercent?: number
  transcriptId?: string
  updateStatus: UpdateStatusType
}

// -----------------
// Authorization
// -----------------
interface IJwt {
  oid: string
  email: string
  upn: string
  name: string
}

