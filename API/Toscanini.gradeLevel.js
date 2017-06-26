"use strict";
const Toscanini = require("./Toscanini");
const fs = require("fs");
const path = require("path");

const gradeScore = (xmlfilename) =>
{
  const gradeLevel = {};

  gradeLevel.assessMeter = () =>
  {
    const musicxml =
      fs.readFileSync(xmlfilename, "utf-8")
    const toscanini = Toscanini(musicxml);
    const timeSignatures = toscanini.getTimeSignatures();
    const meterAssessment = [];
    let averageMeter = 0;

    timeSignatures.forEach((timeSignature) =>
    {
      if (timeSignature = [7, 8])
      {
        meterAssessment.push(5);
      }
      else if (timeSignature == [5, 4] || timeSignature == [9, 8]
        || timeSignature == [12, 8] || timeSignature == [5, 8])
      {
        meterAssessment.push(4);
      }
      else if (timeSignature == [6, 8] || timeSignature == [6, 4]
        || timeSignature == [3, 8])
      {
        meterAssessment.push(3);
      }
      else if ((timeSignature == [2, 2] || timeSignature == [4, 4]
        || timeSignature == [2, 4] || timeSignature == [3, 4])
        && timeSignatures.length > 1)
      {
        meterAssessment.push(2);
      }
      else if ((timeSignature == [4,4] || timeSignature == [2, 4]
        || timeSignature == [3, 4]) && (timeSignatures.length = 1))
      {
        meterAssessment.push(1);
      }
      else
      {
        meterAssessment.push(6);
      }
    });

    for (var i = 0; i < meterAssessment.length; i++)
    {
      averageMeter += meterAssessment[i];
    }
    averageMeter /= meterAssessment.length;

    return averageMeter;
  };

  return gradeLevel;
};

//======================================================================
const xml2js = require("xml2js");
const parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});

const constructor = (musicxml) =>
{
  let toscObj;

  parser.parseString(musicxml, (err, obj) =>
  {
    if (err)
    {
      throw err;
    }
    toscObj = obj;
  });

  // console.log(JSON.stringify(scoreObj, null, 4));

  return gradeScore(toscObj);
};

module.exports = constructor;
