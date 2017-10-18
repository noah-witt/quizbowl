function event(name)
{
  this.id = "event";
  this.name = name;
  this.schools = [];
}
event.prototype.id = null;
event.prototype.name = '';
event.prototype.schools = [];

event.prototype.addSchool = function(name,numTeams)
{
  var s = new school(this);
  this.schools.push(s);
  s.setName(name);
  s.setNumberOfTeams(numTeams);
};
