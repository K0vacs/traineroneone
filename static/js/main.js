$(document).ready(function() {
  
  // Global variables and Materialize prototypes executed on load -------------- //
  
  $('.sidenav').sidenav();
  $('.collapsible').collapsible();
  $('select').formSelect();
  
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
  
  // This click event enables users to navigate between collapsable panels using buttons to allow for a more fluid process flow.
  $("[data-nav]").on("click", function() {
    var self = $(this).data("nav");
    var collapseOpen = $('.collapsible');

    switch (self) {
      case "home":
        window.location.href = window.location.origin;
        break;
      case "exercises":
        collapseOpen.collapsible('open', 0);
        $("#exerciseOptions").empty().html(
          "<option value='' disabled selected>Choose your option</option>"
        );
        break;
      case "workouts":
        collapseOpen.collapsible('open', 1);
        loadSelectOptions("exercise");
        $("#workoutOptions").empty().html(
          "<option value='' disabled selected>Choose your option</option>"
        );
        break;
      case "program":
        collapseOpen.collapsible('open', 2);
        loadSelectOptions("workout");
        $("#exerciseOptions").empty().html(
          "<option value='' disabled selected>Choose your option</option>"
        );
        break;
    }
  });
  
  $( ".input-field" ).on("click", function(event) {
    $(this).find(".warning").remove();
  });
  
  
  

  
  $(".card-panel").on("click", ".recent-item-control", function() {
    var self = $(this).parents(".recent-item");
    var id = self.attr("id");
    
    self.find(".edit").attr("disabled", true).children("i").text( "refresh" ).addClass( "spin-icon" );
    
    if($(this).hasClass("edit")) {
      $.ajax({
        url: `/edit?id=${id}`,
        type: 'GET',
        success: function( response ) {
          edit(self, response);
          self.find(".edit").attr("disabled", false).children("i").text( "edit" ).removeClass( "spin-icon" );
        },
        error: function( error ) {
          console.log( error );
          self.find(".edit").attr("disabled", false).children("i").text( "edit" ).removeClass( "spin-icon" );
        }
      });
    } else {
      deleteExercisesAndWorkouts(self);
    }
  });
  
  
  
  
  function edit(self, object) {
    var form = $( "form" );
    var obj = JSON.parse(object);
    form.find(".label").addClass("active");
    
    $.each(obj[0], function(name, value) {
      switch (true) {
        case name == "_id":
          $("[data-save='exercise']").html(`<i class="material-icons left">save</i>UPDATE`);
          $("[data-save='exercise']").attr("data-id", value.$oid);
          $("[data-save='exercise']").after(`
            <button data-create="new" class="deep-orange waves-effect waves-light btn">NEW</button>
          `);
          break;
        case name == "exerciseImg" || name == "workoutImg" || name == "programImg":
          var imgUrl = value.split("/");
          var image = imgUrl[3].slice(24);
          form.find(`#${name}`).val(image);
          console.log(value);
          $("[data-save='exercise']").attr("data-img", value);
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
  
  
  
  $( "form" ).on("submit", function(event) {
    event.preventDefault();
    var self  = $( this );
    var arr   = emptyFieldValidation( self );
    
    switch(true) {
      case arr.length == 0:
        getSignedRequest( self );
        break;
      case arr.length > 0:
        warningMessage( arr );
        break;
    }
  });
  

  function update( self, id, url ) {
    var form        = self.serializeArray();
    var selectData  = JSON.stringify(self.find(".selectOptions").formSelect('getSelectedValues'));
    var imgName     = self.find("[type='file']").attr("name");
    var imgUrl      = self.find("[data-save]").attr("data-img");
    var files       = self.find( "[type='file']" ).prop( "files" );
    
    if(files.length > 0) {
      form.push(
        { name: imgName, value: files[0] },
        { name: "toDelete", value: imgUrl.slice(45) }
      );
    }
    
    form.push(
      { name: "_id", value: id },
      { name: imgName, value: url },
      { name: 'multiSelect', value: selectData }
    );
    console.log(form);
    $.ajax({
      url: `/update/`,
      data: form,
      type: 'POST',
      success: function( response ) {
        console.log( response );
      },
      error: function( error ) {
        console.log( error );
      }
    });
    
    $(`#${id} span`).text(form[0].value);
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

























  $('select').on('contentChanged', function() {
    $(this).formSelect();
  });

















  // Ajax calls, processed in app.py ------------------------------------------- //
  
  function loadSelectOptions(options) {
    $.ajax({
      type: 'GET',
      url: `/load-select-options?options=${options}`,
      success: function( response ) {
        var resp = JSON.parse( response );
        if( options === "exercise" ) {
          for( var i = 0; resp.length - 1 >= i; i++ ) {
            var id = resp[i]._id.$oid;
            var name = resp[i].exerciseName;
            var $newOpt = $("<option>").attr("value",id).text(name);
            $("#exerciseOptions").append($newOpt);
          }
        } else {
          for( var i = 0; resp.length - 1 >= i; i++ ) {
            var id = resp[i]._id.$oid;
            var name = resp[i].workoutName;
            var $newOpt = $("<option>").attr("value",id).text(name);
            $("#workoutOptions").append($newOpt);
          }
        }
        $( "select" ).formSelect();
      },
      error: function( error ) {
        alert( "Error: Exercises not loaded, please refresh the page." );
        console.log(error);
      }
    });
  }
  
  function getSignedRequest( self ) {
    const files   = self.find( "[type='file']" ).prop( "files" );
    const file    = files[0];
    
    if(file != undefined) {
      
      self.find( "[data-save]" ).attr( "disabled", true )
      .children("i").text( "refresh" ).removeClass( "spin-icon" );
      
      $.ajax({
        url: `/sign-s3?file-name=${file.name}&file-type=${file.type}`,
        type: 'GET',
        success: function( response ) {
          const responseObj = JSON.parse( response );
          uploadFile( file, responseObj.data, responseObj.url, self );
          var isUpdate = self.find("[data-save]").attr("data-id");
          if(isUpdate.length > 0) {
            update( self, isUpdate, responseObj.url );
          } else {
            sendFormData( responseObj.url, self );
          }
        },
        error: function( error ) {
          alert( "Error: The form did not save, please try again." );
          console.log( error );
        }
      });
      
    }
  }

  function uploadFile(file, s3Data, url, self) {
    const postData = new FormData();
    for (key in s3Data.fields) {
      postData.append(key, s3Data.fields[key]);
    }
    postData.append('file', file);

    $.ajax({
      url: s3Data.url,
      data: postData,
      type: 'POST',
      headers: { 'x-amz-acl': 'public-read' },
      contentType: false,
      processData: false,
      success: function( response ) {
        self.find("[data-save] i").text( "check" ).removeClass( "spin-icon" );
        self.find("[data-save]").attr("disabled", false);
        
        setTimeout(function(){ 
          self.find("[data-save] i").text( "save" );
			  }, 3000);
      },
      error: function( error ) {
        console.log(error);
      }
    });
  }

  function sendFormData( url, self ) {
    var form        = self.serializeArray();
    var selectData  = JSON.stringify(self.find(".selectOptions").formSelect('getSelectedValues'));
    var imgName     = self.find("[type='file']").attr("name");
    
    form.push(
      { name: imgName, value: url },
      { name: 'multiSelect', value: selectData }
    );
    
    if(form.length < 5) {
      var imgUrl = form[2].value;
    } else {
      var imgUrl = form[6].value;
    }
    
    $.ajax({
      type: 'POST',
      url: '/save-form',
      data: form,
      success: function( response ) {
        var recentlyAdded = {
          id: response, 
          name: form[0].value, 
          imageUrl: imgUrl
        };
        recentItem(recentlyAdded);
      },
      error: function( error ) {
        alert( "Error: The form did not save, please try again." );
        console.log(error);
      }
    });
    self.trigger("reset");
    self.find(".label").addClass("active");
    
  }
  
  function recentItem(form) {
    $(".active .recent-item:last").after(`
      <div id="${form.id}" data-img="${form.imageUrl}" class="row valign-wrapper recent-item">
          <div class="col s8">
              <span>${form.name}</span>
          </div>
          <div class="col s4">
            <button type="button" class="deep-orange waves-effect waves-light btn recent-item-control edit">
              <i class="material-icons">edit</i>
            </button>
            <button type="button" class="deep-orange waves-effect waves-light btn recent-item-control delete">
              <i class="material-icons">delete</i>
            </button>
          </div>
      </div>
    `);
  }
  
  
  
  function deleteExercisesAndWorkouts(self) {
    var imgUrl = self.data("img");
    var imgKey = imgUrl.slice(45);
    var form = $("form");
    
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
  
  
  
  
});