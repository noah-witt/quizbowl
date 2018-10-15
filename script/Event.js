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

//get a list of the valid iterations sorted by their rank score.
event.prototype.getValidIterations = function() {

  //array to store all the iterations that are valid
  let iterations = [];


  for(let i=0;i<this.scheduleIterations.length;i++)
  {
    if(this.scheduleIterations[i].valid)
    {
      iterations.push(this.scheduleIterations[i]);
    }
  }

  //now sort by score

  //using insertion sort
  for(let i=1;i<iterations.length;i++)
  {
    let x = iterations[i];
    let j = i-1;
    while(j >=0 && iterations[j].getRankScore()>x.getRankScore())
    {
      iterations[j+1] = iterations[j];
       j--;
    }
    iterations[j+1] = x;
  }

  return iterations;

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
