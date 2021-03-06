let $ = require('jquery');
let fs = require('fs');
const {ipcRenderer} = require('electron')
let filename = 'notes.json';
const ipc = require('electron').ipcRenderer
let theNoteArgs

let backBtn = document.getElementById("back-Btn");
let editBtn = document.getElementById("edit-Btn");
let deleteBtn = document.getElementById("delete-Btn");
let editBtnI = document.getElementById('edit-BtnI');
let saveBtn = document.getElementById('save-Btn');

if(backBtn){
  backBtn.addEventListener("click", function(){
    ipcRenderer.send('close-note')
  })
}

if(editBtn){
  editBtn.addEventListener("click", function(){
    let noteTitle = document.getElementById('noteTitle');
    let noteBody = document.getElementById('noteBody');
    let noteBodyFooter = document.getElementById('noteBodyFooter');

    let noteTitleEdit = document.createElement('input')
    noteTitleEdit.className = 'form-control';
    noteTitleEdit.value = noteTitle.innerText

    let breakBR = document.createElement('br')

    let noteEdit = document.createElement('textarea');
    noteEdit.className = 'form-control';
    noteEdit.rows = '10';
    noteEdit.value = document.getElementById('noteBody').innerText

    let noteEditSave = document.createElement('button');
    noteEditSave.className = 'btn btn-outline-success';
    noteEditSave.id = 'save-btn'

    let noteEditSaveI = document.createElement('i');
    noteEditSaveI.className = 'fas fa-save';

    noteBody.innerText = ""
    noteBody.appendChild(noteTitleEdit);
    noteBody.appendChild(breakBR);
    noteBody.appendChild(noteEdit);
    noteEditSave.appendChild(noteEditSaveI);
    noteBodyFooter.prepend(noteEditSave);

    editBtn.disabled = true;

    noteTitleEdit.focus();

    noteEditSave.addEventListener("click", function(){
      ipcRenderer.send('close-note', [theNoteArgs.id, noteEdit.value, noteTitleEdit.value])
    })
  })
}

if(deleteBtn){
  deleteBtn.addEventListener("click", function(){
    let confirmBtn = document.createElement('button');
    confirmBtn.innerText = 'Confirm? This option can not be reversed!';
    confirmBtn.className = 'btn btn-warning';
    document.getElementById('noteBodyFooter').appendChild(confirmBtn);
    deleteBtn.disabled = true
    confirmBtn.addEventListener('click', function(){
      ipcRenderer.send('delete-note', theNoteArgs.id)
      ipcRenderer.send('close-note')
    })
  })
}

ipcRenderer.on('send-note', (event, arg) => {
  document.getElementById('noteTitle').innerText = arg.name
  document.getElementById('noteDTStamp').innerText = arg.timestamp
  document.getElementById('noteBody').innerText = arg.text
  theNoteArgs = arg
})

$(function() {
  ipcRenderer.send('request-note')
});
