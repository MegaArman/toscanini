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

