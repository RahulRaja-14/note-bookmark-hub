import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Bookmark, BookmarkFormData } from '@/types';
import { TagInput } from '@/components/shared/TagInput';

interface BookmarkFormProps {
  bookmark?: Bookmark;
  onSubmit: (data: BookmarkFormData) => Promise<boolean>;
  onClose: () => void;
}

export function BookmarkForm({ bookmark, onSubmit, onClose }: BookmarkFormProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    if (bookmark) {
      setUrl(bookmark.url);
      setTitle(bookmark.title || '');
      setDescription(bookmark.description || '');
      setTags(bookmark.tags);
    }
  }, [bookmark]);

  const validateUrl = (value: string) => {
    if (!value.trim()) {
      setUrlError('URL is required');
      return false;
    }
    try {
      new URL(value);
      setUrlError('');
      return true;
    } catch {
      setUrlError('Please enter a valid URL (e.g., https://example.com)');
      return false;
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value.trim()) {
      validateUrl(value);
    } else {
      setUrlError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrl(url)) return;

    setSubmitting(true);
    const success = await onSubmit({ url, title, description, tags });
    setSubmitting(false);
    
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 animate-fade-in">
      <div className="bg-card rounded-2xl shadow-medium w-full max-w-lg animate-scale-in border border-border">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-serif text-xl font-bold">
            {bookmark ? 'Edit Bookmark' : 'New Bookmark'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">URL *</label>
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com"
              className={`w-full px-4 py-3 rounded-xl bg-muted border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                urlError ? 'border-destructive' : 'border-border focus:border-primary'
              }`}
              required
            />
            {urlError && (
              <p className="text-destructive text-sm mt-1">{urlError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter bookmark title..."
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <TagInput tags={tags} onChange={setTags} />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !url.trim()}
              className="flex-1 px-4 py-3 rounded-xl btn-gradient disabled:opacity-50 transition-all"
            >
              {submitting ? 'Saving...' : bookmark ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
