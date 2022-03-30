// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
let $ = require('jquery');
let fs = require('fs');
const {ipcRenderer} = require('electron')
let filename = 'notes.json';
let sno = 0;

let newNoteBtn = document.getElementById("new-noteBtn");

if(newNoteBtn){
  newNoteBtn.addEventListener("click", function(){
    let lastID = 0
    $.getJSON(filename, function(result){
      $.each(result, function(i, field){
        if(field.id > lastID){
          lastID = field.id
        }
      });
      lastID++
      var newNoteTitle = "Note" + lastID;
      result[newNoteTitle] = {id:lastID, name: "New Note", timestamp: "Now", text: ""};
      fs.writeFile(filename, JSON.stringify(result), (err) => {
      if(err)
        console.log(err)
      })
      addEntry("New Note", lastID )
    });
  })
}

function addEntry(name, noteID){
  if(!name){
    name = "New Note " + sno++;
  }
  var ul = document.getElementById("notes-list");

  const new_entry = document.createElement('li')
  new_entry.className = 'list-group-item'

  const textToAdd = name;

  const new_text = document.createElement('text')
  new_text.innerText = textToAdd

  const succBtn = document.createElement('button')
  succBtn.className = 'btn btn-outline-success'

  const succBtnImg = document.createElement('i')
  succBtnImg.className = 'fas fa-search'

  const primBtn = document.createElement('button')
  primBtn.className = 'btn btn-outline-primary'

  const primBtnImg = document.createElement('i')
  primBtnImg.className = 'fas fa-edit'

  const delBtn = document.createElement('button')
  delBtn.className = 'btn btn-outline-danger'

  const delBtnImg = document.createElement('i')
  delBtnImg.className = 'fas fa-trash'

  const spacerEle1 = document.createElement('text')
  spacerEle1.innerText = " "
  const spacerEle2 = document.createElement('text')
  spacerEle2.innerText = " "
  const spacerEle3 = document.createElement('text')
  spacerEle3.innerText = " "
  const spacerEle4 = document.createElement('text')
  spacerEle4.innerText = " "

  new_entry.appendChild(new_text)
  new_entry.appendChild(spacerEle1)
  new_entry.appendChild(succBtn)
  succBtn.appendChild(succBtnImg)
  new_entry.appendChild(spacerEle2)
  new_entry.appendChild(primBtn)
  primBtn.appendChild(primBtnImg)
  new_entry.appendChild(spacerEle3)
  new_entry.appendChild(delBtn)
  delBtn.appendChild(delBtnImg)
  new_entry.appendChild(spacerEle4)
  ul.appendChild(new_entry)
}

function loadAndDisplayContacts() {
   //Check if file exists
  if(fs.existsSync(filename)) {
    $.getJSON(filename, function(result){
      $.each(result, function(i, field){
        sno = sno + 1
        addEntry(field.name, i)
      });
    });
  } else {
    console.log("File Doesn\'t Exist. Creating new file.")
    fs.writeFile(filename, '{ "Note1": { "id":1, "name": "Welcome to the Notes App!", "timestamp": "", "text": "This is an example note!"} }', (err) => {
      loadAndDisplayContacts();
      if(err)
      console.log(err)
    })
  }
}

loadAndDisplayContacts()

ipcRenderer.on('create-note', (event, arg) => {
  let lastID = 0
  $.getJSON(filename, function(result){
    $.each(result, function(i, field){
      if(field.id > lastID){
        lastID = field.id
      }
    });
    lastID++
    var newNoteTitle = "Note" + lastID;
    result[newNoteTitle] = {id:lastID, name: "New Note", timestamp: "Now", text: ""};
    fs.writeFile(filename, JSON.stringify(result), (err) => {
    if(err)
      console.log(err)
    })
    addEntry("New Note", lastID )
  });
})

function readyFn() {
}

$(function() {
    console.log( "ready!" );
    ipcRenderer.send('setup-client')
});
