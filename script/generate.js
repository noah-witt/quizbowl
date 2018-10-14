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

function genSchedules(eventObj)
{
  eventObj.scheduleIterations.forEach(function(el){
    try {
      el.generate();
    }
    catch(err) {
      //console.warn("genSchedule failed. retrying.");
      nSchools = eventObj.numberOfSchools;
      var eventObj = new event("quizbowl");
      window.eventObj = eventObj;
      eventObj.setNumberOfSchools(nSchools);
      //console.log("Re Attempting Schools:"+nSchools);
      setTimeout(function(){genSchedules(eventObj);}, 0);
    }
  });
}
