/**
 * Created by jiaweizhang95 on 9/14/15.
 */
var app = angular.module('myApp', [
    "ngRoute",
    "mobile-angular-ui",
])
app.config(function ($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'mobile-angular-ui/demo/home.html'
        }).
        when('/scroll', {
            templateUrl: 'mobile-angular-ui/demo/scroll.html'
        })
    // ...
});