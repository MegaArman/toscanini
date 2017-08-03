"use strict";
const Toscanini = require("./Toscanini");

function arraySame(first, second)
{
    let compareLen = first.length;
    if (compareLen !== second.length)
      return false;
    while (compareLen--)
    {
        if (first[compareLen] !== second[compareLen]) return false;
    }
    return true;
}

function meterArray(meter)
{
  return [meter.beats, meter.beatType];
}

// function instrumentCheck(instrumentName, toscanini)
// {
//   let instruments = null;
//
//   if (instrumentName === undefined)
//   {
//     instruments = toscanini.getInstrumentNames();
//   }
//   else
//   {
//     instruments = toscanini.getInstrumentNames();
//
//     if (instruments.includes(instrumentName))
//     {
//       instruments = instrumentName;
//     }
//     else
//     {
//       instruments = null;
//     }
//   }
//
//   return instruments;
// }
//------------------------------------------------------------------------

const gradeScore = (musicxml) =>
{
  const gradeLevel = {};

  gradeLevel.assessArticulations = (instrumentName) =>
  {
    const toscanini = Toscanini(musicxml);
    const articulationAssessment = [];

    let instruments;
    if (instrumentName !== undefined && instrumentName !== null)
    {
      instruments = [instrumentName];
    }
    else
    {
      instruments = toscanini.getPartNames();
    }

    if (instruments !== null)
    {
      let averageArticulation = 0;

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
          articulationAssessment.push.apply(articulationAssessment,
            gradeLevel.assessArticulationsChoral(instrument, toscanini));
        }
        else
        {
          articulationAssessment.push.apply(articulationAssessment,
            gradeLevel.assessArticulationsInstrumental(instrument, toscanini));
        }
      });

      for (let i = 0; i < articulationAssessment.length; i++)
      {
        averageArticulation += articulationAssessment[i];
      }
      averageArticulation /= articulationAssessment.length;

      return averageArticulation;
    }
  };

  gradeLevel.assessArticulationsChoral = (instrumentName, toscanini) =>
  {
    const articulations = toscanini.getArticulations(instrumentName);
    let articulationAssessment = [];

    //Does not include level 5, because no way to incorporate 2 things at a time
    articulations.forEach((articulation) =>
    {
      if (articulation.includes("legato-staccato")
        || articulation.includes("stacatto-legato"))
      {
        //include swing weightedness
        articulationAssessment.push(4);
      }
      else if (articulation.includes("tenuto")
        || articulation.includes("inverted accent")
        || articulation.includes("fermata"))
      {
        articulationAssessment.push(3);
      }
      else if (articulation.includes("slur")
        || articulation.includes("staccato")
        || articulation.includes("accent"))
      {
        articulationAssessment.push(2);
      }
      else if (articulation.includes("attack")
        || articulation.includes("release")
        || articulation.includes("breath-mark"))
      {
        articulationAssessment.push(1);
      }
      else
      {
        articulationAssessment.push(6);
      }
    });

    return articulationAssessment;
  };

  gradeLevel.assessArticulationsInstrumental = (instrumentName, toscanini) =>
  {
    const articulations = toscanini.getArticulations(instrumentName);
    let articulationAssessment = [];

    //Does not include level 5, because no way to incorporate 2 things at a time
    articulations.forEach((articulation) =>
    {
      if (articulation.includes("richochet")
        || articulation.includes("stacatto-legato")
        || articulation.includes("double-tongue"))
      {
        articulationAssessment.push(4);
      }
      else if (articulation.includes("legato-staccato")
        || articulation.includes("stacatto-legato")
        || articulation.includes("marcato"))
      {
        //include swing weightedness
        articulationAssessment.push(3);
      }
      else if (articulation.includes("accent")
        || articulation.includes("tenuto")
        || articulation.includes("fermata")
        || articulation.includes("spiccato"))
      {
        articulationAssessment.push(2);
      }
      else if (articulation.includes("attack")
        || articulation.includes("release")
        || articulation.includes("breath-mark")
        || articulation.includes("slur")
        || articulation.includes("staccato")
        || articulation.includes("legato")
        || articulation.includes("tied"))
      {
        articulationAssessment.push(1);
      }
      else
      {
        articulationAssessment.push(6);
      }
    });

    return articulationAssessment;
  };

  gradeLevel.assessDynamics = (instrumentName) =>
  {
    const toscanini = Toscanini(musicxml);

    const dynamicAssessment = [];

    let instruments;
    if (instrumentName !== undefined && instrumentName !== null)
    {
      instruments = [instrumentName];
    }
    else
    {
      instruments = toscanini.getPartNames();
    }

    if (instruments !== null)
    {
      let averageDynamic = 0;

      instruments.forEach((instrument) =>
      {
        //lowercase
        const lowercaseInst = instrument.toLowerCase();
        if (lowercaseInst.includes("treble")
          || lowercaseInst.includes("soprano")
          || lowercaseInst.includes("alto")
          || lowercaseInst.includes("tenor")
          || lowercaseInst.includes("baritone")
          || lowercaseInst.includes("bass")
          || lowercaseInst.includes("voice")
          || lowercaseInst === "choir"
          || lowercaseInst === "Mean"
          || lowercaseInst === "Cantus"
          || lowercaseInst === "Secundus"
          || lowercaseInst === "Altus"
          || lowercaseInst === "Quintus")
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
    }

    return "Instrument does not exist. Check your spelling!";
  };

//private funtion kind of?
  gradeLevel.assessDynamicsChoral = (instrument) =>
  {
    const toscanini = Toscanini(musicxml);
    const dynamics = toscanini.getDynamics(instrument);
    let dynamicAssessment = 0;

    dynamics.forEach((dynamic) =>
    {
      let dynamicComparison = dynamic.dynamic;

      if (dynamicComparison === "ff" || dynamicComparison === "pp")
      {
        dynamicAssessment.push(5);
      }
      else if (dynamicComparison === "fp" || dynamicComparison === "sfz")
      {
        dynamicAssessment.push(4);
      }
      else if (dynamicComparison === "mp" || dynamicComparison === "mf")
      {
        dynamicAssessment.push(3);
      }
      else if (dynamicComparison === "crescendo"
        || dynamicComparison === "cres."
        || dynamicComparison === "diminuendo" || dynamicComparison === "dim.")
      {
        dynamicAssessment.push(2);
      }
      else if (dynamicComparison === "p" || dynamicComparison === "f")
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
      let dynamicComparison = dynamic.dynamic;

      if (dynamicComparison === "fff" || dynamicComparison === "ppp")
      {
        dynamicAssessment.push(5);
      }
      else if (dynamicComparison === "ff" || dynamicComparison === "fp")
      {
        dynamicAssessment.push(4);
      }
      else if (dynamicComparison === "mp" || dynamicComparison === "pp"
        || dynamicComparison === "fp" || dynamicComparison === "sfz")
      {
        dynamicAssessment.push(3);
      }
      else if (dynamicComparison === "crescendo"
        || dynamicComparison === "cres."
        || dynamicComparison === "diminuendo" || dynamicComparison === "dim."
        || dynamicComparison === "mf")
      {
        dynamicAssessment.push(2);
      }
      else if (dynamicComparison === "p" || dynamicComparison === "f")
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
      if (arraySame(meterArray(timeSignature), [7, 8]))
      {
        meterAssessment.push(5);
      }
      else if (arraySame(meterArray(timeSignature), [5, 4])
        || arraySame(meterArray(timeSignature), [9, 8])
        || arraySame(meterArray(timeSignature), [12, 8])
        || arraySame(meterArray(timeSignature), [5, 8]))
      {
        meterAssessment.push(4);
      }
      else if (arraySame(meterArray(timeSignature), [6, 8])
        || arraySame(meterArray(timeSignature), [6, 4])
        || arraySame(meterArray(timeSignature), [3, 8]))
      {
        meterAssessment.push(3);
      }
      else if ((arraySame(meterArray(timeSignature), [2, 2])
        || arraySame(meterArray(timeSignature), [4, 4])
        || arraySame(meterArray(timeSignature), [2, 4])
        || arraySame(meterArray(timeSignature), [3, 4]))
        & timeSignatures.length > 1)
      {
        meterAssessment.push(2);
      }
      else if ((arraySame(meterArray(timeSignature), [4,4])
        || arraySame(meterArray(timeSignature), [2, 4])
        || arraySame(meterArray(timeSignature), [3, 4]))
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

    let rhythms;

    if (instrumentName === undefined || instrumentName === null)
    {
      rhythms = toscanini.getRhythmicComplexity();
    }
    else
    {
      rhythms = toscanini.getRhythmicComplexity(instrumentName);
    }

    let averageRhythm = 0;
    let rhythmicAssessment = [];

    rhythms.forEach((rhythm) =>
    {
      let rhythmType = rhythm.type;
      let rhythmDot = rhythm.dotted;
      if ((rhythmType === "quarter" || rhythmType === "half"
      || rhythmType === "whole") && rhythmDot === 0)
      {
        rhythmicAssessment.push(1);
      }
      else if ((rhythmType === "eighth" && rhythmDot === 0)
      || (rhythmType === "quarter" && rhythmDot === 1))
      {
        rhythmicAssessment.push(2);
      }
      else if ((rhythmType === "16th" && rhythmDot === 0)
      || (rhythmType === "eighth" && rhythmDot === 1))
      {
        //not sure how syncopation will be calculated
        rhythmicAssessment.push(3);
      }
      //missing fourth
      //double check how 16ths and 32nds are marked in xml
      else if ((rhythmType === "quarter" && rhythmDot === 2)
      || (rhythmType === "32nd" && rhythmDot === 0))
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
      else if (tempo > 200 && tempo <= 208)
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
