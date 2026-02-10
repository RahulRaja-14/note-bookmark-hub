import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bookmark, BookmarkFormData } from '@/types';
import { toast } from 'sonner';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTags, setFilterTags] = useState<string[]>([]);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('bookmarks').select('*').order('updated_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,url.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (filterTags.length > 0) {
        query = query.contains('tags', filterTags);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookmarks(data as Bookmark[] || []);
    } catch (error: any) {
      toast.error('Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterTags]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const createBookmark = async (formData: BookmarkFormData) => {
    try {
      if (!isValidUrl(formData.url)) {
        toast.error('Please enter a valid URL');
        return false;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('bookmarks').insert({
        user_id: user.id,
        url: formData.url.trim(),
        title: formData.title.trim() || null,
        description: formData.description.trim() || null,
        tags: formData.tags,
      });

      if (error) throw error;
      toast.success('Bookmark created!');
      fetchBookmarks();
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create bookmark');
      return false;
    }
  };

  const updateBookmark = async (id: string, formData: BookmarkFormData) => {
    try {
      if (!isValidUrl(formData.url)) {
        toast.error('Please enter a valid URL');
        return false;
      }

      const { error } = await supabase.from('bookmarks').update({
        url: formData.url.trim(),
        title: formData.title.trim() || null,
        description: formData.description.trim() || null,
        tags: formData.tags,
      }).eq('id', id);

      if (error) throw error;
      toast.success('Bookmark updated!');
      fetchBookmarks();
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update bookmark');
      return false;
    }
  };

  const deleteBookmark = async (id: string) => {
    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id);
      if (error) throw error;
      toast.success('Bookmark deleted!');
      fetchBookmarks();
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete bookmark');
      return false;
    }
  };

  const toggleFavorite = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase.from('bookmarks').update({
        is_favorite: !currentValue,
      }).eq('id', id);

      if (error) throw error;
      fetchBookmarks();
    } catch (error: any) {
      toast.error('Failed to update favorite');
    }
  };

  const allTags = [...new Set(bookmarks.flatMap(bookmark => bookmark.tags))];

  return {
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
    refetch: fetchBookmarks,
  };
}
