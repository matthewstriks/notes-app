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
    writeNewEntry();
  })
}

function writeNewEntry(){
  let lastID = 0
  $.getJSON(filename, function(result){
    $.each(result, function(i, field){
      if(field.id > lastID){
        lastID = field.id
      }
    });
    lastID++
    var newNoteTitle = "Note" + lastID;
    let today = new Date();
    result[newNoteTitle] = {id:lastID, name: "New Note", timestamp: today.toLocaleDateString("en-US") + " " + today.getHours() + ":" + today.getMinutes(), text: ""};
    fs.writeFile(filename, JSON.stringify(result), (err) => {
    if(err)
      console.log(err)
    })
    addEntry("New Note", newNoteTitle )
  });
}

function openBtnFunction(btnID){
  document.getElementById(btnID).addEventListener("click", function(){
    console.log('open! ' + btnID);
    let noteToOpen
    $.getJSON(filename, function(result){
      $.each(result, function(i, field){
        if ('open-' + i == btnID) {
          noteToOpen = result[i];
        }
      });
      console.log(noteToOpen);
      ipcRenderer.send('open-note', noteToOpen)
    });
  })
}

function deleteBtnFunction(btnID){
  document.getElementById(btnID).addEventListener("click", function(){
    let confirmBtn = document.createElement('button');
    confirmBtn.innerText = 'Confirm? This option can not be reversed!';
    confirmBtn.className = 'btn btn-warning';
    document.getElementById(document.getElementById(btnID).noteid).appendChild(confirmBtn);
    confirmBtn.addEventListener('click', function(){
      $.getJSON(filename, function(result){
        $.each(result, function(i, field){
          if(document.getElementById(btnID).noteid == i){
            delete result[i]
          }
        });
        fs.writeFile(filename, JSON.stringify(result), (err) => {
        loadAndDisplayContacts()
        if(err)
          console.log(err)
        })
      });
    })
  })
}

function addEntry(name, noteID){
  if(!name){
    name = "New Note " + sno++;
  }
  var ul = document.getElementById("notes-list");

  const new_entry = document.createElement('li')
  new_entry.className = 'list-group-item'
  new_entry.setAttribute("id", noteID);

  const textToAdd = name;

  const new_text = document.createElement('text')
  new_text.innerText = textToAdd

  // open note
  const succBtn = document.createElement('button')
  succBtn.className = 'btn btn-outline-success'
  succBtn.setAttribute("id", "open-"+noteID);
  const succBtnImg = document.createElement('i')
  succBtnImg.className = 'fas fa-search'

  // delete note
  const delBtn = document.createElement('button')
  delBtn.className = 'btn btn-outline-danger'
  delBtn.setAttribute("id", "delete-"+noteID);
  delBtn.noteid = noteID;
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
  new_entry.appendChild(delBtn)
  delBtn.appendChild(delBtnImg)
  new_entry.appendChild(spacerEle4)
  ul.appendChild(new_entry)

  openBtnFunction("open-"+noteID)
  deleteBtnFunction("delete-"+noteID)
}

function loadAndDisplayContacts() {
  document.getElementById("notes-list").innerHTML = "";
   //Check if file exists
  if(fs.existsSync(filename)) {
    $.getJSON(filename, function(result){
      $.each(result, function(i, field){
        sno = sno + 1
        console.log(i);
        addEntry(field.name, i)
      });
    });
  } else {
    console.log("File Doesn\'t Exist. Creating new file.")
    let today = new Date();
    fs.writeFile(filename, '{ "Note1": { "id":1, "name": "Welcome to the Notes App!", "timestamp": "' + today.toLocaleDateString("en-US") + ' ' + today.getHours() + ':' + today.getMinutes() + '", "text": "This is an example note!"} }', (err) => {
      loadAndDisplayContacts();
      if(err)
      console.log(err)
    })
  }
}

loadAndDisplayContacts()

ipcRenderer.on('create-note', (event, arg) => {
  writeNewEntry();
})

ipcRenderer.on('refresh-notes', (event, arg) => {
  loadAndDisplayContacts()
})

$(function() {
  ipcRenderer.send('setup-client')
});
