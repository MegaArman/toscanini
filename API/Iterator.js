"use strict";
const fs = require("fs");
const et = require("elementtree");

const musicXML = fs.readFileSync("./scores/two_parts.xml").toString();
const etree = et.parse(musicXML);

//TODO measures should just be of the first instrument

//etree.findall(".//part")[0].findall(".//note").forEach((note)=>
//{
//  console.log(note.findtext(".//step"));
//});

const wins = etree.findall(".//note").filter((note) => (note === "A"));
console.log(wins);
