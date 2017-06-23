"use strict";
const fs = require("fs");
const et = require("elementtree");

const musicXML = fs.readFileSync("./scores/guitar_two_voices.xml").toString();
const etree = et.parse(musicXML);

//TODO measures should just be of the first instrument

//etree.findall(".//part")[0].findall(".//note").forEach((note)=>
//{
//  console.log(note.findtext(".//step"));
//});

//iterator.nextMeasure().iteratorNextbeat()

const firstMeasure = etree.findall(".//measure")[1];

firstMeasure["_children"].forEach((child) => 
{
  if (child["tag"] === "note")
  {
    console.log(child.findtext(".//duration"));
  }
});
