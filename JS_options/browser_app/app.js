let xml2js = require('xml2js');
let ScoreSearcher = require('./ScoreSearcher.js');

let parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});

//HTML DEPENDENT CODE
let fileInput = document.getElementById('fileInput');
let fileDisplayArea = document.getElementById('fileDisplayArea');
//========================================

fileInput.addEventListener('change', function(e) {
  let file = fileInput.files[0];
  let textType = /text.xml/;

  if (file.type.match(textType))
  {
    let reader = new FileReader();

    reader.onload = function(e) {
      let xml = reader.result;

      fileDisplayArea.innerText = xml;

      parser.parseString(xml, function (err, result) {
        // console.dir(result);
        const basicPiece = new ScoreSearcher(result);
        console.log('max midi pitch is ' + basicPiece.getMaxPitch());
      });
    };

    reader.readAsText(file);
  }
  else
  {
    fileDisplayArea.innerText = "File not supported! XML files only";
  }
});
