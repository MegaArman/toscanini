"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Toscanini = require("../Toscanini");

test("score_length_test test", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/dynamics_test.xml"));
  const toscanini =  Toscanini(musicXML);

  {
    const actual = [];
    const expected = toscanini.getScoreLength();
    t.deepEqual(actual, expected, "getScoreLength score");
  }

  t.end();
});
