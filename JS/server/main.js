let query = {"flute": {"minPitch": 50, "maxPitch": 80}};
query = JSON.stringify(query);

$("#ask").on("click", ()=> 
{
	$.ajax(
	{
		type: "POST",
		url: "/",
		data: query,
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
    console.dir(chip["tag"]);
  // you have the added chip here
  });
