eav.controller("NoteController", ['$scope',
    '$http',
    '$route',
    '$sce',
    '$location',
    '$routeParams',
    'aiService',
    'localStorageService',
    function ($scope,
        $http,
        $route,
        $sce,
        $location,
        $routeParams,
        aiService,
        localStorageService) {

            $scope.archives = $scope.archives = localStorageService.get("archiveList") || [];
            $scope.todos = localStorageService.get("todoList") || [];
            $scope.aiService = aiService;

            $scope.init = function () {
                CKEDITOR.replace('todoEditor');
            };
            $scope.init();
            
            $scope.$watch("todos",function  (newVal,oldVal) {
                //console.log(newVal,angular.toJson(newVal));
                if (newVal !== null && angular.isDefined(newVal) && newVal!==oldVal) {
                    localStorageService.set("todoList",angular.toJson(newVal));
                }
            },true);

            $scope.$watch("archives",function  (newVal,oldVal) {
                //console.log(newVal,angular.toJson(newVal));
                if (newVal !== null && angular.isDefined(newVal) && newVal!==oldVal) {
                    localStorageService.set("archiveList",angular.toJson(newVal));
                }
            },true);

            $scope.addTodo = function () {
                var today = new Date();
                var tempArray = [];
                var editor_data = CKEDITOR.instances.todoEditor.getData();
                for(i = 0; aiService.aiSelected.length > i; i++){
                    tempArray.push(aiService.aiSelected[i]);
                }
                $scope.todos.push({
                    taskName : editor_data, relatedAIs: tempArray , taskDate: today.defaultView()
                });
                
                $scope.newTodo = "";//Reset the text field.
                CKEDITOR.instances.todoEditor.setData('');
                aiService.aiSelected.length = 0;
            };

            $scope.deleteTodo = function(index) {
                $scope.todos.splice(index, 1);
            };

            $scope.editTodo = function(index) {
                var editableText = $scope.todos[index].taskName;
                CKEDITOR.instances.todoEditor.setData(editableText);
                $scope.todos.splice(index, 1);
            };

            $scope.archiveTodo = function(index) {
                var today = new Date();
                $scope.archives.push({
                    archiveName : $scope.todos[index].taskName , relatedAIs: $scope.todos[index].relatedAIs, taskDate: $scope.todos[index].taskDate, archiveDate: today.defaultView()
                });
                $scope.todos.splice(index, 1);
            };

            $scope.deleteArchive = function(index) {
                $scope.archives.splice(index, 1);
            };

            $scope.SkipValidation = function(value) {
                return $sce.trustAsHtml(value);
            };
        }
    ]
);