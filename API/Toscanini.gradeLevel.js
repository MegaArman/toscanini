"use strict";

const gradeScore = (musicObj) =>
{
  const grade = {};

  grade.assessMeter()
  {
    const timeSignatures = toscanini.getTimeSignatures();
    const meterAssessment = [];

    timeSignatures.forEach((timeSignature) =>
    {
      if ((timeSignature === [4, 4] || timeSignature === [2, 4]
        || timeSignature === [3, 4]) && timeSignatures.length === 1)
        {
          //grade level 1
          meterAssessment.push(1);
        }
      else if (timeSignature === [4, 4] || timeSignature === [2, 4]
        || timeSignature === [3, 4] || timeSignature === [2, 2])
        {

        }
      else if (timeSignature === [6, 8] || timeSignature === [2, 4]
        || timeSignature === [3, 4] || timeSignature === [2, 2])
        {

        }
    });
  }
}

//======================================================================
const xml2js = require("xml2js");
const parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});

const constructor = (musicxml) =>
{
  let scoreObj;

  parser.parseString(musicxml, (err, obj) =>
  {
    if (err)
    {
      throw err;
    }
    scoreObj = obj;
  });

  // console.log(JSON.stringify(scoreObj, null, 4));

  return gradeScore(scoreObj);
};

module.exports = constructor;
