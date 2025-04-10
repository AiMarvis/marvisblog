import { useState, useEffect } from 'react';
import { supabase, SupabaseGalleryImage, SupabaseBlogPost, SupabaseAITool } from '../lib/supabase';
import { GalleryImage, BlogPost, AITool } from '../types';
import { v4 as uuidv4 } from 'uuid';

type ContentType = GalleryImage | BlogPost | AITool;
type SupabaseContentType = SupabaseGalleryImage | SupabaseBlogPost | SupabaseAITool;

type TableMap = {
  gallery: 'gallery_images';
  blog: 'blog_posts';
  aiTools: 'ai_tools';
};

interface ContentHook<T> {
  items: T[];
  isLoading: boolean;
  error: string | null;
  addItem: (item: T) => Promise<void>;
  updateItem: (id: string, item: T) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  incrementLikes: (id: string) => Promise<void>;
  incrementViews: (id: string) => Promise<void>;
  setFeatured: (id: string, featured: boolean) => Promise<void>;
  getFeaturedItems: (limit?: number) => T[];
  getUserItems: (userId: string) => T[];
  refresh: () => Promise<void>;
}

// 테이블 매핑
const getTableName = (contentType: keyof TableMap): string => {
  const tableMap: TableMap = {
    gallery: 'gallery_images',
    blog: 'blog_posts',
    aiTools: 'ai_tools'
  };
  return tableMap[contentType];
};

// 데이터 변환 함수: 앱 모델 -> Supabase 모델
const transformToSupabase = (item: ContentType, contentType: keyof TableMap): SupabaseContentType => {
  if (contentType === 'gallery') {
    const galleryImage = item as GalleryImage;
    return {
      id: galleryImage.id,
      title: galleryImage.title,
      description: galleryImage.description,
      category: galleryImage.category,
      image_url: galleryImage.imageUrl,
      alt_text: galleryImage.altText,
      tags: galleryImage.tags || [],
      likes: galleryImage.likes || 0,
      views: galleryImage.views || 0,
      user_id: galleryImage.userId,
      is_featured: galleryImage.isFeatured || false,
      created_at: galleryImage.createdAt,
      updated_at: galleryImage.updatedAt || new Date().toISOString()
    } as SupabaseGalleryImage;
  }
  
  if (contentType === 'blog') {
    const blogPost = item as BlogPost;
    return {
      id: blogPost.id,
      title: blogPost.title,
      content: blogPost.content,
      editor_mode: blogPost.editorMode,
      tags: blogPost.tags || [],
      likes: blogPost.likes || 0,
      views: blogPost.views || 0,
      user_id: blogPost.userId,
      is_featured: blogPost.isFeatured || false,
      created_at: blogPost.createdAt,
      updated_at: blogPost.updatedAt || new Date().toISOString()
    } as SupabaseBlogPost;
  }
  
  if (contentType === 'aiTools') {
    const aiTool = item as AITool;
    return {
      id: aiTool.id,
      name: aiTool.name,
      description: aiTool.description,
      url: aiTool.url,
      category: aiTool.category,
      provider: aiTool.provider || '',
      pricing: aiTool.pricing || '',
      features: aiTool.features || [],
      tags: aiTool.tags || [],
      likes: aiTool.likes || 0,
      views: aiTool.views || 0,
      user_id: aiTool.userId,
      is_featured: aiTool.isFeatured || false,
      created_at: aiTool.createdAt,
      updated_at: aiTool.updatedAt || new Date().toISOString()
    } as SupabaseAITool;
  }
  
  throw new Error(`Unsupported content type: ${contentType}`);
};

// 데이터 변환 함수: Supabase 모델 -> 앱 모델
const transformFromSupabase = <T extends ContentType>(item: any, contentType: keyof TableMap): T => {
  if (contentType === 'gallery') {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      imageUrl: item.image_url,
      altText: item.alt_text,
      tags: item.tags || [],
      likes: item.likes || 0,
      views: item.views || 0,
      userId: item.user_id,
      isFeatured: item.is_featured || false,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    } as unknown as T;
  }
  
  if (contentType === 'blog') {
    return {
      id: item.id,
      title: item.title,
      content: item.content,
      editorMode: item.editor_mode,
      tags: item.tags || [],
      likes: item.likes || 0,
      views: item.views || 0,
      userId: item.user_id,
      isFeatured: item.is_featured || false,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    } as unknown as T;
  }
  
  if (contentType === 'aiTools') {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      url: item.url,
      category: item.category,
      provider: item.provider,
      pricing: item.pricing,
      features: item.features || [],
      tags: item.tags || [],
      likes: item.likes || 0,
      views: item.views || 0,
      userId: item.user_id,
      isFeatured: item.is_featured || false,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    } as unknown as T;
  }
  
  throw new Error(`Unsupported content type: ${contentType}`);
};

