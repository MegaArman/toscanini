// Load the http module to create an http server.
const fs = require("fs");
const ScoreSearcher = require("./ScoreSearcher.js");

const factsDB = new Map();
const fileNames = fs.readdirSync("./scores");
fileNames.forEach((fileName) =>
{
	console.log("./scores/" + fileName);
	const musicXML = fs.readFileSync("./scores/" + fileName);
	const scoreSearcher = ScoreSearcher(musicXML);
	const instrumentNames = scoreSearcher.getInstrumentNames(); //[]
	const fact = {};
	const instrumentRanges = {};
	
	instrumentNames.forEach((instrumentName) => 
	{
		let range = {};
		range["minPitch"] = scoreSearcher.getMinPitch(instrumentName);
		range["maxPitch"] = scoreSearcher.getMaxPitch(instrumentName);
		instrumentRanges[instrumentName.toLowerCase()] = range;
	});	
	fact["instrumentRanges"] = instrumentRanges;
	fact["tempos"] = scoreSearcher.getTempos();
	factsDB.set(fileName, fact);
});

fs.writeFile("facts.json", JSON.stringify([...factsDB]), (err) =>
{
	if (err)
		console.log("err");
	else
		console.log("saved!");
});
