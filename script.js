var INSTA_API_BASE_URL = "https://api.instagram.com/v1";
var app = angular.module('Instamood',[]);

app.controller('MainCtrl', function($scope, $http) {
  // get the access token if it exists
	$scope.hasToken = true;
	var token = window.location.hash;
	console.log(token);
  if (!token) {
    $scope.hasToken = false;
  }
  token = token.split("=")[1];

  $scope.getInstaPics = function() {
	  var path = "/users/self/media/recent";
	  var mediaUrl = INSTA_API_BASE_URL + path;
	  $http({
	    method: "JSONP",
	    url: mediaUrl,
	    params: {
	    	callback: "JSON_CALLBACK",
        	access_token: "231679130.f42855a.07ecdef8db0442d5986fa4a9b6bea86a"
	    }
	  }).then(function(response) {
	  	console.log(response);
      $scope.picArray = response.data.data;
      	
      	var numberLikes=0;
        var SundayCount = 0;
        var MondayCount = 0;
        var TuesdayCount = 0;
        var WednesdayCount = 0;
        var ThursdayCount = 0;
        var FridayCount = 0;
        var SaturdayCount = 0;
        var length = 0;
        var tags = 0;
        $scope.egoCount = 0;

      		for (var i=0; i<$scope.picArray.length; i++) {
            if($scope.picArray[i].user_has_liked) {
              console.log(i, " this is the index");
      				$scope.egoCount = $scope.egoCount + 1;
      			}
      			numberLikes += $scope.picArray[i].likes.count;
            $scope.average = numberLikes / $scope.picArray.length;

            var timestamp = $scope.picArray[i].created_time;
            var a = new Date(timestamp*1000);
            var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            var dayOfWeek = days[a.getDay()]

            if (dayOfWeek === "Sunday") {
              SundayCount = SundayCount + 1;
            }
            else if (dayOfWeek === "Monday") {
              MondayCount = MondayCount + 1;
            }
            else if (dayOfWeek === "Tuesday") {
              TuesdayCount = TuesdayCount + 1;
            }
            else if (dayOfWeek === "Wednesday") {
              WednesdayCount = WednesdayCount + 1;
            }
            else if (dayOfWeek === "Thursday") {
              ThursdayCount = ThursdayCount + 1;
            }
            else if (dayOfWeek === "Friday") {
              FridayCount = FridayCount + 1;
            }
            else if (dayOfWeek === "Saturday") {
              SaturdayCount = SaturdayCount + 1;
            }
            var weekArray = [SundayCount, MondayCount, TuesdayCount, WednesdayCount, ThursdayCount, FridayCount, SaturdayCount];
            $scope.maxDay = weekArray[0];
              for (var j=0; j<weekArray.length; j++) {
                if (weekArray[j] > $scope.maxDay) {
                  $scope.maxDay = days[j];
                }
              }
            length += $scope.picArray[i].caption.text.length;
            $scope.caption = length / $scope.picArray.length;

            tags += $scope.picArray[i].tags.length;
            $scope.vis = tags / $scope.picArray.length;

            
          }
          var caption=0;
          for (var i=0; i < $scope.picArray.length; i++) {
            caption = $scope.picArray[i].caption.text;
            analyzeSentiments(caption);
          };
          $scope.positivityArray = [];
      		})
	 };


    var analyzeSentiments = function(i) {
      $http ({
            url: "https://twinword-sentiment-analysis.p.mashape.com/analyze/",
            method: "GET",
            headers: {
              "X-Mashape-Key": "9ffUaQqhGzmshlcWFhUt9DK4WyXDp18NbojjsnsRBxqu3RwXZA"
            },
            params: {
              text: i
            }
      }).then(function(response) {
            console.log(response);
            $scope.positivityArray.push(response.data.score);
            var totalPositivity = 0;
            for (var i=0; i<$scope.positivityArray.length; i++) {
              totalPositivity += $scope.positivityArray[i];
            }
           $scope.avgPositivity = totalPositivity / $scope.positivityArray.length;
            // $scope.picArray = 
    });
    // when you call this function, $scope.picArray should have an array of all 
    // your instas. Use the sentiment analysis API to get a score of how positive your 
    // captions are
  }
	});

	

