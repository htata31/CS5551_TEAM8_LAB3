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

        $http.get('http://127.0.0.1:8080/getDataRegister?keywords='+$scope.email+'**'+$scope.username).then(function(d)
            {
                console.log("Len is "+d.data.length);
                console.log("val "+JSON.stringify({d: d}));
                if(d.data.length!=0) {
                    console.log("it is " + d.data[0].email);
                    var u_name = d.data[0].username;
                    var email=d.data[0].email;
                    if (email == $scope.email &&  u_name==$scope.username)
                    {
                        $scope.finalErr = ' User Name and email Already Exists';
                        //console.log("User Name Already Exists");
                    }
                    else if(email == $scope.email)
                    {
                        $scope.finalErr = 'email Already Exists';
                    }
                    else if(u_name==$scope.username)
                    {
                        $scope.finalErr = 'username Already Exists';
                    }
                }
                else
                {
                    var req = $http.post('http://127.0.0.1:8080/enroll', dataParams);
                    req.success(function (data, status, headers, config) {
                        $scope.message = data;
                        console.log("here " + data);
                        $scope.finalErr="";
                        $scope.finalMsg = "Registration Successful";
                        $window.location.href = 'LoginPage.html?'+$scope.username;
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


            $http.get('http://127.0.0.1:8080/getDataSignIn?keywords=' + $scope.uname).then(function (d) {
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
                                $scope.signInErr = "Please enter valid user name and password";
                                console.log("Not matched");
                            }
                            document.push(new Array(d.data[i].username + '-' + d.data[i].password));
                        }
                        console.log("document is " + document);
                    }
                    else {
                        $scope.signInErr = "Username is not available";
                        console.log("Username is not available");
                    }
                }, function (err) {
                    console.log(err);
                }
            )
            }
    };


    $scope.closepopup = function() {
        ClearField();
        }
    function ClearField()
    {
        document.getElementById('modal-wrapper').style.display='none';
        $scope.username="";
        $scope.password="";
        $scope.email="";
        $scope.repassword="";
        $scope.policycheck="";
        checkbox.checked=false;
    }
})