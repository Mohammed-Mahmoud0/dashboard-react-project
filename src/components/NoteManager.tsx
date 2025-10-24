import { useState, useEffect } from "react";

interface Note {
  id: string;
  text: string;
  priority: "important" | "normal" | "delayed";
  createdAt: string;
}

function NoteManager() {
  const [noteText, setNoteText] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<
    "important" | "normal" | "delayed"
  >("normal");
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!noteText.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      text: noteText.trim(),
      priority: selectedPriority,
      createdAt: new Date().toLocaleString(),
    };

    setNotes((prevNotes) => [...prevNotes, newNote]);
    setNoteText("");
    setSelectedPriority("normal");
  };

  const deleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const changePriority = (
    id: string,
    newPriority: "important" | "normal" | "delayed"
  ) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, priority: newPriority } : note
      )
    );
  };

  const importantNotes = notes.filter((note) => note.priority === "important");
  const normalNotes = notes.filter((note) => note.priority === "normal");
  const delayedNotes = notes.filter((note) => note.priority === "delayed");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      addNote();
    }
  };
  return (
    <div className="container-fluid py-4 note-manager-dark">
      <div className="row">
        <div className="col-12">
          <div className="mb-4">
            <h2 className="text-white mb-2">Note Manager</h2>
            <p className="text-light">
              Create and organize your notes by priority
            </p>
          </div>

          <div className="card dark-card mb-4">
            <div
              className="card-header"
              style={{
                backgroundColor: "#2d2d2d",
                borderBottom: "1px solid #404040",
              }}
            >
              <h4 className="text-white mb-0">Add New Note</h4>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="noteText" className="form-label text-white">
                  Note Text
                </label>
                <textarea
                  id="noteText"
                  className="form-control bg-dark text-white border-secondary"
                  rows={3}
                  placeholder="Enter your note here... (Ctrl+Enter to add quickly)"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  style={{ backgroundColor: "#1a1a1a", borderColor: "#404040" }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="priority" className="form-label text-white">
                  Priority
                </label>
                <select
                  id="priority"
                  className="form-select bg-dark text-white border-secondary"
                  value={selectedPriority}
                  onChange={(e) =>
                    setSelectedPriority(
                      e.target.value as "important" | "normal" | "delayed"
                    )
                  }
                  style={{ backgroundColor: "#1a1a1a", borderColor: "#404040" }}
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>

              <button
                className="btn btn-primary"
                onClick={addNote}
                disabled={!noteText.trim()}
              >
                Add Note
              </button>
              {notes.length > 0 && (
                <span className="text-light ms-3">
                  Total notes: {notes.length}
                </span>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 col-md-12 mb-4">
              <div className="card dark-card h-100">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#dc3545",
                    borderBottom: "1px solid #404040",
                  }}
                >
                  <h5 className="text-white mb-0">
                    Important ({importantNotes.length})
                  </h5>
                </div>
                <div
                  className="card-body"
                  style={{
                    minHeight: "300px",
                    maxHeight: "500px",
                    overflowY: "auto",
                  }}
                >
                  {importantNotes.length === 0 ? (
                    <p className="text-light">No important notes yet.</p>
                  ) : (
                    importantNotes.map((note) => (
                      <div
                        key={note.id}
                        className="mb-3 p-3"
                        style={{
                          backgroundColor: "#1a1a1a",
                          borderRadius: "8px",
                          border: "1px solid #404040",
                        }}
                      >
                        <p className="text-white mb-2">{note.text}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-light">{note.createdAt}</small>
                          <div>
                            <select
                              className="form-select form-select-sm bg-dark text-white me-2"
                              value={note.priority}
                              onChange={(e) =>
                                changePriority(
                                  note.id,
                                  e.target.value as
                                    | "important"
                                    | "normal"
                                    | "delayed"
                                )
                              }
                              style={{
                                backgroundColor: "#1a1a1a",
                                borderColor: "#404040",
                                width: "auto",
                                display: "inline-block",
                              }}
                            >
                              <option value="important">Important</option>
                              <option value="normal">Normal</option>
                              <option value="delayed">Delayed</option>
                            </select>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteNote(note.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-12 mb-4">
              <div className="card dark-card h-100">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#0d6efd",
                    borderBottom: "1px solid #404040",
                  }}
                >
                  <h5 className="text-white mb-0">
                    Normal ({normalNotes.length})
                  </h5>
                </div>
                <div
                  className="card-body"
                  style={{
                    minHeight: "300px",
                    maxHeight: "500px",
                    overflowY: "auto",
                  }}
                >
                  {normalNotes.length === 0 ? (
                    <p className="text-light">No normal notes yet.</p>
                  ) : (
                    normalNotes.map((note) => (
                      <div
                        key={note.id}
                        className="mb-3 p-3"
                        style={{
                          backgroundColor: "#1a1a1a",
                          borderRadius: "8px",
                          border: "1px solid #404040",
                        }}
                      >
                        <p className="text-white mb-2">{note.text}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-light">{note.createdAt}</small>
                          <div>
                            <select
                              className="form-select form-select-sm bg-dark text-white me-2"
                              value={note.priority}
                              onChange={(e) =>
                                changePriority(
                                  note.id,
                                  e.target.value as
                                    | "important"
                                    | "normal"
                                    | "delayed"
                                )
                              }
                              style={{
                                backgroundColor: "#1a1a1a",
                                borderColor: "#404040",
                                width: "auto",
                                display: "inline-block",
                              }}
                            >
                              <option value="important">Important</option>
                              <option value="normal">Normal</option>
                              <option value="delayed">Delayed</option>
                            </select>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteNote(note.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-12 mb-4">
              <div className="card dark-card h-100">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#ffc107",
                    borderBottom: "1px solid #404040",
                  }}
                >
                  <h5 className="text-dark mb-0">
                    Delayed ({delayedNotes.length})
                  </h5>
                </div>
                <div
                  className="card-body"
                  style={{
                    minHeight: "300px",
                    maxHeight: "500px",
                    overflowY: "auto",
                  }}
                >
                  {delayedNotes.length === 0 ? (
                    <p className="text-light">No delayed notes yet.</p>
                  ) : (
                    delayedNotes.map((note) => (
                      <div
                        key={note.id}
                        className="mb-3 p-3"
                        style={{
                          backgroundColor: "#1a1a1a",
                          borderRadius: "8px",
                          border: "1px solid #404040",
                        }}
                      >
                        <p className="text-white mb-2">{note.text}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-light">{note.createdAt}</small>
                          <div>
                            <select
                              className="form-select form-select-sm bg-dark text-white me-2"
                              value={note.priority}
                              onChange={(e) =>
                                changePriority(
                                  note.id,
                                  e.target.value as
                                    | "important"
                                    | "normal"
                                    | "delayed"
                                )
                              }
                              style={{
                                backgroundColor: "#1a1a1a",
                                borderColor: "#404040",
                                width: "auto",
                                display: "inline-block",
                              }}
                            >
                              <option value="important">Important</option>
                              <option value="normal">Normal</option>
                              <option value="delayed">Delayed</option>
                            </select>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteNote(note.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteManager;
