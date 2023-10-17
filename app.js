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
      console.log(response.answer);
      answer = {
        answer: response,
      };
    })();

    const text = keyword_extractor.extract(req.body.text, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false,
    });
    // const text = req.body.text;

    const options = {
      page: 0,
      safe: true,
      parse_ads: false,
      additional_params: {
        hl: "en",
      },
    };

    const response = await google.search(text, options);
    // console.log(response);
    res.status(200).send({
      google: response,
      AiAnswer: answer,
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
    console.log("Server started on port 3000");
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`,
    "MongoError.log"
  );
});

//using wiki
// app.post('/extractInformation', async (req, res) => {
//   try {
//     const extractionResult = keyword_extractor.extract(req.body.text, { language: "english", remove_digits: true, return_changed_case: true, remove_duplicates: false });
//     const searchQuery = extractionResult.join(' ');
//     const wikipediaUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchQuery)}`;

//     const response = await axios.get(wikipediaUrl);

//     if (response.status === 200 && response.data.type === 'standard') {
//       const { title, extract, content_urls } = response.data;
//       const information = {
//         title,
//         extract,
//         url: content_urls.desktop.page,
//       };

//       res.json(information);
//     } else {
//       res.status(404).json({ error: 'Topic not found on Wikipedia' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
//using google
/*const express = require('express');
const keyword_extractor = require('keyword-extractor');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

app.post('/extractInformation', async (req, res) => {
  const extraction_result = keyword_extractor.extract(req.body.text, { language: "english", remove_digits: true, return_changed_case: true, remove_duplicates: false });
  const search_query = extraction_result.join(' ');
  const search_url = `https://www.google.com/search?q=${encodeURIComponent(search_query)}`;
  const search_response = await axios.get(search_url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
  },});
  const $ = cheerio.load(search_response.data);
  const search_results = $('div.g');
  console.log(search_results);
  const information = [];

  search_results.each((index, element) => {
    const title = $(element).find('h3').text();
    const url = $(element).find('a').attr('href');
    const description = $(element).find('div.IsZvec').text();
    information.push({ title, url, description });
  });

  res.send(information);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
*/

/*const express = require('express');
const keyword_extractor = require('keyword-extractor');
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

app.post('/extractKeywords', (req, res) => {
  const extraction_result = keyword_extractor.extract(req.body.text, { language: "english", remove_digits: true, return_changed_case: true, remove_duplicates: false });
  res.status(200).send(extraction_result);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});*/
