 /**
  * KendoStrapAng3 Module
  *
  * The module for eav
  */


  var eav = angular.module('eav', ['LocalStorageModule', 'ui.unique', 'ngRoute']).value('$anchorScroll', angular.noop);

 //[Configuration Section]
 var config = {};
 config["username"] = "JWU";
 config["customercd"] = "502359";
 config["baseurl"] = "http://localhost";

 //Misc Utilities used throughout code.

 Date.prototype.defaultView = function() {
   var dd = this.getDate();
   if (dd < 10) {
       dd = "0" + dd;
   }
   var mm = this.getMonth() + 1;
   if (mm < 10) {
       mm = "0" + mm;
   }
   var yyyy = this.getFullYear();
   return String(mm + "\/" + dd + "\/" + yyyy);
};

Date.prototype.fileView = function() {
   var dd = this.getDate();
   if (dd < 10) {
       dd = "0" + dd;
   }
   var mm = this.getMonth() + 1;
   if (mm < 10) {
       mm = "0" + mm;
   }
   var yyyy = this.getFullYear();
   return String(mm + dd + yyyy);
};

function getClockTime() {
   var now = new Date();
   var hour = now.getHours();
   var minute = now.getMinutes();
   var second = now.getSeconds();
   var ap = "AM";
   if (hour > 11) {
       ap = "PM";
   }
   if (hour > 12) {
       hour = hour - 12;
   }
   if (hour === 0) {
       hour = 12;
   }
   if (hour < 10) {
       hour = "0" + hour;
   }
   if (minute < 10) {
       minute = "0" + minute;
   }
   if (second < 10) {
       second = "0" + second;
   }
   var timeString = hour +
   ':' +
   minute +
   ':' +
   second +
   " " +
   ap;
   return timeString;
}

$('body').on('click', '#exportNotesBtn', function(){ 
    var data = localStorage.getItem("eav.todoList").replace(/<\/?[^>]+>/gi, '');
    JSONToCSVConvertor(data, "Notes", true);
});
$('body').on('click', '#exportArchiveBtn', function(){ 
    var data = localStorage.getItem("eav.archiveList").replace(/<\/?[^>]+>/gi, '');
    JSONToCSVConvertor(data, "Archived Notes", true);
});


function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var today = new Date();
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + ' from '+ today.defaultView() + ' \r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    //var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    var fileName = ReportTitle.replace(/ /g,"_")+'_'+today.fileView();   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}