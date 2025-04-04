import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GalleryImage } from '../types';
import { useContent } from '../hooks/useContent';
import { v4 as uuidv4 } from 'uuid';
import useAdmin from '../hooks/useAdmin';

interface ImageFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  image?: File;
  previewUrl?: string;
}

const categories = [
  { id: 1, value: 'automotive', label: 'Automotive', brand: 'Rolls-Royce' },
  { id: 2, value: 'fashion', label: 'Fashion', brand: 'Chanel' },
  { id: 3, value: 'furniture', label: 'Furniture', brand: 'Minotti' },
  { id: 4, value: 'watches', label: 'Watches', brand: 'Patek Philippe' },
  { id: 5, value: 'technology', label: 'Technology', brand: 'Apple' },
  { id: 6, value: 'accessories', label: 'Fashion Accessories', brand: 'Hermès' },
  { id: 7, value: 'jewelry', label: 'Jewelry', brand: 'Cartier' },
  { id: 8, value: 'hotels', label: 'Hotels', brand: 'Feadship' },
  { id: 9, value: 'jets', label: 'Private Jets', brand: 'Gulfstream' },
  { id: 10, value: 'yachts', label: 'Yachts', brand: 'La Cornue' }
];

const CreateImage = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;
  
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const { items, addItem, updateItem } = useContent<GalleryImage>('gallery');

  const [formData, setFormData] = useState<ImageFormData>({
    title: '',
    description: '',
    category: categories[0].value,
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 관리자 권한 확인
  useEffect(() => {
    if (!isAdmin) {
      alert('관리자만 이미지를 추가하거나 수정할 수 있습니다.');
      navigate('/gallery');
    }
  }, [isAdmin, navigate]);

  // 편집 모드일 경우 기존 이미지 데이터 로드
  useEffect(() => {
    if (isEditMode) {
      const existingImage = items.find(img => img.id === id);
      if (existingImage) {
        setFormData({
          title: existingImage.title,
          description: existingImage.description,
          category: existingImage.category,
          tags: existingImage.tags || [],
          previewUrl: existingImage.imageUrl
        });
      } else {
        setError('이미지를 찾을 수 없습니다.');
        navigate('/gallery');
      }
    }
  }, [isEditMode, id, items, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        setError('이미지 크기는 5MB를 초과할 수 없습니다.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드 가능합니다.');
        return;
      }
      setFormData({
        ...formData,
        image: file,
        previewUrl: URL.createObjectURL(file),
      });
      setError('');
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (formData.tags.length >= 5) {
        setError('태그는 최대 5개까지만 추가할 수 있습니다.');
        return;
      }
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()],
        });
        setTagInput('');
        setError('');
      }
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (!formData.description.trim()) {
      setError('설명을 입력해주세요.');
      return;
    }

    if (!formData.previewUrl) {
      setError('이미지를 업로드해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (isEditMode) {
        // 기존 이미지 업데이트
        const existingImage = items.find(img => img.id === id);
        if (existingImage) {
          const updatedImage: GalleryImage = {
            ...existingImage,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            imageUrl: formData.previewUrl,
            tags: formData.tags,
            updatedAt: new Date().toISOString(),
            altText: formData.title
          };
          
          await updateItem(id!, updatedImage);
          navigate(`/gallery/${id}`);
        }
      } else {
        // 새 이미지 추가
        const newImage: GalleryImage = {
          id: uuidv4(),
          title: formData.title,
          description: formData.description,
          category: formData.category,
          imageUrl: formData.previewUrl,
          tags: formData.tags,
          likes: 0,
          views: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: 'user1',
          isFeatured: false,
          altText: formData.title
        };

        await addItem(newImage);
        navigate(`/gallery/${newImage.id}`);
      }
    } catch (error) {
      console.error('이미지 저장 오류:', error);
      setError('이미지 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-space-navy/50 backdrop-blur-sm rounded-2xl p-6 border border-space-light/10">
            <h1 className="text-3xl font-bold text-space-light mb-8">
              {isEditMode ? '이미지 수정' : '새 이미지 업로드'}
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 이미지 업로드 영역 */}
              <div className="space-y-2">
                <label className="block text-space-light/80">이미지</label>
                <div className="relative">
                  {formData.previewUrl ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden group">
                      <img
                        src={formData.previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-space-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: undefined, previewUrl: undefined })}
                          className="text-space-light hover:text-space-glow"
                        >
                          이미지 변경
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="block w-full aspect-video border-2 border-dashed border-space-light/20 rounded-lg hover:border-space-glow/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <div className="h-full flex flex-col items-center justify-center text-space-light/60">
                        <span className="text-4xl mb-2">+</span>
                        <span>이미지를 선택하거나 드래그하세요</span>
                        <span className="text-sm mt-1">최대 5MB</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* 제목 입력 */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-space-light/80">제목</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-space-dark/50 border border-space-light/20 rounded-lg px-4 py-2 text-space-light focus:outline-none focus:border-space-glow/50"
                  placeholder="이미지 제목을 입력하세요"
                />
              </div>

              {/* 카테고리 선택 */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-space-light/80">카테고리</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-space-dark/50 border border-space-light/20 rounded-lg px-4 py-2 text-space-light focus:outline-none focus:border-space-glow/50"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 설명 입력 */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-space-light/80">설명</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-space-dark/50 border border-space-light/20 rounded-lg px-4 py-2 text-space-light focus:outline-none focus:border-space-glow/50 h-32 resize-none"
                  placeholder="이미지에 대한 설명을 입력하세요"
                />
              </div>

              {/* 태그 입력 */}
              <div className="space-y-2">
                <label htmlFor="tags" className="block text-space-light/80">태그</label>
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagAdd}
                  className="w-full bg-space-dark/50 border border-space-light/20 rounded-lg px-4 py-2 text-space-light focus:outline-none focus:border-space-glow/50"
                  placeholder="태그를 입력하고 Enter를 누르세요 (최대 5개)"
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full bg-space-glow/20 border border-space-glow/30 text-space-light/90 text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="ml-1 text-space-light/60 hover:text-space-light"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 에러 메시지 */}
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              {/* 버튼 영역 */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/gallery')}
                  className="px-4 py-2 text-space-light/70 hover:text-space-light transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-space-accent hover:bg-space-glow transition-colors rounded-lg text-white ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? '처리 중...' : isEditMode ? '수정하기' : '업로드'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateImage; 