const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const cheerio = require("cheerio");
const xml2js = require("xml2js");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/:type", upload.single("file"), async (req, res) => {
  const dataBuffer = fs.readFileSync(req.file.path);
  let parsedData;
  const $ = cheerio.load(dataBuffer);

  switch (req.params.type) {
    case "pdf":
      parsedData = await pdfParse(dataBuffer);
      break;
    case "html":
      parsedData = $("body").text();
      break;
    case "xml":
      parsedData = await xml2js.parseStringPromise(dataBuffer);
      break;
    case "txt":
      parsedData = dataBuffer.toString();
      break;
    default:
      return res.status(400).send("Unsupported file type");
  }

  res.json({
    description: req.file.originalname,
    title: req.file.filename,
    content: parsedData
  });
});

module.exports = router;
