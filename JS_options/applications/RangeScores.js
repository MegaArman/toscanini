//TODO: find range of all scores
//TODO: find which score's range matches a criterian
'use strict';
const fs = require('fs');
const xml2js = require('xml2js');
const ScoreSearcher = require('../pre_API/ScoreSearcher.js');

const parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});
let globalMaxPitch = -999;
let args = ['../scores/vivaldi_winter.xml',
            '../scores/avamariapg1.xml'];
let promises = []; //ends up as array of scoreSearcher objects

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
          // const scoreSearcher = new ScoreSearcher(result);
          //PROOF the read is async as avamaria is always calculated first
          //despite being the 2nd item in the list
          // console.log('max is ' + scoreSearcher.getMaxPitch());
          resolve(new ScoreSearcher(result));
          reject(err);
        });
      });
    }));
  }
}

loadJSObjectsIntoMem();

//aggregates results of multiple promises, in other words...
//after we've created all our JS objects in memory, then calc the globalmaxpitch
//Note the promises resolves are in order, despite the file read being async
Promise.all(promises).then(results => {
  for (let pResolve of results)
  {
    let max = pResolve.getMaxPitch();
    if (globalMaxPitch < max) globalMaxPitch =max;
    console.log('max is ' + max);
  }

  console.log('globalMaxPitch is ' + globalMaxPitch);
});
