const fs = require("fs");
const factsJSON = fs.readFileSync("./facts.json");
const factsMap = new Map(JSON.parse(factsJSON));

//queries of form {"flute": {"minPitch": 50, "maxPitch": 80}};
module.exports = (query) => //ex: invoked w searchFacts(query)
{
	const matchingPieces = [];
  const queryInstrumentNames = Object.keys(query);
  //................value, key
	factsMap.forEach((pieceFacts, pieceName) => //iterate over facts pieces
	{
    //see if piece has query instruments and if they're in range
    //to do so we need to check substrings, so "trumpet in C" passes for query "trumpet"
    const pieceInstrumentNames = Object.keys(pieceFacts["instrumentRanges"]);
    //console.log("queryInstrumentNames", queryInstrumentNames);
     
    for (let queryInstrumentName of queryInstrumentNames)
		{
      let equivalentInstrumentName;
  
      for (let pieceInstrumentName of pieceInstrumentNames)
      {
        if (pieceInstrumentName.includes(queryInstrumentName))
           equivalentInstrumentName = pieceInstrumentName;
      }
      
       if (equivalentInstrumentName === undefined)
       {
         // console.log(pieceName + "does not have ", queryInstrumentName);
          return false;
       }
       
     //  console.log("equivalentInstrumentName ", equivalentInstrumentName);
			 const minPitch = pieceFacts["instrumentRanges"][equivalentInstrumentName]["minPitch"];
			 const maxPitch = pieceFacts["instrumentRanges"][equivalentInstrumentName]["maxPitch"];
			 const queryMinPitch = query[queryInstrumentName]["minPitch"];
			 const queryMaxPitch = query[queryInstrumentName]["maxPitch"];
	
			 if (minPitch < queryMinPitch || maxPitch > queryMaxPitch)
		   {
         //console.log(pieceName + " range issue");
         return false
       }          	
    }
    matchingPieces.push(pieceName); //if it made it this far it passes!

  });
  
	return matchingPieces;
}

