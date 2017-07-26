"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Toscanini = require("../lib/Toscanini");

test("getArticulations test", (t) =>
{
  let musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/musicxml/33f-Trill-EndingOnGraceNote.xml"));
  let toscanini =  Toscanini(musicXML);

  {
    const expected = ["trill-mark", "wavy-line", "slur"];
    const actual = toscanini.getArticulations();
    t.deepEqual(actual, expected, "basic test");
  }

  musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/musicxml/32a-Notations.xml"));
  toscanini =  Toscanini(musicXML);

  {
    const expected = [];
    const actual = toscanini.getArticulations();
    t.deepEqual(actual, expected, "notations test");
  }

  t.end();
});
