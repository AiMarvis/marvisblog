import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import AdminModal from '../components/AdminModal';
import { useAdmin } from '../hooks/useAdmin';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  editorMode: 'basic' | 'markdown' | 'html';
  createdAt: string;
  tags: string[];
  userId: string;
  likes: number;
  views: number;
  isFeatured: boolean;
}

const Blog = () => {
  const navigate = useNavigate();
  const { isAdmin, isModalOpen, error, openModal, closeModal, verifyPassword } = useAdmin();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // 로컬 스토리지에서 포스트 데이터 로드
  useEffect(() => {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      setBlogPosts(JSON.parse(savedPosts));
    }
  }, []);

  const handleSearch = (query: string) => {
    console.log('Blog search:', query);
    // TODO: Implement blog search
  };

  const handleCreateClick = () => {
    if (isAdmin) {
      navigate('/create-post');
    } else {
      openModal();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const renderPostContent = (post: BlogPost) => {
    const previewContent = post.content.slice(0, 200) + (post.content.length > 200 ? '...' : '');
    
    switch (post.editorMode) {
      case 'markdown':
        return <ReactMarkdown>{previewContent}</ReactMarkdown>;
      case 'html':
        return <div dangerouslySetInnerHTML={{ __html: previewContent }} />;
      default:
        return <div style={{ whiteSpace: 'pre-wrap' }}>{previewContent}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-space-dark bg-[size:50px_50px] relative overflow-hidden">
      {/* Star background effect */}
      <div className="absolute inset-0 bg-star-pattern opacity-10"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-space-purple/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-space-accent/20 rounded-full blur-3xl animate-pulse-slow delay-700"></div>
      
      {/* Content */}
      <div className="relative">
        {/* Hero Section */}
        <div className="relative pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-space-light mb-4 tracking-tight">
                AI Art Blog
              </h1>
              <p className="text-xl text-space-light/80 max-w-2xl mx-auto">
                Explore articles about AI art and digital creativity
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 max-w-3xl mx-auto">
              <div className="flex-1 w-full">
                <SearchBar onSearch={handleSearch} />
              </div>
              <button
                onClick={handleCreateClick}
                className="px-6 py-2 bg-space-accent hover:bg-space-glow transition-colors rounded-lg text-white flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                <span>글 작성</span>
              </button>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {blogPosts.length === 0 ? (
            <div className="text-center text-space-light/60 py-12">
              <p className="text-lg">아직 작성된 글이 없습니다.</p>
              <p className="text-sm mt-2">첫 번째 글을 작성해보세요!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group block"
                >
                  <article className="bg-space-navy/30 border border-space-light/10 rounded-lg overflow-hidden hover:border-space-glow/30 transition-colors h-full">
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-space-light mb-2 group-hover:text-space-glow transition-colors">
                        {post.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-space-light/70 mb-4">
                        <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center">
                            <span className="mr-1">❤️</span>
                            {post.likes || 0}
                          </span>
                          <span className="flex items-center">
                            <span className="mr-1">👁️</span>
                            {post.views || 0}
                          </span>
                        </div>
                      </div>
                      <div className="prose prose-invert max-w-none mb-4">
                        {renderPostContent(post)}
                      </div>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-space-navy/50 rounded-full text-xs text-space-light/70"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={verifyPassword}
        error={error}
      />
    </div>
  );
};

export default Blog; 