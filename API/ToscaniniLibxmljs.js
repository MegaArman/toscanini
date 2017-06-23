"use strict";
const fs = require("fs");
const libxml = require("libxmljs");

const musicXml = fs.readFileSync("./scores/two_tempos.xml", "UTF-8");
const xmlDoc = libxml.parseXmlString(musicXml);
console.log(xmlDoc.get("part"));
