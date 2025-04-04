import React from 'react';
import { useTheme, ThemeName } from '../hooks/useTheme';

interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '' }) => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  // 테마 아이콘 컴포넌트
  const ThemeIcon = ({ theme }: { theme: ThemeName }) => {
    switch (theme) {
      case 'space':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12z" />
            <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        );
      case 'cyberpunk':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        );
      case 'minimal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  // 테마 변경 함수 - 즉시 테마 변경
  const changeTheme = (theme: ThemeName) => {
    console.log('테마 변경 시도:', theme);
    try {
      setTheme(theme);
      console.log('테마 변경 완료:', theme);
    } catch (err) {
      console.error('테마 변경 오류:', err);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex p-1 bg-gray-800/30 rounded-lg">
        {availableThemes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => changeTheme(theme.name)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              currentTheme.name === theme.name
                ? theme.name === 'minimal' 
                  ? 'bg-white text-black' 
                  : theme.name === 'cyberpunk' 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-space-accent text-white'
                : 'hover:bg-gray-700/50 text-white/70'
            }`}
            title={theme.label}
          >
            <ThemeIcon theme={theme.name} />
            <span className="hidden md:inline text-xs">{theme.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher; 