'use strict';

angular.module('myApp.login', ['ngRoute', 'ui.bootstrap'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'login'
        });
    }])

    .controller('login', function view1Controller($scope, $http, $location) {

        $scope.email = ''
        $scope.password = ''


        $scope.login = function () {
            $http({
                method: 'POST',
                url: "http://localhost:3000/api/auth/login",
                data: {
                    email: $scope.email,
                    password: $scope.password
                },
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            })
                .then(res => {
                    $location.path('/album')
                }).catch(res => {
                    alert('Process Error')
                })
        }

    });