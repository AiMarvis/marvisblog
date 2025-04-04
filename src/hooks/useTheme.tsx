import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 테마 타입 정의
export type ThemeName = 'space' | 'cyberpunk' | 'minimal';

// 테마 설정 타입
interface ThemeConfig {
  name: ThemeName;
  label: string;
  mainBg: string;
  secondaryBg: string;
  accentColor: string;
  textColor: string;
  headingColor: string;
  buttonBg: string;
  buttonHoverBg: string;
  isDark: boolean;
}

// 테마 옵션 정의
export const themes: Record<ThemeName, ThemeConfig> = {
  space: {
    name: 'space',
    label: '우주 테마',
    mainBg: 'bg-space-dark',
    secondaryBg: 'bg-space-navy/50',
    accentColor: 'text-space-accent',
    textColor: 'text-space-light',
    headingColor: 'text-white',
    buttonBg: 'bg-space-accent',
    buttonHoverBg: 'bg-space-glow',
    isDark: true
  },
  cyberpunk: {
    name: 'cyberpunk',
    label: '사이버펑크 테마',
    mainBg: 'bg-black',
    secondaryBg: 'bg-gray-900/70',
    accentColor: 'text-pink-500',
    textColor: 'text-blue-100',
    headingColor: 'text-yellow-400',
    buttonBg: 'bg-pink-600',
    buttonHoverBg: 'bg-pink-500',
    isDark: true
  },
  minimal: {
    name: 'minimal',
    label: '미니멀 테마',
    mainBg: 'bg-white',
    secondaryBg: 'bg-gray-100',
    accentColor: 'text-gray-900',
    textColor: 'text-gray-800',
    headingColor: 'text-black',
    buttonBg: 'bg-gray-800',
    buttonHoverBg: 'bg-gray-700',
    isDark: false
  },
};

// 테마 컨텍스트 인터페이스
interface ThemeContextProps {
  currentTheme: ThemeConfig;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  availableThemes: ThemeConfig[];
}

// 테마 컨텍스트 생성
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// 테마 제공자 컴포넌트 Props
interface ThemeProviderProps {
  children: ReactNode;
}

// 테마 제공자 컴포넌트
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 로컬 스토리지에서 테마 불러오기 또는 기본값(space) 사용
  const [currentThemeName, setCurrentThemeName] = useState<ThemeName>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    return savedTheme && themes[savedTheme] ? savedTheme : 'space';
  });

  // 테마 이름에 따라 현재 테마 설정 불러오기
  const currentTheme = themes[currentThemeName];

  // 테마 설정 저장 및 적용
  useEffect(() => {
    try {
      console.log('useEffect - 테마 적용:', currentThemeName);
      
      // 로컬 스토리지에 테마 저장
      localStorage.setItem('theme', currentThemeName);
      
      // 문서 루트 요소에 데이터 속성으로 현재 테마 추가
      document.documentElement.setAttribute('data-theme', currentThemeName);
      
      // 테마의 isDark 속성에 따라 다크 모드 클래스 추가/제거
      if (currentTheme.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // 테마별 클래스 추가
      if (currentThemeName === 'minimal') {
        document.documentElement.classList.add('theme-minimal');
        document.documentElement.classList.remove('theme-space', 'theme-cyberpunk');
      } else if (currentThemeName === 'cyberpunk') {
        document.documentElement.classList.add('theme-cyberpunk');
        document.documentElement.classList.remove('theme-space', 'theme-minimal');
      } else { // space
        document.documentElement.classList.add('theme-space');
        document.documentElement.classList.remove('theme-cyberpunk', 'theme-minimal');
      }

      // 미니멀 테마일 경우 body 배경색 변경 및 추가 설정
      if (currentThemeName === 'minimal') {
        document.body.style.backgroundColor = '#ffffff';
        document.documentElement.style.setProperty('--theme-bg', '#ffffff');
        document.documentElement.style.setProperty('--theme-text', '#1f2937');
        document.documentElement.style.setProperty('--theme-accent', '#111827');
      } else if (currentThemeName === 'cyberpunk') {
        document.body.style.backgroundColor = '#000000';
        document.documentElement.style.removeProperty('--theme-bg');
        document.documentElement.style.removeProperty('--theme-text');
        document.documentElement.style.removeProperty('--theme-accent');
      } else { // space
        document.body.style.backgroundColor = '#0f1119';
        document.documentElement.style.removeProperty('--theme-bg');
        document.documentElement.style.removeProperty('--theme-text');
        document.documentElement.style.removeProperty('--theme-accent');
      }

      console.log(`[테마 디버그] 테마가 성공적으로 적용되었습니다: ${currentThemeName}, isDark: ${currentTheme.isDark}`);
    } catch (err) {
      console.error('테마 설정 적용 중 오류:', err);
    }
  }, [currentThemeName, currentTheme.isDark]);

  // 테마 변경 함수
  const setTheme = (theme: ThemeName) => {
    if (!themes[theme]) {
      console.error('존재하지 않는 테마:', theme);
      return;
    }
    
    try {
      console.log('테마 변경 시작:', theme);
      
      // 상태 업데이트
      setCurrentThemeName(theme);
      
      // DOM 직접 접근
      document.documentElement.setAttribute('data-theme', theme);
      
      // 다크 모드 클래스 관리
      const isDark = themes[theme].isDark;
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // 미니멀 테마 특수 처리
      if (theme === 'minimal') {
        document.body.style.backgroundColor = '#ffffff';
        document.documentElement.classList.add('theme-minimal');
        document.documentElement.classList.remove('theme-space', 'theme-cyberpunk');
      } else if (theme === 'cyberpunk') {
        document.body.style.backgroundColor = '#000000';
        document.documentElement.classList.add('theme-cyberpunk');
        document.documentElement.classList.remove('theme-space', 'theme-minimal');
      } else { // space
        document.body.style.backgroundColor = '#0f1119';
        document.documentElement.classList.add('theme-space');
        document.documentElement.classList.remove('theme-cyberpunk', 'theme-minimal');
      }
      
      // CSS 변수 설정
      if (theme === 'minimal') {
        document.documentElement.style.setProperty('--theme-bg', '#ffffff');
        document.documentElement.style.setProperty('--theme-text', '#1f2937');
        document.documentElement.style.setProperty('--theme-accent', '#111827');
      } else {
        document.documentElement.style.removeProperty('--theme-bg');
        document.documentElement.style.removeProperty('--theme-text');
        document.documentElement.style.removeProperty('--theme-accent');
      }
      
      // 로컬 스토리지에 저장
      localStorage.setItem('theme', theme);
      console.log('테마 변경 완료:', theme);
    } catch (err) {
      console.error('테마 변경 중 오류 발생:', err);
    }
  };

  // 테마 순환 함수
  const toggleTheme = () => {
    const themeNames = Object.keys(themes) as ThemeName[];
    const currentIndex = themeNames.indexOf(currentThemeName);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    setCurrentThemeName(themeNames[nextIndex]);
  };

  // 사용 가능한 모든 테마 목록
  const availableThemes = Object.values(themes);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        toggleTheme,
        availableThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// 테마 훅
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default useTheme; 