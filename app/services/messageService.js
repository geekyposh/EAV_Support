eav.factory("transformRequestAsFormPost",
            function() {

                // I prepare the request data for the form post.
                function transformRequest( data, getHeaders ) {

                    var headers = getHeaders();

                    headers[ "Content-type" ] = "application/x-www-form-urlencoded; charset=utf-8";

                    return( serializeData( data ) );

                }


                // Return the factory value.
                return( transformRequest );


                // ---
                // PRVIATE METHODS.
                // ---


                // I serialize the given Object into a key-value pair string. This
                // method expects an object and will default to the toString() method.
                // --
                // NOTE: This is an atered version of the jQuery.param() method which
                // will serialize a data collection for Form posting.
                // --
                // https://github.com/jquery/jquery/blob/master/src/serialize.js#L45
                function serializeData( data ) {

                    // If this is not an object, defer to native stringification.
                    if ( ! angular.isObject( data ) ) {

                        return( ( data == null ) ? "" : data.toString() );

                    }

                    var buffer = [];

                    // Serialize each key in the object.
                    for ( var name in data ) {

                        if ( ! data.hasOwnProperty( name ) ) {

                            continue;

                        }

                        var value = data[ name ];

                        buffer.push(
                            encodeURIComponent( name ) +
                            "=" +
                            encodeURIComponent( ( value == null ) ? "" : value )
                        );

                    }

                    // Serialize the buffer and clean it up for transportation.
                    var source = buffer
                        .join( "&" )
                        .replace( /%20/g, "+" )
                    ;

                    return( source );

                }

            }
        );
eav.factory("messageService", function($http,transformRequestAsFormPost) {
    var messageService = {
        sendAiMessage: function(message, aiNumber, emailConfig) {
            var today = new Date();
            return $http({
                url: config.baseurl + '/eav/cgi-bin/actionitemsdll.dll/Info?',
                method: 'post',
                transformRequest: transformRequestAsFormPost,
                data: {
                    "listitemnum": aiNumber,
                    "WMT": "none",
                    "WRP": "actionNote.htm",
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function(response) {
                var responseStatus = "";
                var newnote = '<table width="100%" border="0"><tr><td bgcolor="#999999"><font color="white">Detailed Description Entered by ' +
                    config.username +
                    ' <BR>Time: ' +
                    today.defaultView() +
                    ' ' +
                    window.getClockTime() +
                    '</font></td></tr></table><p>' +
                    message + '</p>';
                var messageToSend = newnote + '<br>' + response.data;
                var uploadPromise = messageService.uploadAiMessage(messageToSend, aiNumber, emailConfig);
                uploadPromise.then(function(response) {
                    responseStatus = response;
                    return responseStatus;
                });
                return uploadPromise;
            });
        },
        uploadAiMessage: function(message, aiNumber, emailConfig) {
            var promise = $http({
                url: config.baseurl + '/eav/cgi-bin/msashelpdll.dll/ActionItemUpdate',
                method: 'post',
                transformRequest: transformRequestAsFormPost,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data:/*Must use lodash to merge objects*/ _.assign({
                    "CUSTOMERCD": config.customercd,
                    "listitemnum": aiNumber,
                    "WMT": "none",
                    "ACTIONNOTE": message,
                    "WRP": "UploadResponse.htm",

                }, emailConfig)
            }).then(function(response) {
                return response.data;
            });
            return promise;
        }
    };
    return messageService;
});
