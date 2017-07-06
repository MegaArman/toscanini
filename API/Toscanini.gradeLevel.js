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

  gradeLevel.assessDynamics = (instrumentName) =>
  {
    const toscanini = Toscanini(musicxml);

    const dynamicAssessment = [];

    let instruments = null;
    if (instrumentName === undefined)
    {
      instruments = toscanini.getInstrumentNames();
    }
    else
    {
      instruments = toscanini.getInstrumentNames();
    }

    let averageDynamic = 0;

    instruments.forEach((instrument) =>
    {
      //lowercase
        if (instrument === "Solo Treble" || instrument === "Solo Soprano"
          || instrument === "Solo Alto" || instrument === "Solo Tenor"
          || instrument === "Solo Baritone" || instrument === "Solo Bass"
          || instrument === "Treble" || instrument === "Soprano"
          || instrument === "Alto" || instrument === "Tenor"
          || instrument === "Baritone" || instrument === "Bass"
          || instrument === "Voice" || instrument === "Choir"
          || instrument === "Voice [male]" || instrument === "Mean"
          || instrument === "Cantus" || instrument === "Mezzo-soprano"
          || instrument === "Secundus" || instrument === "Contralto"
          || instrument === "Altus" || instrument === "Countertenor"
          || instrument === "Quintus" || instrument === "Bassus")
        {
          dynamicAssessment.push.apply(
            dynamicAssessment, gradeLevel.assessDynamicsChoral(instrument));
        }
        else
        {
          dynamicAssessment.push.apply(dynamicAssessment,
            gradeLevel.assessDynamicsInstrumental(instrument));
        }
    });

    for (var i = 0; i < dynamicAssessment.length; i++)
    {
      averageDynamic += dynamicAssessment[i];
    }
    averageDynamic /= dynamicAssessment.length;


    return averageDynamic;
  };

//private funtion kind of?
  gradeLevel.assessDynamicsChoral = (instrument) =>
  {
    const toscanini = Toscanini(musicxml);
    const dynamics = toscanini.getDynamics(instrument);
    let dynamicAssessment = 0;

    dynamics.forEach((dynamic) =>
    {
      if (dynamic === "ff" || dynamic === "pp")
      {
        dynamicAssessment.push(5);
      }
      else if (dynamic === "fp" || dynamic === "sfz")
      {
        dynamicAssessment.push(4);
      }
      else if (dynamic === "mp" || dynamic === "mf")
      {
        dynamicAssessment.push(3);
      }
      else if (dynamic === "crescendo" || dynamic === "cres."
        || dynamic === "diminuendo" || dynamic === "dim.")
      {
        dynamicAssessment.push(2);
      }
      else if (dynamic === "p" || dynamic === "f")
      {
        dynamicAssessment.push(1);
      }
      else
      {
        dynamicAssessment.push(6);
      }
    });
    return dynamicAssessment;
  };

  gradeLevel.assessDynamicsInstrumental = (instrument) =>
  {
    const toscanini = Toscanini(musicxml);
    const dynamics = toscanini.getDynamics(instrument);
    let dynamicAssessment = [];

    dynamics.forEach((dynamic) =>
    {
      if (dynamic === "fff" || dynamic === "ppp")
      {
        dynamicAssessment.push(5);
      }
      else if (dynamic === "ff" || dynamic === "fp")
      {
        dynamicAssessment.push(4);
      }
      else if (dynamic === "mp" || dynamic === "pp" || dynamic === "fp"
        || dynamic === "sfz")
      {
        dynamicAssessment.push(3);
      }
      else if (dynamic === "crescendo" || dynamic === "cres."
        || dynamic === "diminuendo" || dynamic === "dim."
        || dynamic === "mf")
      {
        dynamicAssessment.push(2);
      }
      else if (dynamic === "p" || dynamic === "f")
      {
        dynamicAssessment.push(1);
      }
      else
      {
        dynamicAssessment.push(6);
      }
    });

    return dynamicAssessment;
  };

  gradeLevel.assessMeter = (instrumentName) =>
  {
    const toscanini = Toscanini(musicxml);

    let timeSignatures = null;
    if (instrumentName === undefined)
    {
      timeSignatures = toscanini.getTimeSignatures();
    }
    else
    {
      timeSignatures = toscanini.getTimeSignatures(instrumentName);
    }

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

  gradeLevel.assessRhythmicComplexity = (instrumentName) =>
  {
    //does not include pickups

    const toscanini = Toscanini(musicxml);
    let rhythms = null;
    if (instrumentName === undefined)
    {
      rhythms = toscanini.getRhythmComplexity();
    }
    else
    {
      rhythms = toscanini.getRhythmComplexity(instrumentName);
    }
    let averageRhythm = 0;
    let rhythmicAssessment = [];

    rhythms.forEach((rhythm) =>
    {
      if ((rhythm.noteType === "quarter" || rhythm.noteType === "half"
      || rhythm.noteType === "whole") && rhythm.dotted === 0)
      {
        rhythmicAssessment.push(1);
      }
      else if ((rhythm.noteType === "eighth" && rhythm.dotted === 0)
      || (rhythm.noteType === "quarter" && rhythm.dotted === 1))
      {
        rhythmicAssessment.push(2);
      }
      else if ((rhythm.noteType === "16th" && rhythm.dotted === 0)
      || (rhythm.noteType === "eighth" && rhythm.dotted === 1))
      {
        //not sure how syncopation will be calculated
        rhythmicAssessment.push(3);
      }
      //missing fourth
      //double check how 16ths and 32nds are marked in xml
      else if ((rhythm.noteType === "quarter" && rhythm.dotted === 2)
      || (rhythm.noteType === "32nd" && rhythm.dotted === 0))
      {
        //also frequent syncopation
        rhythmicAssessment.push(5);
      }
      else
      {
        rhythmicAssessment.push(6);
      }
    });

    for (var i = 0; i < rhythmicAssessment.length; i++)
    {
      averageRhythm += rhythmicAssessment[i];
    }
    averageRhythm /= rhythmicAssessment.length;

    return averageRhythm;
  };

  gradeLevel.assessTempo = (instrumentName) =>
  {
    const toscanini = Toscanini(musicxml);
    let tempos = null;

    if (instrumentName === undefined)
    {
      tempos = toscanini.getTempos();
    }
    else
    {
      tempos = toscanini.getTempos(instrumentName);
    }
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
