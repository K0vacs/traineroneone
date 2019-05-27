$(document).ready(function() {
    
  $(".button-collapse").sideNav();
    
  $('.carousel').slick({
    accessibility: true,
    autoplay: false,
    arrows: true,
    autoplaySpeed: 5000,
    dots: true,
  });
  
    $('select').material_select();
  
});