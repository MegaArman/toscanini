//TODO: find range of all scores
//TODO: find which score's range matches a criterian
'use strict';
const fs = require('fs');
const xml2js = require('xml2js');
const ScoreSearcher = require('../pre_API/ScoreSearcher.js');

const parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});
let globalMaxPitch = -999;
// let globalMinPitch = 999;

//synchornous:
//vivaldi_winter is 3.8mb

// let args = process.argv.slice(2); //MUST run with node RangeScores.js _ _...


let args = ['../scores/vivaldi_winter.xml',
            '../scores/avamariapg1.xml'];
const scoreSearchers = [];
let promises = [];


function loadJSObjectsIntoMem()
{
  for (const fileName of args)
  {
    //NOTE: this DOES invoke async file reading, but then the xml2js invokation
    //is blocking because JS is single threaded.
    promises.push(new Promise((resolve, reject) => {
      fs.readFile(fileName, function(err, data) {
        if (err) throw err;
        parser.parseString(data, function (err, result) {
          const scoreSearcher = new ScoreSearcher(result);
          //PROOF the read is async as avamaria is always calculated first
          //despite being the 2nd item in the list
          // console.log('max is ' + scoreSearcher.getMaxPitch());
          scoreSearchers.push(scoreSearcher);
          resolve(scoreSearcher);
          reject(err);
        });
      });
    }));
  }
}
loadJSObjectsIntoMem();

//after we've created all our JS objects in memory, then get the maxpitch
Promise.all(promises).then(values => {
  for (let pResolve of values)
  {
    console.log(pResolve.getMaxPitch());
  }
});
