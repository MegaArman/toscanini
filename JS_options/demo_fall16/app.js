let xml2js = require('xml2js');
let ScoreSearcher = require('./ScoreSearcher.js');
let parser = new xml2js.Parser({explicitArray: false});

let fileInput = document.getElementById('fileInput');
let xmlStrings;

fileInput.addEventListener('change', function() {
  xmlStrings = {};
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
    parser.parseString(xmlStrings[fileName], function (err, result)
    {
      const scoreSearcher = new ScoreSearcher(result);
      const min = scoreSearcher.getMinPitch();
      const max = scoreSearcher.getMaxPitch();
      const instrumentNames =  Object.keys(scoreSearcher.getInstrumentObjects());
      let ranges = [];

      for (let i = 0; i < instrumentNames.length; i++)
      {
        let min = scoreSearcher.getMinPitchOf(instrumentNames[i]);
        let max = scoreSearcher.getMaxPitchOf(instrumentNames[i]);
        ranges.push('(' + min + '-' + max + ')');
      }

      let combined = [];
      
      for (let i = 0; i < ranges.length; i++)
      {
        let str = ' ' + instrumentNames[i] + ' ' + ranges[i];
        combined.push(str);
      }

      $('#results').
      append('<tr>' +
      '<td>' + fileName + '</td>' +
      '<td>' + min + '-' + max +'</td>' +
      '<td>' +  combined + '</td>'
      +'</tr>');
    });
  }
};

window.clear = function()
{
  $('#results').empty();
};

$('#analyze').on('click', window.analyze);
$('#clear').on('click', window.clear);
