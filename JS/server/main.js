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
   console.log(chip["tag"]);
   const splitTag = chip["tag"].split(" ");
   const minPitch = parseInt(splitTag[1]);
   const maxPitch = parseInt(splitTag[2]);
   if (minPitch > maxPitch)
      alert("min pitch should not be greater than the max pitch!");
  

   if (splitTag.length !== 3)
      alert("all search criteria must be of format, flute G5 G7");
   
   const range = {};
   range["minPitch"] = minPitch;
   range["maxPitch"] = maxPitch;
   query[splitTag[0]] = range;
   console.log(query);
  });
