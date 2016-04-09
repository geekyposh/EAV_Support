eav.controller("AiController", ['$scope',
    '$http',
    '$route',
    '$location',
    '$routeParams',
    'localStorageService',
    'aiService',
    'userService',
    'aiMetricsService',
    function ($scope,
        $http,
        $route,
        $location,
        $routeParams,
        localStorageService,
        aiService,
        userService,
        aiMetricsService) {
            $scope.username = userService.getUsername();
            $scope.progress = null;

            $scope.$on('$viewContentLoaded', function () {
                $(function () {
                    CKEDITOR.replace('aiMessageEditor');
                });
            });
            $scope.aiService = aiService;
            $scope.aiList = {};
            $scope.aiResults = {};
            //$scope.aiSelectedList = [];
            $scope.aiMessage = "";
            $scope.filterAisBy = aiService.getAiListFilter();
            $scope.sortAisBy = aiService.getAiListSort();
            $scope.aiNumber = $routeParams.aiNumber;
            $scope.todos = [];
            $scope.ai = "";
            //$scope.getOrgName = aiService.getOrgName();
             $scope.showbookmarks = function(bookmarks) {
                //console.log($scope.aiList);
                return function(aiList) {
                    return bookmarks.indexOf(aiList.LISTITEMNUM) != -1;
                }
            };
            $scope.setAiFilter = function (filter) {
                //console.log(filter);
                if(filter === "Saved"){
                    //console.log($scope.showbookmarks(aiService.bookmarks))
                    aiService.setAiListFilter($scope.showbookmarks(aiService.bookmarks));
                    $scope.filterAisBy = aiService.getAiListFilter();
                }else{
                    if (!filter) {
                        filter = "";
                    }
                    aiService.setAiListFilter(filter);
                    $scope.filterAisBy = aiService.getAiListFilter();
                }
                

            };
            $scope.setAiSort = function (sort) {

                aiService.getUserAis($scope.username,sort).success(function (data, status) {
                    $scope.aiList = aiService.modifyAis(data.actionItems);
                    $scope.sortAisBy = aiService.getAiListSort();
                });

            };

            aiService.getAiNotes($scope.aiNumber).success(function (data) {
                var note = $(data);
                $("#details").append(note);
                if ($("#details").text().length > 10) {
                    $scope.details = note;
                    $scope.modifyDetails();
                } else {
                    $("#details").append("There are no notes for this AI.");
                }
                $scope.getDetails();
            });
            aiService.getAiDocuments($scope.aiNumber).success(function (data) {
                var documents = $(data);
                $scope.docList = documents;
            });
            $scope.getDetails = function () {
                if ($scope.aiNumber) {
                    aiService.getAiDetails($scope.aiNumber).success(function (data) {
                        //$scope.bookmarked = aiService.isBookmarked($scope.aiNumber);
                        $scope.ai = aiService.modifyAi(data);
                    });
                   
                }
            };
            $scope.modifyDetails = function () {
                $("#details").find("*").removeAttr("style bgcolor color");
                var noteHeaders = $("#details table");
                var notesAmt = noteHeaders.length;
                $.each(noteHeaders, function (index, noteHeader) {
                    var $noteHeader = $(noteHeader).addClass("noteHeader panel-heading");
                    //$noteHeader.addClass("noteHeader panel-heading");
                    if (index < notesAmt) {
                        var $entireNote = $noteHeader.add($noteHeader.nextUntil("table"));
                        $entireNote.wrapAll("<div class='note well'></div>");
                    }
                    var headerText = $noteHeader.text();
                    headerText = headerText.substring(headerText.indexOf("by") + 3);
                    var headerTextArray = headerText.split("Time:");
                    headerText = headerTextArray[0];
                    var timeStamp = headerTextArray[1];
                    $noteHeader.html(headerText);
                    $noteHeader.prepend("<i class='fa fa-user'></i>").append("<span class='timeStamp'>" + timeStamp + "</span>");
                });
            };
            aiService.getUserAis($scope.username,$scope.sortAisBy).success(function (data, status) {
                $scope.aiList = aiService.modifyAis(data.actionItems);
                $scope.progress = aiMetricsService.calcProgress(data.actionItems);
            });
            $scope.searchUserAi = function (aiNumber) {
                if (aiNumber.indexOf("user/") === -1) {
                    $scope.navigateTo('/ai/' + aiNumber);
                } else {
                    localStorageService.add("username", aiNumber.split("/")[1]);
                    window.location.reload();
                }
            };

            $scope.aiSelect = function (aiNumber) {
                if(aiNumber){
                    aiService.aiSelected.push(aiNumber);
                    $scope.aiSearch = null;
                }else{
                    aiService.aiSelected.push($scope.aiSearch);
                    $scope.aiSearch = null;
                }
                
            };
            $scope.aiSelectRemove = function(index){
                aiService.aiSelected.splice(index, 1);
            };
            $scope.addNote = function(aiNumber){
                aiService.aiSelected.push(aiNumber);
                $scope.navigateTo('/notes/');
            };

           
        }
    ]);