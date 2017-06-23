"use strict";
const fs = require("fs");
const xmldoc = require("xmldoc");
var xpath = require('xpath')
  , dom = require('xmldom').DOMParser
 
const musicXML = fs.readFileSync("./scores/two_tempos.xml", "UTF-8");
var doc = new dom().parseFromString(musicXML)
var measures = xpath.select("//measure", doc)

//using measure as starting point
const firstNote = xpath.select(measures)[0];
console.log(firstNote);

const firstNoteSecondMeasure = 
  xpath.select("//measure", doc)[1].firstChild.note;

console.log("firstNoteSecondMeasure", firstNoteSecondMeasure);
//console.log(nodes[0].localName + ": " + nodes[0].firstChild.data)
//console.log("Node: " + nodes[0].toString())


