$(document).ready(function() {

  // Global variables and Materialize prototypes executed on load -------------- //
  $('.collapsible').collapsible();
  $('select').formSelect();
  loadSelectOnCardEdit();

  // jQuery events ------------------------------------------------------------- //

  // This submit event saves the users' input's if they are valid.
  $("form").on("submit", function(event) {
    event.preventDefault();
    var self = $(this);
    var toValidate = emptyFieldValidation(self);

    if (toValidate.length == 0) {
      loadingEffectOnButtons(self, "[data-save]", "save");
      prepareFileData(self);
    }
    else {
      warningMessage(toValidate);
    }
  });

  // This click event enables users to navigate between collapsable panels using buttons to allow for a more fluid process flow.
  $("[data-nav]").on("click", function() {
    var self = $(this).data("nav");
    prepareSelectData(self);
  });

  // This click event removes the warning message when it is no longer necessary.
  $(".input-field").on("click", function() {
    $(this).find(".warning").remove();
  });

  // This click event triggers the users request to see saved data.
  $(".card-panel").on("click", ".edit, .delete", function(event) {
    var self = $(this).parents(".saved-item");
    var state = $(this).hasClass("edit");
    var form = self.parents(".row").children("form");
    var type = form.find("[type='submit']").data("save");
    loadingEffectOnButtons(self, ".edit", "edit");
    
    if (state) {
      ajaxGetItemDetails( self, form, type );
    }
    else {
      deleteExercisesAndWorkouts( self, type );
    }
  });

  // This click event triggers the form reset when the create new button is clicked.
  $(".btn-control").on("click", "[data-create='new']", function(event) {
    var form = $("form");
    clearForm(form);
  });

  // This click event ensures the Materialize Multi Select is always up to date.
  $("select").on("contentChanged", function() {
    $(this).formSelect();
  });

  // Ajax calls, processed in app.py ------------------------------------------- //

  // This Ajax call gets a DB record by ID.
  function ajaxGetItemDetails(self, form, type) {
    $.ajax({
      url: `/edit?id=${self.attr( "id" )}&type=${type}`,
      type: "GET",
      success: function(response) {
        clearForm(form);
        displayItemData(form, type, response);
        loadingEffectOnButtons(self, ".edit", "edit");
      },
      error: function(error) {
        console.log(error);
        alert("An error occured while loading the file.");
        loadingEffectOnButtons(self, ".edit", "edit");
      }
    });
  }

  // This Ajax call gets all DB records for the specified option.
  function ajaxGetOptions(option) {
    $.ajax({
      type: "GET",
      url: `/load-select-options?options=${ option }`,
      success: function(response) {
        displaySelectOptions(option, response);
      },
      error: function(error) {
        console.log(error);
        alert("Error: Exercises not loaded, please refresh the page.");
      }
    });
  }

  // This Ajax call gets a presigned request from AWS S3 which is a pre-authorisation to upload a file.
  function ajaxGetSignedRequest(self, file) {
    $.ajax({
      url: `/sign-s3?file-name=${ file.name }&file-type=${ file.type }`,
      type: "GET",
      success: function(response) {
        prepareSignedRequest(self, file, response);
      },
      error: function(error) {
        console.log(error);
        alert("Error: The form did not save, please try again.");
      }
    });
  }

  // This Ajax call posts the file uploaded using the form to an S3 bucket.
  function ajaxPostUploadFile(self, s3Data, fileAndMeta) {
    $.ajax({
      url: s3Data.url,
      data: fileAndMeta,
      type: "POST",
      headers: { "x-amz-acl": "public-read" },
      contentType: false,
      processData: false,
      success: function(response) {
        loadingEffectOnButtons(self, "[data-save]", "save");
      },
      error: function(error) {
        loadingEffectOnButtons(self, "[data-save]", "save");
        console.log(error);
        alert("Error: The file did not upload, please try again.");
      }
    });
  }

  // This Ajax call posts form data to app.py to be saved.
  function ajaxPostSaveItem(self, form, img) {
    $.ajax({
      type: "POST",
      url: "/save-form",
      data: form,
      success: function(response) {
        savedItem(response, form, img);
      },
      error: function(error) {
        alert("Error: The form did not save, please try again.");
        console.log(error);
      }
    });
    self.trigger("reset");
    self.find(".label").addClass("active");
  }

  // This Ajax call posts form data to app.py to update a DB record.
  function ajaxPostUpdateItem(self, form) {
    $.ajax({
      url: `/update/`,
      data: form,
      type: "POST",
      success: function(response) {
        loadingEffectOnButtons(self, "[data-save]", "save");
      },
      error: function(error) {
        loadingEffectOnButtons(self, "[data-save]", "save");
        alert("Error: Saved item not updated, please refresh the page.");
        console.log(error);
      }
    });
  }

  // JavaScript Functions ------------------------------------------------------------- //
  
  // This function parses the AJAX response and calls the necessary functions.
  function prepareSignedRequest(self, file, response) {
    var resp = JSON.parse(response);
    prepareFileUpload(self, file, resp.data);
    prepareFormData(self, resp.url);
  }

  // This function isolates the uploaded file and calls the necessary function if the upload exists. 
  function prepareFileData(self) {
    var files = self.find("[type='file']").prop("files");
    var file = files[0];

    if (file != undefined) {
      ajaxGetSignedRequest(self, file);
    }
    else {
      prepareFormData(self);
    }
  }
  
  // This function prepares the signed request with the file to upload.
  function prepareFileUpload(self, file, s3Data) {
    var fileAndMeta = new FormData();
    for (key in s3Data.fields) {
      fileAndMeta.append(key, s3Data.fields[key]);
    }
    fileAndMeta.append('file', file);

    ajaxPostUploadFile(self, s3Data, fileAndMeta);
  }
  
  // This function prepares the form data with the AWS S3 url to save or update to the database.
  function prepareFormData(self, url) {
    var form = self.serializeArray();
    var selectData = JSON.stringify(self.find(".selectOptions").formSelect('getSelectedValues'));
    var imgName = self.find("[type='file']").attr("name");
    var imgUrl = url || self.find("[data-save]").attr("data-img");
    var id = self.find("[data-save]").attr("data-id") || false;

    if (url) {
      form.push({ name: imgName, value: url }, { name: 'multiSelect', value: selectData });
    }
    else if (url & imgUrl > 0) {
      form.push({ name: imgName, value: url }, { name: "toDelete", value: imgUrl.slice(45) });
    }
    else {
      form.push({ name: 'multiSelect', value: selectData });
    }

    if (form.length < 5) {
      var imgUrl = form[2].value;
    }
    else {
      var imgUrl = form[6].value;
    }

    if (id) {
      form.push({ name: "_id", value: id }, );
      ajaxPostUpdateItem(self, form);
      $("#" + id + " span").text(form[0].value);
    }
    else {
      ajaxPostSaveItem(self, form, imgUrl);
    }

  }
  
  // This function adds dynamic html to program-form.html to display saved items.
  function savedItem(response, form, img) {
    $(".active .saved-item:last").after(`
      <div id="${ response }" data-img="${ img }" class="row valign-wrapper saved-item item">
          <div class="col s8">
              <span>${ form[0].value }</span>
          </div>
          <div class="col s5 text-right">
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
  
  // This function adds select options to the form based on the database records returned.
  function displaySelectOptions(option, response) {
    var resp = JSON.parse(response);

    for (var i = 0; resp.length - 1 >= i; i++) {
      var id = resp[i]._id.$oid;
      var name = resp[i].exerciseName || resp[i].workoutName;
      var optionToAdd = $("<option>").attr("value", id).text(name);
      
      $("#" + option + "Options").append(optionToAdd);
    }

    $("select").formSelect();
  }
  
  // This function displays a warning message to users when a field is blank on submit.
  function warningMessage(arr) {
    $.each(arr, function(index, value) {
      if($(arr[index].field).children( "div" ).hasClass( "warning" )) {
        // Do nothing as the warning is already displayed.
      } else {
        $(arr[index].field).find("label").after(`
          <div class="warning valign-wrapper">
            <i class="tiny material-icons orange-text">warning &nbsp;</i>
            <span class="orange-text">Please fill in this field.</span>
          </div>
        `);
      }
    });
  }
  
  // This function checks if a field is blank when the form is submitted.
  function emptyFieldValidation(self) {
    var arr = [];
    
    self.find( ".input-field" ).each(function() {
      var input = $( this ).find( ".validation" ).val();
      var select = $( this ).find( ".select-dropdown" ).val();
      
      if( select != undefined ) {
        var selectVal = select.slice(20);
        
        if( selectVal.length == 0 ) {
          var selectObj = { field: $(this), value: selectVal };
          arr.push( selectObj );
        } 
      } else if ( input.length == 0 ) {
        var obj = { field: $(this), value: input };
        arr.push( obj );
      }

    });

    return arr;
  }
  
  // This function deletes the created item and removes the dynamic and unnecessary html displayed.
  function deleteExercisesAndWorkouts( self, type ) {
    console.log(self.attr("id"));
    var imgUrl = self.data("img");
    var imgKey = imgUrl.slice(45);
    var form = $("form");
    form.find("[data-save]").removeAttr("data-id data-img")
      .html("<i class='material-icons left'>save</i>SAVE");
    $("[data-create='new']").remove();

    $.ajax({
      url: `/delete?type=${type}s&id=${self.attr( "id" )}&img=${imgKey}`,
      type: 'GET',
      success: function(response) {
        $("button").attr("disabled", false);
      },
      error: function(error) {
        $("button").attr("disabled", false);
        console.log(error);
      }
    });
    self.remove();
    form.trigger("reset");
    form.find(".selectOptions option:selected").each(function() {
      var val = $(this).val();
      if (val != "") {
        $(this).attr("selected", false);
      }
    });
    $('select').formSelect();
    form.find(".label").addClass("active");
  }
  
  // This function runs the loading effect on buttons so users can see something is happening.
  function loadingEffectOnButtons(self, button, icon) {
    var state = self.find(button).children("i").hasClass("spin-icon");

    if (state == true) {
      $("button").attr("disabled", false);
      self.find(button).children("i").text("check").removeClass("spin-icon");

      setTimeout(function() {
        self.find(button).children("i").text(icon);
      }, 1000);
    }
    else {
      $("button").attr("disabled", true);
      self.find(button).children("i").text("refresh").addClass("spin-icon");
    }

  }
  
  // This function displays the item data in the form when edit is selected.
  function displayItemData(form, type, response) {
    var obj = JSON.parse(response);
    var id = form.find("[data-save]").attr("data-id");
    form.find(".label").addClass("active");

    $.each(obj[0], function(name, value) {
      switch (true) {
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
  
  // This function clears the form data. 
  function clearForm(form) {
    form.find("[data-save]").removeAttr("data-id data-img")
      .html("<i class='material-icons left'>save</i>SAVE");
    $("[data-create='new']").remove();

    form.trigger("reset");
    form.find(".selectOptions option:selected").each(function() {
      var val = $(this).val();
      if (val != "") {
        $(this).attr("selected", false);
      }
    });
    $('select').formSelect();
    form.find(".label").addClass("active");
  }
  
  // This fucntion triggers the select options to be loaded when the collapse is active.
  function loadSelectOnCardEdit() {
    var activeCollapse = $(".active .collapse-header").attr("data-header");
    prepareSelectData(activeCollapse);
  }
  
  // This function prepares the select options to be loaded.
  function prepareSelectData(self) {
    var collapseOpen = $(".collapsible");

    switch (self) {
      case "home":
        window.location.href = window.location.origin;
        break;
      case "exercises":
        collapseOpen.collapsible("open", 0);
        $("#exerciseOptions").empty().html(
          "<option value='' disabled selected>Choose your option</option>"
        );
        break;
      case "workouts":
        collapseOpen.collapsible("open", 1);
        ajaxGetOptions("exercise");
        $("#workoutOptions").empty().html(
          "<option value='' disabled selected>Choose your option</option>"
        );
        break;
      case "program":
        collapseOpen.collapsible("open", 2);
        ajaxGetOptions("workout");
        $("#exerciseOptions").empty().html(
          "<option value='' disabled selected>Choose your option</option>"
        );
        break;
    }
  }

});