"use strict";
const fs = require("fs");
const et = require("elementtree");

const XML = et.xml;
const ElementTree = et.elementTree;
const element = et.Element;
const subElement = et.SubElement;

const musicXML = fs.readFileSync("./scores/two_tempos.xml").toString();
const etree = et.parse(musicXML);

//assuming one tempo per measure, else we need findall

//console.log(etree.findall(".//measure")[0].findtext(".//per-minute"));

// ex: if 4/4 at 60bpm it should take 4 seconds (assuming tempo is in quarters)
// because 4 * (4/4) * 60/60, thus 
// equation for length of measure: 
//    numBeats * (4/beatType) * tempo / 60


//TODO: account for different beat-units, ex: 120bpm where beats is half
//todo account for repeats or other flow control type things

let currentBeats;
let currentBeatType;
let currentTempo;
let currentTimeElapsed;

//TODO measures should just be of the first instrument
etree.findall(".//measure").forEach((measure) =>
{
//TODO: account for tempo changes in a measure

  const newBeats = parseInt(measure.findtext(".//beats"));
  currentBeats = newBeats ? newBeats : currentBeats;

  const newBeatType = parseInt(measure.findtext(".//beat-type"));
  currentBeatType = newBeatType ? newBeatType: currentBeatType;
  
  const newTempo = parseInt(measure.findtext(".//per-minute"));
  currentTempo = newTempo ? newTempo: currentTempo;

  //TODO need beat and beat type in case tempo changes for simplicity 
  currentTimeElapsed += 
    currentBeats * (4/currentBeatType) * (60.0 / currentTempo);
  console.log("currentMeasureLength", currentTimeElapsed);
});
