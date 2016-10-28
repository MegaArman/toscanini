let xml2js = require('xml2js');
let ScoreSearcher = require('./ScoreSearcher.js');
let FileSaver = require('file-saver');

let parser = new xml2js.Parser({explicitArray: false});

//HTML DEPENDENT CODE=======================
let fileInput = document.getElementById('fileInput');
let fileDisplayArea = document.getElementById('fileDisplayArea');
//=========================================

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
        // console.log('max midi pitch is ' + basicPiece.getMaxPitch());

        //write to file and save file in browser for download
        let builder = new xml2js.Builder();
        let xml = builder.buildObject(basicPiece.colorNotes()); //color notes
        let blob = new Blob([xml], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "modified_score.xml");
      });
    };

    reader.readAsText(file);
  }
  else
  {
    fileDisplayArea.innerText = "File not supported! XML files only";
  }
});
