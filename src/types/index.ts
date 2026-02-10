export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  url: string;
  title: string | null;
  description: string | null;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface NoteFormData {
  title: string;
  content: string;
  tags: string[];
}

export interface BookmarkFormData {
  url: string;
  title: string;
  description: string;
  tags: string[];
}
