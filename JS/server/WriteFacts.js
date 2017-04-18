// Load the http module to create an http server.
const fs = require("fs");
const ScoreSearcher = require("./ScoreSearcher.js");

//const musicXML = fs.readFileSync("../scores/vivaldi_winter.xml");
//const scoreSearcher = ScoreSearcher(musicXML);
//const instrumentNames = scoreSearcher.getInstrumentNames();
//const facts = {};
////GOAL: {"Beethoven": {"flute": {"min": 45, "max": 60"}}}
//instrumentNames.forEach((instrumentName) => 
//{
//	let range = {};
//	range["min"] = scoreSearcher.getMinPitch(instrumentName);
//	range["max"] = scoreSearcher.getMaxPitch(instrumentName);
//	console.log("range", range);
//	facts[instrumentName] = range;
//});
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
		instrumentRanges[instrumentName] = range;
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
