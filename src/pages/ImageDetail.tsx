import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { useAdmin } from '../hooks/useAdmin';
import { GalleryImage } from '../types';

export default function ImageDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, deleteItem, incrementViews, incrementLikes } = useContent<GalleryImage>('gallery');
  const { isAdmin } = useAdmin();
  const [image, setImage] = useState<GalleryImage | null>(null);
  const [viewIncremented, setViewIncremented] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      const foundImage = items.find(img => img.id === id);
      if (foundImage) {
        setImage(foundImage);
        if (!viewIncremented) {
          incrementViews(id).catch(console.error);
          setViewIncremented(true);
        }
      }
    }
  }, [id, items, incrementViews, viewIncremented]);

  const handleLike = async () => {
    if (image) {
      try {
        await incrementLikes(image.id);
      } catch (error) {
        console.error('좋아요 처리 중 오류 발생:', error);
        alert('좋아요 처리 중 오류가 발생했습니다.');
      }
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) {
      alert('관리자만 이미지를 삭제할 수 있습니다.');
      return;
    }

    if (!image || isDeleting) return;

    const confirmed = window.confirm('이 이미지를 삭제하시겠습니까?');
    if (confirmed) {
      try {
        setIsDeleting(true);
        await deleteItem(image.id);
        navigate('/gallery');
      } catch (error) {
        console.error('이미지 삭제 중 오류 발생:', error);
        alert('이미지 삭제 중 오류가 발생했습니다.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (!image) {
    return (
      <div className="min-h-screen bg-space-dark flex items-center justify-center">
        <div className="text-space-light text-center">
          <p className="text-xl">이미지를 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate('/gallery')}
            className="mt-4 text-space-glow hover:text-space-glow/70 transition-colors"
          >
            갤러리로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-space-dark bg-[size:50px_50px] relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-star-pattern opacity-10"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/gallery')}
          className="mb-6 flex items-center gap-2 text-space-light/70 hover:text-space-light transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>갤러리로 돌아가기</span>
        </button>

        <article className="bg-space-navy/30 border border-space-light/10 rounded-lg overflow-hidden">
          <img
            src={image.imageUrl}
            alt={image.title}
            className="w-full h-auto object-cover"
          />
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold text-space-light">{image.title}</h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 px-4 py-2 bg-space-navy/50 rounded-lg text-space-light hover:bg-space-navy/70 transition-colors"
                >
                  <span>❤️</span>
                  <span>{image.likes || 0}</span>
                </button>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => navigate(`/gallery/edit/${image.id}`)}
                      className="px-4 py-2 bg-space-accent/20 text-space-light rounded-lg hover:bg-space-accent/30 transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      {isDeleting ? '삭제 중...' : '삭제'}
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 mb-8 text-space-light/70">
              <time dateTime={image.createdAt}>{formatDate(image.createdAt)}</time>
              <div className="flex items-center gap-2">
                <span className="flex items-center">
                  <span className="mr-1">👁️</span>
                  {image.views || 0}
                </span>
              </div>
              <span className="text-space-light/50">{image.category}</span>
            </div>
            <p className="text-space-light/90 text-lg mb-8">
              {image.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {image.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-space-navy/50 text-space-light/70 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
} 