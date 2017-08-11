//suggest Google Chrome======================
// alert("NOTE: This app has only been tested with Google Chrome");

//===========================================

let GradeLevel = require("./Toscanini.gradeLevel.js");
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

$("#analyzeSelected").hide();
$("#checkboxes").hide();

window.analyze = function()
{
  //filesObj is like {"basic.xml": "<xml string here..."}
  //Object.keys(filesObj) -> basic.xml

  //Iterate over the keys (file names) of filesObj:
  Object.keys(filesObj).forEach((fileName) =>
  {
      //filesObj.fileName -> "<xml..."
      gradeLevel = GradeLevel(filesObj[fileName]);
      toscanini = Toscanini(filesObj[fileName]);
      let instruments = toscanini.getInstrumentNames();

      let articulations = gradeLevel.assessArticulations();
      let dynamics = gradeLevel.assessDynamics();
      let meter = gradeLevel.assessMeter();
      let rhythmicComplexity = gradeLevel.assessRhythmicComplexity();
      let tempo = gradeLevel.assessTempo();
      const overallScore = ((articulations + dynamics
        + meter + rhythmicComplexity
        + tempo) / 5).toFixed(2);
      articulations = articulations.toFixed(2);
      dynamics = dynamics.toFixed(2);
      meter = meter.toFixed(2);
      rhythmicComplexity = rhythmicComplexity.toFixed(2);
      tempo = tempo.toFixed(2);

      $("#results").
      append("<tr>" +
      "<td>" + fileName + "</td>" +
      "<td>" + instruments + "</td>" +
      "<td>" + articulations +"</td>" +
      "<td>" + dynamics + "</td>" +
      "<td>" + meter + "</td>" +
      "<td>" + rhythmicComplexity + "</td>" +
      "<td>" + tempo + "</td>" +
      "<td>" + overallScore + "</td>" +
      "</tr>");
  });
};

window.allInstruments = function()
{
  if (filesObj === undefined)
  {
    alert("Input files!")
  }
  else
  {
    //filesObj is like {"basic.xml": "<xml string here..."}
    //Object.keys(filesObj) -> basic.xml

    //Iterate over the keys (file names) of filesObj:
    Object.keys(filesObj).forEach((fileName) =>
    {
        //filesObj.fileName -> "<xml..."
        toscanini = Toscanini(filesObj[fileName]);
        gradeLevel = GradeLevel(filesObj[fileName]);
        let instruments = toscanini.getInstrumentNames();

        instruments.forEach((instrument) =>
        {
          let articulations = gradeLevel.assessArticulations(instrument);
          let dynamics = gradeLevel.assessDynamics(instrument);
          let meter = gradeLevel.assessMeter(instrument);
          let rhythmicComplexity =
            gradeLevel.assessRhythmicComplexity(instrument);
          let tempo = gradeLevel.assessTempo(instrument);
          const overallScore = ((articulations + dynamics
            + meter + rhythmicComplexity
            + tempo) / 5).toFixed(2);
          articulations = articulations.toFixed(2);
          dynamics = dynamics.toFixed(2);
          meter = meter.toFixed(2);
          rhythmicComplexity = rhythmicComplexity.toFixed(2);
          tempo = tempo.toFixed(2);

          $("#results").
          append("<tr>" +
          "<td>" + fileName + "</td>" +
          "<td>" + instrument + "</td>" +
          "<td>" + articulations +"</td>" +
          "<td>" + dynamics + "</td>" +
          "<td>" + meter + "</td>" +
          "<td>" + rhythmicComplexity + "</td>" +
          "<td>" + tempo + "</td>" +
          "<td>" + overallScore + "</td>" +
          "</tr>");
        });
    });
  }
};

window.clear = function()
{
  if (filesObj === undefined)
  {
    alert("Input files!")
  }
  else
  {
    $("#results").empty();
    $("#checkboxes").empty();
    $("#file-path-wrapper").empty();
  }
};

window.selectInstrument = function()
{
  if (filesObj === undefined)
  {
    alert("Input files!")
  }
  else
  {
    $("#checkboxes").empty();
    $("#checkboxes").toggle();
    $("#analyzeSelected").toggle();

    Object.keys(filesObj).forEach((fileName) =>
    {
      toscanini = Toscanini(filesObj[fileName]);
      const instruments = toscanini.getInstrumentNames();
      instruments.forEach((instrument) =>
      {
        $("#checkboxes").append("<p><input type='checkbox' id='" + instrument + "'/><label for='" + instrument + "'>"+ instrument +"</label></p>");
      });

    });
  }
};

window.analyzeSelected = function()
{
  if (filesObj === undefined)
  {
    alert("Input files!")
  }
  else
  {
    Object.keys(filesObj).forEach((fileName) =>
    {
      toscanini = Toscanini(filesObj[fileName]);
      gradeLevel = GradeLevel(filesObj[fileName]);
      const instruments = toscanini.getInstrumentNames();
      instruments.forEach((instrument) =>
      {
        let checked = $('#' + instrument).is(":checked");
        if (checked)
        {
          let articulations = gradeLevel.assessArticulations(instrument);
          let dynamics = gradeLevel.assessDynamics(instrument);
          let meter = gradeLevel.assessMeter(instrument);
          let rhythmicComplexity =
            gradeLevel.assessRhythmicComplexity(instrument);
          let tempo = gradeLevel.assessTempo(instrument);
          const overallScore = ((articulations + dynamics
            + meter + rhythmicComplexity
            + tempo) / 5).toFixed(2);
          articulations = articulations.toFixed(2);
          dynamics = dynamics.toFixed(2);
          meter = meter.toFixed(2);
          rhythmicComplexity = rhythmicComplexity.toFixed(2);
          tempo = tempo.toFixed(2);

          $("#results").
          append("<tr>" +
          "<td>" + fileName + "</td>" +
          "<td>" + instrument + "</td>" +
          "<td>" + articulations +"</td>" +
          "<td>" + dynamics + "</td>" +
          "<td>" + meter + "</td>" +
          "<td>" + rhythmicComplexity + "</td>" +
          "<td>" + tempo + "</td>" +
          "<td>" + overallScore + "</td>" +
          "</tr>");
        }
      });
    });
  }
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
$("#analyzeSelected").on("click", window.analyzeSelected);
$("#selectInstrument").on("click", window.selectInstrument);
$("#allInstruments").on("click", window.allInstruments);
$("#analyze").on("click", window.analyze);
$("#clear").on("click", window.clear);
