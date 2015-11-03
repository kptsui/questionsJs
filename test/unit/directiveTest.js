'use strict';
describe('TodoCtrl', function() {
  beforeEach(module('todomvc'));
  // variables for injection
  var scope;
  var compile;
  var browser;
  // Injecting variables
  // http://stackoverflow.com/questions/13664144/how-to-unit-test-angularjs-controller-with-location-service
  beforeEach(inject(function($location,
    $rootScope,
	$compile,
	$browser){
      scope = $rootScope.$new();
	  compile = $compile;
	  browser = $browser;
    }));
    describe('directive Testing', function() {
		it('esc test', function () {
			var el = angular.element('<input todo-blur="true">');
			compile(el)(scope);;
			spyOn(scope,'$apply');
			el.triggerHandler({	type: 'keydown',keyCode: 27	});
			expect(scope.$apply).toHaveBeenCalled();
		});
		
		it('not esc test', function () {
			var el = angular.element('<input todo-blur="true">');
			compile(el)(scope);;
			spyOn(scope,'$apply');
			el.triggerHandler({	type: 'keydown',keyCode: 28	});
			expect(scope.$apply).not.toHaveBeenCalled();
			el.triggerHandler({	type: 'blur',});
		});	

		it('blue and destroy test', function () {
			var el = angular.element('<input todo-blur="true">');
			compile(el)(scope);;
			spyOn(scope,'$apply');
			el.triggerHandler({	type: 'blur',});
			expect(scope.$apply).toHaveBeenCalled();
			scope.$destroy();
		});	
		
		it('focus test', function () {
			var el = angular.element('<input todo-focus="focus">');
			compile(el)(scope);
			scope.$apply(function () {
				scope.focus = true;
			});
			expect(browser.deferredFns.length).toBe(1);
			scope.$apply(function () {
				scope.focus = false;
			});
			expect(browser.deferredFns.length).toBe(1);
		});
	});	
});

  