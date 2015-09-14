// 
// Here is how to define your module 
// has dependent on mobile-angular-ui
// 
var app = angular.module('myApp', [
    'ngRoute',
    'mobile-angular-ui',

    // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'
    // it is at a very beginning stage, so please be careful if you like to use
    // in production. This is intended to provide a flexible, integrated and and
    // easy to use alternative to other 3rd party libs like hammer.js, with the
    // final pourpose to integrate gestures into default ui interactions like
    // opening sidebars, turning switches on/off ..
    'mobile-angular-ui.gestures'
]);

app.run(function ($transform) {
    window.$transform = $transform;
});

// 
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false' 
// in order to avoid unwanted routing.
// 
app.config(function ($routeProvider) {
    $routeProvider.when('/', {templateUrl: '../pages/home.html', reloadOnSearch: false});
    $routeProvider.when('/scroll', {templateUrl: '../pages/scroll.html', reloadOnSearch: false});
    $routeProvider.when('/toggle', {templateUrl: '../pages/toggle.html', reloadOnSearch: false});
    $routeProvider.when('/tabs', {templateUrl: '../pages/tabs.html', reloadOnSearch: false});
    $routeProvider.when('/accordion', {templateUrl: '../pages/accordion.html', reloadOnSearch: false});
    $routeProvider.when('/overlay', {templateUrl: '../pages/overlay.html', reloadOnSearch: false});
    $routeProvider.when('/forms', {templateUrl: '../pages/forms.html', reloadOnSearch: false});
    $routeProvider.when('/dropdown', {templateUrl: '../pages/dropdown.html', reloadOnSearch: false});
    $routeProvider.when('/touch', {templateUrl: '../pages/touch.html', reloadOnSearch: false});
    $routeProvider.when('/swipe', {templateUrl: '../pages/swipe.html', reloadOnSearch: false});
    $routeProvider.when('/drag', {templateUrl: '../pages/drag.html', reloadOnSearch: false});
    $routeProvider.when('/drag2', {templateUrl: '../pages/drag2.html', reloadOnSearch: false});
});

// 
// `$touch example`
// 

app.directive('toucharea', ['$touch', function ($touch) {
    // Runs during compile
    return {
        restrict: 'C',
        link: function ($scope, elem) {
            $scope.touch = null;
            $touch.bind(elem, {
                start: function (touch) {
                    $scope.touch = touch;
                    $scope.$apply();
                },

                cancel: function (touch) {
                    $scope.touch = touch;
                    $scope.$apply();
                },

                move: function (touch) {
                    $scope.touch = touch;
                    $scope.$apply();
                },

                end: function (touch) {
                    $scope.touch = touch;
                    $scope.$apply();
                }
            });
        }
    };
}]);

//
// `$drag` example: drag to dismiss
//
app.directive('dragToDismiss', function ($drag, $parse, $timeout) {
    return {
        restrict: 'A',
        compile: function (elem, attrs) {
            var dismissFn = $parse(attrs.dragToDismiss);
            return function (scope, elem) {
                var dismiss = false;

                $drag.bind(elem, {
                    transform: $drag.TRANSLATE_RIGHT,
                    move: function (drag) {
                        if (drag.distanceX >= drag.rect.width / 4) {
                            dismiss = true;
                            elem.addClass('dismiss');
                        } else {
                            dismiss = false;
                            elem.removeClass('dismiss');
                        }
                    },
                    cancel: function () {
                        elem.removeClass('dismiss');
                    },
                    end: function (drag) {
                        if (dismiss) {
                            elem.addClass('dismitted');
                            $timeout(function () {
                                scope.$apply(function () {
                                    dismissFn(scope);
                                });
                            }, 300);
                        } else {
                            drag.reset();
                        }
                    }
                });
            };
        }
    };
});


app.directive('dragMe', ['$drag', function ($drag) {
    return {
        controller: function ($scope, $element) {
            $drag.bind($element,
                {
                    //
                    // Here you can see how to limit movement
                    // to an element
                    //
                    transform: $drag.TRANSLATE_INSIDE($element.parent()),
                    end: function (drag) {
                        // go back to initial position
                        drag.reset();
                    }
                },
                { // release touch when movement is outside bounduaries
                    sensitiveArea: $element.parent()
                }
            );
        }
    };
}]);

//
// For this trivial demo we have just a unique MainController 
// for everything
//
app.controller('MainController', function ($rootScope, $scope) {

    $scope.swiped = function (direction) {
        alert('Swiped ' + direction);
    };

    // User agent displayed in home page
    $scope.userAgent = navigator.userAgent;

    // Needed for the loading screen
    $rootScope.$on('$routeChangeStart', function () {
        $rootScope.loading = true;
    });

    $rootScope.$on('$routeChangeSuccess', function () {
        $rootScope.loading = false;
    });

    // Fake text i used here and there.
    $scope.lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel explicabo, aliquid eaque soluta nihil eligendi adipisci error, illum corrupti nam fuga omnis quod quaerat mollitia expedita impedit dolores ipsam. Obcaecati.';

    //
    // 'Scroll' screen
    //
    var scrollItems = [];

    for (var i = 1; i <= 100; i++) {
        scrollItems.push('Item ' + i);
    }

    $scope.scrollItems = scrollItems;

    $scope.bottomReached = function () {
        /* global alert: false; */
        alert('Congrats you scrolled to the end of the list!');
    };

    //
    // 'Forms' screen
    //
    $scope.rememberMe = true;
    $scope.email = 'me@example.com';
    $scope.loggedIn = false;

    $scope.logIn = function() {
        $scope.loggedIn = true;
    }

    $scope.logOut = function() {
        $scope.loggedIn = false;
    }

    $scope.login = function () {
        alert('You submitted the login form');
    };

    //
    // 'Drag' screen
    //
    $scope.notices = [];

    for (var j = 0; j < 10; j++) {
        $scope.notices.push({icon: 'envelope', message: 'Notice ' + (j + 1)});
    }

    $scope.deleteNotice = function (notice) {
        var index = $scope.notices.indexOf(notice);
        if (index > -1) {
            $scope.notices.splice(index, 1);
        }
    };
});