export function useSupabaseContent<T extends ContentType>(
  contentType: keyof TableMap
): ContentHook<T> {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const tableName = getTableName(contentType);
  
  // 데이터 로드 함수
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*');
      
      if (error) {
        throw error;
      }
      
      const transformedData = data.map(item => transformFromSupabase<T>(item, contentType));
      setItems(transformedData);
    } catch (err: any) {
      console.error(`Error fetching ${contentType}:`, err.message);
      setError(`Failed to load ${contentType}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 초기 데이터 로드
  useEffect(() => {
    fetchItems();
  }, [contentType]);
  
  // 아이템 추가
  const addItem = async (item: T) => {
    try {
      const newItem = {
        ...item,
        id: item.id || uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 갤러리 이미지의 경우 Storage 처리
      if (contentType === 'gallery') {
        const galleryImage = newItem as unknown as GalleryImage;
        
        // Base64 이미지인 경우 업로드 처리
        if (galleryImage.imageUrl && galleryImage.imageUrl.startsWith('data:image')) {
          try {
            // Base64 데이터 추출
            const base64Data = galleryImage.imageUrl.split(',')[1];
            if (!base64Data) throw new Error('Invalid image data');
            
            // 이미지 데이터를 Blob으로 변환
            const blob = await fetch(galleryImage.imageUrl).then(res => res.blob());
            const fileExt = blob.type.split('/')[1] || 'png';
            const fileName = `${newItem.id}.${fileExt}`;
            
            // Storage에 업로드 - 폴더 구조 단순화 (gallery/ 폴더 사용하지 않음)
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('images')
              .upload(fileName, blob, {
                contentType: blob.type,
                upsert: true
              });
              
            if (uploadError) throw uploadError;
            
            // 업로드된 이미지 URL 가져오기
            const { data: urlData } = supabase.storage
              .from('images')
              .getPublicUrl(fileName);
              
            // 이미지 URL 업데이트
            galleryImage.imageUrl = urlData.publicUrl;
            
            // 디버그 로그
            console.log('이미지 업로드 성공:', fileName);
            console.log('이미지 URL:', urlData.publicUrl);
          } catch (storageError: any) {
            console.error('Storage upload error:', storageError);
            throw new Error(`Storage upload failed: ${storageError.message}`);
          }
        }
      }
      
      const supabaseItem = transformToSupabase(newItem, contentType);
      
      const { error } = await supabase
        .from(tableName)
        .insert(supabaseItem);
      
      if (error) {
        throw error;
      }
      
      await fetchItems(); // 새로고침
    } catch (err: any) {
      console.error('Error adding item:', err.message);
      throw new Error(`Failed to add item: ${err.message}`);
    }
  };
  
  // 아이템 업데이트
  const updateItem = async (id: string, updatedItem: T) => {
    try {
      const itemToUpdate = {
        ...updatedItem,
        updatedAt: new Date().toISOString()
      };
      
      // 갤러리 이미지의 경우 Storage 처리
      if (contentType === 'gallery') {
        const galleryImage = itemToUpdate as unknown as GalleryImage;
        
        // Base64 이미지인 경우 업로드 처리 (이미지가 변경된 경우)
        if (galleryImage.imageUrl && galleryImage.imageUrl.startsWith('data:image')) {
          try {
            // 이미지 데이터를 Blob으로 변환
            const blob = await fetch(galleryImage.imageUrl).then(res => res.blob());
            const fileExt = blob.type.split('/')[1] || 'png';
            const fileName = `${id}.${fileExt}`;
            
            // Storage에 업로드 - 폴더 구조 단순화
            const { error: uploadError } = await supabase.storage
              .from('images')
              .upload(fileName, blob, {
                contentType: blob.type,
                upsert: true
              });
              
            if (uploadError) throw uploadError;
            
            // 업로드된 이미지 URL 가져오기
            const { data: urlData } = supabase.storage
              .from('images')
              .getPublicUrl(fileName);
              
            // 이미지 URL 업데이트
            galleryImage.imageUrl = urlData.publicUrl;
            
            // 디버그 로그
            console.log('이미지 업데이트 성공:', fileName);
            console.log('이미지 URL:', urlData.publicUrl);
          } catch (storageError: any) {
            console.error('Storage upload error:', storageError);
            throw new Error(`Storage upload failed: ${storageError.message}`);
          }
        }
      }
      
      const supabaseItem = transformToSupabase(itemToUpdate, contentType);
      
      const { error } = await supabase
        .from(tableName)
        .update(supabaseItem)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      await fetchItems(); // 새로고침
    } catch (err: any) {
      console.error('Error updating item:', err.message);
      throw new Error(`Failed to update item: ${err.message}`);
    }
  };
  
  // 아이템 삭제
  const deleteItem = async (id: string) => {
    try {
      // 갤러리 이미지의 경우 Storage에서도 삭제
      if (contentType === 'gallery') {
        try {
          const item = items.find(item => item.id === id) as unknown as GalleryImage;
          if (item && item.imageUrl) {
            // URL에서 파일 경로 추출
            const fileUrl = item.imageUrl;
            const fileName = fileUrl.split('/').pop();
            
            if (fileName) {
              // 폴더 구조 단순화 - gallery/ 폴더 사용하지 않음
              const { error: deleteError } = await supabase.storage
                .from('images')
                .remove([fileName]);
                
              if (deleteError) {
                console.error('파일 삭제 오류:', deleteError);
              } else {
                console.log('파일 삭제 성공:', fileName);
              }
            }
          }
        } catch (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // 파일 삭제 실패해도 계속 진행
        }
      }
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      await fetchItems(); // 새로고침
    } catch (err: any) {
      console.error('Error deleting item:', err.message);
      throw new Error(`Failed to delete item: ${err.message}`);
    }
  };
  
  // 좋아요 증가
  const incrementLikes = async (id: string) => {
    try {
      const item = items.find(item => item.id === id);
      if (!item) {
        throw new Error('Item not found');
      }
      
      const { error } = await supabase.rpc('increment_likes', {
        table_name: tableName,
        row_id: id
      });
      
      if (error) {
        // 대체 방법: RPC가 없는 경우 직접 업데이트
        const currentLikes = item.likes || 0;
        await supabase
          .from(tableName)
          .update({ likes: currentLikes + 1 })
          .eq('id', id);
      }
      
      await fetchItems(); // 새로고침
    } catch (err: any) {
      console.error('Error incrementing likes:', err.message);
      throw new Error(`Failed to increment likes: ${err.message}`);
    }
  };
  
  // 조회수 증가
  const incrementViews = async (id: string) => {
    try {
      const item = items.find(item => item.id === id);
      if (!item) {
        throw new Error('Item not found');
      }
      
      const { error } = await supabase.rpc('increment_views', {
        table_name: tableName,
        row_id: id
      });
      
      if (error) {
        // 대체 방법: RPC가 없는 경우 직접 업데이트
        const currentViews = item.views || 0;
        await supabase
          .from(tableName)
          .update({ views: currentViews + 1 })
          .eq('id', id);
      }
      
      await fetchItems(); // 새로고침
    } catch (err: any) {
      console.error('Error incrementing views:', err.message);
      throw new Error(`Failed to increment views: ${err.message}`);
    }
  };
  
  // 추천 여부 설정
  const setFeatured = async (id: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .update({ is_featured: featured })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      await fetchItems(); // 새로고침
    } catch (err: any) {
      console.error('Error setting featured status:', err.message);
      throw new Error(`Failed to set featured status: ${err.message}`);
    }
  };
  
  // 추천 아이템 가져오기
  const getFeaturedItems = (limit?: number) => {
    const sortedItems = [...items].sort((a, b) => ((b.likes || 0) + (b.views || 0)) - ((a.likes || 0) + (a.views || 0)));
    return limit ? sortedItems.slice(0, limit) : sortedItems;
  };
  
  // 사용자별 아이템 가져오기
  const getUserItems = (userId: string) => {
    return items.filter(item => item.userId === userId);
  };
  
  // 데이터 새로고침
  const refresh = async () => {
    await fetchItems();
  };
  
  return {
    items,
    isLoading,
    error,
    addItem,
    updateItem,
    deleteItem,
    incrementLikes,
    incrementViews,
    setFeatured,
    getFeaturedItems,
    getUserItems,
    refresh
  };
} 