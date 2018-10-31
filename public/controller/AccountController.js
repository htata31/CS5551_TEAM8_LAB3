var profile_page= angular.module('account',[]);
profile_page.controller('AccountController', function($scope, $http,$window) {
    var url = window.location.href;

    var userName = (url.substr(url.indexOf("?") + 1)).replace("%20", " ");
    console.log(userName);
    $scope.uname = userName;

    $scope.GoContact = function () {
        $window.location.href = "contact.html?" + $scope.uname;
    }
    $scope.GoHome = function () {
        $window.location.href = "Homepage.html?" + $scope.uname;
    }
    $scope.GoProfile= function () {
        $window.location.href="profilepage.html?"+$scope.uname;
    }

    $scope.Delete=function(){
        $http.post('http://127.0.0.1:8080/delete?keywords='+$scope.uname).then(function (d)
            {
                console.log(d);
                $window.location.href="../LoginPage.html";

            }, function (err) {
                console.log(err);
            }
        )
    }


})