function createSchoolTable(numSchools)
{
  var res = generateSchoolTableHTML(numSchools);
  $("#SchoolDetailEntery").html(res);
  return true;
}

function generateSchoolTableHTML(numSchools)
{
  var str = '<table class="table">';
  //heading
  str+="<tr><th>Name Of School</th><th>Number Of Teams</th>";
  //insert rows
  for(var i=0;i<numSchools;i++)
  {
    str+=generateSchoolTableRow(i);
  }
  //close table
  str+='</table>';
  //Go Button.
  //str+='<div class="btn-group" role="group" aria-label="..."><button type="button" class="btn btn-default" onclick="genSchedule()" id="setupSchools">Generate Schedule</button></div>';
  str+='<div class="btn-group" role="group" aria-label="..."><button type="button" class="btn btn-default" onclick="fireGenRoomTable()" id="GenRoomTable">Enter Rooms</button></div>';
  return str;
}

//generates a school row for the generateSchooltableHTML function.
function generateSchoolTableRow(i)
{
  return '<tr><td><div class="input-group"><input type="text" class="form-control" placeholder="School Name" aria-describedby="basic-addon1" id="SchoolNameEntery-'+i+'"></div></td> <td><div class="input-group"><input type="number" min="0" class="form-control" placeholder="Number Of Teams" aria-describedby="basic-addon1" id="SchoolNumberEntry-'+i+'"></div></td></tr>';
}

function fireGenRoomTable()
{
  //console.log("TEST");
  var numberOfSchools = window.eventObj.getNumberOfSchools();
  var totalTeams =0;
  for(var i=0;i<numberOfSchools;i++)
  {
    var name = $("#SchoolNameEntery-"+i).val();
    var numTeams = parseInt($("#SchoolNumberEntry-"+i).val());
    totalTeams+=numTeams;
  }

  if(totalTeams%2==1)
  {
    $("#ErrorBox").html('<div class="alert alert-danger" role="alert">You must enter an even number of teams.</div>');
    $("#setupSchools").removeClass("disabled").attr("onclick","genSchedule()");
    throw "UnEven";
  }
  var res = generateRoomTable(totalTeams/2);
  $("#RoomDetailEntery").html(res);
}

function generateRoomTable(numRooms)
{
  //console.log(numRooms);
  var str = '<table class="table">';
  //heading
  str+="<tr><th>Room Letter</th><th>Room Number</th>";
  //insert rows
  for(var i=0;i<numRooms;i++)
  {
    str+=generateRoomTableRow(i);
  }
  //close table
  str+='</table>';
  //Go Button.
  str+='<div class="btn-group" role="group" aria-label="..."><button type="button" class="btn btn-default" onclick="genSchedule()" id="setupSchools">Generate Schedule</button></div>';
  return str;
}

function generateRoomTableRow(i)
{
  return '<tr><td>'+generateRoomLetter(i)+'</td> <td><div class="input-group"><input type="text" class="form-control" placeholder="Room Number" aria-describedby="basic-addon1" id="RoomNumber-'+i+'"></div></td></tr>';
}

function generateRoomLetter(i)
{
  var names = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
  var name = names.slice(i,i+1);
  return name;
}

//renders schedule
function renderSchedule(eventObj)
{
  window.config.isDone = true;
  //renderOverview(eventObj);
  renderOverviewTraditinal(eventObj);
  renderAllRooms(eventObj);
  renderAllTeams(eventObj);
}

//renders overview
function renderOverview(eventObj)
{
  var out ="";
  var rooms = eventObj.schedule.rooms;

  //iterate through each round
  for(var round=0;round<window.config.rounds;round++)
  {

    //iterates through each room
    for(var roomNum=0;roomNum<rooms.length;roomNum++)
    {
      //console.log({round,roomNum});
      out+="<br/>"+rooms[roomNum].rounds[round].getFormatedMatchup();
      //console.log("ye");
    }
  }
  $("#fullTurnySchedule").html(out);
  return out;
}

