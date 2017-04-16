// Load the http module to create an http server.
const http = require("http");
const fs = require("fs");
const ScoreSearcher = require("./ScoreSearcher.js");

const musicXML = fs.readFileSync("../scores/vivaldi_winter.xml");
const scoreSearcher = ScoreSearcher(musicXML);
const minPitch = scoreSearcher.getMinPitch().toString();
const maxPitch = scoreSearcher.getMaxPitch().toString();
const instrumentNames = scoreSearcher.getInstrumentNames().toString();
const result = {};

result["minPitch"] = minPitch;
result["maxPitch"] = maxPitch;
result["instrumentNames"] = instrumentNames;

function handleHTTP(req, res)
{
	res.end(JSON.stringify(result));
}

const server = http.createServer(handleHTTP);

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");
