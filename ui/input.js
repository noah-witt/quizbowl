//"Go" is pressed by number of schools.
//fires off generating the table of schools and creates the framework.
function updateNumberOfSchools()
{
  loadConfig();
  //get the number of schools from the input
  var numSchools = parseInt($("#numberOfSchoolsEntery").val());
  var eventObj = new event("quizbowl");
  window.eventObj = eventObj;
  eventObj.setNumberOfSchools(numSchools);
  createSchoolTable(numSchools);
}

function loadConfig()
{
  if($('#config-roomSchedule').is(':checked'))
  {
    window.config.newPages.room = true;
  }

  if($('#config-teamSchedule').is(':checked'))
  {
    window.config.newPages.team = true;
  }
}

function loadTeams()
{
  var event = window.eventObj;
  var numSchools = event.getNumberOfSchools();
  for(var i=0;i<numSchools;i++)
  {
    var name = $("#SchoolNameEntery-"+i).val();
    var numTeams = parseInt($("#SchoolNumberEntry-"+i).val());
    event.addSchool(name,numTeams);
  }
}

//Triggered by bttn
function genSchedule()
{

  //console.log("SCHEDULE GEN");
  //prevent double clicking the GEN SCHEDULE BTTN.
  $("#setupSchools").addClass("disabled");

  //loads the teams in to the object
  loadTeams();

  //actually generates the schedule
  try {
    genScheduleProcess(window.eventObj);
  }
  catch(err) {
    console.warn("genSchedule failed. retrying.");
    nSchools = window.eventObj.numberOfSchools;
    var eventObj = new event("quizbowl");
    window.eventObj = eventObj;
    eventObj.setNumberOfSchools(nSchools);
    //console.log("Re Attempting Schools:"+nSchools);
    genSchedule();
  }
  //renders output
  renderSchedule(window.eventObj);
}
