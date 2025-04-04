import { useState, useEffect } from 'react';
import { GalleryImage, BlogPost, AITool } from '../types';

type ContentType = GalleryImage | BlogPost | AITool;
type StorageKeyMap = {
  gallery: GalleryImage[];
  blog: BlogPost[];
  aiTools: AITool[];
};

interface ContentHook<T> {
  items: T[];
  addItem: (item: T) => Promise<void>;
  updateItem: (id: string, item: T) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  incrementLikes: (id: string) => Promise<void>;
  incrementViews: (id: string) => Promise<void>;
  setFeatured: (id: string, featured: boolean) => Promise<void>;
  getFeaturedItems: (limit?: number) => T[];
  getUserItems: (userId: string) => T[];
}

const getStorageKey = (key: keyof StorageKeyMap): string => {
  const keyMap: Record<keyof StorageKeyMap, string> = {
    gallery: 'galleryImages',
    blog: 'blogPosts',
    aiTools: 'aiTools'
  };
  return keyMap[key];
};

export function useContent<T extends ContentType>(
  contentType: keyof StorageKeyMap
): ContentHook<T> {
  const [items, setItems] = useState<T[]>(() => {
    const savedItems = localStorage.getItem(getStorageKey(contentType));
    return savedItems ? JSON.parse(savedItems) : [];
  });

  useEffect(() => {
    const savedItems = localStorage.getItem(getStorageKey(contentType));
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, [contentType]);

  const saveItems = async (newItems: T[]) => {
    try {
      localStorage.setItem(getStorageKey(contentType), JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.error(`Error saving ${contentType}:`, error);
      throw new Error(`Failed to save ${contentType}`);
    }
  };

  const addItem = async (item: T) => {
    try {
      const newItem = {
        ...item,
        likes: 0,
        views: 0,
        isFeatured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const newItems = [...items, newItem];
      await saveItems(newItems);
    } catch (error) {
      console.error('Error adding item:', error);
      throw new Error('Failed to add item');
    }
  };

  const updateItem = async (id: string, updatedItem: T) => {
    try {
      const existingItem = items.find(item => item.id === id);
      if (!existingItem) {
        throw new Error('Item not found');
      }

      const newItems = items.map(item =>
        item.id === id
          ? {
              ...updatedItem,
              views: item.views,
              likes: item.likes,
              updatedAt: new Date().toISOString()
            }
          : item
      );
      await saveItems(newItems);
    } catch (error) {
      console.error('Error updating item:', error);
      throw new Error('Failed to update item');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const existingItem = items.find(item => item.id === id);
      if (!existingItem) {
        throw new Error('Item not found');
      }

      const newItems = items.filter(item => item.id !== id);
      await saveItems(newItems);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw new Error('Failed to delete item');
    }
  };

  const incrementLikes = async (id: string) => {
    try {
      const existingItem = items.find(item => item.id === id);
      if (!existingItem) {
        throw new Error('Item not found');
      }

      const newItems = items.map(item =>
        item.id === id ? { ...item, likes: (item.likes || 0) + 1 } : item
      );
      await saveItems(newItems);
    } catch (error) {
      console.error('Error incrementing likes:', error);
      throw new Error('Failed to increment likes');
    }
  };

  const incrementViews = async (id: string) => {
    try {
      const existingItem = items.find(item => item.id === id);
      if (!existingItem) {
        throw new Error('Item not found');
      }

      const newItems = items.map(item =>
        item.id === id ? { ...item, views: (item.views || 0) + 1 } : item
      );
      await saveItems(newItems);
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw new Error('Failed to increment views');
    }
  };

  const setFeatured = async (id: string, featured: boolean) => {
    try {
      const existingItem = items.find(item => item.id === id);
      if (!existingItem) {
        throw new Error('Item not found');
      }

      const newItems = items.map(item =>
        item.id === id ? { ...item, isFeatured: featured } : item
      );
      await saveItems(newItems);
    } catch (error) {
      console.error('Error setting featured status:', error);
      throw new Error('Failed to set featured status');
    }
  };

  const getFeaturedItems = (limit?: number) => {
    const sortedItems = items
      .sort((a, b) => ((b.likes || 0) + (b.views || 0)) - ((a.likes || 0) + (a.views || 0)));
    
    // limit이 있으면 그 개수만큼, 아니면 모든 아이템 반환
    return limit ? sortedItems.slice(0, limit) : sortedItems;
  };

  const getUserItems = (userId: string) => {
    return items.filter(item => item.userId === userId);
  };

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    incrementLikes,
    incrementViews,
    setFeatured,
    getFeaturedItems,
    getUserItems,
  };
} 