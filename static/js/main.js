$(document).ready(function() {
  
  $(".button-collapse").sideNav();
  
  $('.home-carousel').show();
  
  $('.home-carousel').slick({
    accessibility: true,
    autoplay: true,
    arrows: true,
    autoplaySpeed: 5000,
    dots: true,
    useTransform: false
  });
  
  $('.excersises-carousel').slick({
    dots: true,
    arrows: true
  });
  
  $('select').material_select();
  
  $("[data-save='exercise']").on("click", function(event) {
    event.preventDefault();
    var exerciseName = $("[name='exercise-name']").val();
    validateForm(exerciseName);
  });
  
  function validateForm(formData) {
    if(formData == "") {
      $("#exercise-name").after("<span class='error-message'>Field cannot be blank!");
    } else {
      AjaxRequest();
      $(".error-message").remove();
      $("#exercise-form").trigger("reset");
    }
    
  }
  
  $("[name='exercise-name']").on("mouseenter", function(event) {
    $("[data-save='exercise'] i").text("save");
  });
  
  function AjaxRequest() {
    
    $("[data-save='exercise'] i").text("refresh").addClass("spin-icon");
    $("[data-save='exercise']").attr("disabled", true);

    $.ajax({
			url: '/test',
			data: $('#exercise-form').serialize(),
			type: 'POST',
			success: function(response){
			  $("[data-save='exercise'] i").text("done").removeClass("spin-icon");
			  $("[data-save='exercise']").attr("disabled", false);
				console.log(response);
			},
			error: function(error){
				console.log(error);
			}
		});
  }


$( "[data-nav]" ).on( "click", function() {
  
  var self = $( this ).data( "nav" );
  var collapseOpen =  $('.collapsible');
  
  switch ( self ) {
    case "home":
      window.location.href = "http://traineroneone-f3r3nc.c9users.io";
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

  

  
  
  
  
  
  
  
  
  
  



});