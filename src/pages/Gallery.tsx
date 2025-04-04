import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ImageCard from '../components/ImageCard';
import AdminModal from '../components/AdminModal';
import useAdmin from '../hooks/useAdmin';
import { useContent } from '../hooks/useContent';
import { GalleryImage } from '../types';

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

const Gallery = () => {
  const navigate = useNavigate();
  const { isAdmin, isModalOpen, error, openModal, closeModal, verifyPassword } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { items: galleryImages } = useContent<GalleryImage>('gallery');
  const [searchResults, setSearchResults] = useState<GalleryImage[]>(galleryImages);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const filtered = galleryImages.filter(image => 
        image.title.toLowerCase().includes(query.toLowerCase()) ||
        image.description.toLowerCase().includes(query.toLowerCase()) ||
        image.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(galleryImages);
    }
  };

  const handleCreateClick = () => {
    if (isAdmin) {
      navigate('/gallery/create');
    } else {
      openModal();
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    try {
      await verifyPassword(password);
      closeModal();
      navigate('/gallery/create');
    } catch (err) {
      console.error('잘못된 비밀번호입니다.', err);
    }
  };

  const filteredImages = selectedCategory === 'all'
    ? searchResults
    : searchResults.filter(image => image.category === selectedCategory);

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
                AI Art Gallery
              </h1>
              <p className="text-xl text-space-light/80 max-w-2xl mx-auto">
                Explore our collection of AI-generated cosmic artworks
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
                <span>이미지 추가</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-space-light">갤러리</h2>
            <button
              onClick={handleCreateClick}
              className="px-4 py-2 bg-space-glow/20 text-space-light rounded-lg border border-space-glow/30 hover:bg-space-glow/30 transition-colors flex items-center space-x-2"
            >
              <span>+ 이미지 추가</span>
            </button>
          </div>
          <div className="relative">
            <div className="overflow-x-auto touch-pan-x pb-4 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="flex gap-4 min-w-max px-0.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    selectedCategory === 'all'
                      ? 'bg-space-glow/20 text-space-light border border-space-glow/30'
                      : 'text-space-light/70 hover:text-space-light'
                  }`}
                >
                  전체
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
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
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filteredImages.length === 0 ? (
            <div className="text-center text-space-light/60 py-12">
              <p className="text-lg">아직 등록된 이미지가 없습니다.</p>
              <p className="text-sm mt-2">첫 번째 이미지를 업로드해보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <ImageCard key={image.id} image={image} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handlePasswordSubmit}
        error={error}
      />
    </div>
  );
};

export default Gallery; 