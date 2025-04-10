import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lpivaajkduaztcxrcvek.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwaXZhYWprZHVhenRjeHJjdmVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NDUzMzksImV4cCI6MjA1OTUyMTMzOX0.gNBx6m3vcbKkH8pDoH8VSpCV1abNjmK6vb3WI4fGfLo';

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 타입 정의
export type SupabaseGalleryImage = {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  alt_text?: string;
  tags: string[];
  likes: number;
  views: number;
  user_id: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type SupabaseBlogPost = {
  id: string;
  title: string;
  content: string;
  editor_mode: string;
  tags: string[];
  likes: number;
  views: number;
  user_id: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type SupabaseAITool = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  provider?: string;
  pricing?: string;
  features: string[];
  tags: string[];
  likes: number;
  views: number;
  user_id: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}; 