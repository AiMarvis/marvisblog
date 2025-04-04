import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import useAdmin from '../hooks/useAdmin';
import { BlogPost } from '../types';
import ReactMarkdown from 'react-markdown';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, deleteItem, incrementViews, incrementLikes } = useContent<BlogPost>('blog');
  const { isAdmin } = useAdmin();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [viewIncremented, setViewIncremented] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // 콘솔에 관리자 상태 출력 (디버깅 용도)
  useEffect(() => {
    console.log('블로그 상세 페이지 - 관리자 상태:', isAdmin);
  }, [isAdmin]);

  useEffect(() => {
    if (id) {
      const foundPost = items.find(p => p.id === id);
      if (foundPost) {
        setPost(foundPost);
        // 좋아요 상태 로드
        const likedStatus = localStorage.getItem(`blog_liked_${id}`);
        setIsLiked(likedStatus === 'true');
        if (!viewIncremented) {
          incrementViews(id).then(() => {
            setViewIncremented(true);
          }).catch(error => {
            console.error('Error incrementing views:', error);
          });
        }
      }
    }
  }, [id, items, incrementViews, viewIncremented]);

  const handleLike = async () => {
    if (!post) return;
    try {
      await incrementLikes(post.id);
      // 좋아요 상태 업데이트 및 로컬 스토리지 저장
      localStorage.setItem(`blog_liked_${id}`, 'true');
      setIsLiked(true);
      // 상태 업데이트 반영
      setPost(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) {
      alert('관리자만 게시글을 삭제할 수 있습니다.');
      return;
    }

    if (!post) return;

    if (window.confirm('이 게시글을 삭제하시겠습니까?')) {
      try {
        await deleteItem(post.id);
        navigate('/blog');
      } catch (error) {
        console.error('게시글 삭제 중 오류 발생:', error);
        alert('게시글 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-space-dark text-space-light">
        <p className="text-2xl mb-4">게시글을 불러오는 중...</p>
        <button
          onClick={() => navigate('/blog')}
          className="px-4 py-2 bg-space-accent text-white rounded-lg hover:bg-space-glow transition-colors"
        >
          블로그로 돌아가기
        </button>
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
    <div className="min-h-screen bg-space-dark text-space-light pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className="mb-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-space-accent hover:bg-space-glow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-space-glow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          블로그로 돌아가기
        </button>

        <article className="bg-space-navy p-6 md:p-8 rounded-lg shadow-xl border border-space-light/10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-space-light">{post.title}</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                disabled={isLiked}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${isLiked ? 'text-space-light/50 bg-space-navy/50 cursor-not-allowed' : 'text-space-light hover:bg-space-glow/20'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLiked ? 'text-red-500' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>{post.likes || 0}</span>
              </button>
              {/* 항상 수정/삭제 버튼 표시 */}
              <div className="flex space-x-2">
                <Link
                  to={`/blog/edit/${post.id}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                >
                  수정
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-8 text-space-light/70">
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
            <div className="flex items-center gap-2">
              <span className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span>{post.views || 0}</span>
              </span>
            </div>
            <span className="text-space-light/50">{post.category}</span>
          </div>
          <div className="prose prose-invert max-w-none mb-8">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-space-accent/20 rounded-full text-sm text-space-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail; 