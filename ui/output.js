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
  str+='<div class="btn-group" role="group" aria-label="..."><button type="button" class="btn btn-default" onclick="genSchedule()" id="setupSchools">Generate Schedule</button></div>';
  return str;
}

//generates a school row for the generateSchooltableHTML function.
function generateSchoolTableRow(i)
{
  return '<tr><td><div class="input-group"><input type="text" class="form-control" placeholder="School Name" aria-describedby="basic-addon1" id="SchoolNameEntery-'+i+'"></div></td> <td><div class="input-group"><input type="text" class="form-control" placeholder="Number Of Teams" aria-describedby="basic-addon1" id="SchoolNumberEntry-'+i+'"></div></td></tr>';
}

//renders schedule
function renderSchedule(eventObj)
{
  renderOverview(eventObj);
  renderAllRooms(eventObj);
  renderAllTeams(eventObj);
}

//renders overview
function renderOverview(eventObj)
{
  var out ="";
  var rooms = eventObj.schedule.rooms;

  //iterate through each round
  for(var round=0;round<6;round++)
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
  var res='<div class="panel panel-default"><div class="panel-heading"> Room '+room.letter+'</div><div class="panel-body">';

  //iterate through each round
  for(var round=0;round<6;round++)
  {
    res+=room.rounds[round].getFormatedMatchup()+"<br/>";
  }
  res+='</div></div>';
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

  for(var r=0;r<6;r++)
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

  res+='</div></div>';
  return res;
}
