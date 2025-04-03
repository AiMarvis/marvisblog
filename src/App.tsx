import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:id" element={<ImageDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/ai-tools" element={<AITools />} />
          <Route path="/ai-tools/:id" element={<ToolDetail />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/create-image" element={<CreateImage />} />
          <Route path="/create-tool" element={<CreateTool />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 