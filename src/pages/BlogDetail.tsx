import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { useAdmin } from '../hooks/useAdmin';
import { BlogPost } from '../types';
import ReactMarkdown from 'react-markdown';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, deleteItem, incrementViews, incrementLikes } = useContent<BlogPost>('blog');
  const { isAdmin } = useAdmin();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [viewIncremented, setViewIncremented] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPost = items.find(p => p.id === id);
      if (foundPost) {
        setPost(foundPost);
        if (!viewIncremented) {
          incrementViews(id).catch(console.error);
          setViewIncremented(true);
        }
      }
    }
  }, [id, items, incrementViews, viewIncremented]);

  const handleLike = async () => {
    if (post) {
      try {
        await incrementLikes(post.id);
      } catch (error) {
        console.error('좋아요 처리 중 오류 발생:', error);
        alert('좋아요 처리 중 오류가 발생했습니다.');
      }
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) {
      alert('관리자만 게시글을 삭제할 수 있습니다.');
      return;
    }

    if (!post || isDeleting) return;

    const confirmed = window.confirm('이 게시글을 삭제하시겠습니까?');
    if (confirmed) {
      try {
        setIsDeleting(true);
        await deleteItem(post.id);
        navigate('/blog');
      } catch (error) {
        console.error('게시글 삭제 중 오류 발생:', error);
        alert('게시글 삭제 중 오류가 발생했습니다.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-space-dark flex items-center justify-center">
        <div className="text-space-light text-center">
          <p className="text-xl">게시글을 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate('/blog')}
            className="mt-4 text-space-glow hover:text-space-glow/70 transition-colors"
          >
            블로그로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-space-dark bg-[size:50px_50px] relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-star-pattern opacity-10"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/blog')}
          className="mb-6 flex items-center gap-2 text-space-light/70 hover:text-space-light transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>블로그로 돌아가기</span>
        </button>

        <article className="bg-space-navy/30 border border-space-light/10 rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold text-space-light">{post.title}</h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 px-4 py-2 bg-space-navy/50 rounded-lg text-space-light hover:bg-space-navy/70 transition-colors"
                >
                  <span>❤️</span>
                  <span>{post.likes || 0}</span>
                </button>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => navigate(`/blog/edit/${post.id}`)}
                      className="px-4 py-2 bg-space-accent/20 text-space-light rounded-lg hover:bg-space-accent/30 transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      {isDeleting ? '삭제 중...' : '삭제'}
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 mb-8 text-space-light/70">
              <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
              <div className="flex items-center gap-2">
                <span className="flex items-center">
                  <span className="mr-1">👁️</span>
                  {post.views || 0}
                </span>
              </div>
              <span className="text-space-light/50">{post.category}</span>
            </div>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-space-navy/50 text-space-light/70 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
} 