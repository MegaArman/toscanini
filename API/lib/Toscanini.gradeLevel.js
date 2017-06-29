"use strict";
const Toscanini = require("./Toscanini");

function arraySame(first, second)
{
    var compareLen = first.length;
    if (compareLen !== second.length)
      return false;
    while (compareLen--)
    {
        if (first[compareLen] !== second[compareLen]) return false;
    }
    return true;
}

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
      else if (arraySame(timeSignature, [6, 8])
        || arraySame(timeSignature, [6, 4])
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
        & (timeSignatures.length === 1))
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
    //maybe instead of this I can ask for the largest meterassesment?
    return averageMeter;
  };

  gradeLevel.assessTempo = () =>
  {
    //does not include more nuances of the changes in tempo - words not
    //extensively included

    const toscanini = Toscanini(musicxml);
    const tempos = toscanini.getTempos();
    const tempoAssessment = [];
    let averageTempo = 0;

    tempos.forEach((tempo) =>
    {
      if (tempo < 40 || tempo > 208)
      {
        tempoAssessment.push(6);
      }
      else if (tempo > 200 && tempo < 208)
      {
        tempoAssessment.push(5);
      }
      else if (tempo > 168 && tempo <= 200)
      {
        tempoAssessment.push(4);
      }
      else if ((tempo > 40 && tempo <= 66))
      {
        //not entirely sure what Michael meant in this one
        tempoAssessment.push(3);
      }
      else if ((tempo > 66 && tempo < 78) || (tempo > 120 && tempo <= 168))
      {
        tempoAssessment.push(2);
      }
      else if (tempo >= 78 && tempo <= 120)
      {
        tempoAssessment.push(1);
      }
    });

    for (var i = 0; i < tempoAssessment.length; i++)
    {
      averageTempo += tempoAssessment[i];
    }
    averageTempo /= tempoAssessment.length;
    //maybe instead of this I can ask for the largest meterassesment?
    return averageTempo;
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
