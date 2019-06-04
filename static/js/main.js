$(document).ready(function() {
  
  var homeCarousel      = $('.home-carousel');
  var exercisesCarousel = $('.exercises-carousel');
  var exerciseForm      = $("#exercise-form");
  
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
  
  exerciseForm.on("submit", function(event) {
    event.preventDefault();
    var formData    = $(this).serializeArray();
    console.log(new FormData( this ));
    AjaxRequest(formData);
    $("#exercise-form").trigger("reset");
  });
  
  function AjaxRequest() {
    
    var saveExerciseIcon  = $("[data-save='exercise'] i");
    var saveExercise      = $("[data-save='exercise']");
    
    saveExerciseIcon.text("refresh").addClass("spin-icon");
    saveExercise.attr("disabled", true);

    $.ajax({
			url: '/test',
			data: $('#exercise-form').serializeArray(),
			type: 'POST',
			success: function( response ){
			  
			  saveExerciseIcon.text("done").removeClass("spin-icon");
			  saveExercise.attr("disabled", false);
				console.log( response );
				
				setTimeout(function() {
				  saveExerciseIcon.text("save");
				}, 3000);
			},
			error: function( error ){
			  
				alert("An error occured, your exercise did not save. Please try again.");
				console.log(error);
				
			}
		});
  }


$("[data-nav]").on("click", function() {
  // This click event enables users to navigate between collapsable panels using buttons to allow for a more fluid process flow.

  var self = $(this).data("nav");
  var collapseOpen = $('.collapsible');

  switch (self) {
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