"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Toscanini = require("../lib/Toscanini");

test("dynamics_test test", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/dynamics_test.xml"));
  const toscanini =  Toscanini(musicXML);

  {
    const expected = [ "pp",  "f",  "mp",
       "ff",  "mf"];
    const actual = toscanini.getDynamics();
    t.deepEqual(actual, expected, "getDynamics score");
  }

  {
    const expected = [ "pp",  "f",  "mp"];
    const actual = toscanini.getDynamics("Violin");
    t.deepEqual(actual, expected, "getDynamics Violin");
  }

  {
    const expected = [ "ff",  "f",  "mf"];
    const actual = toscanini.getDynamics("Violoncello");
    t.deepEqual(actual, expected, "getDynamics Violoncello");
  }

  t.end();
});

test("dynamics_test test", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname,
      "../scores/musicxml/31a-Directions.xml"));
  const toscanini =  Toscanini(musicXML);

  {
    const expected = [ "p",
       "pp",  "ppp",
       "pppp",  "ppppp",
       "pppppp",  "f",
       "ff",  "fff",
       "ffff",  "fffff",
       "ffffff",  "mp",
       "mf",  "sf",
       "sfp",  "sfpp",
       "fp",  "rf",
       "rfz",  "sfz",
       "sffz",  "fz", "abc-ffz"];
    const actual = toscanini.getDynamics();
    t.deepEqual(actual, expected, "all dynamics 31a Directions score");
  }
  t.end();
});
