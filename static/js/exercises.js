$(document).ready(function() {
  
    // Global variables and Materialize prototypes executed on load -------------- //
    $('.sidenav').sidenav();
    
    // Slick carousels initialized ----------------------------------------------- //
    $( ".exercises-carousel" ).show().slick({
      dots: true,
      arrows: false
    });
  
    // jQuery events ------------------------------------------------------------- //
    
    // This click event opens the side panel on mobile.
    $( ".sidenav-trigger" ).on( "click", function() {
      $( ".popout-panel" ).addClass( "popout-open" );
    });
    
    // This click event closes the side panel on mobile.
    $( ".sidenav-close" ).on( "click", function() {
      $( ".popout-panel" ).removeClass( "popout-open" );
    });
    
});