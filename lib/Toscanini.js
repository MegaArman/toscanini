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

  const getPart = ((instrumentName) =>
  {
    return parts[partNames.indexOf(instrumentName)];
  });


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
        const newDynamic = dynamic;

        let isIn = false;

        finalDynamics.forEach((dynamic) =>
        {
          if (dynamic === newDynamic)
          {
            isIn = true;
          }
        });

        if (isIn === false)
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
        const newDynamic = dynamic;

        let isIn = false;

        finalDynamics.forEach((dynamic) =>
        {
          if (dynamic === newDynamic)
          {
            isIn = true;
          }
        });

        if (isIn === false)
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
        const newDynamic = dynamic;

        let isIn = false;

        finalDynamics.forEach((dynamic) =>
        {
          if (dynamic === newDynamic)
          {
            isIn = true;
          }
        });

        if (isIn === false)
        {
          finalDynamics.push(newDynamic);
        }
      }
    });

    return finalDynamics;
  };

  toscanini.getInstrumentNames = () => partNames;

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

  toscanini.getNumberOfMeasures = () => parts[0].findall(".//measure").length;

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

  toscanini.getRhythmicComplexity = (instrumentName) =>
  {
    const rhythms = instrumentName ?
      getPart(instrumentName).findall(".//note") : etree.findall(".//note");

    const finalRhythms = [];

    rhythms.forEach((rhythm) =>
    {
      const newRhythm = {};
      const childrenList = rhythm._children;
      let numDots = 0;

      childrenList.forEach((child) =>
      {
        if (child.tag === "type")
        {
          newRhythm.type = child.text;
        }
        if (child.tag === "dot")
        {
          numDots++;
        }
        if (child.tag === "rest")
        {
          newRhythm.rest = true;
        }
      });
      newRhythm.dotted = numDots;

      let isIn = false;
      finalRhythms.forEach((rhythm) =>
      {
        if (rhythm.type === newRhythm.type
          && rhythm.dotted === newRhythm.dotted)
        {
          isIn = true;
        }
      });
      if (newRhythm.rest !== true && isIn !== true)
      {
        finalRhythms.push(newRhythm);
      }
    });

    return finalRhythms;
  };

  toscanini.getTempos = () =>
  {
    let soundTags = etree.findall(".//per-minute");
    const tempoCollection = [];

    soundTags.forEach((soundTag) =>
    {
      const newTempo = parseInt(soundTag.text);

      if (!tempoCollection.includes(newTempo))
      {
        tempoCollection.push(parseInt(newTempo));
      }
    });

    soundTags = etree.findall(".//sound[@tempo]");

    soundTags.forEach((soundTag) =>
    {
      const newTempo = parseInt(soundTag.attrib.tempo);

      if (!tempoCollection.includes(newTempo))
      {
        tempoCollection.push(parseInt(newTempo));
      }
    });

    if (tempoCollection.length === 0)
    {
      tempoCollection.push(120);
    }

    return tempoCollection;
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

  return Object.freeze(toscanini);
}; //createToscanini

//======================================================================
const elementtree = require("elementtree");
const constructor = (musicxml) =>
  createToscanini(elementtree.parse(musicxml.toString()));

module.exports = constructor;
