import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { GalleryImage } from '../types';
import useAdmin from '../hooks/useAdmin';

const ImageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, incrementViews, deleteItem, incrementLikes } = useContent<GalleryImage>('gallery');
  const { isAdmin } = useAdmin();
  const [image, setImage] = useState<GalleryImage | null>(null);
  const [viewIncremented, setViewIncremented] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // 콘솔에 관리자 상태 출력 (디버깅 용도)
  useEffect(() => {
    console.log('관리자 상태:', isAdmin);
  }, [isAdmin]);

  useEffect(() => {
    const foundImage = items.find(img => img.id === id);
    if (foundImage) {
      setImage(foundImage);
      // 좋아요 상태 로드 (예시: 로컬 스토리지 사용)
      const likedStatus = localStorage.getItem(`liked_${id}`);
      setIsLiked(likedStatus === 'true');
      if (!viewIncremented) {
        incrementViews(id!).then(() => {
          setViewIncremented(true);
        }).catch(error => {
          console.error('Error incrementing views:', error);
        });
      }
    } else {
      // 이미지를 찾지 못한 경우 처리 (예: 404 페이지로 리디렉션)
      console.log(`Image with id ${id} not found`);
      // navigate('/404'); // 또는 다른 적절한 처리
    }
  }, [id, items, incrementViews, viewIncremented]);

  const handleDelete = async () => {
    if (!isAdmin) {
      alert('관리자만 삭제할 수 있습니다.');
      return;
    }
    if (window.confirm('정말로 이 이미지를 삭제하시겠습니까?')) {
      try {
        await deleteItem(id!);
        navigate('/gallery');
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('이미지 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleEdit = () => {
    if (!isAdmin) {
      alert('관리자만 수정할 수 있습니다.');
      return;
    }
    navigate(`/gallery/edit/${id}`);
  };

  const handleLike = async () => {
    if (!image) return;
    try {
      await incrementLikes(id!);
      // 좋아요 상태 업데이트 및 로컬 스토리지 저장
      localStorage.setItem(`liked_${id}`, 'true');
      setIsLiked(true);
      // 상태 업데이트 반영을 위해 이미지 정보 다시 로드 또는 상태 업데이트
      setImage(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
    } catch (error) {
      console.error('Error liking image:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!image) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-space-dark text-space-light">
        <p className="text-2xl mb-4">이미지를 불러오는 중...</p>
        <button
          onClick={() => navigate('/gallery')}
          className="px-4 py-2 bg-space-accent text-white rounded-lg hover:bg-space-glow transition-colors"
        >
          갤러리로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-dark text-space-light pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/gallery')}
          className="mb-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-space-accent hover:bg-space-glow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-space-glow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          갤러리로 돌아가기
        </button>

        <div className="bg-space-navy p-6 md:p-8 rounded-lg shadow-xl border border-space-light/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Info */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-space-light mb-4">{image.title}</h1>
                <p className="text-space-light/80 mb-6 text-lg">{image.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {image.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-space-accent/20 rounded-full text-sm text-space-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-space-light/60 space-y-2">
                  <p>카테고리: {image.category}</p>
                  <p>업로드: {formatDate(image.createdAt)}</p>
                  <p>최종 수정: {formatDate(image.updatedAt)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    disabled={isLiked}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${isLiked ? 'text-space-light/50 bg-space-navy/50 cursor-not-allowed' : 'text-space-light hover:bg-space-glow/20'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLiked ? 'text-red-500' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>{image.likes || 0}</span>
                  </button>
                  <div className="flex items-center space-x-1 text-space-light/70">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span>{image.views || 0}</span>
                  </div>
                </div>

                {/* 항상 수정/삭제 버튼 표시 */}
                <div className="flex space-x-2">
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetail; 