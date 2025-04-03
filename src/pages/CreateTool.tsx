import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { AITool } from '../types';

const CreateTool = () => {
  const navigate = useNavigate();
  const { addItem } = useContent<AITool>('aiTools');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    category: '개발',
  });

  const categories = [
    '개발',
    '디자인',
    '생산성',
    '교육',
    '비즈니스',
    '창작',
    '기타'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTool: AITool = {
        id: crypto.randomUUID(),
        ...formData,
        createdAt: new Date().toISOString(),
        userId: 'admin', // 실제 구현시 로그인된 사용자 ID로 대체
        likes: 0,
        views: 0,
        isFeatured: false
      };

      await addItem(newTool);
      navigate('/ai-tools');
    } catch (error) {
      alert('도구 저장 중 오류가 발생했습니다.');
      console.error('도구 저장 오류:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-space-dark bg-[size:50px_50px] relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-star-pattern opacity-10"></div>
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-space-navy/30 border border-space-light/10 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-space-light mb-8">새로운 AI 도구 추가</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-space-light mb-2">
                도구 이름
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-space-dark border border-space-light/20 rounded-lg text-space-light focus:outline-none focus:border-space-accent"
                placeholder="AI 도구 이름을 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-space-light mb-2">
                설명
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-space-dark border border-space-light/20 rounded-lg text-space-light focus:outline-none focus:border-space-accent resize-none"
                placeholder="AI 도구에 대한 설명을 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-space-light mb-2">
                도구 URL
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-space-dark border border-space-light/20 rounded-lg text-space-light focus:outline-none focus:border-space-accent"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-space-light mb-2">
                카테고리
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-space-dark border border-space-light/20 rounded-lg text-space-light focus:outline-none focus:border-space-accent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-space-accent text-space-light rounded-lg hover:bg-space-accent/80 transition-colors"
              >
                도구 추가
              </button>
              <button
                type="button"
                onClick={() => navigate('/ai-tools')}
                className="flex-1 px-6 py-3 bg-space-dark border border-space-light/20 text-space-light rounded-lg hover:bg-space-light/10 transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTool; 