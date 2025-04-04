import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import useAdmin from '../hooks/useAdmin';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { currentTheme } = useTheme();
  const { isAdmin, verifyPassword, logout } = useAdmin();

  // 반응형 메뉴 토글
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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

  // 현재 경로에 따라 활성화된 링크 스타일 지정
  const getNavLinkClass = (path: string) => {
    const baseClass = `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
      currentTheme.textColor
    }`;
    return location.pathname === path
      ? `${baseClass} font-bold ${currentTheme.accentColor}`
      : `${baseClass} hover:${currentTheme.accentColor}`;
  };

  return (
    <nav className={`sticky top-0 z-50 ${currentTheme.mainBg} shadow-md transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className={`text-xl font-bold ${currentTheme.textColor}`}>
                MARVIS
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <Link to="/" className={getNavLinkClass('/')}>
                  홈
                </Link>
                <Link to="/gallery" className={getNavLinkClass('/gallery')}>
                  갤러리
                </Link>
                <Link to="/blog" className={getNavLinkClass('/blog')}>
                  블로그
                </Link>
                <Link to="/ai-tools" className={getNavLinkClass('/ai-tools')}>
                  AI 도구
                </Link>
                
                {/* 테마 스위처 */}
                <div className="ml-2">
                  <ThemeSwitcher />
                </div>
                
                {isAdmin ? (
                  <button 
                    onClick={handleLogout}
                    className={`ml-4 px-3 py-1 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700`}
                  >
                    관리자 로그아웃
                  </button>
                ) : (
                  <button 
                    onClick={handleAutoLogin}
                    className={`ml-4 px-3 py-1 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700`}
                  >
                    관리자 로그인
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 