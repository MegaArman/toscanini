const query = {"instrument": "flute"};

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

