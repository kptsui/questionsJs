$(document).ready(function(){
	var roomGrid = $("#roomList");
	var baseLink = "http://52.88.196.231/chat/question.html#/";

	var ref = new Firebase("https://intense-torch-3848.firebaseio.com/");
	ref.orderByKey().on("child_added", function(snapshot) {
		var roomName = snapshot.key();

		var hyperLink = baseLink+roomName;

		var courseType = roomName.substring(0,4).toLowerCase();
		var icon = '<img src="img/'+courseType+'.png" alt="course icon" class="rmBlock">';

		var stringToAppend = '<a class="col-xs-12 roomItem" href="'+hyperLink+'" onclick="location.reload();">'+icon+roomName.toUpperCase()+'</a>';

		roomGrid.append(stringToAppend);
	});
});