'use strict';

describe('sorting the list of users', function() {
  it('sorts in descending order by default', function() {
    var users = ['jack', 'igor', 'jeff'];
    //    var sorted = sortUsers(users);
    //    expect(sorted).toEqual(['jeff', 'jack', 'igor']);
  });
});

describe('TodoCtrl', function() {
  beforeEach(module('todomvc'));
  // variables for injection
  var controller;
  var scope;
  var location;
  var firebaseArray;
  var sce;
  var localStorage;
  var window;

  // Injecting variables
  // http://stackoverflow.com/questions/13664144/how-to-unit-test-angularjs-controller-with-location-service
  beforeEach(inject(function($location,
    $rootScope,
    $controller,
    $firebaseArray,
    $localStorage,
    $sce,
    $window){
      // The injector unwraps the underscores (_) from around the parameter names when matching

      scope = $rootScope.$new();

      location = $location;
      controller = $controller;
      firebaseArray = $firebaseArray;
      sce = $sce;
      localStorage = $localStorage;
      window = $window;
    }));

    describe('TodoCtrl Testing', function() {
      it('setFirstAndRestSentence', function() {
        var ctrl = controller('TodoCtrl', {
          $scope: scope
        });

        var testInputs = [
          {str:"Hello? This is Sung", exp: "Hello?"},
          {str:"Hello.co? This is Sung", exp: "Hello.co?"},
          {str:"Hello.co This is Sung", exp: "Hello.co This is Sung"},
          {str:"Hello.co \nThis is Sung", exp: "Hello.co \n"},
          {str:"Hello? ! ", exp: "Hello?"},
          {str:"Hello! ? ", exp: "Hello!"},
          {str:"Hello?? This is Sung", exp: "Hello??"},
        ];

        for (var i in testInputs) {
          var results = scope.getFirstAndRestSentence(testInputs[i].str);
          expect(results[0]).toEqual(testInputs[i].exp);
        }
      });

      it('RoomId', function() {
        location.path('/new/path');

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location
        });

        expect(scope.roomId).toBe("new");
      });

      it('toTop Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });

        scope.toTop();
        expect(window.scrollX).toBe(0);
        expect(window.scrollY).toBe(0);
      });
      it('toTop Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
        scope.toTop();
        expect(window.scrollX).toBe(0);
        expect(window.scrollY).toBe(0);
      });

      it('addEcho', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        scope.$storage[abc]="";
        var abc = [];
        abc.push({"echo":0,"like": false});
        scope.addEcho(abc[0]);
        expect(abc[0].echo).toBe(1);
        expect(abc[0].like).toBe(true);
      });
      it('addEcho', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        scope.$storage[abc]="echoed";
        var abc = [];
        abc.push({"echo":2,"like": true});
        scope.addEcho(abc[0]);
        expect(abc[0].echo).toBe(1);
        expect(abc[0].like).toBe(false);
      });
      it('addEcho', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        scope.$storage[abc]="d_echoed";
        var abc = [];
        abc.push({"echo":2,"like": false});
        scope.addEcho(abc[0]);
        expect(abc[0].echo).toBe(2);
        expect(abc[0].like).toBe(false);
      });

            it('minusEcho', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        scope.$storage[abc]="d_echoed";
        var abc = [];
        abc.push({"d_echo":2,"dislike": true});
        scope.minusEcho(abc[0]);
        expect(abc[0].d_echo).toBe(1);
        expect(abc[0].dislike).toBe(false);
      });
            it('minusEcho', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        scope.$storage[abc]="echoed";
        var abc = [];
        abc.push({"d_echo":2,"dislike": false});
        scope.minusEcho(abc[0]);
        expect(abc[0].d_echo).toBe(2);
        expect(abc[0].dislike).toBe(false);
      });
            it('minusEcho', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        scope.$storage[abc]="";
        var abc = [];
        abc.push({"d_echo":2,"dislike": false});
        scope.minusEcho(abc[0]);
        expect(abc[0].d_echo).toBe(3);
        expect(abc[0].dislike).toBe(true);
      });
            it('showLike', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        var no1=10;
        var no2=20;

        scope.$storage[10]="echoed";
        scope.$storage[20]="something";
        expect(scope.showLike(no1)).toBe(true);
        expect(scope.showLike(no2)).toBe(false);

      });

            it('showDislike', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        var no1=10;
        var no2=20;

        scope.$storage[10]="d_echoed";
        scope.$storage[20]="something";
        expect(scope.showDislike(no1)).toBe(true);
        expect(scope.showDislike(no2)).toBe(false);

      });
            it('editTodo', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        var abc = 10;
        scope.editTodo(abc);
        expect(scope.editedTodo).toBe(10);

      });
            it('doneEditing', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        //  scope.todos = [];
        var abc = [];
        abc.push({"wholeMsg":"test"});
        scope.doneEditing(abc[0]);
        expect(scope.todos.$save(abc[0]));

      });
            it('doneEditing', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        //  scope.todos = [];
        var abc = [];
        abc.push({"wholeMsg":""});
        scope.doneEditing(abc[0]);
        expect(scope.removeTodo(abc[0]));

      });
             it('revertEditing', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        
        var abc = [];
        abc.push({"wholeMsg":"test"});
        scope.originalTodo = {wholeMsg: "revert"};
        scope.revertEditing(abc[0]);
        expect(abc[0].wholeMsg).toBe("revert");

      });
             it('clearCompletedTodos', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        
        var abc = [];
        abc.push({ "completed": true, "dateString": "", "desc": "", "echo": 1, "head": "test", "headLastChar": "t", "linkedDesc": "", "new": false, "order": -1, "timestamp": 1442673711706, "trustedDesc": "", "wholeMsg": "test", "$id": "-Jza2SbF6TLvuS9vq90t", "$priority": null, "tags": null, "$$hashKey": "object:6" });
        scope.todos.push(abc[0]);
        scope.originalTodo = {wholeMsg:"sample input"};
        scope.clearCompletedTodos(abc[0]);
        expect(scope.removeTodo(abc[0])).toBe();

      });
             it('toggleCompleted', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        
        var abc = [];
        abc.push({"completed":true});
        scope.toggleCompleted(abc[0]);
        expect(abc[0].completed).toBe(false);

      });


      it('thisIsMine', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        var op1 = "name";
        var op2 = "abc";
        scope.userName = "name";
        expect(scope.thisIsMine(op1)).toBe("2px solid #49C7C3");
        expect(scope.thisIsMine(op2)).toBe("none");
      });
      it('FBLogin', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        scope.noFB = true;
        var abc = [];
        abc.push({"isAdmin": false});
        scope.FBLogin(abc[0]);
        expect(abc[0].isAdmin).toBe(false);
      });
      it('FBLogout', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        scope.noFB = true;
        var abc = [];
        abc.push({"isAdmin": false});
        scope.FBLogout(abc[0]);
        expect(abc[0].isAdmin).toBe(false);
      });
      it('FBLogout', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        scope.noFB = false;
        var abc = [];
        abc.push({"isAdmin": false});
        scope.FBLogout(abc[0]);
        expect(abc[0].isAdmin).toBe(false);
      });

      it('increaseMax', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        scope.maxQuestion = 10;
        scope.totalCount = 1;
        scope.increaseMax();
        expect(scope.maxQuestion).toBe(10);

      });
      it('increaseMax', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        scope.maxQuestion = 10;
        scope.totalCount = 11;
        scope.increaseMax();
        expect(scope.maxQuestion).toBe(20);

      });
      it('addTodo', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });

        scope.input = {wholeMsg:"sample input"};
        scope.addTodo();
        scope.input = {wholeMsg:""};
        scope.addTodo();
        expect(scope.todos.length).toBe(0);      
      });      
      it('tagToMsg', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });

        scope.input = {wholeMsg:"sample input"};
        var tag = "#123";
        scope.tagToMsg(tag);
        expect(scope.input.wholeMsg).toBe("sample input #123");
      });       
      it('tagToMsg', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });

        scope.input = {wholeMsg:""};
        var tag = "#123";
        scope.tagToMsg(tag);
        expect(scope.input.wholeMsg).toBe("#123");
      });
            it('tagToMsg', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });

        scope.input = {wholeMsg:1111};
        var tag = "#123";
        scope.tagToMsg(tag);
        expect(scope.input.wholeMsg).toBe("#123");
      });
      it('changeOrder', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });
        var pre = '';
        scope.changeOrder(pre);
        expect(scope.predicate).toBe('');

      });
      it('changeOrder', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });
        var pre = '123';
        scope.changeOrder(pre);
        expect(scope.predicate).toBe('123');

      });
      it('signUp', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });
        scope.userName = "";
        expect(scope.signUp()).toBe(true);

      });
      it('signUp', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });
        scope.userName = "leo";
        expect(scope.signUp()).toBe(false);

      });
      it('signOut', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });
        scope.userName = "leo";
        expect(scope.signOut()).toBe(true);
        expect(scope.userName).toBe("");

      });

      it('watchCollection', function() {
        var ctrl = controller('TodoCtrl', {
          $scope: scope,
        });
        var todoText = [];
        todoText.push({ "completed": false, "dateString": "", "desc": "", "echo": 1, "head": "test", "headLastChar": "t", "linkedDesc": "", "new": false, "order": -1, "timestamp": 1442673711706, "trustedDesc": "", "wholeMsg": "test", "$id": "-Jza2SbF6TLvuS9vq90t", "$priority": null, "tags": null, "$$hashKey": "object:6" });
        todoText.push({ "completed": true, "dateString": "", "desc": "", "echo": 1, "head": "test", "headLastChar": "t", "linkedDesc": "", "new": false, "order": -1, "timestamp": 1442673711706, "trustedDesc": "", "wholeMsg": "test", "$id": "-Jza2SbF6TLvuS9vq90t", "$priority": null, "tags": null, "$$hashKey": "object:6" });
        todoText.push({completed: false,dataString: '',desc: 'This is david not sung',echo: 0,head: 'hello!',headLastChar: '?', linkedDesc: 'This is david not sung',new: false,order: '0',timestamp: '1442591162593',wholeMsg: ''});
        scope.todos = [];
        scope.todos.push(todoText[0]);
        scope.todos.push(todoText[1]);
        scope.todos.push(todoText[2]);
        scope.todos.push({});
        scope.$apply();
        expect(scope.todos[0].dateString).not.toBe();
        expect(scope.todos[1].dateString).not.toBe();
        expect(scope.todos[2].dateString).not.toBe();
        expect(scope.totalCount).toBe(3);
        expect(scope.remainingCount).toBe(2);
      });

      it('clearMsg', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });
        scope.clearMsg();
        expect(scope.input.wholeMsg).toBe("");

      });
      it('addComment', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });
        var form = [];
        form.push({"msg": "test"});
        var todo = [];

        scope.addComment(form, todo);
        expect(scope.editedTodo).toBe(todo);

      });
    it('markAll', function() {
        var ctrl = controller('TodoCtrl', {
          $scope: scope,
      $firebaseArray: firebaseArray
        });   
    var todoText = [];
    todoText.push({ "completed": false, "dateString": "Sat Sep 19 2015 22:41:51 GMT+0800 (China Standard Time)", "desc": "", "echo": 1, "head": "test", "headLastChar": "t", "linkedDesc": "", "new": false, "order": -1, "timestamp": 1442673711706, "trustedDesc": "", "wholeMsg": "", "$id": "-Jza2SbF6TLvuS9vq90t", "$priority": null, "tags": null, "$$hashKey": "object:6" });
    todoText.push({ "completed": true, "dateString": "Sat Sep 19 2015 22:41:51 GMT+0800 (China Standard Time)", "desc": "", "echo": 1, "head": "test", "headLastChar": "t", "linkedDesc": "", "new": false, "order": -1, "timestamp": 1442673711706, "trustedDesc": "", "wholeMsg": "12345", "$id": "-Jza2SbF6TLvuS9vq90t", "$priority": null, "tags": null, "$$hashKey": "object:6" });
    todoText.push({"completed": true,"dataString": 'Fri Sep 18 2015 23:46:02 GMT+0800 (China Standard Time)',"desc": 'This is david not sung',"echo": 0,"head": 'hello!',"headLastChar": '?', "linkedDesc": 'This is david not sung',"new": false,"order": '0',"timestamp": '1442591162593',"wholeMsg": '', "$id": "-Jza2SbF6TLvuS9vq90t", "$priority": null, "tags": null, "$$hashKey": "object:6"});
    var ref = new Firebase("https://sizzling-fire-8382.firebaseio.com/all/questions/");
    scope.todos = firebaseArray(ref);
    scope.todos.push(todoText[0]);
    scope.todos.push(todoText[1]);
    scope.todos.push(todoText[2]);
    scope.markAll(true);
    expect(todoText[0].completed).toBe(true);
    expect(todoText[1].completed).toBe(true);
    expect(todoText[2].completed).toBe(true);
    expect(scope.todos[0].completed).toBe(true);
    expect(scope.todos[1].completed).toBe(true);
    expect(scope.todos[2].completed).toBe(true);
    scope.markAll(false);
    expect(todoText[0].completed).toBe(false);
    expect(todoText[1].completed).toBe(false);
    expect(todoText[2].completed).toBe(false);
    expect(scope.todos[0].completed).toBe(false);
    expect(scope.todos[1].completed).toBe(false);
    expect(scope.todos[2].completed).toBe(false);
    });
    it('autoScroll true', function() {
        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $window: window
        });
    window.innerHeight = 100;
    window.scrollY = 100;
    spyOn(scope,"increaseMax");
    window.document.body.scrollBottom = 1000;
    var e = document.createEvent("UIEvents");
    e.initUIEvent("scroll", true, true, window, 1);
    window.document.body.dispatchEvent(e);
    expect(scope.increaseMax).toHaveBeenCalled();
      });
    
    it('autoScroll false', function() {
        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $window: window
        });
    window.innerHeight = 10;
    window.scrollY = -11;
    spyOn(scope,"increaseMax");
    window.document.body.scrollTop = 10;
    var e = document.createEvent("UIEvents");
    e.initUIEvent("scroll", true, true, window, 1);
    window.document.body.dispatchEvent(e);
    expect(scope.increaseMax).not.toHaveBeenCalled();
      });

      it('hotTagToMsg', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });

        scope.input = {wholeMsg:"sample input"};
        
        var id = 100;
      
        scope.hotTagToMsg(id);
        expect(scope.input.wholeMsg).toBe("sample input #");
      });
      it('hotTagToMsg', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });

        scope.input = {wholeMsg:""};
        
        var id = 100;
      
        scope.hotTagToMsg(id);
        expect(scope.input.wholeMsg).toBe("#");
      });                    
      it('hotTagToMsg', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });

        scope.input = {wholeMsg:100};
        
        var id = 100;
      
        scope.hotTagToMsg(id);
        expect(scope.input.wholeMsg).toBe("#");
      });
      it('imgToMsg', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });

        scope.input = {wholeMsg:"hi"};
        var tag = "123";
        scope.imgToMsg(tag);
        expect(scope.input.wholeMsg).toBe("hi"+"\n"+"http://52.88.196.231/chat/uploads/123");
      });
      it('imgToMsg', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });

        scope.input = {wholeMsg:""};
        var tag = "123";
        scope.imgToMsg(tag);
        expect(scope.input.wholeMsg).toBe("img upload"+"\n"+"http://52.88.196.231/chat/uploads/123");
      });
      it('imgToMsg', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });

        scope.input = {wholeMsg:100};
        var tag = "123";
        scope.imgToMsg(tag);
        expect(scope.input.wholeMsg).toBe("img upload"+"\n"+"http://52.88.196.231/chat/uploads/123");
      });
      it('btnImageUpload', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });
        scope.imgUpload = true;
        scope.btnImgUpload();
        expect(scope.imgUpload).toBe(false);

      });
      it('btnImgUpload', function() {
        var crtl = controller ('TodoCtrl', {
          $scope:scope,
        });
        scope.imgUpload = false;
        scope.btnImgUpload();
        expect(scope.imgUpload).toBe(true);

      });
      it('parse', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        var desc = false;
        expect(scope.parse(desc)).toBe(false);
      });
      it('parse', function(){
        var crtl = controller ('TodoCtrl',{
          $scope:scope,
        });
        var desc = "test"
        var result = scope.parse(desc);
        expect(scope.parse(desc)).toBe(result);
      });      
                                            
    });
  });
