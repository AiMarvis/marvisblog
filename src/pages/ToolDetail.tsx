import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { useAdmin } from '../hooks/useAdmin';
import { AITool } from '../types';

export default function ToolDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, deleteItem, incrementViews, incrementLikes } = useContent<AITool>('aiTools');
  const { isAdmin } = useAdmin();
  const [tool, setTool] = useState<AITool | null>(null);
  const [viewIncremented, setViewIncremented] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      const foundTool = items.find(t => t.id === id);
      if (foundTool) {
        setTool(foundTool);
        if (!viewIncremented) {
          incrementViews(id).catch(console.error);
          setViewIncremented(true);
        }
      }
    }
  }, [id, items, incrementViews, viewIncremented]);

  const handleLike = async () => {
    if (tool) {
      try {
        await incrementLikes(tool.id);
      } catch (error) {
        console.error('좋아요 처리 중 오류 발생:', error);
        alert('좋아요 처리 중 오류가 발생했습니다.');
      }
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) {
      alert('관리자만 AI 도구를 삭제할 수 있습니다.');
      return;
    }

    if (!tool || isDeleting) return;

    const confirmed = window.confirm('이 AI 도구를 삭제하시겠습니까?');
    if (confirmed) {
      try {
        setIsDeleting(true);
        await deleteItem(tool.id);
        navigate('/ai-tools');
      } catch (error) {
        console.error('AI 도구 삭제 중 오류 발생:', error);
        alert('AI 도구 삭제 중 오류가 발생했습니다.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (!tool) {
    return (
      <div className="min-h-screen bg-space-dark flex items-center justify-center">
        <div className="text-space-light text-center">
          <p className="text-xl">AI 도구를 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate('/ai-tools')}
            className="mt-4 text-space-glow hover:text-space-glow/70 transition-colors"
          >
            AI 도구 목록으로 돌아가기
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
          onClick={() => navigate('/ai-tools')}
          className="mb-6 flex items-center gap-2 text-space-light/70 hover:text-space-light transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>AI 도구 목록으로 돌아가기</span>
        </button>

        <article className="bg-space-navy/30 border border-space-light/10 rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold text-space-light">{tool.name}</h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 px-4 py-2 bg-space-navy/50 rounded-lg text-space-light hover:bg-space-navy/70 transition-colors"
                >
                  <span>❤️</span>
                  <span>{tool.likes || 0}</span>
                </button>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => navigate(`/ai-tools/edit/${tool.id}`)}
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
              <time dateTime={tool.createdAt}>{formatDate(tool.createdAt)}</time>
              <div className="flex items-center gap-2">
                <span className="flex items-center">
                  <span className="mr-1">👁️</span>
                  {tool.views || 0}
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
                  className="px-3 py-1 bg-space-navy/50 text-space-light/70 rounded-full text-sm"
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
          </div>
        </article>
      </div>
    </div>
  );
} 