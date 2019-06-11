$(document).ready(function() {
  
  // Global variables and Materialize prototypes executed on load -------------- //
  
  $('.sidenav').sidenav();
  $('.collapsible').collapsible();
  $('select').formSelect();
  
  // Slick carousels initialized ----------------------------------------------- //
  
  $( ".home-carousel" ).show().slick({
    accessibility: true,
    autoplay: true,
    arrows: true,
    autoplaySpeed: 3000,
    dots: true,
    useTransform: false
  });

  $( ".exercises-carousel" ).show().slick({
    dots: true,
    arrows: true
  });

  // jQuery events ------------------------------------------------------------- //
  
  // This click event enables users to navigate between collapsable panels using buttons to allow for a more fluid process flow.
  $("[data-nav]").on("click", function() {
    var self = $(this).data("nav");
    var collapseOpen = $('.collapsible');

    switch (self) {
      case "home":
        window.location.href = window.location.origin;
        break;
      case "exercises":
        collapseOpen.collapsible('open', 0);
        $("#exercisesList").empty().html(
          "<option value='' disabled selected>Choose your option</option>"
        );
        break;
      case "workouts":
        collapseOpen.collapsible('open', 1);
        loadExercises();
        break;
      case "program":
        collapseOpen.collapsible('open', 2);
        $("#exercisesList").empty().html(
          "<option value='' disabled selected>Choose your option</option>"
        );
        break;
    }
  });
  
  $( "form" ).on("submit", function(event) {
    event.preventDefault();
    
    var self      = $( this );
    const files   = self.find( "[name='image']" ).prop( "files" );
    const file    = files[0];
    
    self.find( "[data-save]" ).attr( "disabled", true );
    self.find( "[data-save] i" ).text( "refresh" ).addClass( "spin-icon" );
    
    getSignedRequest( file, self );
  });
  
  $('select').on('contentChanged', function() {
    $(this).formSelect();
  });

  // Ajax calls, processed in app.py ------------------------------------------- //
  
  function loadExercises() {
    $.ajax({
      type: 'POST',
      url: '/load-exercises',
      success: function( response ) {
        var resp = JSON.parse( response );

        for(var i = 0; resp.length - 1 >= i; i++) {
          var id = resp[i]._id.$oid;
          var name = resp[i].exerciseName;
          var $newOpt = $("<option>").attr("value",id).text(name);
          $("#exercisesList").append($newOpt);
        }
        $("#exercisesList").trigger('contentChanged');
        
      },
      error: function( error ) {
        alert( "Error: Exercises not loaded, please refresh the page." );
        console.log(error);
      }
    });
  }
  
  function getSignedRequest( file, self ) {
    $.ajax({
      url: `/sign-s3?file-name=${file.name}&file-type=${file.type}`,
      type: 'GET',
      success: function( response ) {
        const responseObj = JSON.parse( response );
        uploadFile( file, responseObj.data, responseObj.url, self );
        sendFormData( responseObj.url, self );
      },
      error: function( error ) {
        alert( "Error: The form did not save, please try again." );
        console.log(error);
      }
    });
  }

  function uploadFile(file, s3Data, url, self) {
    const postData = new FormData();
    for (key in s3Data.fields) {
      postData.append(key, s3Data.fields[key]);
    }
    postData.append('file', file);

    $.ajax({
      url: s3Data.url,
      data: postData,
      type: 'POST',
      headers: { 'x-amz-acl': 'public-read' },
      contentType: false,
      processData: false,
      success: function( response ) {
        self.find("[data-save] i").text( "check" ).removeClass( "spin-icon" );
        self.find("[data-save]").attr("disabled", false);
        
        setTimeout(function(){ 
          self.find("[data-save] i").text( "save" );
			  }, 3000);
      },
      error: function( error ) {
        console.log(error);
      }
    });
  }

  function sendFormData( url, self ) {
    var form        = self.serializeArray();
    var selectData  = self.find(".select-wrapper input").val().slice(20);
    
    form.push(
      { name: 'imageUrl', value: url },
      { name: 'multiSelect', value: selectData }
    );
    
    $.ajax({
      type: 'POST',
      url: '/save-form',
      data: form,
      success: function( response ) {
        console.log(response);
      },
      error: function( error ) {
        console.log(error);
      }
    });
    
    self.trigger("reset");
  }
  
  
  
  
  
  
  
  
  
  
  
});