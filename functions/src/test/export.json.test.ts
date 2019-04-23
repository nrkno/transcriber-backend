import json from "../exportTranscript/json";
import {IResult, ITranscript} from "../interfaces";

test("Export to json", async () => {
    const transcript: ITranscript = {};
    const result: IResult = {
        startTime: 39700000000,
        words: [
            {
                confidence: 0.9395052790641785,
                endTime: 40000000000,
                startTime: 39700000000,
                word: "det"
            }
        ]
    };
    const results: IResult[] = [];
    results.push(result);
    const response = {
        "send": jest.fn(),
        "setHeader": jest.fn()
    };
    // @ts-ignore
    json(transcript, results, response);

    expect(response.setHeader).toHaveBeenCalledTimes(1);
    expect(response.setHeader).toHaveBeenCalledWith("Content-Type", "application/json");
    expect(response.send).toHaveBeenCalledTimes(1);
    expect(response.send).toHaveBeenCalledWith("[{\"startTime\":\"00:00:00\",\"words\":\"det\"}]");
})