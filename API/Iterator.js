"use strict";
const fs = require("fs");
const et = require("elementtree");

const musicXML = fs.readFileSync("./scores/basic.xml").toString();
const etree = et.parse(musicXML);
const measures = etree.findall(".//measure");

//measure, beatmap

const iterator = {};
const instrumentPart  = [];

measures.forEach((measure) => 
{
  //  console.log("measure num", measure.attrib.number);
  const beatMap = new Map();
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

      (child.findtext("[rest]")) ?  
        beatMap.set(currentBeat, {"rest": duration}):
        beatMap.set(currentBeat, note);
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
 
  instrumentPart.push(beatMap);
});

//-----------------------------------
let measureNum = 0;
let beatMap = instrumentPart[0];
let beatMapKeys = beatMap.keys();
let beatIndex = 0;

iterator.nextMeasure = () =>
{
  measureNum++;
  beatMap = instrumentPart[measureNum];
  beatMapKeys = beatMap.keys();
  beatIndex = 0;
  console.log("beatMapKeys", beatMapKeys);
  return beatMap.get(1);
};

iterator.prevMeasure = () =>
{
  measureNum--;
  beatMap = instrumentPart[measureNum];
  beatMapKeys = beatMap.keys();
  beatIndex = 0;
  return instrumentPart[measureNum].get(1);
};

iterator.next = () =>
{
 beatIndex++;
 console.log(beatIndex);
 return beatMap.get(beatMapKeys[beatIndex]);
};


iterator.prev = () =>
{
 beatIndex--;
 return  beatMap.get(beatMapKeys[beatIndex]);
};

//console.log("instrumentPart", instrumentPart);
console.log(iterator.nextMeasure());
console.log(iterator.prevMeasure());
console.log(iterator.next());
console.log(iterator.prev());
