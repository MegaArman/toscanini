const fs = require("fs");
const factsJSON = fs.readFileSync("./facts.json");
//const expected = {"flute": {"minPitch": 50, "maxPitch": 80}};

module.exports = (expected) =>
{
	const factsMap = new Map(JSON.parse(factsJSON));
	const matchingPieces = [];

	factsMap.forEach((value, pieceName) => 
	{
		//TODO: should be iterating over expected not V
		for (let instrumentName in value["instrumentRanges"])
		{
			if (instrumentName in expected)
			{
				const minPitch = value["instrumentRanges"][instrumentName]["minPitch"];
				const maxPitch = value["instrumentRanges"][instrumentName]["maxPitch"];
				const expectedMinPitch = expected[instrumentName]["minPitch"];
				const expectedMaxPitch = expected[instrumentName]["maxPitch"];
	
				if (minPitch > expectedMinPitch && maxPitch < expectedMaxPitch)
						matchingPieces.push(pieceName);
			}
		}
	});
	return matchingPieces;
}

