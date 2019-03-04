import { Document, Packer, Paragraph, TextRun } from "docx"
import * as functions from "firebase-functions"
import { IResult, ITranscript } from "../interfaces"

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

    const startTimeInSeconds = (result.startTime || 0) * 1e-9 // Nano to seconds
    const startTimeMatchArray = new Date(startTimeInSeconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)

    const timeRun = new TextRun(startTimeMatchArray[0]).bold().tab()
    metaParagraph.addRun(speakerNameRun)
    metaParagraph.addRun(timeRun)
    doc.addParagraph(metaParagraph)

    const textParagraph = new Paragraph()
    const words = result.words.map(word => word.word).join(" ")
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
