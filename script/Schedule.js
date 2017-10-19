//object to score the schedule
function schedule(event)
{
  this.id="schedule";
  this.event = event;
}

schedule.prototype.rooms =[];
schedule.prototype.event=null;
event.prototype.id = null;



//object to represent each room
function room(roomLetter,schedule)
{
  this.letter = roomLetter;
  this.id=randomString(10,'aA#')+"-room:"+roomLetter;
  //store a reference to the schedule object in the room object so given any part of the turnoment hierarchy you can transverse to the top.
  this.schedule = schedule;
  this.rounds = [];
}
room.prototype.id = null;
room.prototype.letter = "";
room.prototype.rounds =[];
room.prototype.schedule = null;


room.prototype.addRound = function()
{
  var n = new round(this);
  this.rounds.push(n);
  return n;
};


//represents a single round
function round(room)
{
  this.room = room;
  this.id = this.room.id+"-"+randomString(10,'aA#');
}
round.prototype.id = null;
round.prototype.room = null;
round.prototype.team1 = null;
round.prototype.team2 = null;


//sets the teams compeating in a match.
round.prototype.setTeams = function(team1,team2)
{
  this.team1 = team1;
  this.team2 = team2;
};


//returns the matchup in a human readable format.
round.prototype.getFormatedMatchup = function()
{
  return this.team1.getFormatedName() + " VS " + this.team2.getFormatedName();
};