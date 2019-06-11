import {google} from "googleapis";
import {ISpeechRecognitionMetadata, ISpeechRecognitionResult} from "../interfaces";

export async function getOperation(name: string) {
    const googleSpeechRef = name;
    if (googleSpeechRef) {

        try {
            const googleAuth = await google.auth.getClient({
                scopes: ['https://www.googleapis.com/auth/cloud-platform']
            });

            const {data} = await google.speech('v1').operations.get({auth: googleAuth, name: googleSpeechRef});
            console.log("Result from operations.get: ", data);
            return data
        } catch (error) {
            console.error("Failed to fetch operation by googleSpeechRef: ", googleSpeechRef, ". Error: ", error);
        }
    } else {
        console.log()
        return null
    }
}

export async function fetchSpeechRecognitionResuts(operationName: string): Promise<{speechRecognitionResults: ISpeechRecognitionResult[], speechRecognitionMetadata: ISpeechRecognitionMetadata}> {
    let speechRecognitionResults: ISpeechRecognitionResult[] = []
    let speechRecognitionMetadata: ISpeechRecognitionMetadata = {}
    const googleSpeechRef = operationName;
    if (googleSpeechRef) {
        const data = await getOperation(googleSpeechRef)
        console.log("getOpertation; operationName: ", operationName, "; data: ", JSON.stringify(data))
        if (data && data.metadata) {
            speechRecognitionMetadata = {
                lastUpdateTime: data.metadata.lastUpdateTime,
                progressPercent: data.metadata.progressPercent,
                startTime: data.metadata.startTime
            }

            /*
                    data:
                     { name: '6080322534027970989',
              metadata:
               { '@type': 'type.googleapis.com/google.cloud.speech.v1p1beta1.LongRunningRecognizeMetadata',
                 progressPercent: 100,
                 startTime: '2019-05-24T17:18:26.958133Z',
                 lastUpdateTime: '2019-05-24T17:18:33.168022Z' },
              done: true,
              response:
               { '@type': 'type.googleapis.com/google.cloud.speech.v1p1beta1.LongRunningRecognizeResponse',
                 results: [ [Object] ] } }
                     */
            const responses = null
            if (data.done === true) {
                const longRunningRecognizeResponse = data.response
                console.log("getOperation. responses: ", longRunningRecognizeResponse)
                if (longRunningRecognizeResponse) {
                    speechRecognitionResults = longRunningRecognizeResponse.results as ISpeechRecognitionResult[]
                    console.log("complete: ", speechRecognitionResults)
                } else {
                    console.log("No response found for operation googleSpeechRef: ", googleSpeechRef)
                }
            }
        }
    } else {
        console.log("Required parameter 'operationName' is missing.")
    }
    return {speechRecognitionResults, speechRecognitionMetadata}
}
