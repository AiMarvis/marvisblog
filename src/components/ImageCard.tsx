import React from 'react';
import { Link } from 'react-router-dom';
import { GalleryImage } from '../types';

interface ImageCardProps {
  image: GalleryImage;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  return (
    <Link to={`/gallery/${image.id}`} className="block">
      <div className="group relative aspect-square overflow-hidden rounded-lg bg-space-navy/30 border border-space-light/10 hover:border-space-glow/30 transition-colors">
        <img
          src={image.imageUrl}
          alt={image.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
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