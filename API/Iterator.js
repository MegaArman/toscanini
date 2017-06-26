"use strict";
const fs = require("fs");
const et = require("elementtree");

const musicXML = fs.readFileSync("./scores/basic.xml").toString();
const etree = et.parse(musicXML);

const measures = etree.findall(".//measure");
const instrumentPart  = [];

measures.forEach((measure) => 
{
  const beats = [];
  let currentBeat = 1;
  //const voices = {};
    
  measure._children.forEach((child) => 
  {
    if (child.tag === "note")
    {
      //const voice = child.findtext(".//voice");
      const duration = parseInt(child.findtext(".//duration")); 
      const step = child.findtext(".//step");
      const note = {};
      note[step] = duration;
      note.beat = currentBeat;

      (child.findtext("[rest]")) ?  
        beats.push({"beat": currentBeat, "rest": duration}):
        beats.push(note);
      currentBeat += duration;
     // if (child.findtext("[chord]"))
     // {
     //   
     // }
     // !(voice in voices) ? 
      //voices[voice] = duration : voices[voice] += duration;

      //console.log("note", child.findtext(".//duration"));
    }
    else if (child.tag === "backup")
    {
    //  console.log("backup", child.findtext(".//duration"));
    }
    else if (child.tag === "forward")
    {
      //console.log("forward", child.findtext(".//duration"));
    }
  });
 
  instrumentPart.push(beats);
});

//-----------------------------------
const iterator = {};
let measureNum = 0;
let beatMap = instrumentPart[0];
let beatIndex = -1;

const errors =  
{
  "noNext": "no next exists!",
  "noPrev": "no prev exists!"
};

iterator.nextMeasure = () =>
{ 
  if (measureNum >= instrumentPart.length)
  {
    throw new Error(errors.noNext);
  }
  beatMap = instrumentPart[++measureNum];
  beatIndex = 0;
  return beatMap[0];
};

iterator.prevMeasure = () =>
{
  if (measureNum === 0)
  {
    throw new Error(errors.noPrev);
  }
  beatMap = instrumentPart[--measureNum];
  beatIndex = 0;
  return beatMap[0];
};

iterator.next = () =>
{
 if (beatIndex === beatMap.length - 1)
 {
  iterator.nextMeasure();
  return beatMap[beatIndex];
 }
 return beatMap[++beatIndex];
};


iterator.prev = () =>
{
  if (beatIndex === 0)
  {
    iterator.prevMeasure();
    beatIndex = beatMap.length - 1;
    return beatMap[beatIndex];
  }
  return beatMap[--beatIndex];
};

//console.log("instrumentPart", instrumentPart);
//console.log(iterator.nextMeasure());
//console.log(iterator.prevMeasure());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.prev());
console.log(iterator.prev());
console.log(iterator.prev());
console.log(iterator.prev()); //Too low
