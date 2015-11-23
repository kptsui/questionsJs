$(document).ready(function(){
	var roomGrid = $("#roomList");
	var currentLink  = window.location.href;
	var baseLink = currentLink.substr(0, currentLink.indexOf("#/")+2);

	var ref = new Firebase("https://intense-torch-3848.firebaseio.com/");
	ref.orderByKey().on("child_added", function(snapshot) {
		var roomName = snapshot.key();

		var hyperLink = baseLink+roomName;

		var courseType = roomName.substring(0,4).toLowerCase();
		if(courseType!="acct" && courseType!="comp" && courseType!="huma" && courseType!="chem" && courseType!="hlth")
			courseType = "unknown";
		var icon = '<img src="img/'+courseType+'.png" alt="course icon" class="rmBlock">';

		var stringToAppend = '<a class="col-xs-12 roomItem" href="'+hyperLink+'" onclick="location.reload();">'+icon+roomName.toUpperCase()+'</a>';

		roomGrid.append(stringToAppend);
	});
});