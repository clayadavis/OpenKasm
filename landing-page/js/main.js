$(document).ready(function(){
  $("#inputEmail").popover({
    placement: 'bottom',
    trigger  : 'manual',
    title    : 'Invalid Email',
    content  : 'Please enter a full, valid email address to anonymize.',
  });

  $("#inputEmail").click(function(){
    $(this).popover('hide');
  }).focus(function(){
    $(this).popover('hide');
  });

  $("#btnAnonymize").click(function(e){
    e.preventDefault();
    var email = $("#inputEmail").val(),
        rex =
        /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z{|}~])*@[a-zA-Z](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/;
    if (!email.match(rex)) {
      console.log('Invalid email');
      $("#inputEmail").popover('show').blur();
    } else {
      console.log('Valid email');
      $.ajax({
        type: "POST",
        url : "alias/create",
        data: { email: email },
        dataType: "json",
      }).done(function(data){
        $("#modalAnonymize .modal-body").text(data.username);
        $("#modalAnonymize").modal();
      }).fail(function(){
        alert("There was a problem with your request. Please try again.");
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
