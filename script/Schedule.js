//object to score the schedule
function schedule(event,iteration)
{
  this.id="schedule-"+iteration+"-"+randomString(window.config.numberOfDigitsForRandomStrings,'aA#');
  this.iteration = iteration;
  this.event = event;
  this.rooms = [];
}

schedule.prototype.rooms =[];
schedule.prototype.event=null;
schedule.prototype.id = null;
schedule.repeatedRoomsScore = null;
schedule.repeatedSchoolsScore = null;
schedule.valid = null;

schedule.prototype.creationEngine = function()
{
  //atempt to make schedule
  this.generate();
  //score

  if(this.valid)
  {
    this.scoreUseOfRooms();
    this.scoreHitsOfSameSchool();
    console.log(this);
  }
  else {
    this.repeatedRoomsScore = 9999999;
    this.repeatedSchoolsScore = 9999999;
  }
};

//returns rank score
schedule.prototype.getRankScore = function()
{
  return this.repeatedRoomsScore+(window.config.scoring.repeatedSchoolsScore*this.repeatedSchoolsScore);
};


//generate schedule
schedule.prototype.generate = function()
{
  if(this.event.getOrderedListOfTeams().length%2!=0)
  {
    //alert("You Must Have An Even Number Of Teams.");
    throw "odd number of teams";
  }
  var teams = this.event.getRandomizedListOfTeams();
  this.generateRooms(teams.length/2);
  //build rounds
  //debugger;
  try {
    for(var i=0;i<window.config.rounds;i++)
    {
      this.genRoundSchedule();
    }
  } catch (e) {
    this.valid = false;
    return false;
  }
  this.valid = true;
  return true;
};

//generateRooms
schedule.prototype.generateRooms = function(numRooms)
{
  for(var i=0;i<numRooms;i++)
  {
    if(this.numRooms()<=i)
    {
      this.addRoom();
    }
  }
};

schedule.prototype.loadRooms = function()
{
  var num = this.event.getRoomNum();
  for(var i =0;i<num;i++)
  {
    var name = this.event.getRoomName(i);
    this.addRoomWithNum(name);
  }
};

//generate Round SCHEDULE
schedule.prototype.genRoundSchedule = function()
{
  var teams = this.event.getRandomizedListOfTeams();
  var rooms = this.rooms;
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
      if(isValidMatchup(team1,teams[id],this))
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
};

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

//assigns this schedule a score based on how often a team apears in the same room.
//For everytime that a team apears in the same room a single point is added.
//however if the same teams presents in the same room more than twice each subsequent ocuroance encurs an increased penelty
//the penelty increase is defined in window.config.scoring.reOcuringRoomReUsePenalty
schedule.prototype.scoreUseOfRooms = function()
{
  var workingScore =0;
  var numRooms = this.rooms.length;
  //iterate through each room
  for(var i =0;i<numRooms;i++)
  {
    workingScore+=this.rooms[i].getScore();
  }
  this.repeatedRoomsScore = workingScore;
  return workingScore;
};

//score the numver of repeat hits of the same school
schedule.prototype.scoreHitsOfSameSchool = function()
{
  //stub does not work...
  console.warn("Repeat hits stub!!!");
  this.repeatedSchoolsScore = 0;
  return 0;
};

//object to represent each room
function room(roomLetter,schedule)
{
  this.letter = roomLetter;
  this.id=randomString(window.config.numberOfDigitsForRandomStrings,'aA#')+"|room:"+roomLetter;
  //store a reference to the schedule object in the room object so given any part of the turnoment hierarchy you can transverse to the top.
  this.schedule = schedule;
  this.rounds = [];
}
room.prototype.id = null;
room.prototype.letter = "";
room.prototype.rounds =[];
room.prototype.schedule = null;
room.prototype.roomNumber = null;
room.prototype.repeatTeamInRoomScore = null;

//get the score for this room
room.prototype.getScore = function()
{
  var workingScore =0;
  var numRounds = this.rounds.length;
  var teams =[];
  var teamRepeatsInRoom=[];

  //iterate through for each round
  for(var i =0;i<numRounds;i++)
  {
    var workingRound = this.rounds[i];
    var workingID = workingRound.team1.id;
    if(teams.includes(workingID))
    {
      //if there has allready been this team in this room.
      teamRepeatsInRoom[workingID]+=1;
    }
    else
    {
      //if this team has never been in this room before.
      teams.push(workingID);
      teamRepeatsInRoom[workingID] = 0;
    }
  }

  //iterate through each team
  var numTeams = teams.length;
  teams.forEach(function(teamID){
    workingScore+=Math.pow(teamRepeatsInRoom[teamID],window.config.scoring.reOcuringRoomReUsePenalty);
  });
  this.repeatTeamInRoomScore = Math.floor(workingScore);
  return Math.floor(workingScore);
};


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
  this.roundNumer = room.rounds.length+1;
  this.id = this.room.id+"-"+randomString(window.config.numberOfDigitsForRandomStrings,'aA#')+'|roundNumber:'+this.roundNumer;
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

//returns the matchup in the traditinal way
round.prototype.getTraditinalMatchup = function()
{
  return this.team1.getGlobalNumber() + " VS " + this.team2.getGlobalNumber();
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
