//object to score the schedule
function schedule(event)
{
  this.id="schedule";
  this.event = event;
  this.rooms = [];
}

schedule.prototype.rooms =[];
schedule.prototype.event=null;
event.prototype.id = null;

schedule.prototype.numRooms = function()
{
  return this.rooms.length;
};

//adds room
schedule.prototype.addRoom = function()
{
  //throw "test";
  var id=this.rooms.length;
  var names = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
  var name = names.slice(id,id+1);
  this.rooms.push(new room(name,this));
};

schedule.prototype.addRoomWithNum = function(roomNum)
{
  this.addRoom();
  this.rooms[this.rooms.length-1].roomNumber = roomNum;
};

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
room.prototype.roomNumber = null;


room.prototype.getRoomName = function()
{
  if(this.roomNumber!==null&&this.roomNumber!=="")
  {
    return this.roomNumber+" ("+this.letter+")";
  }
  return this.letter;
};

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
  this.roundNumer = room.rounds.length+1;
}
round.prototype.id = null;
round.prototype.room = null;
round.prototype.team1 = null;
round.prototype.team2 = null;
round.prototype.roundNumer =-1;

//sets the teams compeating in a match.
round.prototype.setTeams = function(team1,team2)
{
  //console.log({team1,team2});
  this.team1 = team1;
  this.team2 = team2;
};


//returns the matchup in a human readable format.
round.prototype.getFormatedMatchup = function()
{
  return "Round "+this.roundNumer+": "+this.team1.getFormatedName() + " VS " + this.team2.getFormatedName()+" In room "+this.room.getRoomName()+".";
};

//returns true if this matchup is the same as the one provided in the parameters
round.prototype.isSameMatchup = function(team1,team2)
{
  if(team1.isSame(this.team1)&&team2.isSame(this.team2))
  {
    return true;
  }

  if(team1.isSame(this.team2)&&team2.isSame(this.team1))
  {
    return true;
  }
  return false;
};

round.prototype.hasTeam = function(team)
{
  if(team.isSame(this.team1)||team.isSame(this.team2))
  {
    return true;
  }
  return false;
};
