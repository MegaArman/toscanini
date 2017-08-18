//suggest Google Chrome======================
// alert("NOTE: This app has only been tested with Google Chrome");

//===========================================

let GradeLevel = require("./Grader.js");
let fileInput = document.getElementById("fileInput");
let filesObj; //ex: {"basic.xml": "<xml string here..."}
const Toscanini = require("./Toscanini");

fileInput.addEventListener("change", () =>
{
  filesObj = {};
  let textType = /text.xml/;

  // fileInput.files IS A MAP - NOT a normal object!!
  for (let file of fileInput.files)
  {
    if (file.type.match(textType))
    {
      let reader = new FileReader();

      reader.onload = function()
      {
        filesObj[file.name] = reader.result;
      };

      reader.readAsText(file);
    }
    else
    {
      alert("Are you sure these are all MusicXML files?");
    }
  }
});

//can I create a button for individual instruments and overall?
//currently doing overall
let gradeLevel;
let toscanini;

window.clear = function()
{
    $("#checkboxes").empty();
};

$(document).ready(function(){
    // to fade in on page load
    $("body").css("display", "none");
    $("body").fadeIn(400);
    // to fade out before redirect
    $('information').click(function(e){
        redirect = $(this).attr('href');
        e.preventDefault();
        $('body').fadeOut(400, function(){
            document.location.href = redirect;
        });
    });
})

$("#clear").on("click", window.clear);
