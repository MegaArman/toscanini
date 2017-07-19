"use strict";

//"private static" utility definitions=========================================
const pitchToMidiNum = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A":9, "B": 11};
const fifthToPitch =
{
  "-6": "Gb", "-5": "Db", "-4":"Ab", "-3": "Eb", "-2": "Bb", "-1": "F",
  "0": "C","1": "G", "2": "D", "3": "A", "4": "E", "5": "B", "6": "F#"
};

//=============================================================================
//"class"
// etree represents the element tree for the entire score
const createToscanini = (etree) =>
{
  //private---------------------------
  const partNames = etree.findall(".//part-name")
                          .map((partName) => partName.text);
  const parts = etree.findall(".//part");
  const getPart = (instrumentName)  => parts[partNames.indexOf(instrumentName)];

  //public----------------------------
  const toscanini = {};
  //TODO make small method for repeated things
  toscanini.getDynamics = (instrumentName) =>
  {
    const finalDynamics = [];
    const possibleDynamics = ["ppppppp", "pppppp", "ppppp", "pppp", "ppp",
      "pp", "p","mp", "mf", "f", "ff", "fff", "ffff", "fffff", "ffffff",
      "fffffff", "fp", "sf", "rfz", "rf", "sfz", "sfzp", "fz"];

    let dynamics = instrumentName ? getPart(instrumentName)
      .findall(".//dynamics") : etree.findall(".//dynamics");

    var notNullList = false;
    var found = -1;

    dynamics.forEach((dynamic) => {
      for (var i = 0; i < finalDynamics.length; i++)
      {
        notNullList = true;
        if (finalDynamics[i] === dynamic)
        {
          found = i;
        }
      }
      console.log(dynamic._children);
      if (notNullList === false)
      {
        finalDynamics.push(dynamic._children);
      }
      else if (found !== -1)
      {
        finalDynamics[found].frequency++;
      }
      else
      {
        finalDynamics.push(dynamic._children);
      }
    });

    dynamics = instrumentName ? getPart(instrumentName)
      .findall(".//wedge") : etree.findall(".//wedge");

    dynamics.forEach((dynamic) => {
      if (dynamic.type !== "stop" && dynamic.type !== "start")
      for (var i = 0; i < finalDynamics.length; i++)
      {
        notNullList = true;
        if (finalDynamics[i] === dynamic.type)
        {
          found = i;
        }
      }

      if (notNullList === false)
      {
        finalDynamics.push(dynamic.type);
      }
      else if (found !== -1)
      {
        finalDynamics[found].frequency++;
      }
      else
      {
        finalDynamics.push(dynamic.type);
      }
    });

    dynamics = instrumentName ? getPart(instrumentName)
      .findall(".//words") : etree.findall(".//words");

    //there's going to be an issue here too
    return finalDynamics;
  };

  toscanini.getInstrumentNames = () => partNames;

  toscanini.getPitchRange = (instrumentName) =>
  {
    const pitches = instrumentName ?
       getPart(instrumentName).findall(".//pitch") : etree.findall(".//pitch");
    const range = {min: Infinity, max: -Infinity};

    pitches.forEach((pitch) =>
    {
      const step  = pitchToMidiNum[pitch.findtext(".//step")];
      const alter = (pitch.findtext(".//alter") !== undefined) ?
        parseInt(pitch.findtext(".//alter")) : 0;
      const octave = parseInt(pitch.findtext(".//octave")) * 12;
      const midiNum = step + alter + octave;

      if (midiNum < range.min)
      {
        range.min = midiNum;
      }
      if (midiNum > range.max)
      {
        range.max = midiNum;
      }
    });

    return range;
  };

  toscanini.getTempos = (instrumentName) =>
  {
    const tempos = instrumentName ?
      getPart(instrumentName).findall(".//per-minute")
      : etree.findall(".//per-minute");

    const tempoCollection = [];

    tempos.forEach((tempo) =>
    {
      const newTempo =  {};
      newTempo.tempo = parseInt(tempo.text);
      newTempo.frequency = 1;

      var notNullList = false;
      var found = -1;

      for (var i = 0; i < tempoCollection.length; i++)
      {
        notNullList = true;
        if (tempoCollection[i].tempo === newTempo.tempo)
        {
          found = i;
        }
      }

      if (notNullList === false)
      {
        tempoCollection.push(newTempo);
      }
      else if (found !== -1)
      {
        tempoCollection[found].frequency++;
      }
      else
      {
        tempoCollection.push(newTempo);
      }
    });

    if (tempoCollection.length === 0)
    {
      const filledTempo = {tempo: 120, frequency: 1}
      tempoCollection.push(filledTempo);
    }

    return tempoCollection;
  };


  return toscanini;
}; //createToscanini

//======================================================================
const elementtree = require("elementtree");
const constructor = (musicxml) =>
  createToscanini(elementtree.parse(musicxml.toString()));

module.exports = constructor;