//renders traditinal overview
function renderOverviewTraditinal(eventObj)
{
  var out ="";
  var teams = eventObj.getOrderedListOfTeams();
  $("#fullTurnySchedule").html(out);
  var teamListOut = "<table class='table'><tbody> <tr>";
  for(var i=0;i<teams.length;i++)
  {
    //print new line every (window.config.traditinalPrint.teamsPerRow) set in global config.
    if(i!=0&&i%window.config.traditinalPrint.teamsPerRow==0)
    {
      teamListOut+="<tr/><tr>";
    }
    teamListOut+="<td>"+teams[i].getFormatedNameForTraditinal()+"</td>";
  }
  teamListOut+="</tr></tbody></table>";
  out+=teamListOut;
  out+="<hr>";
  //fill out matchupTable
  var scheduleOut ="";
  var rooms = eventObj.schedule.rooms;
  scheduleOut+="<table class='table'><tbody>";

  //make header
  scheduleOut+="<th>Rooms</th>";
  for(var q=0;q<rooms[0].rounds.length;q++)
  {
    scheduleOut+="<th>Round "+(q+1)+"</th>";
  }

  for(var e =0;e<rooms.length;e++)
  {
    var rounds = rooms[e].rounds;

    scheduleOut+="<tr>";
    scheduleOut+="<td>"+rooms[e].getRoomName()+"</td>";
    for(var j=0;j<rounds.length;j++)
    {
      scheduleOut+="<td>"+rounds[j].getTraditinalMatchup()+"</td>";
    }
    scheduleOut+="</tr>";
  }

  scheduleOut+="</tbody></table>";
  out+=scheduleOut;

  //set view and return result.
  $("#fullTurnySchedule").html(out);
  return out;
}


//render rooms
function renderAllRooms(eventObj)
{
  var res = "";
  for(var i=0;i<eventObj.schedule.rooms.length;i++)
  {
    res+=renderRoom(eventObj.schedule.rooms[i]);
    if(window.config.newPages.room&&i<(eventObj.schedule.rooms.length-1))
    {
      res+='<div class="pagebreak"> </div>';
    }
  }
  $("#roomSchedules").html(res);
}

//rendes singe room
function renderRoom(room)
{
  var res='<div class="panel panel-default"><div class="panel-heading"> Room '+room.getRoomName()+'</div><div class="panel-body">';

  //iterate through each round
  for(var round=0;round<window.config.rounds;round++)
  {
    res+=room.rounds[round].getFormatedMatchup()+"<br/>";
  }
  res+='</div>'+window.config.scheduleFooters+'</div>';
  return res;
}

function renderAllTeams(eventObj)
{
  var res = "";
  var teams = eventObj.getOrderedListOfTeams();
  for(var i=0;i<teams.length;i++)
  {
    res+=renderTeam(teams[i],eventObj);
    if(window.config.newPages.team&&i<(teams.length-1))
    {
      res+='<div class="pagebreak"> </div>';
    }
  }

  $("#teamSchedules").html(res);
}

function renderTeam(team,eventObj)
{
  var res='<div class="panel panel-default"><div class="panel-heading">'+team.getFormatedName()+'</div><div class="panel-body">';

  for(var r=0;r<window.config.rounds;r++)
  {
    for(var i=0;i<eventObj.schedule.rooms.length;i++)
    {
      if(eventObj.schedule.rooms[i].rounds[r].hasTeam(team))
      {
        //add round to schedule
        res+= eventObj.schedule.rooms[i].rounds[r].getFormatedMatchup()+"<br/>";
      }
    }
  }

  res+='</div>'+window.config.scheduleFooters+'</div>';
  return res;
}


function drawStatusBar()
{
  var res='<div class="alert alert-info" role="alert">Working on try '+window.config.retries+'.</div>';
  if(!window.config.isDone)
  {
    if(window.config.isEven)
    {
      $("#ErrorBox").html(res);
    }
  }
  else
  {
    $("#ErrorBox").html('<div class="alert alert-success" role="alert">Finished on try '+window.config.retries+'.</div>');
  }
}
