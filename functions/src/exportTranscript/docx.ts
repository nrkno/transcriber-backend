import { Document, Packer, Paragraph, TextRun } from "docx"
import * as functions from "firebase-functions"
import { IParagraph, ITranscript } from "../interfaces"
import nanoSecondsToFormattedTime from "./nanoSecondsToFormattedTime"

async function docx(transcript: ITranscript, paragraphs: IParagraph[], response: functions.Response) {
  const doc = new Document()

  const tabStop = 1000

  let timecode = 0

  if (transcript.metadata && transcript.metadata.timecode) {
    timecode = transcript.metadata.timecode
  }

  Object.values(paragraphs).map((paragraph, i) => {
    const metaParagraph = new Paragraph().leftTabStop(tabStop)

    let speakerName = ""

    if (transcript.speakerNames !== undefined && paragraph.speaker !== undefined) {
      speakerName = transcript.speakerNames[paragraph.speaker]
    }

    const speakerNameRun = new TextRun(speakerName).bold()

    const formattedStartTime = nanoSecondsToFormattedTime(timecode, paragraph.startTime || 0, true, false)

    const timeRun = new TextRun(formattedStartTime).bold().tab()
    metaParagraph.addRun(speakerNameRun)
    metaParagraph.addRun(timeRun)
    doc.addParagraph(metaParagraph)

    const textParagraph = new Paragraph()
    const words = paragraph.words
      .filter(word => !(word.deleted && word.deleted === true)) // Only words that are not deleted
      .map(word => word.text)
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
