"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Iterator  = require("../lib/Iterator");

test(("one_rest"), (t) =>
{
  const musicXML = fs.readFileSync(
    path.resolve(__dirname, 
     "../scores/one_rest.xml")).toString();
  const i =  Iterator(musicXML);
  i.selectInstrument("Piano"); 
  t.deepEqual(i.getNumberOfMeasures(), 1, "getNumberOfMeasures"); 
  t.end();
});

