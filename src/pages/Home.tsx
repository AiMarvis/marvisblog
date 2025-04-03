import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import SearchBar from '../components/SearchBar';
import ImageCard from '../components/ImageCard';
import { useContent } from '../hooks/useContent';
import { GalleryImage, BlogPost, AITool } from '../types';

// 추천 이미지 데이터
const featuredImages: any[] = [];

// 블로그 포스트 데이터
const blogPosts: any[] = [];

const exploreCategories = [
  {
    id: 1,
    title: 'Automotive',
    description: 'Luxury cars and automotive excellence',
    brand: 'Rolls-Royce',
    image: '/images/categories/automotive.jpg'
  },
  {
    id: 2,
    title: 'Fashion',
    description: 'High-end fashion and accessories',
    brand: 'Chanel',
    image: '/images/categories/fashion.jpg'
  },
  {
    id: 3,
    title: 'Furniture',
    description: 'Luxury furniture and home decor',
    brand: 'Minotti',
    image: '/images/categories/furniture.jpg'
  },
  {
    id: 4,
    title: 'Watches',
    description: 'Premium timepieces and luxury watches',
    brand: 'Patek Philippe',
    image: '/images/categories/watches.jpg'
  },
  {
    id: 5,
    title: 'Technology',
    description: 'Premium electronics and gadgets',
    brand: 'Apple',
    image: '/images/categories/technology.jpg'
  },
  {
    id: 6,
    title: 'Fashion Accessories',
    description: 'Luxury bags and accessories',
    brand: 'Hermès',
    image: '/images/categories/accessories.jpg'
  },
  {
    id: 7,
    title: 'Jewelry',
    description: 'Fine jewelry and precious stones',
    brand: 'Cartier',
    image: '/images/categories/jewelry.jpg'
  },
  {
    id: 8,
    title: 'Hotels',
    description: 'Luxury hotels and resorts',
    brand: 'Feadship',
    image: '/images/categories/hotels.jpg'
  },
  {
    id: 9,
    title: 'Private Jets',
    description: 'Private aviation and luxury jets',
    brand: 'Gulfstream',
    image: '/images/categories/jets.jpg'
  },
  {
    id: 10,
    title: 'Yachts',
    description: 'Luxury yachts and marine vessels',
    brand: 'La Cornue',
    image: '/images/categories/yachts.jpg'
  }
];

