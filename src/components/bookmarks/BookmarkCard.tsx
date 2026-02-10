import { Star, Trash2, Edit2, Calendar, ExternalLink } from 'lucide-react';
import { Bookmark } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export function BookmarkCard({ bookmark, onEdit, onDelete, onToggleFavorite }: BookmarkCardProps) {
  const displayUrl = (() => {
    try {
      const url = new URL(bookmark.url);
      return url.hostname.replace('www.', '');
    } catch {
      return bookmark.url;
    }
  })();

  return (
    <article className="bg-card rounded-xl border border-border p-5 card-hover animate-slide-up shadow-soft">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg font-bold text-card-foreground line-clamp-2">
            {bookmark.title || displayUrl}
          </h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1"
          >
            {displayUrl}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <button
          onClick={onToggleFavorite}
          className={cn("favorite-star shrink-0", bookmark.is_favorite && "active")}
        >
          <Star
            className={cn(
              "w-5 h-5 transition-colors",
              bookmark.is_favorite ? "fill-warning text-warning" : "text-muted-foreground hover:text-warning"
            )}
          />
        </button>
      </div>

      {bookmark.description && (
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {bookmark.description}
        </p>
      )}

      {bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {bookmark.tags.map(tag => (
            <span key={tag} className="tag-badge text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {format(new Date(bookmark.updated_at), 'MMM d, yyyy')}
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
