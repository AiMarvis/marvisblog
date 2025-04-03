import React from 'react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
}

interface BlogPostItemProps {
  post: BlogPost;
}

const BlogPostItem: React.FC<BlogPostItemProps> = ({ post }) => {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg shadow-lg">
      {post.imageUrl && (
        <div className="flex-shrink-0">
          <img
            className="h-48 w-full object-cover"
            src={post.imageUrl}
            alt={post.title}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between bg-white p-6">
        <div className="flex-1">
          <Link to={`/blog/${post.id}`} className="block mt-2">
            <p className="text-xl font-semibold text-gray-900">{post.title}</p>
            <p className="mt-3 text-base text-gray-500 line-clamp-3">
              {post.content}
            </p>
          </Link>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <span className="sr-only">{post.author}</span>
            <div className="h-10 w-10 rounded-full bg-gray-200" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{post.author}</p>
            <div className="flex space-x-1 text-sm text-gray-500">
              <time dateTime={post.date}>{post.date}</time>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPostItem; 