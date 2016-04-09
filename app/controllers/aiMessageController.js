eav.controller("AiMessageController", ['$scope', '$http', '$location', '$route', 'localStorageService', 'aiService', 'userService', 'messageService',
    function ($scope, $http, $location, $route, localStorageService, aiService, userService, messageService) {

        $scope.emailConfig = {
            "SENDEMAIL_Check": false,
            "SENDEMAIL": "Y",
            "SAVETOFILE": "Y",
            "EMAILSUBJECT": "Action Item "+$scope.aiNumber+" Has Been Updated",
            "EMAILRESPONSEFORMAT": "HTML",
            "EMAILFROMADDRESS": "support@euclidtechnology.com",
            "EMAILREPLYFORM": "AI_update_email.htm",
            "EMAILREPLYADDRESS": "support@euclidtechnology.com",
            "ACTIONSTT": "Out-Standing",
            "ACTIONTYPE": "Client Review"
        };
         $scope.sendAiMessage = function() {
            $("#aiMessageEditor").val(CKEDITOR.instances.aiMessageEditor.getData());
            if ($scope.aiMessage || $("#aiMessageEditor").val()) {
                var sendingAi_Promise = messageService.sendAiMessage(($("#aiMessageEditor").val()), $scope.aiNumber, $scope.emailConfig);
                sendingAi_Promise.then(function(response) {
                    $('#aiResponseModal').modal('hide');
                    $route.reload();
                });
            }
        };

    }
]);