const Home = () => {
  const {
    items: galleryImages,
    getFeaturedItems: getFeaturedImages
  } = useContent<GalleryImage>('galleryImages');

  const {
    items: blogPosts,
    getFeaturedItems: getFeaturedPosts
  } = useContent<BlogPost>('blogPosts');

  const {
    items: aiTools,
    getFeaturedItems: getFeaturedTools
  } = useContent<AITool>('aiTools');

  const [latestImages, setLatestImages] = useState<GalleryImage[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [latestTools, setLatestTools] = useState<AITool[]>([]);
  const [featuredImages, setFeaturedImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    // 최신 항목들 설정
    setLatestImages(galleryImages.slice(-3).reverse());
    setLatestPosts(blogPosts.slice(-3).reverse());
    setLatestTools(aiTools.slice(-3).reverse());

    // Featured 이미지 설정 (좋아요 순으로 정렬)
    const featured = getFeaturedImages()
      .sort((a, b) => (b.likes + b.views) - (a.likes + a.views))
      .slice(0, 3);
    setFeaturedImages(featured);
  }, [galleryImages, blogPosts, aiTools]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const renderPostContent = (post: BlogPost) => {
    const previewContent = post.content.slice(0, 100) + (post.content.length > 100 ? '...' : '');
    
    switch (post.editorMode) {
      case 'markdown':
        return <ReactMarkdown>{previewContent}</ReactMarkdown>;
      case 'html':
        return <div dangerouslySetInnerHTML={{ __html: previewContent }} />;
      default:
        return <div style={{ whiteSpace: 'pre-wrap' }}>{previewContent}</div>;
    }
  };

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // TODO: Implement search functionality
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
        {/* Hero Section with Search */}
        <div className="relative pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-space-light mb-4 tracking-tight">
                Explore the Universe of AI Art
              </h1>
              <p className="text-xl text-space-light/80 max-w-2xl mx-auto">
                Discover and share amazing AI-generated images in our cosmic community
              </p>
            </div>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {/* Categories */}
          <div>
            <h2 className="text-2xl font-bold text-space-light mb-6 flex items-center">
              <span className="mr-2">🌌</span> Explore Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {exploreCategories.map((category) => (
                <button
                  key={category.id}
                  className="p-4 rounded-xl bg-space-navy/50 backdrop-blur-sm border border-space-light/10 hover:border-space-glow/50 transition-colors text-center group"
                >
                  <span className="font-medium text-space-light/90 group-hover:text-space-light group-hover:scale-110 inline-block transition-all">
                    {category.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Section */}
          <div>
            <h2 className="text-2xl font-bold text-space-light mb-6 flex items-center">
              <span className="mr-2">✨</span> 추천 작품
            </h2>
            {featuredImages.length === 0 ? (
              <div className="text-center text-space-light/60 py-12 bg-space-navy/30 rounded-xl backdrop-blur-sm">
                <p className="text-lg">아직 등록된 이미지가 없습니다.</p>
                <p className="text-sm mt-2">갤러리에서 새로운 이미지를 등록해보세요!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredImages.map((image) => (
                  <Link
                    key={image.id}
                    to={`/gallery/${image.id}`}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-space-navy/30 border border-space-light/10 hover:border-space-glow/30 transition-colors"
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-space-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-space-light font-medium mb-1">{image.title}</h3>
                        <p className="text-space-light/70 text-sm line-clamp-2">{image.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-space-light/70 text-sm">
                            {image.category}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-space-light/70 text-sm flex items-center">
                              <span className="mr-1">❤️</span>
                              {image.likes || 0}
                            </span>
                            <span className="text-space-light/70 text-sm flex items-center">
                              <span className="mr-1">👁️</span>
                              {image.views || 0}
                            </span>
                          </div>
                          {image.tags && image.tags.length > 0 && (
                            <div className="flex gap-2">
                              {image.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-space-navy/50 rounded-full text-xs text-space-light/70"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Latest Gallery Images */}
          <section className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-space-light">최신 이미지</h2>
              <Link
                to="/gallery"
                className="text-space-glow hover:text-space-glow/70 transition-colors"
              >
                더 보기 →
              </Link>
            </div>
            {latestImages.length === 0 ? (
              <p className="text-space-light/70">아직 등록된 이미지가 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestImages.map((image) => (
                  <Link
                    key={image.id}
                    to={`/gallery/${image.id}`}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-space-navy/30 border border-space-light/10 hover:border-space-glow/30 transition-colors"
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-space-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-space-light font-medium mb-1">{image.title}</h3>
                        <p className="text-space-light/70 text-sm line-clamp-2">{image.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-space-light/70 text-sm">
                            {image.category}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-space-light/70 text-sm flex items-center">
                              <span className="mr-1">❤️</span>
                              {image.likes || 0}
                            </span>
                            <span className="text-space-light/70 text-sm flex items-center">
                              <span className="mr-1">👁️</span>
                              {image.views || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Latest Blog Posts */}
          <section className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-space-light">최신 글</h2>
              <Link
                to="/blog"
                className="text-space-glow hover:text-space-glow/70 transition-colors"
              >
                더 보기 →
              </Link>
            </div>
            {latestPosts.length === 0 ? (
              <p className="text-space-light/70">아직 작성된 글이 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="bg-space-navy/30 border border-space-light/10 rounded-lg p-6 hover:border-space-glow/30 transition-colors block"
                  >
                    <h3 className="text-xl font-semibold text-space-light mb-2">
                      {post.title}
                    </h3>
                    <div className="text-space-light/70 text-sm mb-4">
                      {formatDate(post.createdAt)}
                    </div>
                    <div className="prose prose-invert max-w-none mb-4 text-sm">
                      {renderPostContent(post)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-space-light/70 text-sm flex items-center">
                          <span className="mr-1">❤️</span>
                          {post.likes || 0}
                        </span>
                        <span className="text-space-light/70 text-sm flex items-center">
                          <span className="mr-1">👁️</span>
                          {post.views || 0}
                        </span>
                      </div>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-space-navy/50 rounded-full text-xs text-space-light/70"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Latest AI Tools */}
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-space-light">최신 AI 도구</h2>
              <Link
                to="/ai-tools"
                className="text-space-glow hover:text-space-glow/70 transition-colors"
              >
                더 보기 →
              </Link>
            </div>
            {latestTools.length === 0 ? (
              <p className="text-space-light/70">아직 등록된 AI 도구가 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestTools.map((tool) => (
                  <Link
                    key={tool.id}
                    to={`/ai-tools/${tool.id}`}
                    className="group bg-space-navy/30 border border-space-light/10 rounded-lg p-6 hover:border-space-glow/30 transition-colors block"
                  >
                    <h3 className="text-xl font-semibold text-space-light mb-2 group-hover:text-space-glow transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-space-light/70 mb-4 line-clamp-3">
                      {tool.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-space-light/70 text-sm flex items-center">
                          <span className="mr-1">❤️</span>
                          {tool.likes || 0}
                        </span>
                        <span className="text-space-light/70 text-sm flex items-center">
                          <span className="mr-1">👁️</span>
                          {tool.views || 0}
                        </span>
                      </div>
                      <span className="text-sm text-space-light/50">
                        {tool.category}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home; 