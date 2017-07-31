"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Toscanini = require("../lib/Toscanini");

test("getArticulations test", (t) =>
{
  let musicXML =
    fs.readFileSync(path.resolve(
      __dirname, "../scores/musicxml/33f-Trill-EndingOnGraceNote.xml"));
  let toscanini =  Toscanini(musicXML);

  {
    const expected = ["trill-mark", "wavy-line", "slur"];
    const actual = toscanini.getArticulations();
    t.deepEqual(actual, expected, "basic test");
  }

  musicXML =
    fs.readFileSync(
      path.resolve(__dirname, "../scores/musicxml/32a-Notations.xml"));
  toscanini =  Toscanini(musicXML);

  {
    const expected = ["accent", "strong-accent", "staccato", "tenuto",
      "detached-legato", "staccatissimo", "spiccato", "scoop", "plop", "doit",
      "falloff", "breath-mark", "caesura", "stress", "unstress", "trill-mark",
      "turn", "delayed-turn", "inverted-turn", "shake", "wavy-line", "mordent",
      "inverted-mordent", "schleifer", "tremolo", "up-bow", "down-bow",
      "harmonic", "natural base-pitch harmonic",
      "natural touching-pitch harmonic", "natural sounding-pitch harmonic",
      "open-string", "thumb-position", "fingering", "pluck", "double-tongue",
      "triple-tongue", "stopped", "snap-pizzicato", "fret", "string",
      "hammer-on", "pull-off", "bend", "bend-alter release with-bar bend",
      "bend-alter pre-bend bend", "bend-alter release bend", "tap", "heel",
      "toe", "fingernails", "fermata", "normal fermata", "angled fermata",
      "square fermata", "arpeggiate", "non-arpeggiate",
      "double-sharp accidental-mark"];
    const actual = toscanini.getArticulations();
    t.deepEqual(actual, expected, "notations test");
  }

  t.end();
});
