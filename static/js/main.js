$(document).ready(function() {
    
  $(".button-collapse").sideNav();
    
  console.log("Hello World!")  
  
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
  
  
  $("[data-save='excersise']").on("click", function() {
    var input = `<p>
                  ${$("[name='input']").val()} 
                  <span>
                    <i>E</i>
                    <i>D</i>
                  </span>
                </p>`;
                
    $(".card-title").after(input);
    $("[name='input']").val("")
    
  });

});