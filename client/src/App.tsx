
import React, { useEffect, useState } from 'react';
import './App.css'

type Note = {
  id: number,
  title: string,
  content: string
}

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = 
          await fetch("http://localhost:1234/api/notes")
        const notes: Note[] = await response.json()

        setNotes(notes)
      } catch (error) {
        console.log(error)
      }
    };
    fetchNotes();
  }, []);

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