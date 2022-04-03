var $textTitle = $(".note-title");
var $textArea = $(".note-textarea");
var $noteList = $(".list-container .list-group");
var $saveNote = $(".save-note");
var $newNoteBtn = $(".new-note");

var activeNote = {};

var getNotes = function () {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

var saveNote = function (note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

var deleteNote = function (id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};

var renderActiveNote = function () {
  $saveNote.hide();

  if (activeNote.id) {
    $textTitle.attr("readonly", true);
    $textArea.attr("readonly", true);
    $textTitle.val(activeNote.title);
    $textArea.val(activeNote.text);
  } else {
    $textTitle.attr("readonly", false);
    $textArea.attr("readonly", false);
    $textTitle.val("");
    $textArea.val("");
  }
};

var handleNoteSave = function () {
  var newNote = {
    title: $textTitle.val(),
    text: $textArea.val()
  };

  saveNote(newNote).then(function (data) {
    getAndRenderNotes();
    renderActiveNote();
  });
};

var handleNoteDelete = function (event) {
  event.stopPropagation();

  var note = $(this)
    .parent(".list-group-item")
    .data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(function () {
    getAndRenderNotes();
    renderActiveNote();
  });
};

var handleNoteView = function () {
  activeNote = $(this).data();
  renderActiveNote();
};

var handleNewNoteView = function () {
  activeNote = {};
  renderActiveNote();
};

var handleRenderSaveBtn = function () {
  if (!$textTitle.val().trim() || !$textArea.val().trim()) {
    $saveNote.hide();
  } else {
    $saveNote.show();
  }
};

var renderNoteList = function (notes) {
  $noteList.empty();

  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $("<span>").text(note.title);
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

var getAndRenderNotes = function () {
  return getNotes().then(function (data) {
    renderNoteList(data);
  });
};

$saveNote.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$textTitle.on("keyup", handleRenderSaveBtn);
$textArea.on("keyup", handleRenderSaveBtn);

getAndRenderNotes();