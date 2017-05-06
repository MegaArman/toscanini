const fs = require("fs");
const factsJSON = fs.readFileSync("./facts.json");
const factsMap = new Map(JSON.parse(factsJSON));

//queries of form {"flute": {"minPitch": 50, "maxPitch": 80}};
module.exports = (query) => //ex: invoked w searchFacts(query)
{
  console.time("Took");
  if (query === "lucky")
  {
    //get # between 0 and factsMap.length - 1
    const r = Math.floor(Math.random() * (factsMap.size));
    const keys = factsMap.keys();
    let randomScore = "";  

    for (let i = 0; i < r; i++)
    {
      randomScore = keys.next().value;
    } 
    
    return randomScore;
  }
    
  const matchingPieces = [];
  
  let queryComposer;
  if ("composer" in query)
  {
    queryComposer = query["composer"];
    delete query["composer"];
  }
  
  let queryTempo;
  if ("tempo" in query)
  {
    queryTempo = query["tempo"];
    delete query["tempo"];
  }

  let queryKey;
  if ("key" in query)
  {
    queryKey = query["key"];
    delete query["key"];
  }

  const queryInstrumentNames = Object.keys(query);
  
  //iterate over pieces in our facts database
  //................value, key
  factsMap.forEach((pieceFacts, pieceName) =>
	{
    
    //check if our piece is by the composer they want
    if (queryComposer && !pieceName.toLowerCase().includes(queryComposer))
      return false;
    
    //check if our piece has a tempo range they want
    if (queryTempo)
    {
      for (let tempo of pieceFacts["tempos"])
      {
        if (tempo < queryTempo["minPitch"] || tempo > queryTempo["maxPitch"])
          return false;
      }
    }
    
    //check if our piece has the key they want
    //indexOf returns -1 if doesn't exist
    if (queryKey && pieceFacts["keySignatures"].indexOf(queryKey) === -1)
    {
      return false;
    }

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
  
  console.timeEnd("Took");
	return matchingPieces;
}

