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
    const expected = [{dynamic: "pp"}, {dynamic: "f"}, {dynamic: "mp"},
      {dynamic: "ff"}, {dynamic: "mf"}, {dynamic: "crescendo"}];
    const actual = toscanini.getDynamics();
    t.deepEqual(actual, expected, "getDynamics score");
  }

  {
    const expected = [{dynamic: "pp"}, {dynamic: "f"}, {dynamic: "mp"},
      {dynamic: "crescendo"}];
    const actual = toscanini.getDynamics("Violin");
    t.deepEqual(actual, expected, "getDynamics Violin");
  }

  {
    const expected = [{dynamic: "ff"}, {dynamic: "f"}, {dynamic: "mf"}];
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
    const expected = [{ dynamic: "p"},
      { dynamic: "pp"}, { dynamic: "ppp"},
      { dynamic: "pppp"}, { dynamic: "ppppp"},
      { dynamic: "pppppp"}, { dynamic: "f"},
      { dynamic: "ff"}, { dynamic: "fff"},
      { dynamic: "ffff"}, { dynamic: "fffff"},
      { dynamic: "ffffff"}, { dynamic: "mp"},
      { dynamic: "mf"}, { dynamic: "sf"},
      { dynamic: "sfp"}, { dynamic: "sfpp"},
      { dynamic: "fp"}, { dynamic: "rf"},
      { dynamic: "rfz"}, { dynamic: "sfz"},
      { dynamic: "sffz"}, { dynamic: "fz"},
      { dynamic: "crescendo"} ];
    const actual = toscanini.getDynamics();
    t.deepEqual(actual, expected, "all dynamics 31a Directions score");
  }
  t.end();
});
