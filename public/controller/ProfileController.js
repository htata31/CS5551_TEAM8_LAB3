var profile_page= angular.module('Profile',[]);
profile_page.controller('ProfileController', function($scope, $http,$window) {
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
    $scope.GoSettings=function(){
        $window.location.href="AccountSettings.html?"+$scope.uname;
    }
    $scope.p_uname = userName;
    $scope.Update=function () {
        var dataParams = {
            'username': $scope.p_uname,
            'firstname': $scope.fname,
            'lastname':$scope.lname,
            'number': $scope.number
        };


        $http.post('http://127.0.0.1:8080/update', dataParams).then(function (d)
            {
                console.log(typeof(d));
                console.log("length is " + d.data.length);

            }, function (err) {
                console.log(err);
            }
        )

    }


})