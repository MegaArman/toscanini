"use strict";
const Toscanini = require("./Toscanini");
const path = require("path");

function arraySame(first, second) {
    var compareLen = first.length;
    if (compareLen != second.length) return false;
    while (compareLen--) {
        if (first[compareLen] !== second[compareLen]) return false;
    }
    return true;
};

//------------------------------------------------------------------------

const gradeScore = (musicxml) =>
{
  const gradeLevel = {};

  gradeLevel.assessMeter = () =>
  {
    const toscanini = Toscanini(musicxml);
    const timeSignatures = toscanini.getTimeSignatures();
    const meterAssessment = [];
    let averageMeter = 0;

    timeSignatures.forEach((timeSignature) =>
    {
      if (arraySame(timeSignature, [7, 8]))
      {
        meterAssessment.push(5);
      }
      else if (arraySame(timeSignature, [5, 4])
        || arraySame(timeSignature, [9, 8]) || arraySame(timeSignature, [12, 8])
        || arraySame(timeSignature, [5, 8]))
      {
        meterAssessment.push(4);
      }
      else if (arraySame(timeSignature, [6, 8]) || arraySame(timeSignature, [6, 4])
        || arraySame(timeSignature, [3, 8]))
      {
        meterAssessment.push(3);
      }
      else if ((arraySame(timeSignature, [2, 2])
        || arraySame(timeSignature, [4, 4]) || arraySame(timeSignature, [2, 4])
        || arraySame(timeSignature, [3, 4]))
        & timeSignatures.length > 1)
      {
        meterAssessment.push(2);
      }
      else if ((arraySame(timeSignature, [4,4]) ||
        arraySame(timeSignature, [2, 4]) || arraySame(timeSignature, [3, 4]))
        & (timeSignatures.length == 1))
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
// constructor
const constructor = (musicxml) =>
{
  return gradeScore(musicxml);
};

module.exports = constructor;

//10-1:30 = 3:30
//2:30-4:30 = 2:00
