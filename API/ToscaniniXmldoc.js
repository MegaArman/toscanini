"use strict";
const fs = require("fs");
const xmldoc = require("xmldoc");

const musicXML = fs.readFileSync("./scores/two_tempos.xml", "UTF-8");
const document = new xmldoc.XmlDocument(musicXML);
const parts = document.valueWithPath("measure");

console.log(parts);
