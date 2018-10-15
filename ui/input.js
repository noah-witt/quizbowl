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
  var rounds = parseInt($("#roundsEntery").val());
  window.config.rounds = rounds;
}

function loadTeams()
{
  var event = window.eventObj;
  var numSchools = event.getNumberOfSchools();
  var totalTeams =0;
  for(var i=0;i<numSchools;i++)
  {
    var name = $("#SchoolNameEntery-"+i).val();
    var numTeams = parseInt($("#SchoolNumberEntry-"+i).val());
    totalTeams+=numTeams;
    event.addSchool(name,numTeams);
  }
  if(totalTeams%2==1)
  {
    $("#ErrorBox").html('<div class="alert alert-danger" role="alert">You must enter an even number of teams.</div>');
    $("#setupSchools").removeClass("disabled").attr("onclick","genSchedule()");
    throw "UnEven";
  }
  else {
    window.config.isEven = true;
  }
  setInterval(function(){ drawStatusBar(); }, 500);
}

function loadRooms()
{
  var event = window.eventObj;
  var numRooms = event.getNumberOfTeams()/2;
  for(var i=0;i<numRooms;i++)
  {
    //console.log("HIT");
    var RoomNum = $("#RoomNumber-"+i).val();
    event.addRoom(RoomNum);
  }
  //console.log({event,i,numRooms});
  //debugger;

}


//Triggered by bttn
function genSchedule()
{
  drawStatusBar();
  setInterval(function(){ drawStatusBar(); }, 500);
  $("#ErrorBox").html('<div class="alert alert-info" role="alert">Working! Do Not Inturupt!</div>');
  setTimeout(genScheduleD, 100);
}
//runs
function genScheduleD()
{

  //console.log("SCHEDULE GEN");
  //prevent double clicking the GEN SCHEDULE BTTN.
  $("#setupSchools").addClass("disabled").attr("onclick","reload");
  $("#basicInfoGo").addClass("disabled").attr("onclick","reload");
  $("#GenRoomTable").addClass("disabled").attr("onclick","reload");
  //loads the teams in to the object
  loadTeams();

  //load room numbers
  loadRooms();

  //actually generates the schedule
  genSchedules(window.eventObj);
  //renders output
  renderSchedule(window.eventObj);
}
