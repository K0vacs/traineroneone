$(document).ready(function() {
  
  // Global variables and Materialize prototypes executed on load -------------- //
  
  $('.sidenav').sidenav();
  $('.collapsible').collapsible();
  $('select').formSelect();
  loadSelectOnCardEdit();
  
  // Slick carousels initialized ----------------------------------------------- //
  
  $( ".home-carousel" ).show().slick({
    accessibility: true,
    autoplay: true,
    arrows: true,
    autoplaySpeed: 3000,
    dots: true,
    useTransform: false
  });

  $( ".exercises-carousel" ).show().slick({
    dots: true,
    arrows: true
  });

  // jQuery events ------------------------------------------------------------- //
  
  // This submit event saves the users' input's if they are valid.
  $( "form" ).on( "submit", function( event ) {
    event.preventDefault();
    var self        = $( this );
    var toValidate  = emptyFieldValidation( self );
    
    if( toValidate.length == 0 ) {
      loadingEffectOnButtons( self, "[data-save]", "save" );
      prepareFileData( self );
    } else {
      warningMessage( toValidate );
    }
  });
  
  // This click event enables users to navigate between collapsable panels using buttons to allow for a more fluid process flow.
  $( "[data-nav]" ).on( "click", function() {
    var self = $( this ).data( "nav" );
    prepareSelectData ( self );
  });

  // This click event removes the warning message when it is no longer necessary.
  $( ".input-field" ).on( "click", function() {
    $( this ).find( ".warning" ).remove();
  });
  
  // This click event triggers the users request to see saved data.
  $( ".card-panel" ).on( "click", ".edit, .delete", function( event ) {
    var self  = $( this ).parents( ".saved-item" );
    var state = $( this ).hasClass( "edit" );
    loadingEffectOnButtons( self, ".edit", "edit" );
    
    if( state ) {
      var form = self.parents(".row").children("form");
      var type = form.find("[type='submit']").data("save");
      
      ajaxGetItemDetails( self, form, type ); 
    } else {
      deleteExercisesAndWorkouts( self );
    }
  });
  
  $( ".btn-control" ).on( "click", "[data-create='new']", function( event ) {
    var form = $( "form" );
    clearForm( form );
  });
  
  // This click event ensures the Materialize Multi Select is always up to date.
  $( "select" ).on( "contentChanged", function() {
    $( this ).formSelect();
  });

  // Ajax calls, processed in app.py ------------------------------------------- //
  
  // This Ajax call gets a DB record by ID.
  function ajaxGetItemDetails( self, form, type ) {
    $.ajax({
      url: `/edit?id=${self.attr( "id" )}&type=${type}`,
      type: "GET",
      success: function( response ) {
        clearForm( form );
        displayItemData( form, type, response );
        loadingEffectOnButtons( self, ".edit", "edit" );
      },
      error: function( error ) {
        console.log( error );
        alert( "An error occured while loading the file." );
        loadingEffectOnButtons( self, ".edit", "edit" );
      }
    });
  }
  
  // This Ajax call gets all DB records for the specified option.
  function ajaxGetOptions( option ) {
    $.ajax({
      type: "GET",
      url: `/load-select-options?options=${ option }`,
      success: function( response ) {
        displaySelectOptions( option, response );
      },
      error: function( error ) {
        console.log( error );
        alert( "Error: Exercises not loaded, please refresh the page." );
      }
    });
  }
  
  // This Ajax call gets a presigned request from AWS S3 which is a pre-authorisation to upload a file.
  function ajaxGetSignedRequest( self, file ) {
    $.ajax({
      url: `/sign-s3?file-name=${ file.name }&file-type=${ file.type }`,
      type: "GET",
      success: function( response ) {
        prepareSignedRequest( self, file, response  );
      },
      error: function( error ) {
        console.log( error );
        alert( "Error: The form did not save, please try again." );
      }
    });
  }
  
  // This Ajax call posts the file uploaded using the form to an S3 bucket.
  function ajaxPostUploadFile( self, s3Data, fileAndMeta ) {
    $.ajax({
      url: s3Data.url,
      data: fileAndMeta,
      type: "POST",
      headers: { "x-amz-acl": "public-read" },
      contentType: false,
      processData: false,
      success: function( response ) {
        loadingEffectOnButtons( self, "[data-save]", "save" );
      },
      error: function( error ) {
        loadingEffectOnButtons( self, "[data-save]", "save" );
        console.log( error );
        alert( "Error: The file did not upload, please try again." );
      }
    });
  }
  
  // This Ajax call posts form data to app.py to be saved.
  function ajaxPostSaveItem( self, form, img ) {
    $.ajax({
      type: "POST",
      url: "/save-form",
      data: form,
      success: function( response ) {
        savedItem( response, form, img );
      },
      error: function( error ) {
        alert( "Error: The form did not save, please try again." );
        console.log( error );
      }
    });
    self.trigger( "reset" );
    self.find( ".label" ).addClass( "active" );
  }
  
  // This Ajax call posts form data to app.py to update a DB record.
  function ajaxPostUpdateItem( self, form ) {
    $.ajax({
      url: `/update/`,
      data: form,
      type: "POST",
      success: function( response ) {
        loadingEffectOnButtons( self, "[data-save]", "save" );
      },
      error: function( error ) {
        loadingEffectOnButtons( self, "[data-save]", "save" );
        alert( "Error: Saved item not updated, please refresh the page." );
        console.log( error );
      }
    });
  }
  
  // JavaScript Functions ------------------------------------------------------------- //
  
  function prepareItem( self ) {
    switch(true) {
      case  "sign":
      break;
      case  "file":
        
        var files = self.find( "[type='file']" ).prop( "files" );
        var file  = files[0] || false;
        if( file ) {
          ajaxGetSignedRequest( self, file );
        } else {
          prepareFormData( self );
        }
      break;
      case  "upload":
      break;
    }
      
  }
  
  function prepareSignedRequest( self, file, response ) {
    var resp        = JSON.parse( response );
    var updateItem  = self.attr( "data-id" );
    prepareFileUpload( self, file, resp.data );
    
    // if( typeof updateItem !== typeof undefined && updateItem !== false ) {
    // // ajaxPostUpdateItem( self, updateItem, resp.url );
    // } else {
      prepareFormData( self, resp.url );
    // }
  }
  
  function prepareFileData( self ) {
    var files = self.find( "[type='file']" ).prop( "files" );
    var file  = files[0];
    
    
    if( file != undefined ) {
      ajaxGetSignedRequest( self, file );
    } else {
      prepareFormData( self );
    }
  }
  
  function prepareFileUpload( self, file, s3Data ) {
    var fileAndMeta = new FormData();
    for ( key in s3Data.fields ) {
      fileAndMeta.append( key, s3Data.fields[key] );
    }
    fileAndMeta.append('file', file);
    
    ajaxPostUploadFile( self, s3Data, fileAndMeta );
  }
  
  function prepareFormData( self, url ) {
    var form        = self.serializeArray();
    var selectData  = JSON.stringify(self.find(".selectOptions").formSelect('getSelectedValues'));
    var imgName     = self.find("[type='file']").attr("name");
    var imgUrl      = url || self.find("[data-save]").attr("data-img");
    var id          = self.find("[data-save]").attr("data-id") || false;
    
    if( url ) {
      form.push(
        { name: imgName, value: url },
        { name: 'multiSelect', value: selectData }
      );
    } else if( url & imgUrl > 0 ) {
      form.push(
        { name: imgName, value: url },
        { name: "toDelete", value: imgUrl.slice(45) }
      );
    } else {
      form.push(
        { name: 'multiSelect', value: selectData }
      );
    }
    
    
    if(form.length < 5) {
      var imgUrl = form[2].value;
    } else {
      var imgUrl = form[6].value;
    }
    
    // Create logic that knows when to create or update.
    if( id ) {
      form.push(
        { name: "_id", value: id },
      );
      ajaxPostUpdateItem( self, form );
    } else {
      ajaxPostSaveItem( self, form, imgUrl );
    }
    
  }
  
  function savedItem( response, form, img ) {
    var recentlyAdded = {
      id: response, 
      name: form[0].value, 
      imageUrl: img
    };
        
    $( ".active .saved-item:last" ).after(`
      <div id="${ response }" data-img="${ img }" class="row valign-wrapper saved-item">
          <div class="col s8">
              <span>${ form[0].value }</span>
          </div>
          <div class="col s4">
            <button type="button" class="deep-orange waves-effect waves-light btn edit">
              <i class="material-icons">edit</i>
            </button>
            <button type="button" class="deep-orange waves-effect waves-light btn delete">
              <i class="material-icons">delete</i>
            </button>
          </div>
      </div>
    `);
  }
  
  function displaySelectOptions( option, response ) {
    var resp = JSON.parse( response );
        
    for( var i = 0; resp.length - 1 >= i; i++ ) {
      var id      = resp[i]._id.$oid;
      var name    = resp[i].exerciseName || resp[i].workoutName;
      var optionToAdd  = $( "<option>" ).attr( "value", id ).text( name );
        
      $( "#" + option + "Options" ).append( optionToAdd );
    }
      
    $( "select" ).formSelect();
  }
  
  function warningMessage( arr ) {
    $.each( arr, function( index, value ) {
      $(arr[index].field).find("label").after(`
        <div class="warning valign-wrapper">
          <i class="tiny material-icons orange-text">warning &nbsp;</i>
          <span class="orange-text">Please fill in this field.</span>
        </div>
      `);
    });
  }

  function emptyFieldValidation( self ) {
    var arr = [];
    self.find(".select-dropdown").addClass("validation");
    
    self.find(".input-field").each(function() {
      var input = $( this ).find(".validation").val();    
      
      switch(true) {
        case input.length == 0:
          var obj = {field: $(this), value: input};
          arr.push(obj);
          break;
        case input == "Choose your option":
          var selectVal = input.slice(20);
          
          switch(selectVal) {
            case selectVal.length == 0:
              var selectObj = {field: $(this), value: input};
              arr.push(selectObj);
              break;
          }
          break;
      }
      
    });
    
    return arr;
  }
  
  function deleteExercisesAndWorkouts( self ) {
    var imgUrl = self.data("img");
    var imgKey = imgUrl.slice(45);
    var form = $("form");
    form.find( "[data-save]" ).removeAttr( "data-id data-img" )
    .html( "<i class='material-icons left'>save</i>SAVE" );
    $( "[data-create='new']" ).remove();
    
    $.ajax({
      url: `/delete?id=${self.attr( "id" )}&img=${imgKey}`,
      type: 'GET',
      success: function( response ) {
        
      },
      error: function( error ) {
        console.log( error );
      }
    });
    self.remove();
    form.trigger("reset");
    form.find(".selectOptions option:selected").each( function() {
      var val = $(this).val();
      if(val != "") {
        $(this).attr("selected", false);
      }
    });
    $('select').formSelect();
    form.find(".label").addClass("active");
  }
  
  function loadingEffectOnButtons( self, button, icon ) {
    var state = self.find( button ).children( "i" ).hasClass( "spin-icon" );
    
    if( state == true ) {
      self.find( button ).attr( "disabled", false )
      .children( "i" ).text( "check" ).removeClass( "spin-icon" );
      
      setTimeout(function(){ 
        self.find( button ).children( "i" ).text( icon );
			}, 1000);
    } else {  
      self.find( button ).attr( "disabled", true )
      .children( "i" ).text( "refresh" ).addClass( "spin-icon" );
    }
    
  }
  
  function displayItemData( form, type, response ) {
    var obj = JSON.parse( response );
    var id = form.find( "[data-save]" ).attr( "data-id" );
    form.find( ".label" ).addClass( "active" );
    
    $.each( obj[0], function( name, value ) {
      switch ( true ) {
        case name == "_id" && id == undefined:
          $(`[data-save='${type}']`).html(`<i class="material-icons left">save</i>UPDATE`)
          .attr("data-id", value.$oid)
          .after(`
            <button data-create="new" class="deep-orange waves-effect waves-light btn">NEW</button>
          `);
          break;
        case name == "_id" && id != undefined:
          $(`[data-save='${type}']`).attr("data-id", value.$oid);
          break;  
        case name == type + "Img":
          var imgUrl = value.split("/");
          var image = imgUrl[3].slice(24);
          form.find(`#${name}`).val(image);
          
          $(`[data-save='${type}']`).attr("data-img", value);
          break;
        case name == "multiSelect":
          var item = JSON.parse(value);
          $.each(item, function(i, val) {
            form.find(`.selectOptions [value='${val}']`).attr("selected", true);
          });
          $('select').formSelect();
          break;  
        default:
          form.find(`[name='${name}']`).val(value);
          break;
      }
    });

  }
  
  function clearForm( form ) {
      form.find( "[data-save]" ).removeAttr( "data-id data-img" )
      .html( "<i class='material-icons left'>save</i>SAVE" );
      $( "[data-create='new']" ).remove();
      
      form.trigger("reset");
      form.find(".selectOptions option:selected").each( function() {
        var val = $(this).val();
        if(val != "") {
          $(this).attr("selected", false);
        }
      });
      $('select').formSelect();
      form.find(".label").addClass("active");
    }
  
  function loadSelectOnCardEdit() {
    var activeCollapse = $( ".active .collapse-header" ).attr("data-header");
    prepareSelectData ( activeCollapse );
  }

  function prepareSelectData ( self ) {
    var collapseOpen = $( ".collapsible" );
    
    switch ( self ) {
      case "home":
        window.location.href = window.location.origin;
        break;
      case "exercises":
        collapseOpen.collapsible( "open", 0);
        $( "#exerciseOptions" ).empty().html(
          "<option value='' disabled selected>Choose your option</option>"
        );
        break;
      case "workouts":
        collapseOpen.collapsible( "open", 1);
        ajaxGetOptions( "exercise" );
        $( "#workoutOptions" ).empty().html(
          "<option value='' disabled selected>Choose your option</option>"
        );
        break;
      case "program":
        collapseOpen.collapsible( "open", 2);
        ajaxGetOptions( "workout" );
        $( "#exerciseOptions" ).empty().html(
          "<option value='' disabled selected>Choose your option</option>"
        );
        break;
    }
  }
  
});