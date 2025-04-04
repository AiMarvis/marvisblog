export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  tags: string[];
  createdAt: string;
  likes: number;
  views: number;
  userId: string; // 작성자 식별을 위한 필드
  isFeatured: boolean; // 추천 작품 여부
  altText?: string; // 이미지 대체 텍스트
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  editorMode: 'basic' | 'markdown' | 'html';
  createdAt: string;
  tags: string[];
  likes: number;
  views: number;
  userId: string;
  isFeatured: boolean;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  createdAt: string;
  likes: number;
  views: number;
  userId: string;
  isFeatured: boolean;
}

export interface User {
  id: string;
  isAdmin: boolean;
} 