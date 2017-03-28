"use strict";

//"private static" utility definitions=========================================
const xml2js = require("xml2js");
const parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});
const pitchToMidiNum = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A":9, "B": 11};

function traverse(obj,func)
{
  for (let i in obj)
  {
    func.apply(this,[i, obj[i]]);
    if (obj[i] !== null && typeof(obj[i])==="object") traverse(obj[i],func);
  }
}

//create objects for each part, this will reduce searching whole score.
//part being the full name of parts, ex: Solo Violin, Violin I, Violin II
function makeInstrumentObjects(musicObj)
{
  let partNames = [];
  let instrumentObjects = {};

  function process(key, value) //builds array of instrument objects
  {
    //first find the part names as they"re always towards the top of file
    //This will be pushed in the correct order as we see them:
    if (key === "part-name") partNames.push(value);

    //the actual parts data are in an ordered array found via key "part"
    //bc they"re ordered, they correspond to the ordering of the part-names
    if (key === "part")
    {
      let index = 0;
      for (let name of partNames)
      {
        instrumentObjects[name] = value[index]; //value is array of parts
        index++;
      }

      return; //avoid redundant traversal
    }
  }

  traverse(musicObj, process);

  //if there's a single instrument we need to do some hacking...
  if (Object.keys(instrumentObjects).length === 1)
  {
    const instrumentName = Object.keys(instrumentObjects)[0];
    instrumentObjects[instrumentName] = musicObj;
  }

  return instrumentObjects;
}

//=============================================================================
const factoryScoreIterator = (MusicXML) =>
{
  let musicObj;
  let scoreIterable = []; // object that gets iterated over
  let selectedInstrument;
  const scoreIterator = {}; //does the iterating

  parser.parseString(MusicXML, function (err, jsObj)
  {
    if (err) throw err;
    musicObj = jsObj;
  });

  const instrumentObjects = makeInstrumentObjects(musicObj);

  for (let instrumentName in instrumentObjects)
  {
    let midiNum = 0;
    let part = [];
    let chordMap = new Map(); //contains {"default-x", [pitches]}
    //^ MUST USE MAP NOT OBJECT to ensure notes are always in correct order

    //strategy: loop through measure to see symbols happening at same points in time (default-x)
    const process = (key, value) =>
    {
     if (key === "note") //return as arrays
     {
       for (let singleNote of value)
       {
         //if a pitch
         if (singleNote["pitch"] !== undefined)
         {
           //Calculate midinum
            midiNum += pitchToMidiNum[singleNote["pitch"]["step"]];
            if (singleNote["pitch"]["alter"] !== undefined)
             midiNum += parseInt(singleNote["pitch"]["alter"]);

           midiNum += parseInt(singleNote["pitch"]["octave"]) * 12;

           let note = {};
           note.pitch = midiNum;
           let defaultX = singleNote["default-x"];

           if (chordMap.has(defaultX))
           {
            //  console.log("current time", chordMap.get(defaultX));
            let newList = chordMap.get(defaultX);
            newList.push(note);
            chordMap.set(defaultX, newList);
           }
           //this a new point in time
           else
           {
             let newList= [];
             newList.push(note);

             chordMap.set(defaultX, newList);
           }

           midiNum = 0;
         }
         //TODO: not a pitch
        //  else
        //  {
        //    part.push("not note symbol");
        //  }
       } //loop through measure

       //construct chords
       for (let val of chordMap.values())
       {
         part.push(val);
       }

       // in case coordinates are same - could happen on new page or new measure?
       chordMap.clear();
     }
   };
   traverse(instrumentObjects[instrumentName], process);

  //  console.log("chordMap", chordMap);
   let partObj = {};
   partObj[instrumentName]= part;
   scoreIterable.push(partObj);
 } //loop through instruments


 scoreIterator.selectInstrument = (instrumentName) =>
 {
   selectedInstrument = instrumentName;
 };

  // scoreIterator.next = () =>
  // {
  //
  // }

  return scoreIterator;

};

module.exports = factoryScoreIterator;
