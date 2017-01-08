'use strict';
let hrstart = process.hrtime(); //node supported and more precise for speed test

const fs = require('fs');
const xml2js = require('xml2js');
const ScoreSearcher = require('./ScoreSearcher.js');

const parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});

//vivaldi_winter is 3.8mb
fs.readFile('../scores/vivaldi_winter.xml', function(err, data) {
  parser.parseString(data, function (err, result) {
    const scoreSearcher = new ScoreSearcher(result);
    scoreSearcher.getMaxPitch();

    //PRINT EXECUTION TIME :
    let hrend = process.hrtime(hrstart);
    console.log('Execution time (hr): ', hrend[0], hrend[1]/1000000);
  });
});
