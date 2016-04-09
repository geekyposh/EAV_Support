eav.factory("aiService", function($http, localStorageService, userService) {
    var aiService = {
        actionItemDllBaseUrl: config.baseurl + "/eav/cgi-bin/utilities.dll/customlist?",
        bookmarks: localStorageService.get('userBookmarks') || [],
        aiListFilter: "",
        aiListSort: "",
        aiSelected: [],
        getUserAis: function(username,sort) {
            aiService.aiListSort = sort;
            //console.log("getUserAis Called.");
            //var userId = localStorageService.get("username");
            return $http({
                url: aiService.actionItemDllBaseUrl,
                method: 'GET',
                params: {
                    "user": username,
                    "sqlname": "GETEAVUSERAIS",
                    //"RANGE": "1/15",
                    "SORT": sort,
                    "WBP": "ai_list_JSON.json",
                    "WHP": "ai_list_header_JSON.json",
                    "wmt": "none"
                }
            });
        },
        getSearchAis: function(clientName,fromDate,toDate,aiComments,aiNotes) {
            //console.log("getUserAis Called.");
            //var userId = localStorageService.get("username");
            return $http({
                url: aiService.actionItemDllBaseUrl,
                method: 'GET',
                params: {
                    "sqlname": "GETSEARCHAIS",
                    "namefind": clientName,
                    "ACTIONCOMMENTS": "~"+aiComments+"~",
                    "NOTE": "~"+aiNotes+"~",
                    "LISTMEMBERS.UPDATETMS": "BETWEEN "+fromDate+" AND "+toDate,
                    "SORT": "UPDATETMS",
                    "WBP": "ai_search_JSON.json",
                    "WHP": "ai_list_header_JSON.json",
                    "wmt": "none"
                }
            });
        },
        getAiNotes: function(aiNumber) {
            return $http({
                url: config.baseurl + "/eav/cgi-bin/actionitemsdll.dll/info?",
                method: 'GET',
                params: {
                    "LISTITEMNUM": aiNumber,
                    "RESPONSEPAGE": "actionNote.htm",
                    "WMT": "none"
                }
            });
        },
        getAiDetails: function(aiNumber) {
            return $http({
                //url: "https://www.euclidtechnology.com/cvweb/cgi-bin/actionitemsdll.dll/info?",
                url: config.baseurl + "/eav/cgi-bin/utilities.dll/customlist?",
                method: 'GET',
                params: {
                    "sqlname": "GETEAVUSERAIS",
                    "aiNum": aiNumber,
                    "WMT": "none",
                    "WBP": "ai_list_JSON.json",
                }
            });
        },
        getAiDocuments: function(aiNumber) {
            return $http({
                url: config.baseurl + "/eav/cgi-bin/actionitemsdll.dll/info?",
                method: 'GET',
                params: {
                    "LISTITEMNUM": aiNumber,
                    "RESPONSEPAGE": "filelist.htm",
                    "FileItemConfirmation": "ai_doc_JSON.json",
                    "WMT": "none"
                }
            });
        },
        getBookmarks: function() {
            //console.log("getBookmarks Called.");
            return aiService.bookmarks;
        },
        storeBookmark: function(actionItem) {
            aiService.bookmarks.push(actionItem);
            localStorageService.set('userBookmarks', aiService.bookmarks);
        },

        removeBookmark: function(actionItem) {
            
            _.remove(aiService.bookmarks, function(aiObj) {
                //console.log(aiObj);
                return aiObj === actionItem;
            });
            localStorageService.set('userBookmarks', aiService.bookmarks);
        },
        toggleBookmark: function(actionItem) {
            var containsBookmark = _.any(aiService.bookmarks, function(aiObj) {
                return aiObj === actionItem.LISTITEMNUM;
            });
            if (containsBookmark === true) {
                actionItem.bookmarked = false;
                aiService.removeBookmark(actionItem.LISTITEMNUM);
            } else if (containsBookmark === false) {
                actionItem.bookmarked = true;
                aiService.storeBookmark(actionItem.LISTITEMNUM);
            }

        },
        isBookmarked: function(actionItem) {
            return _.any(aiService.bookmarks, function(aiObj) {
                return aiObj === actionItem;
            });
        },
        openUserAi: function(aiNumber) {
            window.open('https://www.euclidtechnology.com/support/ActionItem.aspx?cv_ActionItem=' + aiNumber, '_blank');
        },
        modifyAis: function(actionItems) {
            $.each(actionItems, function(index, actionItem) {
                actionItem = aiService.modifyAi(actionItem);
            });
            return actionItems;
        },
        modifyAi: function(actionItem) {
            actionItem.actionTypeClass = actionItem.ACTIONTYPE.replace(/\s+/g, '').replace("/", "");
            var today = new Date();
            var twoWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
            if(Date.parse(actionItem.UPDATETMS) < Date.parse(twoWeek) && actionItem.ACTIONTYPE != 'Project') {
                actionItem.lateClass = 'late';
            }else{
                actionItem.lateClass = 'normal';
            }
            actionItem.bookmarked = aiService.isBookmarked(actionItem.LISTITEMNUM);
            return actionItem;
        },
        setAiListFilter: function(filter) {
            aiService.aiListFilter = filter;
        },
        getAiListFilter: function() {
            return aiService.aiListFilter;
        },
        getAiListSort: function() {
            if(aiService.aiListSort != ''){
                return aiService.aiListSort;
            }else{
                return 'LISTITEMNUM DESC';
            }
            
        }

    }; //end aiService Object
    return aiService;

});