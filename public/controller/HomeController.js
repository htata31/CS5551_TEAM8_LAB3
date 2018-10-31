var home_page= angular.module('homepage',[]);
home_page.controller('homeController', function($scope, $http,$window) {
    var url=window.location.href;
    var userName=(url.substr(url.indexOf("?")+1)).replace("%20"," ");
    console.log(userName);
    $scope.uname=userName;

    $scope.GoProfile= function () {
        $window.location.href="profilepage.html?"+$scope.uname;
    }
    $scope.GoContact= function () {
        $window.location.href="contact.html?"+$scope.uname;
    }
    $scope.GoSettings=function(){
        $window.location.href="AccountSettings.html?"+$scope.uname;
    }
    var url=window.location.href;
    var userName=(url.substr(45)).replace("%20"," ");

    if(userName.indexOf("place")==0) {
        console.log("ngular i am here");
        $scope.searchDestination=(url.substr(50,url.indexOf("&&")-50)).replace("%20"," ");
    }


    $scope.viewDirections = function() {
        $window.location.href = 'directions.html?'+$scope.searchDestination+'&&'+(document.getElementById("interest").value).toLowerCase();
    };


    $scope.getSearchResult = function() {
        $scope.placesArray =[];
        $scope.reviews=[];
        $scope.placeRatings=[];
        $scope.weekdayHours=[];
        $scope.placeids=[];
        $scope.placeNames=[];
        $scope.searchDescription=[];

        //Getting the interest field value if the user doesn't select anything no interest is passed to the api request.
        var value=(document.getElementById("interest").value).toLowerCase();

        var interestValue='';

        var alpha= new RegExp('.*\\d.*');
        if ((alpha.test($scope.searchDestination)) && ($scope.searchDestination)) { // not email
            $scope.finalErr = '              Numbers are not allowed in Destination';
        }
        else
        {
            $scope.finalErr = '';
        }

        //Here the code is written to get the places of particular destination with.without interest.
        //From the output of url request we take the placeid,name,address and rating
        //we will do the places sort on basis of rating
        console.log($scope.interest);
        $http.get('http://127.0.0.1:8080/getAPIData?searchkey='+$scope.searchDestination+'**'+$scope.interest).success(function(data)
        {

            console.log('Start');
            console.log(data);
            var photoReference='';
            if(data!=null) {
                console.log('hiiiii');
                console.log(data);
                console.log('byee');
                $scope.listheader = "Here are the places of the searched destination and priority";
                // try {
                var results = data.results.sort((a, b) => a.rating - b.rating);
                console.log(results);
                results.reverse();
                console.log(results.reverse());

                var length = data.results.length;

                for (var j = 0; j < length; j++) {
                    if(results[j].photos !=null) {
                        photoReference = results[j].photos[0].photo_reference;
                        console.log(photoReference);
                    }
                    else
                    {
                        photoReference="";
                    }

                    $scope.addressHeader = "Address :- ";
                    $scope.nameHeader = "Place Name :- ";
                    $scope.ratingHeader = "Rating :-";
                    $scope.description = "Description :-";

                    $scope.placeids.push(results[j].rating + "###" + results[j].place_id);

                    var image = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=" + photoReference + "&key=AIzaSyAk8FdCcWPekxegcpFkUAL5frrMc73F-4E";
                    $scope.placeRatings.push(results[j].rating);
                    console.log($scope.placeRatings);
                    var appendedstring = results[j].rating + "###" + results[j].formatted_address + "***" + results[j].name + "^^^" + image;
                    $scope.placesArray.push(appendedstring);
                    $scope.placeNames.push(results[j].name);
                    console.log($scope.placeNames);
                }
            }
        })
    }
})
