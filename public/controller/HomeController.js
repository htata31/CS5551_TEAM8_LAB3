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

                //$scope.placesArray.sort();
                // }
                // catch (err) {
                //     console.log("error..................");
                // }
            }
        })



        //Here we are requesting for a particular place details with the help of place id's
        //First we are going to sort the place ids
        //since requests can take time in above function so kept a waiting time to this logic
        //After getting the output we will get the the following fields i.e reviews and weekly hours
        setTimeout(function ()
        {
            try{
                for( var z=0;z<$scope.placeids.length;z++)
                {
                    var placeId=$scope.placeids[z].substring($scope.placeids[z].indexOf("###")+3,$scope.placeids[z].length);
                    var place_Name=$scope.placeNames[z];
                    //console.log(place_Name);

                    $http.get("https://kgsearch.googleapis.com/v1/entities:search?query="+place_Name+"&key=AIzaSyCZbMz2VUDfsNIawl7W9W64FpZp8gsoh10&limit=1&indent=True").success(function(descriptiondata)
                    {
                        try {
                            console.log(descriptiondata);

                            var description=descriptiondata.itemListElement[0].result.detailedDescription.articleBody;
                            $scope.searchDescription.push(description);
                            //console.log($scope.searchDescription);
                        }
                        catch(err){
                        }
                    })

                    $http.get("https://maps.googleapis.com/maps/api/place/details/json?placeid="+placeId+"&key=AIzaSyAk8FdCcWPekxegcpFkUAL5frrMc73F-4E").then(function(placedata)
                    {
                        $scope.weekdayHours_week=[];
                        var documents=[];

                        //     for(var i=0;i<1;i++) {

                        $scope.reviewHeader = "Reviews";

                        $scope.author_name_header = "Author Name :- ";
                        $scope.reviewtime_header = "Time of review :- ";
                        $scope.comment_header = "Comment :-";
                        $scope.user_rating_header = "User Rating :- ";

                        if(placedata.data.result.reviews !=null) {
                            $scope.author_Name = placedata.data.result.reviews[0].author_name;
                            $scope.reviewtime = placedata.data.result.reviews[0].relative_time_description;
                            $scope.comment = placedata.data.result.reviews[0].text;
                            $scope.user_rating = placedata.data.result.reviews[0].rating;


                            documents.push($scope.author_Name + '@@' + $scope.reviewtime + '##' + $scope.comment + '$$' + $scope.user_rating);

                            // }
                            $scope.reviews.push($scope.author_Name + '@@' + $scope.reviewtime + '##' + $scope.comment + '$$' + $scope.user_rating);
                        }
                        //console.log($scope.author_Name + '@@' + $scope.reviewtime + '##' + $scope.comment + '$$'+$scope.user_rating);


                        // for(var x=0;x<documents.length;x++) {
                        //     $scope.reviews.push((documents[x]).toString());
                        // }


                        $scope.weeklyhoursheader = "Weeekly Hours";
                        for (var k = 0; k < 7; k++) {
                            try {
                                var weekday_timings = placedata.data.result.opening_hours.weekday_text[k];
                                $scope.weekdayHours_week.push(weekday_timings);
                            }
                            catch (e) {
                                $scope.weekdayHours_week.push("All Working Days");
                                break;

                            }
                        }
                        $scope.weekdayHours.push($scope.weekdayHours_week);
                    })

                }
            }
            catch (e) {

            }
        }, 1000);
    }
})
