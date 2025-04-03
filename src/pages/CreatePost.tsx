import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

type EditorMode = 'basic' | 'markdown' | 'html';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  editorMode: EditorMode;
  createdAt: string;
  tags: string[];
}

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editorMode, setEditorMode] = useState<EditorMode>('basic');
  const [previewMode, setPreviewMode] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // 이미지 업로드 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB를 초과할 수 없습니다.');
        return;
      }
      // 이미지 처리 로직 추가
    }
  };

  // 태그 추가
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (tags.length >= 5) {
        alert('태그는 최대 5개까지만 추가할 수 있습니다.');
        return;
      }
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // 태그 삭제
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      // 새 블로그 포스트 객체 생성
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        editorMode,
        createdAt: new Date().toISOString(),
        tags
      };

      // 기존 포스트 목록 가져오기
      const existingPosts = localStorage.getItem('blogPosts');
      const posts = existingPosts ? JSON.parse(existingPosts) : [];
      
      // 새 포스트 추가
      posts.push(newPost);
      
      // 로컬 스토리지에 저장
      localStorage.setItem('blogPosts', JSON.stringify(posts));

      // 블로그 페이지로 이동
      navigate('/blog');
    } catch (error) {
      console.error('포스트 저장 중 오류 발생:', error);
      alert('포스트 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 미리보기 렌더링
  const renderPreview = useCallback(() => {
    switch (editorMode) {
      case 'markdown':
        return (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        );
      case 'html':
        return (
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      default:
        return (
          <div className="whitespace-pre-wrap text-space-light">
            {content}
          </div>
        );
    }
  }, [editorMode, content]);

  return (
    <div className="min-h-screen bg-space-dark bg-[size:50px_50px] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-star-pattern opacity-10"></div>
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-space-purple/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-space-accent/20 rounded-full blur-3xl animate-pulse-slow delay-700"></div>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-space-light">새 글 작성</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-space-light/70">
              커버 이미지
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="cover-image"
              />
              <label
                htmlFor="cover-image"
                className="px-4 py-2 bg-space-navy/50 text-space-light rounded-lg border border-space-light/10 hover:border-space-glow/30 cursor-pointer transition-colors"
              >
                이미지 업로드
              </label>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-space-light/70">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-space-navy/50 border border-space-light/10 rounded-lg text-space-light placeholder-space-light/30 focus:outline-none focus:border-space-glow/50"
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          {/* Editor Mode Tabs */}
          <div className="border-b border-space-light/10">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setEditorMode('basic')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  editorMode === 'basic'
                    ? 'text-space-glow border-b-2 border-space-glow'
                    : 'text-space-light/70 hover:text-space-light'
                }`}
              >
                기본 모드
              </button>
              <button
                type="button"
                onClick={() => setEditorMode('markdown')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  editorMode === 'markdown'
                    ? 'text-space-glow border-b-2 border-space-glow'
                    : 'text-space-light/70 hover:text-space-light'
                }`}
              >
                마크다운
              </button>
              <button
                type="button"
                onClick={() => setEditorMode('html')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  editorMode === 'html'
                    ? 'text-space-glow border-b-2 border-space-glow'
                    : 'text-space-light/70 hover:text-space-light'
                }`}
              >
                HTML
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className={`ml-auto px-4 py-2 text-sm font-medium transition-colors ${
                  previewMode
                    ? 'text-space-glow'
                    : 'text-space-light/70 hover:text-space-light'
                }`}
              >
                {previewMode ? '편집' : '미리보기'}
              </button>
            </div>
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            {previewMode ? (
              <div className="min-h-[300px] p-4 bg-space-navy/50 rounded-lg border border-space-light/10">
                {renderPreview()}
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[300px] px-4 py-2 bg-space-navy/50 border border-space-light/10 rounded-lg text-space-light placeholder-space-light/30 focus:outline-none focus:border-space-glow/50 font-mono"
                placeholder={
                  editorMode === 'markdown'
                    ? '마크다운 형식으로 작성하세요...'
                    : editorMode === 'html'
                    ? 'HTML 형식으로 작성하세요...'
                    : '내용을 입력하세요...'
                }
                required
              />
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-space-light/70">
              태그 (최대 5개)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-space-navy/50 rounded-full border border-space-light/10 text-sm text-space-light flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-space-light/70 hover:text-space-light"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full px-4 py-2 bg-space-navy/50 border border-space-light/10 rounded-lg text-space-light placeholder-space-light/30 focus:outline-none focus:border-space-glow/50"
              placeholder="태그를 입력하고 Enter를 누르세요"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="px-4 py-2 text-space-light/70 hover:text-space-light transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-space-glow/20 text-space-light rounded-lg border border-space-glow/30 hover:bg-space-glow/30 transition-colors"
            >
              발행
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost; 