'use strict';

angular.module('myApp.photos', ['ngRoute', 'ngCookies'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/album/:albumId', {
      templateUrl: 'photos/photos.html',
      controller: 'photosController'
    });
  }])

  .controller('deletePhotoController', function ($uibModalInstance) {
    var $ctrl = this;


    $ctrl.ok = function () {
      $uibModalInstance.close();
    };

    $ctrl.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  })

  .controller('movePhotoController', function ($uibModalInstance, albumId) {
    var $ctrl = this;

    $ctrl.albumId = albumId;

    $ctrl.ok = function () {
      $uibModalInstance.close({ albumId: $ctrl.albumId });
    };

    $ctrl.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  })

  .controller('editPhotoController', function ($uibModalInstance, title) {
    var $ctrl = this;

    $ctrl.title = title;

    $ctrl.ok = function () {
      $uibModalInstance.close({ title: $ctrl.title });
    };

    $ctrl.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  })

  .controller('addPhotoController', function ($uibModalInstance) {
    var $ctrl = this;

    $ctrl.title = '';
    $ctrl.thumbnailUrl = '';
    $ctrl.imageUrl = '';

    $ctrl.ok = function () {
      $uibModalInstance.close({ title: $ctrl.title, thumbnailUrl: $ctrl.thumbnailUrl, imageUrl: $ctrl.imageUrl });
    };

    $ctrl.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  })

  .controller('photosController', function ($scope, $http, $routeParams, $uibModal, $document, $cookies) {

    $scope.currentPage = 1;
    $scope.totalItems = 0;
    $scope.nameFilter = '';

    $scope.photosArr = [];

    $scope.deletePhotoModal = function (photoId) {
      let parentElem = angular.element($document[0].querySelector('.top-level '));
      let modalInstance = $uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'deletePhotoContent.html',
        controller: 'deletePhotoController',
        controllerAs: '$ctrl',
        appendTo: parentElem,
      })

      modalInstance.result.then(res => {
        $http({
          method: 'DELETE',
          url: "http://localhost:3000/api/photos",
          data: {
            id: photoId,
          },
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${$cookies.get('Authorization')}`
          },
          withCredentials: true,
        })
          .then(res => {
            $scope.pageChanged()
            alert('Data has been deleted')
          }).catch(res => {
            if (res.status === 401) {
              alert('Only Admin Can Delete')
            } else {
              alert('Process error')
            }

          })
      })
    }

    $scope.movePhotoModal = function (photoId, albumId) {
      let parentElem = angular.element($document[0].querySelector('.top-level '));
      let modalInstance = $uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'movePhotoContent.html',
        controller: 'movePhotoController',
        controllerAs: '$ctrl',
        appendTo: parentElem,
        resolve: {
          albumId: function () {
            return albumId
          }
        }
      })

      modalInstance.result.then(res => {
        $http({
          method: 'POST',
          url: "http://localhost:3000/api/photos/move",
          data: {
            id: photoId,
            albumId: res.albumId,
          },
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${$cookies.get('Authorization')}`
          },
        })
          .then(res => {
            $scope.pageChanged()
            alert('Data has been submitted')
          }).catch(res => {
            if (res.status === 401) {
              alert('Only Admin Can Move Photo')
            } else {
              alert('Process error')
            }
          })
      })
    }

    $scope.editPhotoModal = function (photoId, photoTitle) {
      let parentElem = angular.element($document[0].querySelector('.top-level '));
      let modalInstance = $uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'editPhotoContent.html',
        controller: 'editPhotoController',
        controllerAs: '$ctrl',
        appendTo: parentElem,
        resolve: {
          title: function () {
            return photoTitle
          }
        }
      })

      modalInstance.result.then(res => {
        $http({
          method: 'PUT',
          url: "http://localhost:3000/api/photos",
          data: {
            id: photoId,
            title: res.title,
          },
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${$cookies.get('Authorization')}`
          },
        })
          .then(res => {
            $scope.pageChanged()
            alert('Data has been submitted')
          }).catch(res => {
            if (res.status === 401) {
              alert('Only Admin Can Edit Photo')
            } else {
              alert('Process error')
            }
          })
      })
    }

    $scope.openAddPhotoModal = function () {
      let parentElem = angular.element($document[0].querySelector('.top-level '));
      let modalInstance = $uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'addPhotoContent.html',
        controller: 'addPhotoController',
        controllerAs: '$ctrl',
        appendTo: parentElem,
      })

      modalInstance.result.then(res => {
        $http({
          method: 'POST',
          url: "http://localhost:3000/api/photos",
          data: {
            albumId: $routeParams.albumId,
            title: res.title,
            thumbnailUrl: res.thumbnailUrl,
            url: res.imageUrl
          },
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${$cookies.get('Authorization')}`
          },
        })
          .then(res => {
            $scope.pageChanged()
            alert('Data has been submitted')
          }).catch(res => {
            if (res.status === 401) {
              alert('Only Admin Can Add Photo')
            } else {
              alert('Process error')
            }
          })
      })
    }

    $scope.pageChanged = function () {
      $http({
        method: 'GET',
        url: "http://localhost:3000/api/photos",
        params: {
          albumId: $routeParams.albumId,
          title: $scope.nameFilter,
          currentPage: $scope.currentPage
        },
        headers: { "Content-Type": "application/json" }
      })
        .then(res => {
          $scope.photosArr = res.data.data
          $scope.totalItems = res.data.total
        }).catch(res => {
          alert('Process Error')
        })
    };

    $scope.filterName = function () {
      $http({
        method: 'GET',
        url: "http://localhost:3000/api/photos",
        params: {
          albumId: $routeParams.albumId,
          title: $scope.nameFilter,
          currentPage: $scope.currentPage
        },
        headers: { "Content-Type": "application/json" }
      })
        .then(res => {
          $scope.photosArr = res.data.data
          $scope.totalItems = res.data.total
        }).catch(res => {
          alert('Process Error')
        })
    };

    $http({
      method: 'GET',
      url: "http://localhost:3000/api/photos",
      params: {
        albumId: $routeParams.albumId,
        currentPage: $scope.currentPage
      },
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        $scope.photosArr = res.data.data
        $scope.totalItems = res.data.total
      }).catch(res => {
        alert('Process Error')
      })

  });