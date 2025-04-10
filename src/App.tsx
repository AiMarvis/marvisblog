import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import AITools from './pages/AITools';
import CreatePost from './pages/CreatePost';
import CreateImage from './pages/CreateImage';
import CreateTool from './pages/CreateTool';
import ImageDetail from './pages/ImageDetail';
import BlogDetail from './pages/BlogDetail';
import ToolDetail from './pages/ToolDetail';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { ContentProvider } from './contexts/ContentContext';

// 라우터를 테마 제공자 내부에서 사용하기 위한 래퍼 컴포넌트
const AppContent = () => {
  const { currentTheme } = useTheme();
  
  return (
    <Router>
      <div className={`min-h-screen ${currentTheme.mainBg} transition-colors duration-700`}>
        <Navbar />
        <Routes>
          {/* 홈 */}
          <Route path="/" element={<Home />} />
          
          {/* 갤러리 라우트 - 순서 중요! */}
          <Route path="/gallery/create" element={<CreateImage />} />
          <Route path="/gallery/edit/:id" element={<CreateImage />} />
          <Route path="/gallery/:id" element={<ImageDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          
          {/* 블로그 라우트 */}
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/create-post" element={<CreatePost />} />
          
          {/* AI 도구 라우트 */}
          <Route path="/ai-tools/:id" element={<ToolDetail />} />
          <Route path="/ai-tools" element={<AITools />} />
          <Route path="/create-tool" element={<CreateTool />} />
        </Routes>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <ContentProvider>
        <AppContent />
      </ContentProvider>
    </ThemeProvider>
  );
};

export default App; 