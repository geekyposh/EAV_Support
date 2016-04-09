//Some example configurations of views in angular with the route provider.
eav.config(['$routeProvider', '$compileProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'app/views/actionItems.htm',
            controller: 'AiController'
        }).
        when('/ai/:aiNumber', {
            templateUrl: 'app/views/actionItems.htm',
            controller: 'AiController'
        }).
        when('/notes', {
            templateUrl: 'app/views/notes.htm',
            controller: 'NoteController'
        }).
        when('/archives', {
            templateUrl: 'app/views/archives.htm',
            controller: 'NoteController'
        }).
        when('/search', {
            templateUrl: 'app/views/search.htm',
            controller: 'SearchController'
        }).
        otherwise({
            redirectTo: 'app/views/view1.htm'
        });
    }
]);
