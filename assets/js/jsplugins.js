/*global $, angular, console*/

// loginApp js
var myApp = angular.module("myApp", ["ngCookies"]);
//loginCtrl js
myApp.controller("loginCtrl", ["$scope", "$location", "$cookies", "$http", function ($scope, $location, $cookies, $http) {
    "use strict";
    //access
    $scope.login = function () {
        console.log($scope.uname);
        console.log($scope.upass);
        console.log($scope.rememberme);
        $http({
            method: "POST",
            data: JSON.stringify({"Email": $scope.uname, "Password": $scope.upass, "lang": "en"}),
            url: "http://yakensolution.cloudapp.net:80/LiveHealthyPharmacy/api/User/Login"
        })
            .then(function (response) {
                if (response.data.isSuccess) {
                    $scope.userid = response.data.Response.UserDetails.User_ID;
                    $scope.accessToken = response.headers().token;
                    console.log(response.data);
                    console.log($scope.accessToken);
                    if ($scope.rememberme) {
                        var now = new Date(),
                            exp = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
                        $cookies.putObject('User_ID', $scope.userid, {expires: exp});
                        $cookies.putObject('accessToken', $scope.accessToken, {expires: exp});
                        window.location.href = 'inside.html';
                    } else {
                        $cookies.put("User_ID", $scope.userid);
                        $cookies.put("accessToken", $scope.accessToken);
                        window.location.href = 'inside.html';
                    }
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    $('#loginerror').modal("show");
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
}]);

// insideApp js
var mainApp = angular.module("mainApp", ["ngCookies"]);
//chemistCtrl js
mainApp.controller("insideCtrl", ["$scope", "$location", "$cookies", "$http", function ($scope, $location, $cookies, $http) {
    "use strict";
    var auth = $cookies.get('accessToken');
    if (auth === undefined || auth === null || auth === "" || auth === " ") {
        window.location.href = 'index.html';
    }
    
    $scope.clearnotification = function () {
        $scope.newnotification = false;
    };
    //get pending
    $scope.getPending = function () {
        $http({
            method: "GET",
            url: "http://yakensolution.cloudapp.net:80/LiveHealthyPharmacy/api/Orders/GetOrders?FromDate=2-2-2002&Status=Pending&PageNumber=1&NumberRecords=100&lang=en",
            headers: {
                "UserID": $cookies.get("User_ID"),
                "Token": $cookies.get("accessToken")
            }
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.isSuccess) {
                    $scope.pendinglist = response.data.Response.Orders;
                    $scope.reversependinglist = response.data.Response.Orders.reverse();
                    console.log($scope.reversependinglist);
                    console.log($scope.pendinglist);
                    console.log($scope.oldpendinglist);
                    console.log($scope.newpendinglist);
                    $scope.newpendinglist = response.data.Response.Orders;
                    if ($scope.checknotifications) {
                        if ($scope.newpendinglist[0].Order_ID !== $scope.oldpendinglist[0].Order_ID || $scope.newpendinglist.length !== $scope.oldpendinglist.length) {
                            $scope.newnotification = true;
                        }
                    }
                    $scope.oldpendinglist = $scope.newpendinglist;
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    $('#error').modal("show");
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    $scope.getPending();
    //get Accepted
    $scope.getAccepted = function () {
        $http({
            method: "GET",
            url: "http://yakensolution.cloudapp.net:80/LiveHealthyPharmacy/api/Orders/GetOrders?FromDate=2-2-2002&Status=Accepted&PageNumber=1&NumberRecords=100&lang=en",
            headers: {
                "UserID": $cookies.get("User_ID"),
                "Token": $cookies.get("accessToken")
            }
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.isSuccess) {
                    $scope.Acceptedlist = response.data.Response.Orders;
                    console.log($scope.Acceptedlist);
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    $('#error').modal("show");
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    $scope.getAccepted();
    //get On the way
    $scope.getOntheway = function () {
        $http({
            method: "GET",
            url: "http://yakensolution.cloudapp.net:80/LiveHealthyPharmacy/api/Orders/GetOrders?FromDate=2-2-2002&Status=On the way&PageNumber=1&NumberRecords=100&lang=en",
            headers: {
                "UserID": $cookies.get("User_ID"),
                "Token": $cookies.get("accessToken")
            }
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.isSuccess) {
                    $scope.Onthewaylist = response.data.Response.Orders;
                    console.log($scope.Onthewaylist);
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    $('#error').modal("show");
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    $scope.getOntheway();
    //get Delivered
    $scope.getDelivered = function () {
        $http({
            method: "GET",
            url: "http://yakensolution.cloudapp.net:80/LiveHealthyPharmacy/api/Orders/GetOrders?FromDate=2-2-2002&Status=Delivered&PageNumber=1&NumberRecords=100&lang=en",
            headers: {
                "UserID": $cookies.get("User_ID"),
                "Token": $cookies.get("accessToken")
            }
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.isSuccess) {
                    $scope.Deliveredlist = response.data.Response.Orders;
                    console.log($scope.Deliveredlist);
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    $('#error').modal("show");
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    $scope.getDelivered();
    //get Canceled
    $scope.getCanceled = function () {
        $http({
            method: "GET",
            url: "http://yakensolution.cloudapp.net:80/LiveHealthyPharmacy/api/Orders/GetOrders?FromDate=2-2-2002&Status=Canceled&PageNumber=1&NumberRecords=100&lang=en",
            headers: {
                "UserID": $cookies.get("User_ID"),
                "Token": $cookies.get("accessToken")
            }
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.isSuccess) {
                    $scope.Canceledlist = response.data.Response.Orders;
                    console.log($scope.Canceledlist);
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    $('#error').modal("show");
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    $scope.getCanceled();
    //display medictions
    $scope.showmedication = function (x, y, z) {
        $scope.medicationowner = x;
        $scope.medicationimage = y;
        $scope.medicationlist = z;
        $('#medicationmodal').modal("show");
    };
    //change status
    $scope.changestatus = function (x, y, z) {
        console.log(x);
        console.log(y);
        console.log(z);
        $http({
            method: "POST",
            data: JSON.stringify({"OrderID": x, "Status": y, "Message": z, "lang": "en"}),
            url: "http://yakensolution.cloudapp.net:80/LiveHealthyPharmacy/api/Orders/UpdateOrder",
            headers: {
                "UserID": $cookies.get("User_ID"),
                "Token": $cookies.get("accessToken")
            }
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.isSuccess) {
                    $scope.getPending();
                    $scope.getAccepted();
                    $scope.getOntheway();
                    $scope.getDelivered();
                    $scope.getCanceled();
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    $('#loginerror').modal("show");
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //refresher
    setInterval(function () {
        $scope.checknotifications = true;
        $scope.getPending();
        $scope.getAccepted();
        $scope.getOntheway();
        $scope.getDelivered();
        $scope.getCanceled();
    }, 60000);
    //logout
    $scope.logout = function () {
        $cookies.remove('accessToken');
        window.location.href = 'index.html';
    };
}]);
