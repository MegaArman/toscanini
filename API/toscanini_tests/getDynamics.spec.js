"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Toscanini = require("../Toscanini");

test("dynamics_test test", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/dynamics_test.xml"));
  const toscanini =  Toscanini(musicXML);

  {
    const actual = ["pp", "f", "mp", "ff", "mf"];
    const expected = toscanini.getDynamics();
    t.deepEqual(actual, expected, "getDynamics score");
  }

  {
    const actual = ["pp", "f", "mp"];
    const expected = toscanini.getDynamics("Violin");
    t.deepEqual(actual, expected, "getDynamics Violin");
  }

  {
    const actual = ["ff", "f", "mf"];
    const expected = toscanini.getDynamics("Violoncello");
    t.deepEqual(actual, expected, "getDynamics Violoncello");
  }

  t.end();
});

test("dynamics_test test", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/basiccres.xml"));
  const toscanini =  Toscanini(musicXML);

  {
    const actual = ["p", "crescendo", "dim."];
    const expected = toscanini.getDynamics();
    t.deepEqual(actual, expected, "getDynamics cres/dim score");
  }

  t.end();
});
