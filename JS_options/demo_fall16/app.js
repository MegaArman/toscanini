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

      //Overall Range
      let min = scoreSearcher.getMinPitch();
      let max = scoreSearcher.getMaxPitch();
      min = scoreSearcher.midiNumToNote(min);
      max = scoreSearcher.midiNumToNote(max);

      //Instruments Range
      const instrumentNames =  Object.keys(scoreSearcher.getInstrumentObjects());
      let ranges = [];

      for (let i = 0; i < instrumentNames.length; i++)
      {
        let min = scoreSearcher
        .midiNumToNote(scoreSearcher.getMinPitchOf(instrumentNames[i]));
        let max = scoreSearcher
        .midiNumToNote(scoreSearcher.getMaxPitchOf(instrumentNames[i]));
        ranges.push('(' + min + '-' + max + ')');
      }

      let instrumentRanges = [];

      for (let i = 0; i < ranges.length; i++)
      {
        let str = ' ' + instrumentNames[i] + ' ' + ranges[i];
        instrumentRanges.push(str);
      }

      //Key Signatures
      const keySignatures = scoreSearcher.getKeySignatures();

      $('#results').
      append('<tr>' +
      '<td>' + fileName + '</td>' +
      '<td>' + min + '-' + max +'</td>' +
      '<td>' +  instrumentRanges + '</td>' +
      '<td>' +  keySignatures + '</td>'  +
      '</tr>');
    });
  }
};

window.clear = function()
{
  $('#results').empty();
};

$('#analyze').on('click', window.analyze);
$('#clear').on('click', window.clear);
