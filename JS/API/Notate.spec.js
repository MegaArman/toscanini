"use strict";
const test = require("tape").test;
const Notate = require("./Notate.js");
const N = new Notate();

test("Notate.js tests", function (t) {
  const actual = ["C0", "G10", "F#5"];
  const expected =
  [N.midiNumToNote(0), N.midiNumToNote(127), N.midiNumToNote(66)];
  t.deepEqual(actual, expected, "midiNumToNote");

  t.end();
});
