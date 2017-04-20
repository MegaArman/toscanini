//The goal of this file is to submit a  query of format
//{"flute": {"minPitch": 50, "maxPitch": 80}, "viola": {"minPitch": 40, "maxPitch": 74}};

function ascii(c)
{
  return c.charCodeAt(0);
}
const noteToMIDI = 
{
  "C": 0,
  "C#": 1,
  "Db": 1,
  "D": 2,
  "D#": 3,
  "Eb": 3,
  "E": 4,
  "E#": 5,
  "Fb": 4,
  "F": 5,
  "F#": 6,
  "Gb": 6,
  "G": 7,
  "G#": 8,
  "Ab": 8,
  "A": 9,
  "A#": 10,
  "Bb": 10,
  "B": 11,
  "B#": 0, //B# in octave 0 corresponds to C in octave 0
  "Cb": 11 //Cb in octave 1 corresponds to B in octave 1
};

//noteOctave, ex: C2
function noteOctaveToMIDI(noteOctave)
{
  let pitch;
  let accidental;
  let octave;

  pitch = noteToMIDI[noteOctave.charAt(0).toUpperCase()];
  
  //has accidental
  if (noteOctave.length === 3)
  {
    if (noteOctave.charAt(1) === "b")
        accidental = -1;
    if (noteOctave.charAt(1) === "#")
       accidental = 1;
    octave = parseInt(noteOctave.charAt(2));  
  }
  //no accidental
  else if (noteOctave.length == 2)
  {
    accidental = 0;
    octave = parseInt(noteOctave.charAt(1));
  }

  const MIDI = pitch + accidental + 12 * octave;
  return MIDI;
}

$("#search").on('keyup', (e) =>
{
  if (e.keyCode == 13)
  {
   return false;
  }
});


$("#ask").on("click", ()=> 
{
  const query = {};
  let validQuery = true;

  //take the input string, flute 34 70 and guitar 30 90 and output
  //=>[ [ 'flute', '34', '70' ], [ 'guitar', '30', '90' ] ]
  const inputMatrix = $("#search").val().split("and").map((query) =>
  {
    return (query.replace(/\s+/g, " ").trim().split(" "));
  });

  inputMatrix.forEach((queryPart) => 
  {
    if (queryPart.length !== 3)
    {
      validQuery = false;
      alert("all search criteria must be of format, flute 50 80 with the word 'and' seperating criteria");
      return;
    }
    //Store instrument name
    const instrumentName = queryPart[0].toLowerCase();

    //Check if they use note octave notation, ex: C2 or midi nums, ex: 24
    const firstASCIICharMinPitch = ascii(queryPart[1].toUpperCase().charAt(0));
    const firstASCIICharMaxPitch = ascii(queryPart[2].toUpperCase().charAt(0));
    let maxPitch;
    let minPitch;

  //  console.log("firstASCIICharMin", firstASCIICharMinPitch);
    //console.log("firstASCIICharMax", firstASCIICharMaxPitch);
    
    if (firstASCIICharMinPitch >= 65 && firstASCIICharMinPitch <= 71)
    {
      minPitch = noteOctaveToMIDI(queryPart[1]);
    }
    else
    {
      minPitch = parseInt(queryPart[1]);
    }

    if (firstASCIICharMaxPitch >= 65 && firstASCIICharMaxPitch <= 71)
    {
      maxPitch = noteOctaveToMIDI(queryPart[2]);
    } 
    else
    {
     maxPitch = parseInt(queryPart[2]);
    }

    if (instrumentName in query)
    { 
      validQuery = false;
      alert(instrumentName + " already has a range criteria");
      return;
    }

    if (minPitch > maxPitch)
    {
      validQuery = false;
      alert("min pitch should not be greater than the max pitch, please fix!"); 
      return;
    }

    //perform the insertion
    query[instrumentName] = {"minPitch": minPitch, "maxPitch": maxPitch};
    console.log("post insert", query); 
  });

  const queryJSON = JSON.stringify(query);
  
  if (validQuery)
  {
    $.ajax(
    {
      type: "POST",
      url: "/",
      data: queryJSON,
      success: (scoresJSON) => 
      {
        const scores = JSON.parse(scoresJSON);
        scores.forEach((scoreName) =>
        {
          $("#matchingScores").append("<a href='./scores/" + scoreName + "'" +  
          "class='download collection-item'" + "download>" +
          scoreName +
          "</a>");
        });
      },      
      error: () => alert("no response from server")
    });
  }
});

$("#clear").on("click", () =>
{
  $("#matchingScores").empty();
});
