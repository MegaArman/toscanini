"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Toscanini = require("../lib/Toscanini");

test("two_time_signatures", (t) =>
{
  const musicxml =
    fs.readFileSync(
      path.resolve(__dirname, "../scores/time_signature_change.xml"));
  const toscanini = Toscanini(musicxml);

  {
    const actual = toscanini.getTimeSignatures();
    const expected = [{ beatTypeBottom: '4', beatsTop: '4', frequency: 2},
      { beatTypeBottom: '8', beatsTop: '9', frequency: 1 }];
    t.deepEqual(actual, expected, "getTimeSignatures");
  }

  t.end();
});
