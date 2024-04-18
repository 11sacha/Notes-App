
import React, { useState } from 'react';
import './App.css'

type Note = {
  id: number,
  title: string,
  content: string
}

const App = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "note title 1",
      content: "content 1"
    },
    {
      id: 2,
      title: "note title 2",
      content: "content 2"
    },
    {
      id: 3,
      title: "note title 3",
      content: "content 3"
    },
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  const handleAddNote  = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Title: ", title);
    console.log("Content: ", content);

    const newNote: Note = {
      id: notes.length + 1,
      title: title,
      content: content
    };

    setNotes([...notes, newNote]);
    setTitle("");
    setContent("");
  };

  const handleUpdateNote  = (event: React.FormEvent) => {
    event.preventDefault();

    if(!selectedNote){
      return;
    };

    const updatedNote: Note = {
      id: selectedNote.id,
      title: title,
      content: content
    };
    const updatedNoteList = notes.map((note) => 
      note.id === selectedNote.id
        ? updatedNote
        : note
    );

    setNotes(updatedNoteList)
    setTitle("")
    setContent("");
    setSelectedNote(null)
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null)
  }

  const deleteNote = (event: React.FormEvent, noteId: number) => {
    event.stopPropagation();
    const updatedNotes = notes.filter((note) => 
      note.id !== noteId
    );
    setNotes(updatedNotes);
  }


  return (
    <>
      <h1 className='title'>Personal Notes App</h1>
      <div className='app-container'>
        <form 
          className='note-form'
          onSubmit={(event) => selectedNote ? handleUpdateNote(event) : handleAddNote(event)}>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
            }} 
            placeholder='title' 
            required />
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
            }} 
            placeholder='Content' 
            required 
            rows={10}></textarea>
          
          {selectedNote ? (
            <div className='edit-buttons'>
              <button type='submit'>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          ) : (
            <button type='submit'>
              Add note
            </button>
          )}

        </form>
        <div className='notes-grid'>
          {notes.map((note, index) => (
            <div 
              className='note-item' 
              key={index}
              onClick={() => handleNoteClick(note)}>
              <div className='notes-header'>
                <button 
                  onClick={(event) => deleteNote(event, note.id)}>
                    X
                </button>
              </div>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
            </div>
          ))}
          
        </div>
      </div>
    </>
    
  )
};

export default App