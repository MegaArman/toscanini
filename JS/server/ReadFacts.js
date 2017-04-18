const fs = require("fs");
const factsJSON = fs.readFileSync("./facts.json");
const factsMap = new Map(JSON.parse(factsJSON));
//const expected = "flute": {"minPitch": 23, "maxPitch": 45}};
const matchingPieces = [];


factsMap.forEach((value, pieceName) => 
{
	//console.log(key + " = " + value["instrumentRanges"]);
	for (let instrument in value["instrumentRanges"])
	{
		if (instrument.toLowerCase() === "flute")
		{
			const maxPitch = value["instrumentRanges"][instrument]["maxPitch"];
			if (maxPitch < 80)
					matchingPieces.push(pieceName);
			else
				console.log("won't pass", pieceName);
		}
	}
});

console.log(matchingPieces);
