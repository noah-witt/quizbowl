//check to see
function isValidMatchup(team1,team2)
{

}

//WILL REMOVE ELEMENT
function getRandomElementOfArray(array)
{
    var index = Math.floor( Math.random()*array.length );
    var temp = array[index];
    array.splice( index, 1 );
    return temp;
}

function genSchedule(eventObj)
{
  if(eventObj.getOrderedListOfTeams().length%2!=0)
  {
    alert("You Must Have An Even Number Of Teams.");
    throw "odd number of teams";
  }
  var teams = eventObj.getRandomizedListOfTeams();

}

//makes enugh rooms for each match;
function generateRooms(numRooms,eventObj)
{
  for(var i=0;i<numRooms;i++)
  {
    eventObj.schedule.addRoom();
  }
}
