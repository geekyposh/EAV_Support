eav.controller("MainController", ['$scope', '$http', '$location','$sce','localStorageService', 'aiService', 'userService',
    function($scope, $http, $location, $sce, localStorageService, aiService, userService) {


        $scope.mainCtrlVariables = {
            variableWithinObject: [],
        };

        $scope.username = config.username;
        $scope.navigateTo = function(path) {
            $location.path(path);
        };

        $scope.openOnSupport = function(aiNumber) {
            aiService.openUserAi(aiNumber);
        };

        $scope.isActive = function (viewLocation) {
            var active = (viewLocation === $location.path());
            return active;
        };

    }
]);
