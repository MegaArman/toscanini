"use strict";
const fs = require("fs");
const et = require("elementtree");

const musicXML = fs.readFileSync("./scores/guitar_two_voices.xml").toString();
const etree = et.parse(musicXML);
const measures = etree.findall(".//measure");

//measure, beatmap

measures.forEach((measure) => 
{
  //  console.log("measure num", measure.attrib.number);
  //  const beatMap = new Map();
  //const voices = {};
    
  measure["_children"].forEach((child) => 
  {
    if (child.tag === "note")
    {
      const voice = child.findtext(".//voice");
      const duration = parseInt(child.findtext(".//duration"));
      if (child.findtext("[chord]"))
      {
        
      }
     !(voice in voices) ? voices[voice] = duration : voices[voice] += duration;

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

  console.log("voices", voices);
});
