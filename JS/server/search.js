// Load the http module to create an http server.
const http = require("http");
const fs = require("fs");
const ScoreSearcher = require("./ScoreSearcher.js");

const scoreSearcher = ScoreSearcher(musicXML);
const minPitch = scoreSearcher.getMinPitch().toString();
const maxPitch = scoreSearcher.getMaxPitch().toString();
const instrumentNames = scoreSearcher.getInstrumentNames().toString();
const result = {};
let musicXML;

fs.readFile("../scores/vivaldi_winter.xml", (err, contents) =>
{
	if (err)
		throw err;
	else
		musicXML = contents;
});

result["minPitch"] = minPitch;
result["maxPitch"] = maxPitch;
result["instrumentNames"] = instrumentNames;

const server = http.createServer((request, response) =>
{
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write(JSON.stringify(result));
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");
