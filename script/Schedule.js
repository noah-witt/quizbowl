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
    //console.log(this);
  }
  else {
    this.repeatedRoomsScore = 9999999;
    this.repeatedSchoolsScore = 9999999;
  }
};

//returns rank score
schedule.prototype.getRankScore = function()
{
  return this.repeatedRoomsScore+(window.config.scoring.repeatedSchoolsScoreWeight*this.repeatedSchoolsScore);
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
  // array to store the team ids
  //workingData data structure listed Bellow
  //[teamID: {id:x, matchups: [matchupTeamID: {id: matchupTeamID, hits: NumberOftimesAboveOneThatTheyHitTHisSchool}, ...], matchupsIDs: [matchupID, ...] }, ...]
  let workingData = [];

  //team list so we know where to look in workingData;
  //[teamId, ...]
  let workingDataList =[];

  //loop through each room
  for(let roomNum in this.rooms)
  {
    let room = this.rooms[roomNum];
    //debugger;
    //each room looped here

    //loop through each round in the room
    for(let roundNum in room.rounds)
    {
      let round = room.rounds[roundNum];
      //debugger;

      // each round in each room

      //check to see if team1 exists in workingData
      let workingTeamFromWorkingData = null;

      //debugger;

      if(workingDataList.includes(round.team1.id))
      {
        //store the working Team data structure to our working place
        workingTeamFromWorkingData = workingData[round.team1.id];
      }
      else
      {
        //make the working team data structure before we store it.
        workingData[round.team1.id] = {id: round.team1.id, matchups: [], matchupsIDs:[] };

        //insert this team id so it can be found later.
        workingDataList.push(round.team1.id);

        //copy to workingTeam...  so it is easy to work on later in function
        workingTeamFromWorkingData = workingData[round.team1.id];
      }


      //now that we have the team obj we will check to see if they have hit the school before and if they have not we will create the reference at 0. If they have we will add one.
      if(workingTeamFromWorkingData.matchupsIDs.includes(round.team2.school.id))
      {
        //will run if they have hit a team from that school before.
        //this command will add 1  to that value
        workingTeamFromWorkingData.matchups[round.team2.school.id].hits = workingTeamFromWorkingData.matchups[round.team2.school.id].hits+1;
        //console.debug(workingTeamFromWorkingData.matchups[round.team2.school.id]);
        //debugger;
      }
      else
      {
        //will run if the team has not hit that school before
        //this command will create the school in its list of hit schools and start its repeat hits num at 0;
        workingTeamFromWorkingData.matchups[round.team2.school.id] = {id: round.team2.school.id, hits:0};

        //push id on so we can find it when looping
        workingTeamFromWorkingData.matchupsIDs.push(round.team2.school.id);
      }



      //for team 2

      if(workingDataList.includes(round.team2.id))
      {
        //store the working Team data structure to our working place
        workingTeamFromWorkingData = workingData[round.team2.id];
      }
      else
      {
        //make the working team data structure before we store it.
        workingData[round.team2.id] = {id: round.team2.id, matchups: [], matchupsIDs:[] };

        //insert this team id so it can be found later.
        workingDataList.push(round.team2.id);

        //copy to workingTeam...  so it is easy to work on later in function
        workingTeamFromWorkingData = workingData[round.team2.id];
      }


      //now that we have the team obj we will check to see if they have hit the school before and if they have not we will create the reference at 0. If they have we will add one.
      if(workingTeamFromWorkingData.matchupsIDs.includes(round.team1.school.id))
      {
        //will run if they have hit a team from that school before.
        //this command will add 1  to that value
        workingTeamFromWorkingData.matchups[round.team1.school.id].hits = workingTeamFromWorkingData.matchups[round.team1.school.id].hits+1;
        //console.debug(workingTeamFromWorkingData.matchups[round.team2.school.id]);
        //debugger;
      }
      else
      {
        //will run if the team has not hit that school before
        //this command will create the school in its list of hit schools and start its repeat hits num at 0;
        workingTeamFromWorkingData.matchups[round.team1.school.id] = {id: round.team1.school.id, hits:0};

        //push id on so we can find it when looping
        workingTeamFromWorkingData.matchupsIDs.push(round.team1.school.id);
      }

    }
  }




  //iterate through each team now and sum score
  let workingScore = 0;
  for(let teamIdNum in workingDataList)
  {
    //get actual team from data structure.
    let team = workingData[workingDataList[teamIdNum]];

    //for each team that plays. loads up the team from the working team data structure I made.


    //store variable of total repeats.
    let repeats = 0;

    for(let schoolIDNum in team.matchupsIDs)
    {
      // loop through each matchup school
      let school = team.matchups[team.matchupsIDs[schoolIDNum]];  //mark
      repeats += school.hits;
    }

    workingScore+= Math.pow(repeats,window.config.scoring.reOcuringSchoolHitPenalty);


  }

  this.repeatedSchoolsScore = workingScore;
  return workingScore;
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
