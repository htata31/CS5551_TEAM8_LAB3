app.controller('loginAppcontroller', function($scope, $http,$window) {
    console.log("hi");
    $scope.SignUp = function() {

        var username=$scope.username;
        var pwd=$scope.password;
        var repwd=$scope.repassword;
        var email=$scope.email;
        var securityans=$scope.securityanswer;

        var dataParams = {
            'username' : $scope.username,
            'password' : $scope.password,
            'email' : $scope.email
        };

        $http.get('http://127.0.0.1:8080/getData?keywords='+$scope.username).then(function(d)
            {
                console.log("Len is "+d.data.length);
                console.log("val "+JSON.stringify({d: d}));
                if(d.data.length!=0) {
                    console.log("it is " + d.data[0].username);
                    var eamilAdd = d.data[0].username;
                    if (eamilAdd != "")
                    {
                        $scope.finalErr = ' User Name Already Exists';
                        console.log("User Name Already Exists");
                    }
                }
                else
                {
                    var req = $http.post('http://127.0.0.1:8080/enroll', dataParams);
                    req.success(function (data, status, headers, config) {
                        $scope.message = data;
                        console.log("here " + data);
                        $scope.finalMsg = "Registration Successful";
                        $window.location.href = 'LoginPage.html';
                    });
                    req.error(function (data, status, headers, config) {
                        // alert( "failure message: " + JSON.stringify({data: data}));
                        console.log("failure message: " + JSON.stringify({data: data}));
                    });
                }
            },function(err)
            {
                console.log(err);
            }
        )


    }

    $scope.SignIn = function(){
        console.log($scope.uname);
        $scope.finalErr = "";

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
        x=true;
        if (!($scope.uname) || !($scope.pwd) )
        {
            $scope.finalErr = 'Mandatory columns should be entered';
            x=false;
            console.log("In mandatory error");
        }
        else {


            $http.get('http://127.0.0.1:8080/getData?keywords=' + $scope.uname).then(function (d) {
                    console.log(typeof(d));
                    console.log("length is " + d.data.length);
                    if (d.data.length != 0) {
                        var document = [];
                        for (i = 0; i < d.data.length; i++) {
                            if (d.data[i].password == $scope.pwd) {
                                console.log("matched");
                                $window.location.href = 'html/Homepage.html?' + d.data[i].username;
                            }
                            else {
                                $scope.finalErr = "Please enter valid user name and password";
                                console.log("Not matched");
                            }
                            document.push(new Array(d.data[i].username + '-' + d.data[i].password));
                        }
                        console.log("document is " + document);
                    }
                    else {
                        $scope.finalErr = "Username is not available";
                        console.log("Username is not available");
                    }
                }, function (err) {
                    console.log(err);
                }
            )
            }
    };
})