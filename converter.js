var musicXmlToWav = require("musicxml-to-wav");

var stream = musicXmlToWav.convert("song.xml", "song.wav");

stream.on("finish", function() { console.log("Done!") });