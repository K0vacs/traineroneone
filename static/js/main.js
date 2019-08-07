$(document).ready(function() {
  
  // Global variables and Materialize prototypes executed on load -------------- //
  $('.modal').modal();
  
  // Slick carousels initialized ----------------------------------------------- //
  $( ".home-carousel" ).show().slick({
    accessibility: true,
    infinite: true,
    autoplay: true,
    arrows: false,
    autoplaySpeed: 3000,
    dots: true,
    useTransform: false
  });

  // jQuery events ------------------------------------------------------------- //
  
  // This click event confirms the deletion of items.
  $( ".delete-modal" ).on( "click", function() {
    var title       = $( this ).closest( ".card" ).find( ".card-title" ).text();
    var deleteLink  = $( this ).attr( "data-delete" );
    
    $( ".modal" ).find( ".delete-link" ).prop( "href", deleteLink );
    $( ".modal-content h4" ).text( "Delete " + title + "?" );
  });
  
});