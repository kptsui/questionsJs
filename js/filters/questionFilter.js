/*global todomvc, angular, Firebase */
'use strict';

/**
* The questionFilter
* Show the new questions on the top and show only max questions 
*
*/
todomvc.filter('questionFilter', function () {
  return function (input, max) {
    var sorted = [];
    var newQuestions = [];
    var sortedCount = 0;

    angular.forEach(input, function (todo) {
      if (todo.timestamp > new Date().getTime() - 180000) { // 3min
        todo.new = true;
		todo.bgColor = '#9CE79C';
		todo.textColor = '#000';
        newQuestions.push(todo);
      } else if (sortedCount++<=max){  // show top n only.
        todo.new = false;
		todo.bgColor = '#fff';
		todo.textColor = '#000';
        sorted.push(todo);
      }

      // sorting new questions based on the time if echo is the same.
      // Newer ones are on the top
      newQuestions.sort(function(a, b) {
        if (a.echo == b.echo) {
          return b.timestamp - a.timestamp;
        }
        return b.echo - b.d_echo - a.echo + a.d_echo;
      });
    });

    // Combined list
    return newQuestions.concat(sorted);
  };
});
