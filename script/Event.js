function event(name)
{
  this.id = "event-"+name+"-"+randomString(window.config.numberOfDigitsForRandomStrings,'aA#');
  this.name = name;
  this.numberOfSchools =0;
  this.schools = [];
  this.scheduleIterations = [];
  this.iterate(window.config.numberOfIterations);
}
event.prototype.id = null;
event.prototype.name = '';
event.prototype.schools = [];
event.prototype.numberOfSchools = 0;
event.prototype.schedule = null;
event.prototype.roomList = [];

event.prototype.iterate = function(num)
{
  for(var i =0; i<num;i++)
  {
    this.scheduleIterations[i] = new schedule(this,i+1);
  }
};

event.prototype.selectTopIteration = function() {
  var top = this.scheduleIterations[0];
  for(var i=1;i<this.scheduleIterations.length;i++)
  {
    //console.log({title: "compison:", obj: this.scheduleIterations[i],rankScore: this.scheduleIterations[i].getRankScore()});
    //console.log({title: "top:", obj: top, rankScore: top.getRankScore()});
    //if(this.scheduleIterations[i].valid){debugger;}
    if(this.scheduleIterations[i].valid&&this.scheduleIterations[i].getRankScore()<top.getRankScore())
    {
      //debugger;
      top = this.scheduleIterations[i];
    }
  }
  this.schedule = top;
  //debugger;
  return top;
};

event.prototype.addSchool = function(name,numTeams)
{
  //console.log("school");
  var s = new school(this);
  this.schools.push(s);
  s.setName(name);
  s.setNumberOfTeams(numTeams);
};

event.prototype.setNumberOfSchools = function(num)
{
  this.numberOfSchools = num;
  return num;
};


event.prototype.getNumberOfSchools = function()
{
  return this.numberOfSchools;
};


event.prototype.getNumberOfTeams = function()
{
  return this.getOrderedListOfTeams().length;
};

//returns an ordered list of every team compeating
// NOT RANDOM
event.prototype.getOrderedListOfTeams = function()
{
  var list =[];
  for(i=0;i<this.schools.length;i++)
  {
    list = list.concat(this.schools[i].teams);
  }
  return list;
};

//returns shuffled list of teams
event.prototype.getRandomizedListOfTeams = function()
{
  var arr = this.getOrderedListOfTeams();
  return shuffle(arr);
};

event.prototype.addRoom = function(name)
{
  this.roomList.push(name);
};

event.prototype.getRoomName = function(index)
{
  return this.roomList[index];
};
event.prototype.getRoomNum = function()
{
  return this.roomList.length;
};
