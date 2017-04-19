//GOAL let query = {"flute": {"minPitch": 50, "maxPitch": 80}};

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
  console.log("noteOctave", noteOctave);
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
  console.log("MIDI", MIDI);
  return MIDI;
}

let query = {};

$("#ask").on("click", ()=> 
{
  let queryString = JSON.stringify(query);

	$.ajax(
	{
		type: "POST",
		url: "/",
		data: queryString,
		success: (scores) => alert(scores),
		error: () => alert("error!!!")
	});
});

$(".chips-initial").material_chip(
{
  data: [{tag: "flute 50 80"}] 
});
query["flute"] = {"minPitch": 50, "maxPitch": 80}
 
$(".chips").on("chip.add", (e, chip) =>
{     
  //console.log("e", e);
  const splitTag = chip["tag"].split(" ");
  console.log(splitTag);
  if (splitTag.length !== 3)
  {
    
    alert("all search criteria must be of format, flute 50 80");
    $(".chip:last").remove();
    return;
  }
  //Store instrument name
  const instrumentName = splitTag[0].toLowerCase();

  //Check if they use note octave notation, ex: C2 or midi nums, ex: 24
  const firstASCIICharMinPitch = ascii(splitTag[1].toUpperCase().charAt(0));
  const firstASCIICharMaxPitch = ascii(splitTag[2].toUpperCase().charAt(0));
  let maxPitch;
  let minPitch;

  console.log("firstASCIICharMin", firstASCIICharMinPitch);
  console.log("firstASCIICharMax", firstASCIICharMaxPitch);
  
  if (firstASCIICharMinPitch >= 65 && firstASCIICharMinPitch <= 71)
  {
    minPitch = noteOctaveToMIDI(splitTag[1]);
  }
  else
  {
    minPitch = parseInt(splitTag[1]);
  }

  if (firstASCIICharMaxPitch >= 65 && firstASCIICharMaxPitch <= 71)
  {
    maxPitch = noteOctaveToMIDI(splitTag[2]);
  } 
  else
  {
   maxPitch = parseInt(splitTag[2]);
  }


  if (instrumentName in query)
  { 
    $(".chip:last").remove();
    console.log("instrument exists");
    alert("this instrument already has a criteria");
    return;
  }
  else
  {
    console.log("new!");
  }

  if (minPitch > maxPitch)
  {
    $(".chip:last").remove();
    alert("min pitch should not be greater than the max pitch, please fix!"); 
    return;
  }

  const range = {};
  range["minPitch"] = minPitch;
  range["maxPitch"] = maxPitch;
  query[instrumentName] = range;
  console.log("post insert", query);
});

$('.chips').on('chip.delete', function(e, chip)
{
  const splitTag = chip["tag"].split(" ");
  const toDelete = splitTag[0].toLowerCase();
  delete query[toDelete];
  console.log("post delete", query);
});
                  
