//GOAL let query = {"flute": {"minPitch": 50, "maxPitch": 80}};
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

$(".chips-placeholder").material_chip(
{
  placeholder: "Enter a tag",
  secondaryPlaceholder: "+Flute G5 G7",
});

  
 $(".chips").on("chip.add", (e, chip) =>
 {     
   console.log("e", e);
   const splitTag = chip["tag"].split(" ");

   if (splitTag.length !== 3)
   {
      
      alert("all search criteria must be of format, flute G5 G7");
      $(".chip:last").remove();
      return;
   }
      
   const instrumentName = splitTag[0].toLowerCase();
   const minPitch = parseInt(splitTag[1]);
   const maxPitch = parseInt(splitTag[2]);

   if (instrumentName in query)
   {
    alert("this instrument already has a criteria");
    $(".chip:last").remove();
    return;
   }

   if (minPitch > maxPitch)
   {
      alert("min pitch should not be greater than the max pitch, please fix!");
      $(".chip:last").remove();
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
                  
