function school(event)
{
  this.id = randomString(10,'aA#');
  this.event = event;
}
school.prototype.numberOfTeams =0;
school.prototype.name ='';
school.prototype.teams=[];
school.prototype.event=null;

school.prototype.setName = function(name)
{
  this.name = name;
  return name;
};

school.prototype.setNumberOfTeams = function(num)
{
  this.numberOfTeams=num;
  this.teams =[];
  for(var i=1;i<=num;i++)
  {
    this.addTeam(i);
  }
};

school.prototype.addTeam = function(num)
{
  this.teams.push(new team(this,num));
};

function team(school,number)
{
  this.id = school.id+"-"+randomString(10,'aA#');
  this.school = school;
  this.teamNumber = number;
}
team.prototype.school = null;
team.prototype.teamNumber = 0;

//returns the name of the team in a human readable way.
team.prototype.getFormatedName = function()
{
  return this.school.name+" "+this.teamNumber;
};