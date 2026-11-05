import { useState } from "react";
import { MessageSquareText, Trash2 } from "lucide-react";
import { formatDateTime } from "../../utils/date.js";
import Button from "../ui/Button.jsx";
import ConfirmDialog from "../ui/ConfirmDialog.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import FormField from "../ui/FormField.jsx";

function NotesTimeline({ notes, onAddNote, onDeleteNote }) {
  // Only this component needs these two values, so they stay local.
  const [newNote, setNewNote] = useState("");
  const [noteIdToDelete, setNoteIdToDelete] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();

    const text = newNote.trim();
    if (!text) return;

    onAddNote(text);
    setNewNote("");
  }

  return (
    <>
      <form className="timeline-form" onSubmit={handleSubmit}>
        <FormField
          id="timeline-note"
          label="Add a dated note"
          as="textarea"
          rows={3}
          placeholder="e.g. Recruiter call went well, tech round next week"
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
        />
        <Button type="submit" disabled={!newNote.trim()}>
          Add note
        </Button>
      </form>

      {notes.length === 0 ? (
        <EmptyState
          icon={MessageSquareText}
          title="No notes yet"
          message="Log calls, follow-ups and interview feedback here."
        />
      ) : (
        <ol className="timeline">
          {notes.map((note) => (
            <li key={note.id} className="timeline-entry">
              <div className="timeline-entry-header">
                <time dateTime={note.createdAt}>
                  {formatDateTime(note.createdAt)}
                </time>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Delete note"
                  onClick={() => setNoteIdToDelete(note.id)}
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>
              <p>{note.text}</p>
            </li>
          ))}
        </ol>
      )}

      <ConfirmDialog
        open={noteIdToDelete !== null}
        title="Delete this note?"
        message="This note will be removed from the timeline."
        onCancel={() => setNoteIdToDelete(null)}
        onConfirm={() => {
          onDeleteNote(noteIdToDelete);
          setNoteIdToDelete(null);
        }}
      />
    </>
  );
}

export default NotesTimeline;
