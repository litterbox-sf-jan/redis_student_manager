$(document).ready(function(){
  var val, newName;
  //ajax calls

  //get all students
  function getStudents(){
    $.getJSON("/students.json", function(students){
      var obj = {
        students: students
      }
      var source = $("#template").html();
      var template = Handlebars.compile(source)(obj);
      $("#info").html(template)
    })
  }

  //add a student
  function addStudent(name){
    $.ajax({
      method: "POST",
      url: "/add.json",
      data: {name: name},
      success: function(data){
        console.log(data)
        getStudents();
      }
    })
  }

  //update a student
  function editStudent(name,newName){
    $.ajax({
      method: "PUT",
      url: "/student/" + name + ".json",
      data: {newName: newName},
      success: function(data){
        console.log(data)
        getStudents();
      },
      error: function(err){
        console.log(err)
      }
    })
  }


  //delete a student
  function deleteStudent(name){
    $.ajax({
      method: "DELETE",
      url: "/student/" + name + ".json",
      success: function(data){
        console.log(data)
        getStudents();
      },
      error: function(err){
        console.log(err)
      }
    })
  }

  //delete all students
  function deleteStudents(){
    $.ajax({
      method: "DELETE",
      url: "/students.json",
      success: function(data){
        console.log(data)
        getStudents();
      },
      error: function(err){
        console.log(err)
      }
    })
  }

  // start by grabbing all existing students
  getStudents()

  $("body").on("click", ".edit", function(){
    // insert an form with input and button
    val = $(this).parent().text().trim()
    var $form = '<form class="edit-one" action="/student/' + val + '.json?_method=put" method="POST"><input class="new-name" type="text" value="' + val + '"><input class= "btn btn-sm btn-info" type="submit" value="edit"></form>'
    // $("body").append($form)
    $(this).parent().parent().append($form)
    // hide delete button
    $(this).parent().next().hide()
    // hide the pencil
    $(this).parent().hide()

    // TODO - FIX DOUBLE EVENT DELEGATION!
    $(".edit-one").on("submit", function(e){
      e.preventDefault();
      newName = $(".new-name").val();
      console.log(newName)
      editStudent(val,newName);
      getStudents();
    })
  })



  $("body").on("submit", ".remove-one", function(e){
    e.preventDefault();
    $(this).hide();
    val = $(this).children()[0].innerText.trim();
    deleteStudent(val);
  })

  $(".add").on("submit", function(e){
    e.preventDefault();
    val = $("#name").val();
    addStudent(val);
    $("#name").val("");
  })

  $(".delete-all").on("click", function(e){
    e.preventDefault();
    var conf = confirm("are you sure?");
    if (conf){
      deleteStudents();
    }
  })
});