import { useState } from 'react';
import { Plus, Bookmark as BookmarkIcon } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SearchBar } from '@/components/shared/SearchBar';
import { TagFilter } from '@/components/shared/TagFilter';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { BookmarkCard } from '@/components/bookmarks/BookmarkCard';
import { BookmarkForm } from '@/components/bookmarks/BookmarkForm';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Bookmark } from '@/types';
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

export default function Bookmarks() {
  const {
    bookmarks,
    loading,
    searchQuery,
    setSearchQuery,
    filterTags,
    setFilterTags,
    allTags,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    toggleFavorite,
  } = useBookmarks();

  const [showForm, setShowForm] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBookmark(undefined);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteBookmark(deleteId);
      setDeleteId(null);
    }
  };

  const sortedBookmarks = [...bookmarks].sort((a, b) => {
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
            <h1 className="font-serif text-3xl font-bold">Bookmarks</h1>
            <p className="text-muted-foreground mt-1">
              {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl btn-gradient"
          >
            <Plus className="w-5 h-5" />
            New Bookmark
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search bookmarks..."
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
        ) : bookmarks.length === 0 ? (
          <EmptyState
            icon={<BookmarkIcon className="w-8 h-8 text-muted-foreground" />}
            title="No bookmarks yet"
            description={searchQuery || filterTags.length ? "No bookmarks match your search" : "Save your first bookmark to get started"}
            action={
              !searchQuery && !filterTags.length && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl btn-gradient"
                >
                  <Plus className="w-5 h-5" />
                  Add Bookmark
                </button>
              )
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedBookmarks.map(bookmark => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={() => handleEdit(bookmark)}
                onDelete={() => setDeleteId(bookmark.id)}
                onToggleFavorite={() => toggleFavorite(bookmark.id, bookmark.is_favorite)}
              />
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <BookmarkForm
            bookmark={editingBookmark}
            onSubmit={editingBookmark 
              ? (data) => updateBookmark(editingBookmark.id, data)
              : createBookmark
            }
            onClose={handleCloseForm}
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Bookmark</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this bookmark? This action cannot be undone.
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
