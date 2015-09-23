/*global todomvc, angular, Firebase */
'use strict';

/**
* The main controller for the app. The controller:
* - retrieves and persists the model via the $firebaseArray service
* - exposes the model to the template and provides event handlers
*/
todomvc.controller('TodoCtrl',
['$scope', '$location', '$firebaseArray', '$sce', '$localStorage', '$window',
function ($scope, $location, $firebaseArray, $sce, $localStorage, $window) {
	// initialize later
	// for each questions
	$scope.comments = [];
	$scope.forms = []; // for data binding, prevent input appears on all forms at the same time
	
	var noFB = true;
	
	//$scope.master = {};
	//$scope.master = angular.copy(user);
	//$scope.user = {};
	// after submitted form, user={name: xxx, msg: xxx}
	
	// function for just submitted the form
	$scope.addComment = function(form, todo) {
		if(form.name != "" && form.msg != ""){
			$scope.editedTodo = todo;

			if(todo.hasOwnProperty("comments")){
				todo.comments.push(form);
			}
			else{ // todo.comments[0].name = ""
				//todo.comments[0] = form;
				
				// add new property to todo object
				todo.comments = [form]; //[{}]
			}
			todo.views += 1;
			$scope.todos.$save(todo);
			form.name = "";
			form.msg = "";
		}
	};
	
	// set local storage
	$scope.$storage = $localStorage;

	var scrollCountDelta = 10;
	$scope.maxQuestion = scrollCountDelta;

	/*
	$(window).scroll(function(){
	if($(window).scrollTop() > 0) {
	$("#btn_top").show();
} else {
$("#btn_top").hide();
}
});
*/
var splits = $location.path().trim().split("/");
var roomId = angular.lowercase(splits[1]);
if (!roomId || roomId.length === 0) {
	roomId = "all";
}

// TODO: Please change this URL for your app
var firebaseURL = "https://intense-torch-3848.firebaseio.com/";


$scope.roomId = roomId;
var url = firebaseURL + roomId + "/questions/";
var echoRef = new Firebase(url);

var query = echoRef.orderByChild("order");
// Should we limit?
//.limitToFirst(1000);
$scope.todos = $firebaseArray(query); // put json data into array

//$scope.input.wholeMsg = '';
$scope.editedTodo = null;

// pre-precessing for collection
//******************
// todo in todos
//******************
$scope.$watchCollection('todos', function () {
	var total = 0;
	var remaining = 0;
	$scope.todos.forEach(function (todo) { // json data alread put into array on line44
		// Skip invalid entries so they don't break the entire app.
		if (!todo || !todo.head ) {
			return;
		}
		//***********************************
		//***********************************
		// new added
		if(todo.hasOwnProperty("comments")){
			$scope.comments.push(todo.comments);//$scope.comments[0][0].name
		}
		// form for each questions
		$scope.forms.push({name: "", msg: ""});
		
		//***********************************
		//***********************************
		total++;
		if (todo.completed === false) {
			remaining++;
		}

		// set time
		todo.dateString = new Date(todo.timestamp).toString();
		// set message
		//todo.tags = todo.wholeMsg.match(/#\w+/g);

		todo.trustedDesc = $sce.trustAsHtml(todo.linkedDesc);
	});

	$scope.totalCount = total;
	$scope.remainingCount = remaining;
	$scope.completedCount = total - remaining;
	$scope.allChecked = remaining === 0;
	$scope.absurl = $location.absUrl();
}, true);

// Get the first sentence and rest
$scope.getFirstAndRestSentence = function($string) {
	var head = $string;
	var desc = "";

	var separators = [". ", "? ", "! ", '\n'];

	var firstIndex = -1;
	for (var i in separators) {
		var index = $string.indexOf(separators[i]);
		if (index == -1) continue;
		if (firstIndex == -1) {firstIndex = index; continue;}
		if (firstIndex > index) {firstIndex = index;}
	}

	if (firstIndex !=-1) {
		head = $string.slice(0, firstIndex+1);
		desc = $string.slice(firstIndex+1);
	}
	return [head, desc];
};

// Get the # tags from msg
// return msg without tags and tags[]
$scope.getTags = function($string){
	var n_string = "";
	var tags = new Object();
	tags = [];
	
	var line = $string.split("\n");	
	for (var l in line)
	{
		var res = line[l].split(" ");
		for (var i in res)
		{
			if (res[i].charAt(0)=="#")
				tags.push(res[i].substr(1));
			else
				n_string += res[i]+" ";
		}
		if (n_string!="")
			n_string += "\n";
	}
	if (tags.length == 0)
		tags[0] = "...";
	
	
	return [n_string, tags];
}

//****************************************
//****************************************
$scope.addTodo = function () {
	var newTodo = $scope.input.wholeMsg.trim();

	// No input, so just do nothing
	if (!newTodo.length) {
		return;
	}

	var res = $scope.getTags(newTodo);
	var newTodo_nt = res[0];
	var tags = res[1];
	
	if (!newTodo.length) {
		return;
	}
	
	var firstAndLast = $scope.getFirstAndRestSentence(newTodo_nt);
	var head = firstAndLast[0];
	var desc = firstAndLast[1];

	//****************************************
	//****************************************
	//****************************************
	$scope.todos.$add({
		wholeMsg: newTodo,
		head: head,
		headLastChar: head.slice(-1),
		desc: desc,
		linkedDesc: Autolinker.link(desc, {newWindow: false, stripPrefix: false}),
		completed: false,
		timestamp: new Date().getTime(),
		tags: tags,
		echo: 0,
		order: 0,
		views: 0
		//comments: [{name: "", msg : ""}]
	});
	// remove the posted question in the input
	$scope.input.wholeMsg = '';
};

$scope.editTodo = function (todo) {
	$scope.editedTodo = todo;
	$scope.originalTodo = angular.extend({}, $scope.editedTodo);
};

// Like button
$scope.addEcho = function (todo) {
	$scope.editedTodo = todo;
	todo.echo = todo.echo + 1;
	// Hack to order using this order.
	todo.order = todo.order -1;
	$scope.todos.$save(todo);

	// Disable the button
	$scope.$storage[todo.$id] = "echoed";
};

// Dislike button
$scope.minusEcho = function (todo) {
	$scope.editedTodo = todo;
	todo.echo = todo.echo -1;
	// Hack to order using this order.
	todo.order = todo.order +1;
	$scope.todos.$save(todo);

	// Disable the button
	$scope.$storage[todo.$id] = "echoed";
};


$scope.doneEditing = function (todo) {
	$scope.editedTodo = null;
	var wholeMsg = todo.wholeMsg.trim();
	if (wholeMsg) {
		$scope.todos.$save(todo);
	} else {
		$scope.removeTodo(todo);
	}
};

$scope.revertEditing = function (todo) {
	todo.wholeMsg = $scope.originalTodo.wholeMsg;
	$scope.doneEditing(todo);
};

$scope.removeTodo = function (todo) {
	$scope.todos.$remove(todo);
};

$scope.clearCompletedTodos = function () {
	$scope.todos.forEach(function (todo) {
		if (todo.completed) {
			$scope.removeTodo(todo);
		}
	});
};

$scope.toggleCompleted = function (todo) {
	todo.completed = !todo.completed;
	$scope.todos.$save(todo);
};

$scope.markAll = function (allCompleted) {
	$scope.todos.forEach(function (todo) {
		todo.completed = allCompleted;
		$scope.todos.$save(todo);
	});
};

$scope.FBLogin = function () {
	if (!noFB)
	{
		var ref = new Firebase(firebaseURL);
		ref.authWithOAuthPopup("facebook", function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				$scope.$apply(function() {
					$scope.$authData = authData;
					$scope.isAdmin = true;
				});
				console.log("Authenticated successfully with payload:", authData);
			}
		});
	}
	else
		$scope.isAdmin = true;
	
};

$scope.FBLogout = function () {
	if (!noFB)
	{
		var ref = new Firebase(firebaseURL);
		ref.unauth();
		delete $scope.$authData;
	}
	$scope.isAdmin = false;
};

$scope.increaseMax = function () {
	if ($scope.maxQuestion < $scope.totalCount) {
		$scope.maxQuestion+=scrollCountDelta;
	}
};

$scope.toTop =function toTop() {
	$window.scrollTo(0,0);
};

// Not sure what is this code. Todel
if ($location.path() === '') {
	$location.path('/');
}
$scope.location = $location;

// autoscroll
angular.element($window).bind("scroll", function() {
	if ($window.innerHeight + $window.scrollY >= $window.document.body.offsetHeight) {
		console.log('Hit the bottom2. innerHeight' +
		$window.innerHeight + "scrollY" +
		$window.scrollY + "offsetHeight" + $window.document.body.offsetHeight);

		// update the max value
		$scope.increaseMax();

		// force to update the view (html)
		$scope.$apply();
	}
});

}]);
