var home_page= angular.module('contactpage',[]);
home_page.controller('contactController', function($scope, $http,$window) {
    var url=window.location.href;

    var userName=(url.substr(url.indexOf("?")+1)).replace("%20"," ");
    console.log(userName);
    $scope.uname=userName;

    $scope.GoProfile= function () {
        $window.location.href="profilepage.html?"+$scope.uname;
    }
    $scope.GoHome= function () {
        $window.location.href="Homepage.html?"+$scope.uname;
    }
    $scope.GoSettings=function(){
        $window.location.href="AccountSettings.html?"+$scope.uname;
    }
})