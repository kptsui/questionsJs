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


      });

       
    });
  });
