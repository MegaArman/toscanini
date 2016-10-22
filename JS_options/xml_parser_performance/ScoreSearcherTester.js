let fs = require('fs'),
    xml2js = require('xml2js');

let hrstart = process.hrtime(); //node supported and more precise for speed test
let parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});
let ScoreSearcher = require('./ScoreSearcher.js');

fs.readFile('./vivaldi_winter.xml', function(err, data) {
    let basicPieceRaw;

    parser.parseString(data, function (err, result) {
      basicPieceRaw = result;
      const basicPiece = new ScoreSearcher(basicPieceRaw);
      // basicPiece.findValsByKey('instrument-name');
      // console.log('max midi pitch is ' + basicPiece.getMaxPitch());
      // console.log('min midi pitch is ' + basicPiece.getMinPitch());

      //PRINT EXECUTION TIME :
      let hrend = process.hrtime(hrstart);
      console.log('Execution time (hr): ', hrend[0], hrend[1]/1000000);
      console.log(basicPiece.getMaxPitch());
  });
});
