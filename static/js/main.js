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
  
  
  $("[data-save='excersise']").on("click", function(event) {
    event.preventDefault();
    var exerciseName = $("[name='exercise-name']").val();
    showExercise(exerciseName);
    sessionVariable(exerciseName);
    
    $.ajax({
			url: '/test',
			data: $('#exercise-form').serialize(),
			type: 'POST',
			success: function(response){
				console.log(response);
			},
			error: function(error){
				console.log(error);
			}
		});
		
  });
  
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