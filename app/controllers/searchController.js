eav.controller("SearchController", ['$scope',
    '$http',
    '$route',
    '$location',
    '$routeParams',
    'localStorageService',
    'aiService',
    function ($scope,
        $http,
        $route,
        $location,
        $routeParams,
        localStorageService,
        aiService) {
            /*$scope.$on('$viewContentLoaded', function () {
                $(function () {
                    $('.dateField').datepicker({
                        orientation: "top auto",
                        autoclose: true,
                        todayHighlight: true
                    });
                    
                });
            });*/
            $scope.aiService = aiService;
            $scope.aiResults = {};
            $scope.init = function () {
                $('.datepicker').datepicker({
                    endDate: "today",
                    autoclose: true,
                    todayHighlight: true
                });
            };
            $scope.init();
            $scope.searchAllAi = function(client,fromDate,toDate,aiComments,aiNotes) {
                var today = new Date();
                if(!fromDate){
                    fromDate = "01/01/2005";
                }
                if(!toDate){
                    toDate = today.defaultView();
                }
                if(!aiComments){
                    aiComments = "";
                }
                if(!aiNotes){
                    aiNotes = "";
                }

                aiService.getSearchAis(client,fromDate,toDate,aiComments,aiNotes).success(function (data, status) {
                    $scope.aiResults = aiService.modifyAis(data.actionItems);
                });
            };

            $scope.setStatusFilter = function (filter) {
                    if (!filter) {
                        filter = "";
                    }
                    $scope.filterbyStatus = filter;   
            };
            $scope.setUserFilter = function (filter) {
                    if (!filter) {
                        filter = "";
                    }
                    $scope.filterbyUser = filter;       
            };
            $scope.clearFilter = function(){
                $scope.filterbyUser = '';
                $scope.filterbyStatus = '';
            }
        }
    ]);

eav.directive('datepicker', function() {
    return {

      restrict: 'A',
      // Always use along with an ng-model
      require: '?ngModel',

      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) return;

        ngModel.$render = function() { //This will update the view with your model in case your model is changed by another code.
           $(element).datepicker('update', ngModel.$viewValue || '');
        };

        $(element).datepicker({format: 'mm/dd/yy'}).on("changeDate",function(event){
            scope.$apply(function() {
                var thisDate = event.date;
                ngModel.$setViewValue(thisDate.getMonth() + 1 +"/" + thisDate.getDate() + "/" + thisDate.getFullYear());//This will update the model property bound to your ng-model whenever the datepicker's date changes.
            });
        });
      }
    };
});