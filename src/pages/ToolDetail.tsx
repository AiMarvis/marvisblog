import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import useAdmin from '../hooks/useAdmin';
import { AITool } from '../types';

const ToolDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, deleteItem, incrementViews, incrementLikes } = useContent<AITool>('aiTools');
  const { isAdmin } = useAdmin();
  const [tool, setTool] = useState<AITool | null>(null);
  const [viewIncremented, setViewIncremented] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // 콘솔에 관리자 상태 출력 (디버깅 용도)
  useEffect(() => {
    console.log('AI 도구 상세 페이지 - 관리자 상태:', isAdmin);
  }, [isAdmin]);

  useEffect(() => {
    if (id) {
      const foundTool = items.find(t => t.id === id);
      if (foundTool) {
        setTool(foundTool);
        // 좋아요 상태 로드
        const likedStatus = localStorage.getItem(`tool_liked_${id}`);
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
    if (!tool) return;
    try {
      await incrementLikes(tool.id);
      // 좋아요 상태 업데이트 및 로컬 스토리지 저장
      localStorage.setItem(`tool_liked_${id}`, 'true');
      setIsLiked(true);
      // 상태 업데이트 반영
      setTool(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) {
      alert('관리자만 AI 도구를 삭제할 수 있습니다.');
      return;
    }

    if (!tool) return;

    if (window.confirm('이 AI 도구를 삭제하시겠습니까?')) {
      try {
        await deleteItem(tool.id);
        navigate('/ai-tools');
      } catch (error) {
        console.error('AI 도구 삭제 중 오류 발생:', error);
        alert('AI 도구 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-space-dark text-space-light">
        <p className="text-2xl mb-4">AI 도구를 불러오는 중...</p>
        <button
          onClick={() => navigate('/ai-tools')}
          className="px-4 py-2 bg-space-accent text-white rounded-lg hover:bg-space-glow transition-colors"
        >
          AI 도구 목록으로 돌아가기
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
          onClick={() => navigate('/ai-tools')}
          className="mb-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-space-accent hover:bg-space-glow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-space-glow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          AI 도구 목록으로 돌아가기
        </button>

        <article className="bg-space-navy p-6 md:p-8 rounded-lg shadow-xl border border-space-light/10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-space-light">{tool.name}</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                disabled={isLiked}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${isLiked ? 'text-space-light/50 bg-space-navy/50 cursor-not-allowed' : 'text-space-light hover:bg-space-glow/20'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLiked ? 'text-red-500' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>{tool.likes || 0}</span>
              </button>
              {/* 항상 수정/삭제 버튼 표시 */}
              <div className="flex space-x-2">
                <Link
                  to={`/ai-tools/edit/${tool.id}`}
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
            <time dateTime={tool.createdAt}>{formatDate(tool.createdAt)}</time>
            <div className="flex items-center gap-2">
              <span className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span>{tool.views || 0}</span>
              </span>
            </div>
            <span className="text-space-light/50">{tool.category}</span>
          </div>
          <p className="text-space-light/90 text-lg mb-8">
            {tool.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {tool.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-space-accent/20 rounded-full text-sm text-space-accent"
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-space-accent text-space-light rounded-lg hover:bg-space-accent/80 transition-colors"
          >
            <span>도구 사용하기</span>
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </article>
      </div>
    </div>
  );
};

export default ToolDetail; 