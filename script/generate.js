//check to see if matchup is valid. TRUE IF IT IS VALID
function isValidMatchup(team1,team2,scheduleObj)
{
  //returns
  return ((!team1.isSame(team2))&&(!team1.school.isSame(team2.school)))&&(!doesMatchupExist(team1,team2,scheduleObj));
}


//checks to see if a matchup bettween two teams exists
//returns true if it does exist
function doesMatchupExist(team1,team2,scheduleObj)
{
  var rooms = scheduleObj.rooms;

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

function genSchedules(eventObj)
{
  //debugger;
  for(var el of eventObj.scheduleIterations )
  {
    el.loadRooms();
    //console.log(el)
    el.creationEngine();
    //debugger;
  }
  eventObj.selectTopIteration();
}
