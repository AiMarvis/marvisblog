import React, { createContext, useContext, ReactNode } from 'react';
import { useContent } from '../hooks/useContent';
import { useSupabaseContent } from '../hooks/useSupabaseContent';
import { GalleryImage, BlogPost, AITool } from '../types';

// 환경 변수 또는 설정에 따라 Supabase를 사용할지 여부를 결정
const USE_SUPABASE = true;

interface ContentContextType {
  gallery: {
    items: GalleryImage[];
    isLoading?: boolean;
    error?: string | null;
    addItem: (item: GalleryImage) => Promise<void>;
    updateItem: (id: string, item: GalleryImage) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    incrementLikes: (id: string) => Promise<void>;
    incrementViews: (id: string) => Promise<void>;
    setFeatured: (id: string, featured: boolean) => Promise<void>;
    getFeaturedItems: (limit?: number) => GalleryImage[];
    getUserItems: (userId: string) => GalleryImage[];
    refresh?: () => Promise<void>;
  };
  blog: {
    items: BlogPost[];
    isLoading?: boolean;
    error?: string | null;
    addItem: (item: BlogPost) => Promise<void>;
    updateItem: (id: string, item: BlogPost) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    incrementLikes: (id: string) => Promise<void>;
    incrementViews: (id: string) => Promise<void>;
    setFeatured: (id: string, featured: boolean) => Promise<void>;
    getFeaturedItems: (limit?: number) => BlogPost[];
    getUserItems: (userId: string) => BlogPost[];
    refresh?: () => Promise<void>;
  };
  aiTools: {
    items: AITool[];
    isLoading?: boolean;
    error?: string | null;
    addItem: (item: AITool) => Promise<void>;
    updateItem: (id: string, item: AITool) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    incrementLikes: (id: string) => Promise<void>;
    incrementViews: (id: string) => Promise<void>;
    setFeatured: (id: string, featured: boolean) => Promise<void>;
    getFeaturedItems: (limit?: number) => AITool[];
    getUserItems: (userId: string) => AITool[];
    refresh?: () => Promise<void>;
  };
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Supabase 또는 로컬 스토리지 훅 사용
  const galleryHook = USE_SUPABASE 
    ? useSupabaseContent<GalleryImage>('gallery')
    : useContent<GalleryImage>('gallery');
    
  const blogHook = USE_SUPABASE 
    ? useSupabaseContent<BlogPost>('blog')
    : useContent<BlogPost>('blog');
    
  const aiToolsHook = USE_SUPABASE 
    ? useSupabaseContent<AITool>('aiTools')
    : useContent<AITool>('aiTools');

  const value: ContentContextType = {
    gallery: galleryHook,
    blog: blogHook,
    aiTools: aiToolsHook
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContentContext = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContentContext must be used within a ContentProvider');
  }
  return context;
}; 