import * as functions from "firebase-functions"
import { Dictionary } from "lodash"
import xmlbuilder from "xmlbuilder"
import { IParagraph, ITranscript } from "../interfaces"

function xmp(transcript: ITranscript, paragraphs: IParagraph[], response: functions.Response) {
  if (!transcript.metadata || !transcript.metadata.framesPerSecond) {
    throw new Error("Frames per second missing")
  }

  const framesPerSecond = transcript.metadata.framesPerSecond

  let timecode = 0

  if (transcript.metadata && transcript.metadata.timecode) {
    timecode = transcript.metadata.timecode
  }

  const markers = paragraphs.map(paragraph => {
    const words = paragraph.words
      .filter(word => !(word.deleted && word.deleted === true)) // Only words that are not deleted
      .map(word => word.text)
      .join(" ")
    const startTime = (paragraph.startTime || 0) * 1e-9
    const duration = paragraph.words[paragraph.words.length - 1].endTime * 1e-9 - startTime
    const marker: Dictionary<number | string> = {
      "@rdf:parseType": "Resource",
      "xmpDM:comment": words,
      "xmpDM:duration": duration * framesPerSecond,
      "xmpDM:startTime": timecode * 1e-9 + startTime * framesPerSecond,
    }

    if (transcript.speakerNames !== undefined && paragraph.speaker !== undefined) {
      marker["xmpDM:name"] = transcript.speakerNames[paragraph.speaker]
    }

    return marker
  })

  const data = {
    "x:xmpmeta": {
      "@xmlns:x": "adobe:ns:meta/",
      "rdf:RDF": {
        "@xmlns:rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "rdf:Description": {
          "@xmlns:xmpDM": "http://ns.adobe.com/xmp/1.0/DynamicMedia/",
          "xmpDM:Tracks": {
            "rdf:Bag": {
              "rdf:li": {
                "@rdf:parseType": "Resource",
                "xmpDM:frameRate": `f${framesPerSecond}`,
                "xmpDM:markers": {
                  "rdf:Seq": {
                    "rdf:li": markers,
                  },
                },
                "xmpDM:trackName": "Comment",
                "xmpDM:trackType": "Comment",
              },
            },
          },
        },
      },
    },
  }

  const xml = xmlbuilder.create(data, { encoding: "utf-8" }).end({ pretty: true })

  response.setHeader("Content-Disposition", `attachment; filename=${transcript.name}.${transcript.metadata ? transcript.metadata.fileExtension : ""}.xmp`)
  response.send(Buffer.from(xml))
}

export default xmp
