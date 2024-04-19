
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

  const handleAddNote  = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:1234/api/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title,
            content
          })
        }
      );

      const newNote = await response.json();

      setNotes([...notes, newNote]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.log(error)
    }

    
  };

  const handleUpdateNote  = async (event: React.FormEvent) => {
    event.preventDefault();

    if(!selectedNote){
      return;
    };

    try {
      const response = await fetch(`http://localhost:1234/api/notes/${selectedNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title,
            content
          })
        }
      );

      const updatedNote = await response.json();


      const updatedNoteList = notes.map((note) => 
        note.id === selectedNote.id
          ? updatedNote
          : note
      );
  
      setNotes(updatedNoteList)
      setTitle("")
      setContent("");
      setSelectedNote(null)
    } catch (error) {
      console.log(error)
    };
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null)
  }

  const deleteNote = async (event: React.FormEvent, noteId: number) => {
    event.stopPropagation();

    try {
      const response = await fetch(`http://localhost:1234/api/notes/${noteId}`,
        {
          method: "DELETE"
        }
      );

      const updatedNotes = notes.filter((note) => 
        note.id !== noteId
      )

      setNotes(updatedNotes);
    } catch (error) {
      console.log(error)
    };
  };


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