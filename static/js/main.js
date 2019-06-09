$(document).ready(function() {

  var homeCarousel = $('.home-carousel');
  var exercisesCarousel = $('.exercises-carousel');
  var exerciseForm = $("#exercise-form");

  $(".button-collapse").sideNav();

  homeCarousel.show();

  homeCarousel.slick({
    accessibility: true,
    autoplay: true,
    arrows: true,
    autoplaySpeed: 5000,
    dots: true,
    useTransform: false
  });

  exercisesCarousel.show();

  exercisesCarousel.slick({
    dots: true,
    arrows: true
  });

  $('select').material_select();

  $("[data-nav]").on("click", function() {
    // This click event enables users to navigate between collapsable panels using buttons to allow for a more fluid process flow.

    var self = $(this).data("nav");
    var collapseOpen = $('.collapsible');

    switch (self) {
      case "home":
        window.location.href = window.location.origin;
        break;
      case "exercises":
        console.log("Exercises");
        collapseOpen.collapsible('open', 0);
        break;
      case "workouts":
        console.log("Workouts");
        collapseOpen.collapsible('open', 1);
        break;
      case "program":
        console.log("Program");
        collapseOpen.collapsible('open', 2);
        break;
    }

  });
  
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
    var theObj = {};
    theObj[testN] = test;
    console.log(theObj);
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
    formData.push({name: 'exerciseImage', value: url});
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