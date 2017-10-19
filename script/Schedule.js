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
  this.id=randomString(4,'aA#')+"-room:"+roomLetter;
  //store a reference to the schedule object in the room object so given any part of the turnoment hierarchy you can transverse to the top.
  this.schedule = schedule;
  this.rounds = [];
}
room.prototype.id = null;
room.prototype.letter = "";
room.prototype.rounds =[];
room.prototype.schedule = null;

//represents a singe round
function round()
{

}
round.prototype.id = null;
round.prototype.room = null;
