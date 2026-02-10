import { Star, Trash2, Edit2, Calendar } from 'lucide-react';
import { Note } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export function NoteCard({ note, onEdit, onDelete, onToggleFavorite }: NoteCardProps) {
  return (
    <article className="bg-card rounded-xl border border-border p-5 card-hover animate-slide-up shadow-soft">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-serif text-lg font-bold text-card-foreground line-clamp-2 flex-1">
          {note.title}
        </h3>
        <button
          onClick={onToggleFavorite}
          className={cn("favorite-star", note.is_favorite && "active")}
        >
          <Star
            className={cn(
              "w-5 h-5 transition-colors",
              note.is_favorite ? "fill-warning text-warning" : "text-muted-foreground hover:text-warning"
            )}
          />
        </button>
      </div>

      {note.content && (
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {note.content}
        </p>
      )}

      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {note.tags.map(tag => (
            <span key={tag} className="tag-badge text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {format(new Date(note.updated_at), 'MMM d, yyyy')}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
