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
  
});