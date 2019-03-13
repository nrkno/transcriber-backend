import json from "../exportTranscript/json";
import {IResult, ITranscript} from "../interfaces";

test("Export to json", async () => {
    const transcript: ITranscript = {};
    // @ts-ignore
    const results: IResult[] = {};
    const response = {
        "send": jest.fn(),
        "setHeader": jest.fn()
    };
    // let mockedResponse:functions.Response = mock(functions.Response);

    // let response:functions.Response = instance(mockedResponse);
    // @ts-ignore
    await json(transcript, results, response);

    expect(response.setHeader).toHaveBeenCalledTimes(1);
    expect(response.setHeader).toHaveBeenCalledWith("Content-Type", "application/json");
    // expect(jsonDoc).toBe(1234)
})