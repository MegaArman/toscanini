"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Toscanini = require("../Toscanini");

test("two_tempos", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/two_tempos.xml"));
  const toscanini =  Toscanini(musicXML);

  {
    const actual = toscanini.getTempos();
    const expected = [105, 90];
    t.deepEqual(actual, expected, "getTempos");
  }

  { //confirms for single instrument we can use the same queries
    const actual = toscanini.getPitchRange("Flute")["minPitch"];
    const expected = toscanini.getPitchRange()["minPitch"];
    t.deepEqual(actual, expected, "getTempos");
  }

  t.end();
});

test("no tempos", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/basic.xml"));
  const toscanini =  Toscanini(musicXML);

  {
    const actual = toscanini.getTempos();
    const expected = [120];
    t.deepEqual(actual, expected, "getTempos");
  }

  t.end();
});
