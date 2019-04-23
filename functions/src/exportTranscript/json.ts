import * as functions from "firebase-functions"
import {IParagraph, ITranscript} from "../interfaces"

interface IJsonResult {
  startTime: string
  words: string
}

function json(transcript: ITranscript, paragraphs: IParagraph[], response: functions.Response) {

  const jsonDoc:IJsonResult[] = [] ;


  Object.values(paragraphs).map((paragraph, i) => {
    let startTime = "00:00:00";
    if (i > 0) {

      const startTimeInSeconds = (paragraph.startTime || 0) * 1e-9 // Nano to seconds
      const startTimeMatchArray = new Date(startTimeInSeconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)

      if (startTimeMatchArray !== null) {
        startTime = startTimeMatchArray[0];
      } else {
        startTime = String(i);
      }
    }

    const words = paragraph.words.map(word => word.text).join(" ");

    const jsonResult:IJsonResult = {
      startTime,
      words
    };
    jsonDoc.push(jsonResult);
  });

  response.setHeader("Content-Type", `application/json`);
  response.send(JSON.stringify(jsonDoc));
}

export default json
