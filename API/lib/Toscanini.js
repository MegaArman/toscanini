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

  toscanini.getPartNames = () =>
  {
    return partNames;
  };

  toscanini.getParts = () =>
  {
    return parts;
  };

  toscanini.getPart = (instrumentName) => getPart(instrumentName);

  toscanini.getArticulations = (instrumentName) =>
  {
    const finalArticulations = [];

    let articulations = instrumentName ? toscanini.getPart(instrumentName)
      .findall(".//articulations") : etree.findall(".//articulations");

    let ornaments = instrumentName ? toscanini.getPart(instrumentName)
      .findall(".//ornaments") : etree.findall(".//ornaments");

    let notations = instrumentName ? toscanini.getPart(instrumentName)
      .findall(".//notations") : etree.findall(".//notations");

    let technical = instrumentName ? toscanini.getPart(instrumentName)
      .findall(".//technical") : etree.findall(".//technical");

    //CAUTION: these may or may not be all articulations

    articulations.forEach((articulation) =>
    {
      articulation = articulation._children[0].tag;
      if (!finalArticulations.includes(articulation))
      {
        finalArticulations.push(articulation);
      }
    });

    ornaments.forEach((ornament) =>
    {
      ornament = ornament._children[0].tag;
      if (!finalArticulations.includes(ornament))
      {
        finalArticulations.push(ornament);
      }
    });

    technical.forEach((technique) =>
    {
      let tech = technique;
      technique = technique._children[0].tag;
      if (technique === "harmonic")
      {
        console.log(tech._children[0]);
        if (tech._children.length > 1)
        {
          console.log(tech._children[1]);
        }
      }
      if (tech._children !== undefined && tech._children.length > 1)
      {
        console.log("here");
        technique = tech._children[1].tag + tech._children[0].tag;
      }

      if (!finalArticulations.includes(technique))
      {

        finalArticulations.push(technique);
      }
    });

    notations.forEach((notation) =>
    {
      notation = notation._children[0].tag;

      if (notation !== "ornaments" && notation !== "articulations"
        && notation !== "dynamics" && notation !== "technical"
        && !finalArticulations.includes(notation))
      {
        finalArticulations.push(notation);
      }
    });

    return finalArticulations;
  };

  toscanini.getDynamics = (instrumentName) =>
  {
    const finalDynamics = [];

    let dynamics = instrumentName ? toscanini.getPart(instrumentName)
      .findall(".//dynamics") : etree.findall(".//dynamics");

    dynamics.forEach((dynamic) =>
    {
      dynamic = dynamic._children[0].tag;
      if (dynamic !== "other-dynamics")
      {
        const newDynamic = {dynamic: dynamic};

        let isIn = false;

        finalDynamics.forEach((dynamic) =>
        {
          if (dynamic.dynamic === newDynamic.dynamic)
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
        const newDynamic = {dynamic: dynamic};

        let isIn = false;

        finalDynamics.forEach((dynamic) =>
        {
          if (dynamic.dynamic === newDynamic.dynamic)
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
        const newDynamic = {dynamic: dynamic};

        let isIn = false;

        finalDynamics.forEach((dynamic) =>
        {
          if (dynamic.dynamic === newDynamic.dynamic)
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
