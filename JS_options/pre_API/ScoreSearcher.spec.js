// node ScoreSearcher.spec.js to run this test - simple as that!
'use strict';
const fs = require('fs');
const xml2js = require('xml2js');
const test = require('tape').test;
const ScoreSearcher = require('./ScoreSearcher');

let parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});

function avamariapg1()
{

  fs.readFile('../scores/avamariapg1.xml', function(err, data) {
    let basicPiece;

      parser.parseString(data, function (err, result) {
        basicPiece = new ScoreSearcher(result);
        basicPiece.findExtremePitches();

        test('avamariapg1 tests', (t) =>{

          const highestActual = basicPiece.getMaxPitch();
          const highestExpected = 68; //Ab

          t.equal(highestActual, highestExpected, 'highest pitch');

          const lowestActual = basicPiece.getMinPitch();
          const lowestExpected = 15; //Eb

          t.equal(lowestActual, lowestExpected, 'lowest pitch');
          t.end();
        });
     });
  });
}

avamariapg1(); //who says you can't nest tests with tape?!
