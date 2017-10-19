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
