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
      if (timeSignature === [7, 8])
      {
        meterAssessment.push(5);
      }
      else if (timeSignature === [5, 4] || timeSignature === [9, 8]
        || timeSignature === [12, 8] || timeSignature === [5, 8])
      {
        meterAssessment.push(4);
      }
      else if (timeSignature === [6, 8] || timeSignature === [6, 4]
        || timeSignature === [3, 8])
      {
        meterAssessment.push(3);
      }
      else if ((timeSignature === [2, 2] || timeSignature === [4, 4]
        || timeSignature === [2, 4] || timeSignature === [3, 4])
        && timeSignatures.length > 1)
      {
        meterAssessment.push(2);
      }
      else if ((timeSignature === [4, 4] || timeSignature === [2, 4]
        || timeSignature === [3, 4]) && timeSignatures.length === 1)
      {
        meterAssessment.push(1);
      }
      else {
        meterAssessment.push(6);
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
