function event(name)
{
  this.id = "event";
  this.name = name;
  this.numberOfSchools =0;
  this.schools = [];
}
event.prototype.id = null;
event.prototype.name = '';
event.prototype.schools = [];
event.prototype.numberOfSchools = 0;

event.prototype.addSchool = function(name,numTeams)
{
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

event.prototype.getOrderedListOfTeams = function()
{
  var list =[];
  for(i=0;i<this.schools.length;i++)
  {
    //console.log(this.schools[i].teams);
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
