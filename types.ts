
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface UserProfile {
  name: string;
  blogName: string;
  bio: string;
  avatar: string;
}

export type ViewType = 'dashboard' | 'editor' | 'reader' | 'settings' | 'post-view';
