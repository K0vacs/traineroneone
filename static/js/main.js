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
      showExercise(formData);
      sessionVariable(formData);
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
			  $("[data-save='exercise'] i").text("done").removeClass("spin-icon")
			  
			 // setTimeout(function(){ 
			    
			 // }, 3000);
			  
			  $("[data-save='exercise']").attr("disabled", false);
				console.log(response);
			},
			error: function(error){
				console.log(error);
			}
		});
  }
  
  function sessionVariable(form) {
    var list = {
      exerciseName: form,
      image: 'pow',
      difficulty: 'maw',
      sets: 'ooh',
      reps: 'laa',
      duration: 'laa',
      equipment: 'laa',
      muscleGroups: 'laa',
      seperset: 'laa',
      notes: 'laa',
    };
    sessionStorage.setItem('formData', JSON.stringify(list));
    var lastname = JSON.parse(sessionStorage.getItem("formData"));
    console.log(lastname.exerciseName);
  }
  
  if (sessionStorage.getItem("formData") != null) {
    (function onLoadExercisesPage() {
      var lastname = JSON.parse(sessionStorage.getItem("formData"));
//      if (lastname.exerciseName.length >= 1) {
        showExercise(lastname.exerciseName);
//      }
    })();
  }
  
  function showExercise(exerciseName) {
    var input = `<p>
                  ${exerciseName} 
                  <span>
                    <i>E</i>
                    <i>D</i>
                  </span>
                </p>`;
    $(".card-title").after(input);
  }

});