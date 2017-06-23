"use strict";
const fs = require("fs");
const DOMParser = require("xmldom").DOMParser;

const musicXML = fs.readFileSync("./scores/two_tempos.xml", "UTF-8");
const parser = new DOMParser()
  .parseFromString(musicXML,"text/xml");

//const tempos = [];
//const length = parser.getElementsByTagName("per-minute").length;
const perMinutes = parser.getElementsByTagName("per-minute");
//for (let i = 0; i < length; i++)
//{
//  const newTempo = perMinutes[i].childNodes[0].nodeValue;
//
//  if (!tempos.includes(newTempo))
//  {
//    tempos.push(newTempo);
//  }
//}
//console.log(tempos);

//...getelementsByTagName("measures")[0].getChildByTagName.....
const firstPart = parser.getElementsByTagName("part")[0];
//console.log(firstPart);
console.log(firstPart.childNodes[3].text);

