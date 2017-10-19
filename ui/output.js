function createSchoolTable(numSchools)
{
  var res = generateSchoolTableHTML(numSchools);
  $("#SchoolDetailEntery").html(res);
  return true;
}

function generateSchoolTableHTML(numSchools)
{
  var str = '<table class="table">';
  //heading
  str+="<tr><th>Name Of School</th><th>Number Of Teams</th>";
  //insert rows
  for(var i=0;i<numSchools;i++)
  {
    str+=generateSchoolTableRow(i);
  }
  //close table
  str+='</table>';
  //Go Button.
  str+='<div class="btn-group" role="group" aria-label="..."><button type="button" class="btn btn-default" onclick="genSchedule()">Generate Schedule</button></div>';
  return str;
}

//generates a school row for the generateSchooltableHTML function.
function generateSchoolTableRow(i)
{
  return '<tr><td><div class="input-group"><input type="text" class="form-control" placeholder="School Name" aria-describedby="basic-addon1" id="SchoolNameEntery-'+i+'"></div></td> <td><div class="input-group"><input type="text" class="form-control" placeholder="Number Of Teams" aria-describedby="basic-addon1" id="SchoolNumberEntry-'+i+'"></div></td></tr>';
}
