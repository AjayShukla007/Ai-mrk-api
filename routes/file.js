const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const cheerio = require('cheerio');
const xml2js = require('xml2js');
const router = express.Router();
// router.use(express.json());

const upload = multer({ dest: 'uploads/' });

/*
function render_page(pageData) {
    let render_options = {
        normalizeWhitespace: false,
        disableCombineTextItems: false
    };
 
    return pageData.getTextContent(render_options)
    .then(function(textContent) {
        let lastY, text = '';
        for (let item of textContent.items) {
            if (lastY == item.transform[5] || !lastY){
                text += item.str;
            }  
            else{
                text += '\n' + item.str;
            }    
            lastY = item.transform[5];
        }
        return text;
    });
}

let options = {
    pagerender: render_page
};
*/

/*function render_page(pageData) {
    let render_options = {
        normalizeWhitespace: false,
        disableCombineTextItems: false
    }

    return pageData.getTextContent(render_options)
    .then(function(textContent) {
        let lastY, text = '';
        for (let item of textContent.items) {
            if (lastY == item.transform[5] || !lastY){
                text += item.str;
            }  
            else{
                text += '\n' + item.str;
            }    
            lastY = item.transform[5];
        }

        // Convert text to markdown
        let md = textToMarkdown(text);

        return md;
    });
}

function textToMarkdown(text) {
    // Use markdown-pdf or any other library to convert text to markdown
    let md = markdownpdf().from.string(text).to.string(function() {});
    return md;
}

let options = {
    pagerender: render_page
}
*/


router.post('/:type', upload.single('file'), async (req, res) => {
  const dataBuffer = fs.readFileSync(req.file.path);
  let parsedData;
  const $ = cheerio.load(dataBuffer);

  switch (req.params.type) {
    case 'pdf':
      parsedData = await pdfParse(dataBuffer);
      break;
    case 'html':
      parsedData = $('body').text();
      break;
    case 'xml':
      parsedData = await xml2js.parseStringPromise(dataBuffer);
      break;
    case 'txt':
      parsedData = dataBuffer.toString();
      break;
    default:
      return res.status(400).send('Unsupported file type');
  }

  res.json({ description: req.file.originalname, title: req.file.filename, content: parsedData });
  
  
  
  /*
  fs.readFile(req.file.path, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.json({ description: req.file.originalname, title: req.file.filename, content: data });
  });*/
});

module.exports = router;
