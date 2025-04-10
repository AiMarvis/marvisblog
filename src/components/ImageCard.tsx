import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GalleryImage } from '../types';

interface ImageCardProps {
  image: GalleryImage;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const [imgSrc, setImgSrc] = useState<string>(image.imageUrl);
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    // 이미지 URL 디버깅
    console.log('이미지 렌더링:', image.id, image.imageUrl);
    
    // URL이 변경되면 상태 초기화
    setImgSrc(image.imageUrl);
    setImgError(false);
  }, [image.imageUrl]);

  // 이미지 로드 실패 처리
  const handleImageError = () => {
    console.error('이미지 로드 실패:', image.id, image.imageUrl);
    setImgError(true);
    
    // 대체 이미지 또는 백업 URL 사용
    setImgSrc('https://placehold.co/600x400?text=Image+Not+Found');
  };

  return (
    <Link to={`/gallery/${image.id}`} className="block">
      <div className="group relative aspect-square overflow-hidden rounded-lg bg-space-navy/30 border border-space-light/10 hover:border-space-glow/30 transition-colors">
        {imgError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
            <p className="text-center p-4">
              <span className="block text-xl">⚠️</span>
              <span className="block mt-2">이미지를 불러올 수 없습니다</span>
            </p>
          </div>
        )}
        <img
          src={imgSrc}
          alt={image.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-space-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-space-light font-medium mb-1">{image.title}</h3>
            <p className="text-space-light/70 text-sm line-clamp-2">{image.description}</p>
            {image.tags && image.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {image.tags.map((tag, index) => (
                  <span
                    key={index}
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
  );
};

export default ImageCard; 