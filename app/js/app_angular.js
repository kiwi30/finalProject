var travelApp = angular.module('travelApp', ['ngCookies', 'smart-table',]);

travelApp.controller('TravelController', function TravelController($scope, $http, $cookies) {
    $scope.registerUser = {
        username : '',
        email : '',
        password : '',
        confirmPassword : '',
        phone : ''
    }
    $scope.loginData = {
        username : '',
        password : '',
        rememberMe: ''
    }
    $scope.result = null;

    $scope.newsFull = {
        title : '',
        fullText: ''
    }

    $scope.initNewsModal = function(title, text){
        $scope.newsFull.title = title;
        $scope.newsFull.fullText = text;
    }

    $scope.initUser = function(){
        $scope.result = $cookies.getObject('user');
    }

    $scope.logout = function(){
        $scope.result = null;
        $cookies.remove('user');
    }

    $scope.init = function() {
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:8077/news'
        }).success(function(data, status, headers, config) {
            $scope.newsList = data.news;
        }).error(function(data, status, headers, config) {

        });
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:8077/reviews'
        }).success(function(data, status, headers, config) {
            $scope.reviews = data.reviews;
            console.log($scope.reviews);
        }).error(function(data, status, headers, config) {

        });
    };

    $scope.login = function() {
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:8077/login',
            params: $scope.loginData
        }).success(function(data, status, headers, config) {
            $scope.result = data;
            if($scope.result != null && $scope.result.username !="" &&$scope.loginData.rememberMe != ''){
                $cookies.putObject('user', $scope.result);
            }
        }).error(function(data, status, headers, config) {

        });
    };

    $scope.register = function() {
        if ($scope.registerUser.password == $scope.registerUser.confirmPassword) {

            $http({
                method: 'POST',
                url: 'http://127.0.0.1:8077/register',
                data: $scope.registerUser
            }).success(function (data, status, headers, config) {
            }).error(function (data, status, headers, config) {

            });
        } else {
            $window.alert("Passwords are not identical!");
        }
    }


        var nameList = ['Ukraine', 'Ukraine', 'Ukraine', 'Ukraine', 'Turkey', 'Cyprus', 'Italia', 'Spain', 'France', 'Egypt', 'Montenegro', 'USA','Greece'];
        var familyName = ['Turkey', 'Turkey', 'Cyprus', 'Italia', 'Spain', 'France', 'Egypt', 'Montenegro', 'USA','Greece'];

        $scope.isLoading = false;
        $scope.rowCollection = [];

        $scope.parameters = {
            page: 3,
            filter: "",
            sort: "price",
            perPage: 8
        }


        function createRandomItem() {
            var firstName = nameList[Math.floor(Math.random() * 13)];
            var lastName = firstName == 'Ukraine'? familyName[Math.floor(Math.random() * 10)] : 'Ukraine';
            var rand = Math.random();
            var balance =rand * 2000 < 300? 300 : rand* 2000;

            return {
                from: firstName,
                to: lastName,
                price: balance
            };
        }

        function getAPage() {
            var data = [];
            for (var j = 0; j < 54; j++) {
                data.push(createRandomItem());
            }
            return data;
        }

        var lastStart = 0;
        var maxNodes = 80;

        $scope.callServer = function getData(tableState) {

            //here you could create a query string from tableState
            //fake ajax call
            $scope.isLoading = true;

            $timeout(function () {

                //if we reset (like after a search or an order)
                if (tableState.pagination.start === 0) {
                    $scope.rowCollection = getAPage();
                } else {
                    //we load more
                    $scope.rowCollection = $scope.rowCollection.concat(getAPage());

                    //remove first nodes if needed
                    if (lastStart < tableState.pagination.start && $scope.rowCollection.length > maxNodes) {
                        //remove the first nodes
                        $scope.rowCollection.splice(0, 20);
                    }
                }

                lastStart = tableState.pagination.start;

                $scope.isLoading = false;
            }, 1000);

        };

        $scope.rowCollection = getAPage();


});


travelApp.directive('stRatio',function(){
        return {
            link:function(scope, element, attr){
                var ratio=+(attr.stRatio);

                element.css('width',ratio+'%');

            }
        };
    });

travelApp.directive('pageSelect', function() {
    return {
        restrict: 'E',
        template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
        link: function(scope, element, attrs) {
            scope.$watch('currentPage', function(c) {
                scope.inputPage = c;
            });
        }
    }
});