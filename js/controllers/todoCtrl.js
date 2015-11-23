/*global todomvc, angular, Firebase */
'use strict';

/**
* The main controller for the app. The controller:
* - retrieves and persists the model via the $firebaseArray service
* - exposes the model to the template and provides event handlers
*/
todomvc.controller('TodoCtrl',
['$scope', '$location', '$firebaseArray', '$sce', '$localStorage', '$window', 'FileUploader',
function ($scope, $location, $firebaseArray, $sce, $localStorage, $window, FileUploader) {
	var uploader = $scope.uploader = new FileUploader({
            url: 'upload.php'
        });
	$scope.predicate = '';
	if(localStorage.getItem("userNameInQJS")){
		$scope.userName = localStorage.getItem("userNameInQJS");
		$scope.isSignUpFormShow = false;
	}
	else{
		$scope.userName = "";
		$scope.isSignUpFormShow = true;
	}
	
	// initialize later
	// for each questions
	$scope.comments = [];
	$scope.forms = []; // for data binding, prevent input appears on all forms at the same time

	$scope.frequentTag = ["Exam", "Assignment", "Laboratory"];
	$scope.tagsList = [];
	
	var noFB = true;
	
	//$scope.master = {};
	//$scope.master = angular.copy(user);
	//$scope.user = {};
	// after submitted form, user={name: xxx, msg: xxx}

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

function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}

function dateConverter(res_date, now){
var monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];
var date = res_date;
var day = date.getDate();
var month = date.getMonth();
var year = date.getFullYear();
if (year == now.getFullYear())
	return(day + ' ' + monthNames[month]);
else
	return(day + ' ' + monthNames[month] + ' ' + year);
}

function timeConverter(res_date){
var date = res_date;
var hours = date.getHours();
var minutes = date.getMinutes();
var seconds = date.getSeconds();

return(FormatNumberLength(hours,2) + ':' + FormatNumberLength(minutes,2));
}

// beauty print time
function timeInterpreter(res_date){
	var output = "";
	var now = new Date();
	//if (res_date > now.getTime())
		//output = "Time traveller! - " + dateConverter(res_date, now) + " at " + timeConverter(res_date);
	if (res_date > now.getTime() - 60 * 1000) // 1 min
	{
		output = Math.round((now-res_date)/1000);
		if (output == 0)
			output = "just posted";
		else
			output += " s ago";
	}
	else if (res_date > now.getTime() - 60 * 60 * 1000) // 1 hour
		output = Math.round((now-res_date)/(60000)) + " mins ago"
	else if (res_date > now.getTime() - 24 * 60 * 60 * 1000) // 1 day
		output = Math.round((now-res_date)/(3600000)) + " hrs ago"
	else if (res_date.getMonth() == now.getMonth())
		output = dateConverter(res_date, now) + " at " + timeConverter(res_date);
	else
		output = dateConverter(res_date, now);
	return output;
}

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
		//todo.dateString = new Date(todo.timestamp).toString();
		todo.dateString = timeInterpreter(new Date(todo.timestamp));
		// set message
		//todo.tags = todo.wholeMsg.match(/#\w+/g);

		//todo.trustedDesc = $sce.trustAsHtml(todo.linkedDesc);
		//todo.linkedDesc = todo.linkedDesc + "test";
	});

	$scope.totalCount = total;
	$scope.remainingCount = remaining;
	$scope.completedCount = total - remaining;
	$scope.allChecked = remaining === 0;
	$scope.absurl = $location.absUrl();
}, true);

// function for just submitted the form
$scope.addComment = function(form, todo) {
	if(form.msg != ""){
		$scope.editedTodo = todo;

		form.name = $scope.userName;

		var date = new Date();
		var time = date.getHours() + ":" + date.getMinutes() + " " + date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
		form.dateString = time;

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
		//form.name = "";
		form.msg = "";

		return false; // let comment input ng-show = false
	}
};

$scope.signUp = function(){
	if ($scope.userName)
	{
		localStorage.setItem("userNameInQJS", $scope.userName);
		return false;
	}
	else
		return true;
	//$scope.$apply will trigger a digest loop which will make Angular notice that $scope.isSignUpFormShow has changed.
	//$scope.$apply();
};

$scope.signOut = function(){
	$scope.userName = "";
	return true;
	//$scope.$apply will trigger a digest loop which will make Angular notice that $scope.isSignUpFormShow has changed.
	//$scope.$apply();
};

$scope.changeOrder = function(predicate){
	if(predicate ==  $scope.predicate){ //both is -predicate
		$scope.predicate = predicate.substr(1);
	}
	else{
		$scope.predicate = predicate;
	}
};

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

