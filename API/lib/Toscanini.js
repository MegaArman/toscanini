"use strict";

//"private static" utility definitions=========================================
const pitchToMidiNum = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A":9, "B": 11};
const fifthToPitch =
{
  "-6": "Gb", "-5": "Db", "-4":"Ab", "-3": "Eb", "-2": "Bb", "-1": "F",
  "0": "C","1": "G", "2": "D", "3": "A", "4": "E", "5": "B", "6": "F#"
};

//make properties immutable
Object.freeze(pitchToMidiNum);
Object.freeze(fifthToPitch);
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

  toscanini.getDynamics = (instrumentName) =>
  {
    const finalDynamics = [];

    let dynamics = instrumentName ? getPart(instrumentName)
      .findall(".//dynamics") : etree.findall(".//dynamics");

    dynamics.forEach((dynamic) =>
    {
      dynamic = dynamic._children[0].tag;
      if (dynamic !== "other-dynamics")
      {
        const newDynamic = {dynamic: dynamic};
        if (!finalDynamics.includes(newDynamic))
        {
          finalDynamics.push(newDynamic);
        }
      }
    });

    dynamics = instrumentName ? getPart(instrumentName)
      .findall(".//wedge") : etree.findall(".//wedge");

    dynamics.forEach((dynamic) =>
    {
      dynamic = dynamic.attrib.type;

      if (dynamic !== "stop" && dynamic !== "start")
      {
        const newDynamic = {dynamic: dynamic};
        if (!finalDynamics.includes(newDynamic))
        {
          finalDynamics.push(newDynamic);
        }
      }
    });

    dynamics = instrumentName ? getPart(instrumentName)
      .findall(".//words") : etree.findall(".//words");

    dynamics.forEach((dynamic) =>
    {
      dynamic = dynamic.text;
      if (dynamic === "cres." || dynamic === "crescendo" || dynamic === "dim."
           || dynamic === "diminuendo" || dynamic === "descres."
           || dynamic === "descrescendo" || dynamic === undefined)
      {
        if (dynamic === "cres.")
        {
          dynamic = "crescendo";
        }
        else if (dynamic === "dim.")
        {
          dynamic = "diminuendo";
        }
        else if (dynamic === "decres.")
        {
          dynamic = "descrescendo";
        }
        const newDynamic = {dynamic: dynamic};
        if (!finalDynamics.includes(newDynamic))
        {
          finalDynamics.push(newDynamic);
        }
      }
    });

    return finalDynamics;
  };

  toscanini.getNumberOfMeasures = () => parts[0].findall(".//measure").length;

  toscanini.getInstrumentNames = () => partNames;

  toscanini.getPitchRange = (instrumentName) =>
  {
    const range = {minPitch: Infinity, maxPitch: -Infinity};
    const pitches = instrumentName ?
      getPart(instrumentName).findall(".//pitch") : etree.findall(".//pitch");

    pitches.forEach((pitch) =>
    {
      const step  = pitchToMidiNum[pitch.findtext(".//step")];
      const alter = (pitch.findtext(".//alter") !== undefined) ?
        parseInt(pitch.findtext(".//alter")) : 0;
      const octave = parseInt(pitch.findtext(".//octave")) * 12;
      const midiNum = step + alter + octave;

      if (midiNum < range.minPitch)
      {
        range.minPitch = midiNum;
      }
      if (midiNum > range.maxPitch)
      {
        range.maxPitch = midiNum;
      }

     });

    return range;
  };

  toscanini.getTempos = () =>
  {
    const soundTags = etree.findall(".//sound[@tempo]");

    const tempoCollection = [];

    soundTags.forEach((soundTag) =>
    {
      const newTempo = parseInt(soundTag.attrib.tempo);

      if (!tempoCollection.includes(newTempo))
      {
        tempoCollection.push(parseInt(newTempo));
      }
    });

    return tempoCollection;
  };

  toscanini.getKeySignatures = (instrumentName) =>
  {
    const keySignatures = [];
    const allFifths = instrumentName ?
      getPart(instrumentName).findall(".//fifths") : etree.findall(".//fifths");

    allFifths.forEach((fifths) =>
    {
      if (!keySignatures.includes(fifthToPitch[fifths.text]))
      {
        keySignatures.push(fifthToPitch[fifths.text]);
      }
    });

    return keySignatures;
  };

  toscanini.getTimeSignatures = (instrumentName) =>
  {
    const times = instrumentName ?
      getPart(instrumentName).findall(".//time") : etree.findall(".//time");
    const timeSignatures = [];

    times.forEach((time) =>
    {
      const beats = parseInt(time.findtext(".//beats"));
      const beatType = parseInt(time.findtext(".//beat-type"));
      const duplicate = timeSignatures.some((oldTimeSignature) =>
      {
        return beats === oldTimeSignature.beats
          && beatType === oldTimeSignature.beatType;
      });

      if (!duplicate)
      {
        timeSignatures.push({beats: beats, beatType: beatType});
      }
    });

    return timeSignatures;
  };

  toscanini.getRhythmicComplexity = (instrumentName) =>
  {
    const rhythms = instrumentName ?
      getPart(instrumentName).findall(".//note") : etree.findall(".//note");

    //check 4 and 5

    rhythms.forEach((rhythm) =>
    {
      const newRhythm = {};
      newRhythm.type = rhythm[4].text;
      if (rhythm[5].tag === "dot")
      {
        //TODO need to check for rests and for dots
      }
    });
  };

  return Object.freeze(toscanini);
}; //createToscanini

//======================================================================
const elementtree = require("elementtree");
const constructor = (musicxml) =>
  createToscanini(elementtree.parse(musicxml.toString()));

module.exports = constructor;
