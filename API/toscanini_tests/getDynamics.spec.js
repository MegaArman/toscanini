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
    const expected = [{dynamic: "pp", frequency: 1},
      {dynamic: "f", frequency: 2}, {dynamic: "mp", frequency: 1},
      {dynamic: "ff", frequency: 1}, {dynamic: "mf", frequency: 1},
      {dynamic: "crescendo", frequency: 2}];
    const actual = toscanini.getDynamics();
    t.deepEqual(actual, expected, "getDynamics score");
  }

  {
    const expected = [{dynamic: "pp", frequency: 1},
      {dynamic: "f", frequency: 1}, {dynamic: "mp", frequency: 1},
      {dynamic: "crescendo", frequency: 2}];
    const actual = toscanini.getDynamics("Violin");
    t.deepEqual(actual, expected, "getDynamics Violin");
  }

  {
    const expected = [{dynamic: "ff", frequency: 1},
    {dynamic: "f", frequency: 1}, {dynamic: "mf", frequency: 1}];
    const actual = toscanini.getDynamics("Violoncello");
    t.deepEqual(actual, expected, "getDynamics Violoncello");
  }

  t.end();
});
//TODO
//also test with 31a directions
//also test for repeated dynamics
