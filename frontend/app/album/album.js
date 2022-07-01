'use strict';

angular.module('myApp.album', ['ngRoute', 'ui.bootstrap'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/album', {
      templateUrl: 'album/album.html',
      controller: 'album'
    });
  }])

  .controller('album', function view1Controller($scope, $log, $http) {

    $scope.totalItems = 0;
    $scope.currentPage = 1;

    $scope.pageChanged = function () {
      $http({
        method: 'GET',
        url: "http://localhost:3000/api/photos/album",
        params: {
          currentPage: $scope.currentPage
        },
        headers: { "Content-Type": "application/json" }
      })
        .then(res => {
          $scope.albumArr = res.data.data
          $scope.totalItems = res.data.total
        }).catch(res => {
          alert('Process Error')
        })
    };
    $scope.albumArr = [];

    $http({
      method: 'GET',
      url: "http://localhost:3000/api/photos/album",
      params: {
        currentPage: $scope.currentPage
      },
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        $scope.albumArr = res.data.data
        $scope.totalItems = res.data.total
      }).catch(res => {
        alert('Process Error')
      })

  });