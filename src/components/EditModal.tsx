import React, { useState, useEffect } from 'react';
import { GalleryImage, BlogPost, AITool } from '../types';

interface EditModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: T) => void;
  item: T;
  type: 'gallery' | 'blog' | 'tool';
}

export function EditModal<T extends GalleryImage | BlogPost | AITool>({
  isOpen,
  onClose,
  onSave,
  item,
  type
}: EditModalProps<T>) {
  const [editedItem, setEditedItem] = useState<T>(item);
  const [tags, setTags] = useState<string>('');

  useEffect(() => {
    if ('tags' in item) {
      setTags(item.tags.join(', '));
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedItem = {
      ...editedItem,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    };
    onSave(updatedItem as T);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-space-dark/80 flex items-center justify-center p-4 z-50">
      <div className="bg-space-navy rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-space-light mb-6">
          {type === 'gallery' ? '이미지 수정' : type === 'blog' ? '글 수정' : 'AI 도구 수정'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 공통 필드 */}
          {type === 'gallery' && (
            <>
              <div>
                <label className="block text-space-light mb-2">제목</label>
                <input
                  type="text"
                  name="title"
                  value={(editedItem as GalleryImage).title}
                  onChange={handleChange}
                  className="w-full bg-space-dark/50 border border-space-light/20 rounded px-4 py-2 text-space-light"
                />
              </div>
              <div>
                <label className="block text-space-light mb-2">설명</label>
                <textarea
                  name="description"
                  value={(editedItem as GalleryImage).description}
                  onChange={handleChange}
                  className="w-full bg-space-dark/50 border border-space-light/20 rounded px-4 py-2 text-space-light"
                />
              </div>
              <div>
                <label className="block text-space-light mb-2">카테고리</label>
                <input
                  type="text"
                  name="category"
                  value={(editedItem as GalleryImage).category}
                  onChange={handleChange}
                  className="w-full bg-space-dark/50 border border-space-light/20 rounded px-4 py-2 text-space-light"
                />
              </div>
            </>
          )}

          {type === 'blog' && (
            <>
              <div>
                <label className="block text-space-light mb-2">제목</label>
                <input
                  type="text"
                  name="title"
                  value={(editedItem as BlogPost).title}
                  onChange={handleChange}
                  className="w-full bg-space-dark/50 border border-space-light/20 rounded px-4 py-2 text-space-light"
                />
              </div>
              <div>
                <label className="block text-space-light mb-2">내용</label>
                <textarea
                  name="content"
                  value={(editedItem as BlogPost).content}
                  onChange={handleChange}
                  className="w-full bg-space-dark/50 border border-space-light/20 rounded px-4 py-2 text-space-light h-40"
                />
              </div>
              <div>
                <label className="block text-space-light mb-2">에디터 모드</label>
                <select
                  name="editorMode"
                  value={(editedItem as BlogPost).editorMode}
                  onChange={handleChange}
                  className="w-full bg-space-dark/50 border border-space-light/20 rounded px-4 py-2 text-space-light"
                >
                  <option value="basic">기본</option>
                  <option value="markdown">마크다운</option>
                  <option value="html">HTML</option>
                </select>
              </div>
            </>
          )}

          {type === 'tool' && (
            <>
              <div>
                <label className="block text-space-light mb-2">이름</label>
                <input
                  type="text"
                  name="name"
                  value={(editedItem as AITool).name}
                  onChange={handleChange}
                  className="w-full bg-space-dark/50 border border-space-light/20 rounded px-4 py-2 text-space-light"
                />
              </div>
              <div>
                <label className="block text-space-light mb-2">설명</label>
                <textarea
                  name="description"
                  value={(editedItem as AITool).description}
                  onChange={handleChange}
                  className="w-full bg-space-dark/50 border border-space-light/20 rounded px-4 py-2 text-space-light"
                />
              </div>
              <div>
                <label className="block text-space-light mb-2">URL</label>
                <input
                  type="url"
                  name="url"
                  value={(editedItem as AITool).url}
                  onChange={handleChange}
                  className="w-full bg-space-dark/50 border border-space-light/20 rounded px-4 py-2 text-space-light"
                />
              </div>
              <div>
                <label className="block text-space-light mb-2">카테고리</label>
                <input
                  type="text"
                  name="category"
                  value={(editedItem as AITool).category}
                  onChange={handleChange}
                  className="w-full bg-space-dark/50 border border-space-light/20 rounded px-4 py-2 text-space-light"
                />
              </div>
            </>
          )}

          {/* 태그 입력 (갤러리와 블로그에만 해당) */}
          {(type === 'gallery' || type === 'blog') && (
            <div>
              <label className="block text-space-light mb-2">태그 (쉼표로 구분)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-space-dark/50 border border-space-light/20 rounded px-4 py-2 text-space-light"
                placeholder="태그1, 태그2, 태그3"
              />
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-space-light/70 hover:text-space-light transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-space-accent text-space-light rounded hover:bg-space-accent/80 transition-colors"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 