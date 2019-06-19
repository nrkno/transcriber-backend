import serializeError = require("serialize-error");

const PORT = Number(process.env.PORT) || 8080;
import express from "express";
import {ProgressUpdater} from "./updater/ProgressUpdater";

const app = express();
const progressUpdater = new ProgressUpdater("start");

app.get("/admin/transcripts/update", async (req, res) => {
  try {
    const transcripts = await progressUpdater.update();
    res.status(200).send("updated " + transcripts)
  } catch (error) {
    console.error("Failed to fetch transcripts. Error: ", error);

    res.status(500).send(serializeError(error))
  }
})
app.get("/", (req, res) => {
  res.send("🎉 Hello Transcriber backend on AppEngine! 🎉");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
