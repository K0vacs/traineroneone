$(document).ready(function() {

  var homeCarousel = $('.home-carousel');
  var exercisesCarousel = $('.exercises-carousel');
  var exerciseForm = $("#exercise-form");

  $('.sidenav').sidenav();

  homeCarousel.show();

  homeCarousel.slick({
    accessibility: true,
    autoplay: true,
    arrows: true,
    autoplaySpeed: 3000,
    dots: true,
    useTransform: false
  });

  exercisesCarousel.show();

  exercisesCarousel.slick({
    dots: true,
    arrows: true
  });

  $('.collapsible').collapsible();
  $('select').formSelect();
  
  

  $("[data-nav]").on("click", function() {
    // This click event enables users to navigate between collapsable panels using buttons to allow for a more fluid process flow.

    var self = $(this).data("nav");
    var collapseOpen = $('.collapsible');

    switch (self) {
      case "home":
        window.location.href = window.location.origin;
        break;
      case "exercises":
        collapseOpen.collapsible('open', 0);
        clearExercises();
        break;
      case "workouts":
        collapseOpen.collapsible('open', 1);
        console.log("excercises");
        loadExercises();
        break;
      case "program":
        collapseOpen.collapsible('open', 2);
        clearExercises();
        break;
    }

  });
  
  
  function loadExercises() {
    console.log("loaded");
    $.ajax({
      type: 'POST',
      url: '/load-exercises',
      success: function( response ) {
        var response = JSON.parse(response);

        for(var i = 0; response.length - 1 >= i; i++) {
          var id = response[i]._id.$oid;
          var name = response[i].exerciseName;
          var $newOpt = $("<option>").attr("value",id).text(name);
          $("#exercisesList").append($newOpt);
        }
        $("#exercisesList").trigger('contentChanged');
        
      },
      error: function( error ) {
        console.log(error);
      }
    });
  }
  
  $('select').on('contentChanged', function() {
    $(this).formSelect();
  });
  
  
  function clearExercises() {
    $("#exercisesList").empty().html( "<option value='' disabled selected>Choose your option</option>" );
  }
  
  
  
  
  function sessionVariable(form) {
    var name = form[0].value;
    sessionStorage.setItem( name, JSON.stringify(form) );
    //var lastname = JSON.parse(sessionStorage.getItem("formData"));
    //console.log(Object.keys(sessionStorage));
  }

  exerciseForm.on("submit", function(event) {
    event.preventDefault();
    var test = $(this).serializeArray();
    sessionVariable(test)
    var testN = test[0].value;
    //console.log(theObj.slice(20));
    const files = $("#file-input").prop('files');
    const file = files[0];
    var self = $( this );
    self.find( "[data-save]" ).attr( "disabled", true );
    self.find( "[data-save] i" ).text( "refresh" ).addClass( "spin-icon" );
    getSignedRequest(file, self);
  });
  
  function getSignedRequest(file, self) {
    $.ajax({
      url: `/sign-s3?file-name=${file.name}&file-type=${file.type}`,
      type: 'GET',
      success: function( response ) {
        const responseObj = JSON.parse(response);
        console.log(responseObj);
        uploadFile(file, responseObj.data, responseObj.url, self);
        sendFormData(responseObj.url);
      },
      error: function( error ) {
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

  function sendFormData(url) {
    var formData = exerciseForm.serializeArray();
    var selectData = exerciseForm.find(".select-wrapper input").val();
    formData.push(
      { name: 'exerciseImage', value: url },
      { name: 'exerciseMuscleGroup', value: selectData.slice(20) }
    );
    $("#exercise-form").trigger("reset");
    
    $.ajax({
      type: 'POST',
      url: '/save-exercise',
      data: formData,
      success: function( response ) {
        console.log(response);
      },
      error: function( error ) {
        console.log(error);
      }
    });
  }
});