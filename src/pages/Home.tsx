import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import SearchBar from '../components/SearchBar';
import ImageCard from '../components/ImageCard';
import { useContent } from '../hooks/useContent';
import { GalleryImage, BlogPost, AITool } from '../types';
import useAdmin from '../hooks/useAdmin';
import { useTheme } from '../hooks/useTheme';

// 핵심 기능
const features = [
  {
    title: '갤러리',
    description: 'AI로 생성된 고품질 이미지 컬렉션을 감상하고, 다운로드하세요.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: '블로그',
    description: 'AI 기술과 디지털 아트에 관한 인사이트 가득한 블로그 포스트를 읽어보세요.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    )
  },
  {
    title: 'AI 도구',
    description: '최신 AI 이미지 생성 도구를 직접 사용해보고, 자신만의 작품을 만들어보세요.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  }
];

const Home = () => {
  const navigate = useNavigate();
  const { verifyPassword, isAdmin, logout } = useAdmin();
  const { currentTheme } = useTheme();

  const {
    items: galleryImages,
    getFeaturedItems: getFeaturedGalleryImages
  } = useContent<GalleryImage>('gallery');
  
  const {
    items: blogPosts,
    getFeaturedItems: getFeaturedBlogPosts
  } = useContent<BlogPost>('blog');
  
  const {
    items: aiTools,
    getFeaturedItems: getFeaturedAITools
  } = useContent<AITool>('aiTools');

  const [featuredGalleryImages, setFeaturedGalleryImages] = useState<GalleryImage[]>([]);
  const [featuredBlogPosts, setFeaturedBlogPosts] = useState<BlogPost[]>([]);
  const [featuredAITools, setFeaturedAITools] = useState<AITool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setFeaturedGalleryImages(getFeaturedGalleryImages(3));
    setFeaturedBlogPosts(getFeaturedBlogPosts(3));
    setFeaturedAITools(getFeaturedAITools(3));
  }, [galleryImages, blogPosts, aiTools, getFeaturedGalleryImages, getFeaturedBlogPosts, getFeaturedAITools]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search functionality
  };

  // 관리자 로그인 함수
  const handleAutoLogin = async () => {
    try {
      const password = prompt('관리자 비밀번호를 입력하세요:');
      if (!password) return;
      
      const success = await verifyPassword(password);
      if (success) {
        alert('관리자로 로그인되었습니다!');
      } else {
        alert('비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('관리자 로그인에 실패했습니다.');
    }
  };

  // 로그아웃 함수
  const handleLogout = () => {
    logout();
    alert('로그아웃되었습니다.');
  };

  // 테마별 배경과 효과 설정
  const getThemeBackground = () => {
    switch(currentTheme.name) {
      case 'cyberpunk':
        return (
          <>
            <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-30"></div>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyber-secondary/20 rounded-full blur-3xl animate-pulse-slow delay-700"></div>
          </>
        );
      case 'minimal':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-white opacity-50"></div>
        );
      default: // space
        return (
          <>
            <div className="absolute inset-0 bg-[url('/bg-stars.png')] bg-repeat opacity-30"></div>
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-space-purple/30 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-space-accent/20 rounded-full blur-3xl animate-pulse-slow delay-700"></div>
          </>
        );
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.mainBg} ${currentTheme.textColor} transition-colors duration-700`}>
      {/* 헤더/네비게이션은 별도 컴포넌트로 분리 */}
      
      {/* 히어로 섹션 */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        {/* 배경 효과 */}
        {getThemeBackground()}
        
        {/* 컨텐츠 */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-5xl md:text-7xl font-bold ${currentTheme.headingColor} mb-8 tracking-tight ${currentTheme.name === 'cyberpunk' ? 'font-cyber animate-glow' : ''} transition-all duration-700`}>
            <span className={`block ${currentTheme.name === 'space' ? 'text-transparent bg-clip-text bg-gradient-to-r from-space-accent to-space-purple' : currentTheme.name === 'cyberpunk' ? 'text-cyber-primary' : 'text-minimal-primary'}`}>
              MARVIS
            </span>
            <span className="block">AI 갤러리 & 블로그</span>
          </h1>
          <p className={`max-w-2xl mx-auto text-xl md:text-2xl ${currentTheme.textColor}/80 mb-12`}>
            AI 생성 이미지 갤러리와 블로그를 한 곳에서 경험하세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/gallery')}
              className={`px-8 py-3 ${currentTheme.buttonBg} hover:${currentTheme.buttonHoverBg} transition-colors text-white rounded-xl text-lg font-medium`}
            >
              갤러리 보기
            </button>
            <button
              onClick={() => navigate('/blog')}
              className={`px-8 py-3 ${currentTheme.buttonBg} hover:${currentTheme.buttonHoverBg} transition-colors text-white rounded-xl text-lg font-medium`}
            >
              블로그 보기
            </button>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold ${currentTheme.headingColor} mb-4 ${currentTheme.name === 'cyberpunk' ? 'font-cyber' : ''}`}>
              주요 기능
            </h2>
            <p className={`text-lg ${currentTheme.textColor}/70 max-w-2xl mx-auto`}>
              우리 플랫폼의 핵심 기능들을 살펴보세요.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${currentTheme.secondaryBg} border border-${currentTheme.textColor}/10 rounded-lg p-6 text-center hover:bg-opacity-70 transition-colors duration-300`}
              >
                <div className={`flex justify-center items-center mb-4 ${currentTheme.accentColor}`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${currentTheme.headingColor}`}>{feature.title}</h3>
                <p className={`${currentTheme.textColor}/70`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 갤러리 섹션 */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className={`text-3xl font-bold ${currentTheme.headingColor} ${currentTheme.name === 'cyberpunk' ? 'font-cyber' : ''}`}>인기 갤러리</h2>
            <Link
              to="/gallery"
              className={`${currentTheme.accentColor} hover:${currentTheme.buttonHoverBg} transition-colors flex items-center gap-1`}
            >
              <span>더 보기</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGalleryImages.length > 0 ? (
              featuredGalleryImages.map((image) => (
                <div
                  key={image.id}
                  onClick={() => navigate(`/gallery/${image.id}`)}
                  className="cursor-pointer group"
                >
                  <div className={`relative aspect-square overflow-hidden rounded-lg ${currentTheme.secondaryBg}`}>
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-${currentTheme.mainBg}/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4`}>
                      <h3 className={`text-xl font-semibold ${currentTheme.headingColor} mb-1`}>{image.title}</h3>
                      <p className={`${currentTheme.textColor}/80 line-clamp-2`}>{image.description}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className={`${currentTheme.textColor}/60`}>아직 등록된 이미지가 없습니다. 첫 번째 이미지를 업로드해보세요!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 블로그 섹션 */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className={`text-3xl font-bold ${currentTheme.headingColor} ${currentTheme.name === 'cyberpunk' ? 'font-cyber' : ''}`}>최신 블로그</h2>
            <Link
              to="/blog"
              className={`${currentTheme.accentColor} hover:${currentTheme.buttonHoverBg} transition-colors flex items-center gap-1`}
            >
              <span>더 보기</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBlogPosts.length > 0 ? (
              featuredBlogPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className={`${currentTheme.secondaryBg} border border-${currentTheme.textColor}/10 rounded-lg overflow-hidden hover:bg-opacity-70 transition-colors`}
                >
                  <div className="p-6">
                    <h3 className={`text-xl font-semibold mb-2 ${currentTheme.headingColor} line-clamp-2 ${currentTheme.name === 'cyberpunk' ? 'font-cyber' : ''}`}>
                      {post.title}
                    </h3>
                    <p className={`${currentTheme.textColor}/70 mb-4 line-clamp-3`}>
                      {post.content.substring(0, 100)}...
                    </p>
                    <div className={`flex justify-between items-center text-sm ${currentTheme.textColor}/50`}>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center">
                          <span className="mr-1">❤️</span>
                          {post.likes || 0}
                        </span>
                        <span className="flex items-center">
                          <span className="mr-1">👁️</span>
                          {post.views || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className={`${currentTheme.textColor}/60`}>아직 등록된 블로그 글이 없습니다. 첫 번째 글을 작성해보세요!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI 도구 섹션 */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className={`text-3xl font-bold ${currentTheme.headingColor} ${currentTheme.name === 'cyberpunk' ? 'font-cyber' : ''}`}>인기 AI 도구</h2>
            <Link
              to="/ai-tools"
              className={`${currentTheme.accentColor} hover:${currentTheme.buttonHoverBg} transition-colors flex items-center gap-1`}
            >
              <span>더 보기</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredAITools.length > 0 ? (
              featuredAITools.map((tool) => (
                <Link
                  key={tool.id}
                  to={`/ai-tools/${tool.id}`}
                  className={`${currentTheme.secondaryBg} border border-${currentTheme.textColor}/10 rounded-lg p-6 hover:bg-opacity-70 transition-colors`}
                >
                  <h3 className={`text-xl font-semibold mb-2 ${currentTheme.headingColor} ${currentTheme.name === 'cyberpunk' ? 'font-cyber' : ''}`}>
                    {tool.name}
                  </h3>
                  <p className={`${currentTheme.textColor}/70 mb-4 line-clamp-3`}>
                    {tool.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={currentTheme.accentColor}>{tool.category}</span>
                    <div className={`flex items-center gap-2 text-sm ${currentTheme.textColor}/50`}>
                      <span className="flex items-center">
                        <span className="mr-1">❤️</span>
                        {tool.likes || 0}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">👁️</span>
                        {tool.views || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className={`${currentTheme.textColor}/60`}>곧 다양한 AI 도구가 추가될 예정입니다!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className={`${currentTheme.secondaryBg} py-12 transition-colors duration-700`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h2 className={`text-2xl font-bold ${currentTheme.headingColor} mb-2 ${currentTheme.name === 'cyberpunk' ? 'font-cyber' : ''}`}>MARVIS</h2>
              <p className={`${currentTheme.textColor}/60`}>AI 생성 아트와 컨텐츠의 세계로 오신 것을 환영합니다.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className={`text-lg font-medium ${currentTheme.headingColor} mb-3`}>바로가기</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/gallery" className={`${currentTheme.textColor}/60 hover:${currentTheme.textColor} transition-colors`}>
                      갤러리
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className={`${currentTheme.textColor}/60 hover:${currentTheme.textColor} transition-colors`}>
                      블로그
                    </Link>
                  </li>
                  <li>
                    <Link to="/ai-tools" className={`${currentTheme.textColor}/60 hover:${currentTheme.textColor} transition-colors`}>
                      AI 도구
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className={`text-lg font-medium ${currentTheme.headingColor} mb-3`}>연락처</h3>
                <ul className="space-y-2">
                  <li className={`${currentTheme.textColor}/60`}>
                    이메일: kimpastor0191@gmail.com
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={`mt-8 pt-8 border-t border-${currentTheme.textColor}/10 text-center ${currentTheme.textColor}/40 text-sm`}>
            <p>© 2023 MARVIS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 