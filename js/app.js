
// Your Google Drive Spreadsheet URL
var sheetID = "1EfV0QDhCAGTZFjJal6xuAgBqdvTRPA1-U2TLoCzC0Ug";
var sheetURL = "https://spreadsheets.google.com/feeds/cells/"+sheetID+"/1/public/values?alt=json";

var fields = {
  problem : "Problem",
  solution : "Solution",
  key_metrics : "Key Metrics",
  value_prop : "Unique Value Proposition",
  user_profiles : "User Profiles",
  user_channels : "User Channels",
  resources : "Resources Required",
  contrib_profiles : "Contributor Profiles",
  contrib_channels : "Contributor Channels",
  title: "Title"
}
var dayNames = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var data = [];

loadCanvases = function(){
  $.get(sheetURL).done(function(returnedData) {

    data = parseDriveData(returnedData);

    localStorage.setItem("data",JSON.stringify(data));
    console.log(data);

    if(data.length == 0) {
      console.log('no events');
      $(".no-events").show();
    }

    showCanvases();

  }).fail(function(e){
    $(".error-connecting").show();
    $(".throbber").hide();
  });
}

showCanvases = function(){
  console.log(data);
  $(".throbber").addClass("goodbye");

   var list = $('#canvases');
   for(var i=0; i<data.length; i+=1) {
     char = data[i];
     html = "<div class=\"canvas\" data-id=\"" + char['id'] + "\"><h4 href=\"canvas/index.html?id=" + char['Title'] + "\">" + char['Title'] + "</h4></div>";
     list.append(html);
   }
}




var QueryString = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  if(query_string.id) {
    showPop(query_string.id);
  }
  return query_string;
}();


// Displays a larger popup when an event card is clicked
// Also changes the browser history, so you can share a link...

function showPop(id){
  var found = false;
  var pop = $(".event-popup-wrapper");
  pop.find(".event-popup").scrollTop("0");

  for(var k in data){
    var item = data[k];
    pop.data("id",id);
    if(item.id == id) {
      found = true;
      pop.show();

      history.replaceState({}, "Open Canvas " + item.id, "?id=" + item.id);
      resetCanvas();
      pop.find(".value").addClass("not-specified").text("Not filled in");
      pop.find(".value").parent().addClass("not-specified");

      for (var f in fields) {
        if(item[fields[f]])
          $('#' + f + ' span').text(item[fields[f]]).removeClass("not-specified").parent().removeClass("not-specified");
      }

      var value = formatDate(item["Timestamp"]);
      $('.event-date .value').text(value).removeClass("not-specified").parent().removeClass("not-specified");

      adjustCanvas();

    }
  }
}

function resetCanvas(){
  $('#solution').css('height', 'auto');
  $('#value_prop').css('height', 'auto');
  $('#key_metrics').css('height', 'auto');
  $('#user_profiles').css('height', 'auto');
}

function adjustCanvas(){
  matchHeights('solution', 'value_prop');
  matchHeights('key_metrics', 'user_profiles');
}

function matchHeights(first, second) {
  var f = $('#' + first);
  var s = $('#' + second);
  (f.height() > s.height()) ? s.height(f.height()) : f.height(s.height());
}

// Close the popup

function hidePop(){
  var clean_uri = location.protocol + "//" + location.host + location.pathname;
  window.history.replaceState({}, document.title, clean_uri);
  $(".event-popup-wrapper").hide();
}

// navigate

// Navigates the event report details popup to either the next
// or previous event chronologically

function navigatePopup(direction) {
  var popupEl = $(".event-popup-wrapper .event-popup");


  if($(".event-popup-wrapper").is(":visible")) {
    var currentId = parseInt($(".event-popup-wrapper").data("id"));

    popupEl.removeClass("shakeright").removeClass("shakeleft");
    popupEl.width(popupEl.width());

    var visibleIDs = [];

    for(var k in data){
      var item = data[k];
      // if(item.visible) {
        visibleIDs.push(item.id);
      // }
    }

    var currentIndex = visibleIDs.indexOf(currentId);

    if(direction == "next") {
      currentIndex++;
      if(currentIndex >= visibleIDs.length) {
        currentIndex = 0;
      }
      popupEl.addClass("shakeright");
    } else {
      currentIndex--;
      if(currentIndex < 0) {
        currentIndex = visibleIDs.length - 1;
      }
      popupEl.addClass("shakeleft");
    }
    currentId = visibleIDs[currentIndex];

    showPop(currentId);
  }
}


function formatDate(dateString) {
  var date = new Date(dateString);
  if(date == "Invalid Date") {
    return "Date Unknown";
  }
  var dayNum = date.getDay(); //Number of the day of the week
  var dayOfWeek = dayNames[dayNum];
  var dayOfMonth = date.getDate();
  var year = date.getFullYear();
  var monthNumber = date.getMonth();
  var monthName = monthNames[monthNumber];
  return monthName + " " + dayOfMonth + ", " + year;
}

$(document).ready(function(){
  if($('#canvases').length){
    // showCanvases(data);
    loadCanvases();
  }

  $("body").on("click",".canvas",function(){
    var id = $(this).data("id");
    showPop(id);
  });

  $( "#submit" ).click(function() {
    $( "#mG61Hd" ).submit();
  });

  $("#problem textarea").focus();

  $("body").on("click",".event-popup .event-photo img",function(e){
    $(".event-popup-wrapper .large-photo").show();
    e.stopPropagation();
  });

  $("body").on("click",".event-popup-wrapper .large-photo",function(e){
    $(".event-popup-wrapper .large-photo").hide();
  });

  $("body").on("click",".event-popup-wrapper .event-nav",function(e){
    if($(this).hasClass("next")){
      navigatePopup("next");
    } else {
      navigatePopup("previous");
    }
    e.stopPropagation();
  });

  $("body").on("click",".event-popup-wrapper .close-pop",function(e){
    hidePop();
    e.stopPropagation();
  });
  $(window).on("keydown",function(e){
    if(e.keyCode == 37) {
      navigatePopup("previous");
    }
    if(e.keyCode == 39) {
      navigatePopup("next");
    }
    if(e.keyCode == 27) {
      hidePop();
    }
});
});

// Formats JSON data returned from Google Spreadsheet and formats it into
// an array with a series of objects with key value pairs like "column-name":"value"

function parseDriveData(driveData){
  var headings = {};
  var newData = {};
  var finalData = [];
  var entries = driveData.feed.entry;

  for(var i = 0; i < entries.length; i++){
    var entry = entries[i];
    var row = parseInt(entry.gs$cell.row);
    var col = parseInt(entry.gs$cell.col);
    var value = entry.content.$t;

    if(row == 1) {
      headings[col] = value;
    }

    if(row > 1) {
      if(!newData[row]) {
        newData[row] = {};
      }
      newData[row][headings[col]] = value;
    }
  }

  for(var k in newData){
    finalData.push(newData[k]);
  }

  return finalData;
}

