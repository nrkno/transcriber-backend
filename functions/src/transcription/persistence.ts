/**
 * @file Saves transcrips to database
 * @author Andreas Schjønhaug
 */

import database from "../database"
import { IParagraph, ISpeechRecognitionAlternative, IWord } from "../interfaces"

export async function saveParagraph(speechRecognitionResults: any, transcriptId: string) {
  for (const index of speechRecognitionResults.keys()) {
    const recognitionResult = speechRecognitionResults[index].alternatives[0] as ISpeechRecognitionAlternative

    const words = recognitionResult.words.map(wordInfo => {
      let startTime = 0
      if (wordInfo.startTime) {
        if (wordInfo.startTime.seconds) {
          startTime = parseInt(wordInfo.startTime.seconds, 10) * 1e9
        } else if (wordInfo.startTime && !wordInfo.startTime.nanos) {
          startTime = parseInt(wordInfo.startTime, 10) * 1e9
        }
        if (wordInfo.startTime.nanos) {
          startTime += wordInfo.startTime.nanos
        }
      }
      console.log("22222-wordInfo-startTime: ", wordInfo.startTime, ": startTime-toPersist: ",  startTime)
      let endTime = 0
      if (wordInfo.endTime) {
        if (wordInfo.endTime.seconds) {
          endTime = parseInt(wordInfo.endTime.seconds, 10) * 1e9
        } else if (wordInfo.endTime && !wordInfo.endTime.nanos) {
          startTime = parseInt(wordInfo.endTime, 10) * 1e9
        }
        if (wordInfo.endTime.nanos) {
          endTime += wordInfo.endTime.nanos
        }
      }

      const word: IWord = {
        confidence: wordInfo.confidence,
        endTime,
        startTime,
        text: wordInfo.word,
      }

      return word
    })

    // Transform startTime and endTime's seconds and nanos
    const paragraph: IParagraph = {
      startTime: words[0].startTime,
      words,
    }

    const percent = Math.round(((index + 1) / speechRecognitionResults.length) * 100)

    await database.addParagraph(transcriptId, paragraph, percent)
    console.log(transcriptId, `Prosent lagret: ${percent}%`)
  }
}
