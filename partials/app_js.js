(function($) {
  var user_id, meeting_id, token, begin_milliepoch, end_milliepoch, api_poll_url;

  function meetingsPoll () {
    var data = {
      hangout_uri: gapi.hangout.getHangoutUrl(),
      user_count: gapi.hangout.getParticipants().length,
      user_id: user_id,
      token: token
    };

    $.post(api_poll_url, data, function (response) {
      console.log("success:", response);
    })
    .fail(function(response) {
      console.log( "error: ", response);
    });
  }

  function meetingTimer() {
    var time = new Date().getTime();

    if(time > end_milliepoch) {
      $('#meetingNotYetStarted').hide();
      $('#meetingInProgress').hide();
      $('#meetingHasEnded').show();
    } else {
      $('#meetingHasEnded').hide();
      var dTime, $hSpan, $mSpan;
      if( time < begin_milliepoch) {
        dTime = Math.floor((begin_milliepoch - time) / 60 / 1000);
        $('#meetingNotYetStarted').show();
        $('#meetingInProgress').hide();
        $hSpan = $('#hoursRemaining1');
        $mSpan = $('#minutesRemaining1');
      } else {
        dTime = Math.floor((end_milliepoch - time) / 60 / 1000);
        $('#meetingNotYetStarted').hide();
        $('#meetingInProgress').show();
        $hSpan = $('#hoursRemaining2');
        $mSpan = $('#minutesRemaining2');

      }
      var hoursLeft = Math.floor(dTime / 60);
      var minutesLeft = dTime - (60 * hoursLeft);
      $hSpan.text(hoursLeft + (hoursLeft === 1 ? " hour" : " hours"));
      $mSpan.text(minutesLeft + (minutesLeft === 1 ? " minute" : " minutes"));

      if(hoursLeft === 0) {
        $hSpan.hide();
      }
    }
  }

  function parseAppData (appDataStr) {
    var appData = JSON.parse(appDataStr);
    user_id = appData.user_id;
    meeting_id = appData.meeting_id;
    token = appData.token;
    begin_milliepoch = appData.begin_milliepoch;
    end_milliepoch = appData.end_milliepoch;
    api_poll_url = appData.api_poll_url;

    return appData;
  }

  function init (eventObj) {
    if (eventObj.isApiReady) {
      var appDataStr = gadgets.views.getParams()['appData'];
      parseAppData(appDataStr);

      // Update meeting time every 10 seconds
      setInterval(meetingTimer, 10000);
      meetingTimer();

      // Send message to meetin.gs api every 30 seconds
      setInterval(meetingsPoll, 30000);
      meetingsPoll();
    }
  }

  function apiReady() {
    // When API is ready...
    gapi.hangout.onApiReady.add(init);
  }

  // Wait for gadget to load.
  gadgets.util.registerOnLoadHandler(apiReady);

  $('.close').click(function () {
    top.window.close();
  });
})(jQuery);