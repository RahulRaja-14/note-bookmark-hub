import { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SearchBar } from '@/components/shared/SearchBar';
import { TagFilter } from '@/components/shared/TagFilter';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteForm } from '@/components/notes/NoteForm';
import { useNotes } from '@/hooks/useNotes';
import { Note } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Notes() {
  const {
    notes,
    loading,
    searchQuery,
    setSearchQuery,
    filterTags,
    setFilterTags,
    allTags,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
  } = useNotes();

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNote(undefined);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteNote(deleteId);
      setDeleteId(null);
    }
  };

  const sortedNotes = [...notes].sort((a, b) => {
    // Favorites first
    if (a.is_favorite && !b.is_favorite) return -1;
    if (!a.is_favorite && b.is_favorite) return 1;
    return 0;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold">Notes</h1>
            <p className="text-muted-foreground mt-1">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl btn-gradient"
          >
            <Plus className="w-5 h-5" />
            New Note
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search notes..."
          />
          <TagFilter
            allTags={allTags}
            selectedTags={filterTags}
            onTagsChange={setFilterTags}
          />
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : notes.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-8 h-8 text-muted-foreground" />}
            title="No notes yet"
            description={searchQuery || filterTags.length ? "No notes match your search" : "Create your first note to get started"}
            action={
              !searchQuery && !filterTags.length && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl btn-gradient"
                >
                  <Plus className="w-5 h-5" />
                  Create Note
                </button>
              )
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => handleEdit(note)}
                onDelete={() => setDeleteId(note.id)}
                onToggleFavorite={() => toggleFavorite(note.id, note.is_favorite)}
              />
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <NoteForm
            note={editingNote}
            onSubmit={editingNote 
              ? (data) => updateNote(editingNote.id, data)
              : createNote
            }
            onClose={handleCloseForm}
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Note</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this note? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
