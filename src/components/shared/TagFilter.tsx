import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagFilter({ allTags, selectedTags, onTagsChange }: TagFilterProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  if (allTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {allTags.map(tag => (
        <button
          key={tag}
          onClick={() => toggleTag(tag)}
          className={cn(
            "tag-badge cursor-pointer transition-all duration-200",
            selectedTags.includes(tag) && "tag-badge-primary"
          )}
        >
          {tag}
          {selectedTags.includes(tag) && (
            <X className="w-3 h-3 ml-1" />
          )}
        </button>
      ))}
    </div>
  );
}
