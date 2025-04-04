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

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-space-dark">
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

export default App; 