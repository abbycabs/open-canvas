
var sheetsuUrl = "https://sheetsu.com/apis/v1.0/38d32d72";

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


// Dummy data for now -- remove when you have sheetsu working!
var data = [
  {
    Title: 'test',
    Problem: 'problem',
    Solution: 'solution',
    id:0,
    Timestamp: '5/15/2016 16:52:35'
  },
  {
    Title: 'ABBY!',
    Problem: 'this is the problem',
    Solution: 'this is the solution',
    id:4,
    Timestamp: '5/15/2016 16:52:35'
  },
  {
    Title: 'Paper Badger',
    Problem: "* lack of recognition on certain contribution types on academic papers\n* papers aren't taking advantage of the web as a medium",
    Solution: 'award badges to authors on academic papers based on their contributions',
    "Key Metrics": "# of publishers using badges, # of badges awarded",
    "Unique Value Proposition": "Issuing badges to credit authors on academic papers. Badges for authors on academic papers. Get author roles on your papers",
    "User Profiles": "Publishers who want to use the web to enhance paper reading experience. Researchers. ORCID.",
    "User Channels": "MSL community, blog, twitter, talks",
    "Resources Required": "Hardware: heroku 1 process (free), Development, Design, Publisher & ORCID  buy-in",
    "Contributor Profiles": "Devs @ Publishers, Devs @ ORCID, Researchers who can code / want badges",
    "Contributor Channels": "buy-in from employer users who want new features",
    id:5,
    Timestamp: '5/15/2016 16:52:35'
  },
  {
    Title: 'Contributorship Badges',
    Problem: 'problem',
    Solution: 'solution',
    id:6,
    Timestamp: '5/15/2016 16:52:35'
  },
  {
    Title: 'badges',
    Problem: 'problem',
    Solution: 'solution',
    id:7,
    Timestamp: '5/15/2016 16:52:35'
  }
];

loadCanvases = function(){
  console.log('load canvases');
  $.ajax({
    url: sheetsuUrl,
    dataType: 'json',
    type: 'GET',

    // place for handling successful response
    success: function(d) {
      data = d;
      showCanvases(data);
    },

    // handling error response
    error: function(data) {
     console.log(data);
      $(".error-connecting").show();
      $(".throbber").hide();
    }
  });
}


showCanvases = function(data){
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
    showCanvases(data);
    // loadCanvases();
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