$scope.clearMsg = function() {
	$scope.input = {wholeMsg: ""};
}

// update msg string to tag string for quick tag search
$scope.tagToMsg = function($tag) {
	try{
		if ($scope.input.wholeMsg.trim())
			var Msg = $scope.input.wholeMsg.trim() + " " +$tag;
		else
			var Msg = $tag;
	}
	catch(e){
		var Msg = $tag;
	}
	$scope.input = {wholeMsg: Msg};
}

$scope.hotTagToMsg = function(id) {
	try{
		var tag = "#" + $(id).text();
		if ($scope.input.wholeMsg.trim())
			var Msg = $scope.input.wholeMsg.trim() + " " +tag;
		else
			var Msg = tag;
	}
	catch(e){
		var Msg = tag;
	}
	$scope.input = {wholeMsg: Msg};
}

$scope.imgToMsg = function($url) {
	var url = 'http://52.88.196.231/chat/uploads/'+$url;
	try{
		if ($scope.input.wholeMsg.trim())
			var Msg = $scope.input.wholeMsg.trim() + "\n" +url;
		else
			var Msg = "img upload" + "\n" +url;
	}
	catch(e){
		var Msg = "img upload" + "\n" +url;
	}
	$scope.input = {wholeMsg: Msg};
}

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
	
	if (!newTodo_nt.length) {
		return;
	}
	
	var firstAndLast = $scope.getFirstAndRestSentence(newTodo_nt);
	var head = firstAndLast[0];
	var desc = firstAndLast[1];

	var userName = $scope.userName;
	//newTodo = userName + " " + newTodo;
	userName = userName?userName:'annoymous';
	//****************************************
	//****************************************
	var position;
	if($scope.todos.length == 0){
		position = -1;
	}
	else{
		position = -1 - $scope.todos.length;
	}
	
	//var linkedDesc = Autolinker.link(desc, {newWindow: false, stripPrefix: false, truncate: 25});
	
	var linkedDesc = Autolinker.link( desc, {newWindow: false, stripPrefix: false, truncate: 25,
    replaceFn : function( autolinker, match ) {
        switch( match.getType() ) {
            case 'url' :
                //console.log( "url: ", match.getUrl() );
				var link = match.getUrl();
				var ext = link.substr(link.lastIndexOf('.') + 1);
				if (youtube_parser(link)){
                    return false;
                } else if (ext == "jpg" || ext == "png" || ext == "jpeg" || ext == "bmp" || ext == "gif"){
					return '<img class="imgFrame" src="'+link+'">';
				}
				else
				{
                    return true;  // let Autolinker perform its normal anchor tag replacement
                }
        }
    }
} );
	//****************************************
	$scope.todos.$add({
		wholeMsg: newTodo,
		head: head,
		headLastChar: head.slice(-1),
		desc: desc,
		linkedDesc: linkedDesc,
		completed: false,
		timestamp: new Date().getTime(),
		tags: tags,
		echo: 0,
		d_echo: 0,
		order: position,
		views: 0,
		op: userName
		//comments: [{name: "", msg : ""}]
	});
	// remove the posted question in the input
	$scope.input.wholeMsg = '';
};

	$scope.setEmoji = function(){
      $window.emojiPicker = new EmojiPicker({
        emojiable_selector: '[data-emojiable=true]',
        assetsPath: 'emoji/img/',
        popupButtonClasses: 'fa fa-smile-o'
      });
      $window.emojiPicker.discover();
	}
	
	echoRef.on("child_added", function(snapshot, prevChildKey) {
		var question = snapshot.val();
		var tags = question.tags;
		
		if(tags != null){
			for(var i=0; i<tags.length; i++){
				$scope.tagsList.push(tags[i]);
			}
		}
		setFrequentTag();
	});
	
	function setFrequentTag(){
		var copyTagsList = [];
		$scope.tagsList.forEach(function(tag){
			copyTagsList.push(tag);
		});
        // find 3 frequent tags
        for(var i=0; i<3; i++){
			
            var frequentStr = frequentString(copyTagsList);
			
            if(frequentStr != null){
                $scope.frequentTag[i] = frequentStr;
				
				var index = copyTagsList.indexOf(frequentStr);
				if (index > -1) {
					copyTagsList.splice(index, numberOfString(frequentStr, copyTagsList));
				}
				$("#btnTag" + i).text(frequentStr);
				console.log("#btnTag" + i + " : " + frequentStr);
            }
        }
    }
	
	function frequentString(array){
		if(array.length < 3)
			return null;
		
		var amount = [];
		var copyString = [];
		for(var i=0; i < array.length; i++){
			if( i==0 || copyString.indexOf(array[i]) == -1 ){
				copyString.push(array[i]);
				amount.push(1);
			}
			else{
				var index = copyString.indexOf(array[i]);
				amount[index]++;
			}
		}
		var max = 2;
		var position = null;
		for(var i=0; i < amount.length; i++){
			if(amount[i] > max){
				max = amount[i];
				position = i;
			}
		}
		if(position != null)
			return copyString[position];
		else
			return null;
	}
	
	function numberOfString(frequentStr, copyTagsList){
		var num = 0;
		for(var i=0; i<copyTagsList.length; i++){
			if( copyTagsList[i] == frequentStr )
				num++;
		}
		return num;
	}

