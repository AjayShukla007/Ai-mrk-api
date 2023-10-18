require("dotenv").config();

const keyword_extractor = require("keyword-extractor");
const express = require("express");
// const axios = require("axios");
const cors = require("cors");
const google = require("googlethis");
const mongoose = require("mongoose");
const connectToMongo = require("./db.js");

const manager = require("./modules/manager");
const { logger, logEvents } = require("./middleware/logger.js");
const errorHandler = require("./middleware/errorHandler.js");

const app = express();
app.use(cors());
app.use(logger);

app.use(express.json());

app.post("/extractInformation", async (req, res) => {
  try {
    let answer = "";
    (async () => {
      await manager.train();
      manager.save();
      const response = await manager.process("en", req.body.text);
      // console.log(response.answer);
      answer = {
        answer: response
      };
    })();

    const text = keyword_extractor.extract(req.body.text, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false
    });
    // const text = req.body.text;

    const options = {
      page: 0,
      safe: true,
      parse_ads: false,
      additional_params: {
        hl: "en"
      }
    };

    const response = await google.search(text, options);
    // console.log(response);
    res.status(200).send({
      google: response,
      AiAnswer: answer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// SERVER
connectToMongo();
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/file", require("./routes/file"));

app.use(errorHandler);

// DATABASE CONNECTION
mongoose.connection.once("open", () => {
  console.log("connected to mongo db");
  // STARTING SERVER
  app.listen(3000, () => {
    console.log("Server started on port 1000");
  });
});

mongoose.connection.on("error", err => {
  console.log(err);
  logEvents(
    `${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`,
    "MongoError.log"
  );
});
