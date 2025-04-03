import { useState, useEffect } from 'react';
import { GalleryImage, BlogPost, AITool } from '../types';

interface ContentHook<T> {
  items: T[];
  addItem: (item: T) => Promise<void>;
  updateItem: (id: string, item: T) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  incrementLikes: (id: string) => Promise<void>;
  incrementViews: (id: string) => Promise<void>;
  setFeatured: (id: string, featured: boolean) => Promise<void>;
  getFeaturedItems: () => T[];
  getUserItems: (userId: string) => T[];
}

export function useContent<T extends { id: string; likes: number; views: number; isFeatured: boolean; userId: string }>(
  storageKey: string
): ContentHook<T> {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    const savedItems = localStorage.getItem(storageKey);
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, [storageKey]);

  const saveItems = async (newItems: T[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.error(`Error saving ${storageKey}:`, error);
      throw new Error(`Failed to save ${storageKey}`);
    }
  };

  const addItem = async (item: T) => {
    try {
      const newItems = [...items, { ...item, likes: 0, views: 0, isFeatured: false }];
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
        item.id === id ? { ...updatedItem, views: item.views, likes: item.likes } : item
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

  const getFeaturedItems = () => {
    return items
      .filter(item => item.isFeatured)
      .sort((a, b) => (b.likes || 0) - (a.likes || 0));
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