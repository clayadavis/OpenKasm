$(document).ready(function(){
  $("#inputEmail").popover({
    placement: 'bottom',
    trigger  : 'manual',
    title    : 'Invalid Email',
    content  : 'Please enter a full, valid email address to anonymize.',
  });

  $("#inputAlias").popover({
    placement: 'bottom',
    trigger  : 'manual',
    title    : 'Invalid Alias',
    content  : 'Enter a valid alphanumeric alias, with or without "@openkasm.com"',
  });

  $("#inputEmail").click(function(){
    $(this).popover('hide');
  }).focus(function(){
    $(this).popover('hide');
  });

  $("#inputAlias").click(function(){
    $(this).popover('hide');
  }).focus(function(){
    $(this).popover('hide');
  });

  function disableForm(selector, disable){
      var $form = $(selector).children('input, button'),
          $btn = $form.filter('button');

      $form.prop('disabled', disable);
      if (disable) {
        $btn.css('width', $btn.outerWidth() + 'px');
        $btn.html('<i class="fa fa-cog fa-spin"></i>');
      } else {
        $btn.text($btn.data('content'));
        $btn.css('width', '');
      }
  }

  $("#btnAnonymize").click(function(e){
    e.preventDefault();
    var email = $("#inputEmail").val(),
        $form = $('.intro-form').children('input, button'),
        rex =
        /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z{|}~])*@[a-zA-Z](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/;
    if (!email.match(rex)) {
      console.log('Invalid email');
      $("#inputEmail").popover('show').blur();
    } else {
      console.log('Valid email');
      disableForm('.intro-form', true);
      $.ajax({
        type: "POST",
        url : "http://openkasm.com:5000/alias/create",
        data: { email: email },
        dataType: "json",
      }).done(function(data){
        $("#modalAnonymize .modal-body").html('<h2>' + data.username + '@openkasm.com</h2>');
        $("#modalAnonymize").modal();
      }).fail(function(){
        alert("There was a problem with your request. Please try again.");
      }).always(function(){
        disableForm('.intro-form', false);
      });
    }
  });

  $("#btnBanish").click(function(e){
    e.preventDefault();
    var alias = (/[a-zA-Z0-9]+/.exec($("#inputAlias").val()) || [])[0];
    if (!alias) {
      console.log('Invalid alias');
      $("#inputAlias").popover('show').blur();
    } else {
      console.log('Valid alias');
      disableForm('.banish-form', true);
      $.ajax({
        type: "POST",
        url : "http://openkasm.com:5000/alias/deactivate",
        data: { alias: alias },
        dataType: "json",
      }).done(function(data){
        var modalText;
        if (data.response == 'success') {
          text = 'Successfully deactivated alias "' + alias + '".';
        } else {
          text = "Unable to deactivate alias. Did you type it correctly?"
        }
        $("#modalBanish .modal-body").html('<p class="lead">' + text + '</p>');
        $("#modalBanish").modal();
      }).fail(function(){
        alert("There was a problem with your request. Please try again.");
      }).always(function(){
        disableForm('.banish-form', false);
      });
    }
  });




  /* Clipboard bullshit */
  $("#btnCopy").click(function(e){
    e.preventDefault();
  });
  $("#btnCopy").zclip({
    path: 'js/ZeroClipboard.swf',
    copy: function(){
      alert("Text copied!");
      return $("#modalAnonymize .modal-body").text().trim()
    },
    beforeCopy: function(){
      console.log("About to copy");
    }
  });
});