$scope.editTodo = function (todo) {
	$scope.editedTodo = todo;
	$scope.originalTodo = angular.extend({}, $scope.editedTodo);
};

// Like button
$scope.addEcho = function (todo) {    //in bug cause like to clear trustedDesc
	if ($scope.$storage[todo.$id]=="echoed")
	{
		$scope.editedTodo = todo;
		todo.echo = todo.echo - 1;
		// Hack to order using this order.
		//todo.order = todo.order + 1;
		$scope.todos.$save(todo);
		$scope.$storage[todo.$id] = "";
		//todo.opinion = "none";
		todo.like = false;
	}
	else if ($scope.$storage[todo.$id]!="d_echoed")
	{
		$scope.editedTodo = todo;
		todo.echo = todo.echo + 1;
		// Hack to order using this order.
		//todo.order = todo.order - 1;
		$scope.todos.$save(todo);
		$scope.$storage[todo.$id] = "echoed";
		//todo.opinion = "like";
		todo.like = true;
	}	
};

// Dislike button
$scope.minusEcho = function (todo) {
	if ($scope.$storage[todo.$id]=="d_echoed")
	{
		$scope.editedTodo = todo;
		todo.d_echo = todo.d_echo - 1;
		// Hack to order using this order.
		//todo.order = todo.order + 1;
		$scope.todos.$save(todo);
		$scope.$storage[todo.$id] = "";
		todo.dislike = false;
	}
	else if ($scope.$storage[todo.$id]!="echoed")
	{
		$scope.editedTodo = todo;
		todo.d_echo = todo.d_echo + 1;
		// Hack to order using this order.
		//todo.order = todo.order - 1;
		$scope.todos.$save(todo);
		$scope.$storage[todo.$id] = "d_echoed";
		todo.dislike = true;
	}	

	// Disable the button
	//$scope.$storage[todo.$id] = "echoed";
};

$scope.showLike = function (id){
	if ($scope.$storage[id] == "echoed")
		return true;
	return false;
}

$scope.showDislike = function (id){
	if ($scope.$storage[id] == "d_echoed")
		return true;
	return false;
}

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

$scope.thisIsMine = function(op){
	if (op==$scope.userName)
		return '2px solid #49C7C3';
	else
		return 'none';
}

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

$scope.btnImgUpload = function () {
	if ($scope.imgUpload)
		$scope.imgUpload = false;
	else
		$scope.imgUpload = true;
};

$scope.parse = function(desc) {
	if (desc)
	{
	desc = desc.trim();
	var n_string = "";
	var line = desc.split("\n");
	for (var l in line)
	{
		line[l].trim();
		var res = line[l].split(" ");
		for (var i in res)
		{
			var out = youtube_parser(res[i]);
			if (out)
				n_string += '<iframe id="ytplayer" type="text/html" width="640" height="390" src="http://www.youtube.com/embed/' + out + '?autoplay=0" frameborder="0"/> ';
			else
				n_string += res[i]+" ";
		}
		if (n_string!="")
			n_string += "\n";
	}
	return n_string;
	}
	return desc;
}

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

// Not sure what is this code. Todel
if ($location.path() === '') {
	$location.path('/');
}
$scope.location = $location;

// autoscroll
angular.element($window).bind("scroll", function() {
	if ($window.innerHeight + $window.scrollY >= $window.document.body.offsetHeight) {
		//console.log('Hit the bottom2. innerHeight' +
		//$window.innerHeight + "scrollY" +
		//$window.scrollY + "offsetHeight" + $window.document.body.offsetHeight);

		// update the max value
		$scope.increaseMax();

		// force to update the view (html)
		$scope.$apply();
	}
});

//img uploader

        // FILTERS

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
			
			//$scope.item.file.name = response.filename;
			//$scope.uploader = {filename: response.filename}; //this is bug
			//console.log($scope.uploader);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);

}]);