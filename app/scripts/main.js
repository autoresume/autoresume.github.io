'use strict';
var AR = window.AR = window.AR || {};
AR.onLinkedInLoad = function() {
  IN.Event.on(IN, 'auth', AR.onLinkedInAuth);
};

doT.templateSettings.strip = false;
ZeroClipboard.config( { swfPath: "/bower_components/zeroclipboard/dist/ZeroClipboard.swf" } );

AR.onLinkedInAuth = function() {
  $('#msg').html("");
  IN.API.Profile('me').fields(AR.fullProfileFields).result(function(profiles) {
    AR.profile = profiles.values[0];
    $('#btn-generate').click(function(event) {

      $('#msg').html("");
      $('#rst-list').hide();
      var src = $('.carousel-inner > .item.active > input').val();
      var type = $('.carousel-inner > .item.active span.tmpl-type').html();

      $.ajax({
        url: src,
        success: function(data) {
          var tempFn = doT.template(data);
          AR.resumeStr = tempFn(AR.profile);
          AR.resumeBlob = new Blob([AR.resumeStr], {type: "text/plain;charset=utf-8"});
          var fillTemplatesFn = doT.template($('#rst-tmpl').html());
          $('#rst-list').html(fillTemplatesFn(type));
          $('#rst-list').show();
          AR.bindZclip();
        },
        error: function(xhr, status, err) {
          $('#msg').html(err);
        }
      });
    });
  });
};

AR.bindZclip = function() {
  if (AR.zclipClients) ZeroClipboard.destroy();
  AR.zclipClients = new ZeroClipboard($(".btn-copy"));
  AR.zclipClients.on('ready', function(event) {

    AR.zclipClients.on('beforecopy', function(event){
    });

    AR.zclipClients.on('copy', function(event){
      // event.clipboardData.setData( "text/plain", AR.resumeStr);
      event.clipboardData.setData( "text/plain", AR.resumeStr);
    });

    AR.zclipClients.on('aftercopy', function(e) {
      $(e.target).children('span').removeClass('hide').show();
    });
    AR.zclipClients.on('error', function(e) {
      console.log(e);
    });
  });
};


$(function () {
  // load templates
  var fillTemplatesFn = doT.template($('#item-tmpl').html());
  $('#carousel-tmpl div.carousel-inner').html(fillTemplatesFn(AR.templates));

  // stop auto sliding
  $('#carousel-tmpl').carousel({
    interval: false
  });

  $('#btn-generate').click(function(event) {
    $('#msg').html("Please login to LinkedIn first.");
  });

  $('.btn-copy').on('click', function(event) {
    $(this).children('span').hide();
  });
});