import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Note, NoteFormData } from '@/types';
import { toast } from 'sonner';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTags, setFilterTags] = useState<string[]>([]);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('notes').select('*').order('updated_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      if (filterTags.length > 0) {
        query = query.contains('tags', filterTags);
      }

      const { data, error } = await query;

      if (error) throw error;
      setNotes(data as Note[] || []);
    } catch (error: any) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterTags]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (formData: NoteFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('notes').insert({
        user_id: user.id,
        title: formData.title.trim(),
        content: formData.content.trim() || null,
        tags: formData.tags,
      });

      if (error) throw error;
      toast.success('Note created!');
      fetchNotes();
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create note');
      return false;
    }
  };

  const updateNote = async (id: string, formData: NoteFormData) => {
    try {
      const { error } = await supabase.from('notes').update({
        title: formData.title.trim(),
        content: formData.content.trim() || null,
        tags: formData.tags,
      }).eq('id', id);

      if (error) throw error;
      toast.success('Note updated!');
      fetchNotes();
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update note');
      return false;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error;
      toast.success('Note deleted!');
      fetchNotes();
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete note');
      return false;
    }
  };

  const toggleFavorite = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase.from('notes').update({
        is_favorite: !currentValue,
      }).eq('id', id);

      if (error) throw error;
      fetchNotes();
    } catch (error: any) {
      toast.error('Failed to update favorite');
    }
  };

  const allTags = [...new Set(notes.flatMap(note => note.tags))];

  return {
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
    refetch: fetchNotes,
  };
}
