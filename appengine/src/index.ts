import serializeError = require("serialize-error");

const PORT = Number(process.env.PORT) || 8080;
import * as express from "express";
import {findTransciptUpdatedTodayNotDone} from "./transcription/transcritpions";

const app = express();

app.get("/admin/transcripts/update", async (req, res) => {
  console.log("run cron job")
  try {
    const transcripts = await findTransciptUpdatedTodayNotDone();
    res.status(200).send("updated " + transcripts)
  } catch (error) {
    console.error("Failed to fetch transcripts. Error: ", error);

    // Log error to Google Analytics
    // visitor.exception(error.message, true).send()

    res.status(500).send(serializeError(error))
  }
})
app.get("/", (req, res) => {
  res.send("🎉 Hello TypeScript! 🎉");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
