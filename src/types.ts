export interface BaseItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  likes: number;
  views: number;
  isFeatured: boolean;
  category: string;
  tags: string[];
}

export interface GalleryImage extends BaseItem {
  imageUrl: string;
  altText: string;
}

export interface BlogPost extends BaseItem {
  content: string;
  editorMode: 'markdown' | 'html' | 'text';
}

export interface AITool extends BaseItem {
  name: string;
  url: string;
  provider: string;
  pricing: string;
  features: string[];
} 