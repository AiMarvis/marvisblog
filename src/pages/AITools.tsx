import React, { useState, useEffect } from 'react';
import useAdmin from '../hooks/useAdmin';
import AdminModal from '../components/AdminModal';

interface AITool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  createdAt: string;
}

const categories = [
  { value: 'general', label: '일반' },
  { value: 'image', label: '이미지 생성' },
  { value: 'text', label: '텍스트 생성' },
  { value: 'audio', label: '오디오/음악' },
  { value: 'video', label: '비디오' },
  { value: 'coding', label: '코딩' },
  { value: 'productivity', label: '생산성' }
];

const AITools = () => {
  const { isAdmin, openModal, closeModal, verifyPassword } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [tools, setTools] = useState<AITool[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newTool, setNewTool] = useState<Omit<AITool, 'id' | 'createdAt'>>({
    name: '',
    description: '',
    url: '',
    category: categories[0].value
  });

  // 로컬 스토리지에서 도구 데이터 로드
  useEffect(() => {
    const savedTools = localStorage.getItem('aiTools');
    if (savedTools) {
      setTools(JSON.parse(savedTools));
    }
  }, []);

  const handleCreateClick = () => {
    if (isAdmin) {
      setIsAddToolModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    try {
      await verifyPassword(password);
      setIsModalOpen(false);
      setIsAddToolModalOpen(true);
    } catch (err) {
      setError('잘못된 비밀번호입니다.');
    }
  };

  const handleToolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTool.name.trim() || !newTool.url.trim()) {
      alert('도구 이름과 URL은 필수 입력 항목입니다.');
      return;
    }

    try {
      // 새 도구 객체 생성
      const tool: AITool = {
        id: Date.now().toString(),
        ...newTool,
        createdAt: new Date().toISOString()
      };

      // 기존 도구 목록에 추가
      const updatedTools = [...tools, tool];
      setTools(updatedTools);
      
      // 로컬 스토리지에 저장
      localStorage.setItem('aiTools', JSON.stringify(updatedTools));

      // 입력 폼 초기화
      setNewTool({
        name: '',
        description: '',
        url: '',
        category: categories[0].value
      });
      
      // 모달 닫기
      setIsAddToolModalOpen(false);
    } catch (error) {
      console.error('도구 저장 중 오류 발생:', error);
      alert('도구 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const filteredTools = selectedCategory === 'all'
    ? tools
    : tools.filter(tool => tool.category === selectedCategory);

  return (
    <div className="min-h-screen bg-space-dark bg-[size:50px_50px] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-star-pattern opacity-10"></div>
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-space-purple/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-space-accent/20 rounded-full blur-3xl animate-pulse-slow delay-700"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-space-light">AI 도구</h1>
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-space-glow/20 text-space-light rounded-lg border border-space-glow/30 hover:bg-space-glow/30 transition-colors flex items-center space-x-2"
          >
            <span>+ AI 도구 추가</span>
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-space-glow/20 text-space-light border border-space-glow/30'
                  : 'text-space-light/70 hover:text-space-light'
              }`}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-space-glow/20 text-space-light border border-space-glow/30'
                    : 'text-space-light/70 hover:text-space-light'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-space-light/70 mb-4">아직 등록된 AI 도구가 없습니다.</p>
            <button
              onClick={handleCreateClick}
              className="text-space-glow hover:text-space-glow/70 transition-colors"
            >
              첫 번째 AI 도구를 추가해보세요
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <a
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-space-navy/30 border border-space-light/10 rounded-lg p-6 hover:border-space-glow/30 transition-colors"
              >
                <h3 className="text-xl font-semibold text-space-light mb-2 group-hover:text-space-glow transition-colors">
                  {tool.name}
                </h3>
                <p className="text-space-light/70 mb-4 line-clamp-3">
                  {tool.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-space-light/50">
                    {categories.find(c => c.value === tool.category)?.label}
                  </span>
                  <svg
                    className="w-5 h-5 text-space-light/30 group-hover:text-space-glow transition-colors"
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
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Admin Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePasswordSubmit}
        error={error}
      />

      {/* Add Tool Modal */}
      {isAddToolModalOpen && (
        <div className="fixed inset-0 bg-space-dark/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-space-navy/90 border border-space-light/10 rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-space-light mb-6">AI 도구 추가</h2>
            <form onSubmit={handleToolSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-space-light/70 mb-1">
                  도구 이름
                </label>
                <input
                  type="text"
                  value={newTool.name}
                  onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                  className="w-full px-4 py-2 bg-space-dark/50 border border-space-light/10 rounded-lg text-space-light placeholder-space-light/30 focus:outline-none focus:border-space-glow/50"
                  placeholder="도구 이름을 입력하세요"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-space-light/70 mb-1">
                  설명
                </label>
                <textarea
                  value={newTool.description}
                  onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                  className="w-full px-4 py-2 bg-space-dark/50 border border-space-light/10 rounded-lg text-space-light placeholder-space-light/30 focus:outline-none focus:border-space-glow/50"
                  rows={3}
                  placeholder="도구에 대한 설명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-space-light/70 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={newTool.url}
                  onChange={(e) => setNewTool({ ...newTool, url: e.target.value })}
                  className="w-full px-4 py-2 bg-space-dark/50 border border-space-light/10 rounded-lg text-space-light placeholder-space-light/30 focus:outline-none focus:border-space-glow/50"
                  placeholder="https://"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-space-light/70 mb-1">
                  카테고리
                </label>
                <select
                  value={newTool.category}
                  onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
                  className="w-full px-4 py-2 bg-space-dark/50 border border-space-light/10 rounded-lg text-space-light focus:outline-none focus:border-space-glow/50"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddToolModalOpen(false)}
                  className="px-4 py-2 text-space-light/70 hover:text-space-light transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-space-glow/20 text-space-light rounded-lg border border-space-glow/30 hover:bg-space-glow/30 transition-colors"
                >
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITools; 