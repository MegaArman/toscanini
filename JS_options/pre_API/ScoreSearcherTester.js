//Currently the 'import' statement is not widely supported, hence 'require' suffices
let hrstart = process.hrtime(); //node supported and more precise for speed test

let fs = require('fs'),
    xml2js = require('xml2js');

let parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});
//no explicitArray: [ 'Violin', 'Flute' ] , with explicitArray: [ [ 'Violin' ], [ 'Flute' ] ]
//merge attributes treats atrributes the same as child elements
//no explicitArray and mergeAttrs reduce the object size

let ScoreSearcher = require('./ScoreSearcher.js');

//data is the whole score as a string!!!
// fs.readFile('../scores/avamariapg1.xml', function(err, data) {
//     let basicPieceRaw;
//
//     parser.parseString(data, function (err, result) {
//       basicPieceRaw = result;
//       const basicPiece = new ScoreSearcher(basicPieceRaw);
//       basicPiece.findValsByKey('instrument-name');
//       console.log('max midi pitch is ' + basicPiece.getMaxPitch());
//       console.log('min midi pitch is ' + basicPiece.getMinPitch());
//   });
// });

// fs.readFile('./two_parts_simple.xml', function(err, data) {     !
//     let basicPieceRaw;
//
//     parser.parseString(data, function (err, result) {
//       basicPieceRaw = result;
//       const basicPiece = new ScoreSearcher(basicPieceRaw);
//   });
// });

//===============================================================
//PERFORMANCE TEST:
//winter is 3.8mb
fs.readFile('../scores/vivaldi_winter.xml', function(err, data) {
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
  });
});
