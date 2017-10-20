//check to see if matchup is valid. TRUE IF IT IS VALID
function isValidMatchup(team1,team2,eventObj)
{
  //returns
  return ((!team1.isSame(team2))&&(!team1.school.isSame(team2.school)))&&(!doesMatchupExist(team1,team2,eventObj));
}


//checks to see if a matchup bettween two teams exists
//returns true if it does exist
function doesMatchupExist(team1,team2,eventObj)
{
  var rooms = eventObj.schedule.rooms;

  //check every room
  //console.log(rooms);
  for(var i=0;i<rooms.length;i++)
  {
    var rounds = rooms[i].rounds;
    for(var e=0;e<rounds.length;e++)
    {

      //checks the selected matchup and if it is the same as the once provided responds true
      //console.log("check"+team1.getFormatedName()+" "+team2.getFormatedName());
      if(rounds[e].isSameMatchup(team1,team2))
      {
        return true;
      }
    }

  }

  return false;
}

//WILL REMOVE ELEMENT
function getRandomElementOfArray(array)
{
    var index = Math.floor( Math.random()*array.length );
    var temp = array[index];
    array.splice( index, 1 );
    return temp;
}

function genScheduleProcess(eventObj)
{
  if(eventObj.getOrderedListOfTeams().length%2!=0)
  {
    //alert("You Must Have An Even Number Of Teams.");
    throw "odd number of teams";
  }
  var teams = eventObj.getRandomizedListOfTeams();
  generateRooms(teams.length/2,eventObj);
  //build rounds
  /*
  buildRoundSchedule(eventObj);//round 1
  buildRoundSchedule(eventObj);//round 2
  buildRoundSchedule(eventObj);//round 3
  buildRoundSchedule(eventObj);//round 4
  buildRoundSchedule(eventObj);//round 5
  buildRoundSchedule(eventObj);//round 6*/
  for(var i=0;i<window.config.rounds;i++)
  {
    buildRoundSchedule(eventObj);
  }
}

//makes enugh rooms for each match;
function generateRooms(numRooms,eventObj)
{
  for(var i=0;i<numRooms;i++)
  {
    eventObj.schedule.addRoom();
  }
}


//builds the schedule in a random way for a round.
function buildRoundSchedule(eventObj)
{
  var teams = eventObj.getRandomizedListOfTeams();
  var rooms = eventObj.schedule.rooms;
  for(var i=0;i<rooms.length;i++)
  {
    //loop half as many times as there are teams, once per match.
    var team1 = teams[0];
    var works = false;
    var team2 = null;
    var id =-1;
    var errorCounter=0;
    //console.log({team1,works,team2});
    while(!works)
    {
      //get an ID between 1, and the last element in the array;
      id = Math.floor(Math.random() * (teams.length-1))+1;
      if(isValidMatchup(team1,teams[id],eventObj))
      {
        team2 = teams[id];
        works=true;
      }

      if(errorCounter>1000)
      {
        throw "FAILED GEN";
      }
      errorCounter++;
    }

    //matchup decided team1 v team2

    //store teams in round

    //console.log({team1,works,team2});
    var room = rooms[i];
    room.addRound();
    room.rounds[room.rounds.length-1].setTeams(team1,team2);

    //remove the two teams from availabilty that round.
    teams.splice( id, 1 );
    teams.splice( 0, 1 );
  }
}
