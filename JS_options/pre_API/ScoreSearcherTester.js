//Currently the 'import' statement is not widely supported, hence 'require' suffices
let fs = require('fs'),
    xml2js = require('xml2js');
let parser = new xml2js.Parser();
let ScoreSearcher = require('./ScoreSearcher.js');

fs.readFile('./avamariapg1.xml', function(err, data) {     //data is the whole score as a string!!!
    let basicPieceRaw;

    parser.parseString(data, function (err, result) {
      basicPieceRaw = result;
      const basicPiece = new ScoreSearcher(basicPieceRaw);
      basicPiece.findValsByKey('instrument-name');
      console.log('max midi pitch is ' + basicPiece.getMaxPitch());
      console.log('min midi pitch is ' + basicPiece.getMinPitch());
  });
});
