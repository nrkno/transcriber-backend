import { Document, Packer, Paragraph, TextRun } from "docx"
import * as functions from "firebase-functions"
import { IResult, ITranscript } from "../interfaces"
import nanoSecondsToFormattedTime from "./nanoSecondsToFormattedTime"

async function docx(transcript: ITranscript, results: IResult[], response: functions.Response) {
  const doc = new Document()

  const tabStop = 1000

  Object.values(results).map((result, i) => {
    const metaParagraph = new Paragraph().leftTabStop(tabStop)

    let speakerName = ""

    if (transcript.speakerNames !== undefined && result.speaker !== undefined) {
      speakerName = transcript.speakerNames[result.speaker]
    }

    const speakerNameRun = new TextRun(speakerName).bold()

    let transcriptStartTime = 0

    if (transcript.metadata && transcript.metadata.startTime) {
      transcriptStartTime = transcript.metadata.startTime
    }

    const formattedStartTime = nanoSecondsToFormattedTime(transcriptStartTime, result.startTime || 0, true, true)

    const timeRun = new TextRun(formattedStartTime).bold().tab()
    metaParagraph.addRun(speakerNameRun)
    metaParagraph.addRun(timeRun)
    doc.addParagraph(metaParagraph)

    const textParagraph = new Paragraph()
    const words = result.words
      .filter(word => !(word.deleted && word.deleted === true)) // Only words that are not deleted
      .map(word => word.word)
      .join(" ")
    const text = new TextRun(words)
    textParagraph.indent({ left: tabStop })
    textParagraph.addRun(text)

    doc.addParagraph(textParagraph)

    doc.addParagraph(new Paragraph())
  })

  const packer = new Packer()

  const b64string = await packer.toBase64String(doc)
  response.setHeader("Content-Disposition", `attachment; filename=${transcript.name}.docx`)
  response.send(Buffer.from(b64string, "base64"))
}

export default docx
