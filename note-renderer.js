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
    let noteBody = document.getElementById('noteBody');
    let noteBodyFooter = document.getElementById('noteBodyFooter');

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
    noteBody.appendChild(noteEdit);
    noteEditSave.appendChild(noteEditSaveI);
    noteBodyFooter.prepend(noteEditSave);

    editBtn.disabled = true;

    noteEdit.focus();

    noteEditSave.addEventListener("click", function(){
      // write the changes
      $.getJSON(filename, function(result){
        $.each(result, function(i, field){
          if(theNoteArgs.id == field.id){
            result[i].text = noteEdit.value
          }
        });
        fs.writeFile(filename, JSON.stringify(result), (err) => {
        if(err)
          console.log(err)
        })
      });
      ipcRenderer.send('close-note', noteEdit.value)      
//      noteBody.innerText = noteEdit.value
//      noteEditSave.remove()
//      noteEdit.remove()
//      editBtn.disabled = false;
    })
  })
}

if(deleteBtn){
  deleteBtn.addEventListener("click", function(){
    let confirmBtn = document.createElement('button');
    confirmBtn.innerText = 'Confirm? This option can not be reversed!';
    confirmBtn.className = 'btn btn-warning';
    document.getElementById('noteBodyFooter').appendChild(confirmBtn);

    confirmBtn.addEventListener('click', function(){
      $.getJSON(filename, function(result){
        $.each(result, function(i, field){
          if(theNoteArgs.id == field.id){
            delete result[i]
          }
        });
        fs.writeFile(filename, JSON.stringify(result), (err) => {
        if(err)
          console.log(err)
        })
        ipcRenderer.send('close-note')
      });
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
