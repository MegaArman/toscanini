let xml2js = require('xml2js');
let ScoreSearcher = require('./ScoreSearcher.js');

let parser = new xml2js.Parser({explicitArray: false});

//HTML DEPENDENT CODE=======================
let fileInput = document.getElementById('fileInput');
let analyzeButton = document.getElementById('analyze');
document.getElementById('fileInput').multiple = true;
//=========================================

let xmlStrings = {};

fileInput.addEventListener('change', function() {
  let textType = /text.xml/;

  for (let file of fileInput.files)
  {
    if (file.type.match(textType))
    {
      let reader = new FileReader();

      reader.onload = function() {
        xmlStrings[file.name] = reader.result;
      };

      reader.readAsText(file);
    }
    else
    {
      alert('Are you sure these are all MusicXML files?');
    }
  }
});

window.analyze = function()
{
  for (let fileName in xmlStrings)
  {
    parser.parseString(xmlStrings[fileName], function (err, result) {
      const scoreSearcher = new ScoreSearcher(result);
      console.log(fileName + ' has range ' +
      scoreSearcher.getMinPitch() + '-' + scoreSearcher.getMaxPitch());
    });
  }
};

analyzeButton.addEventListener('click', window.analyze);
