import React from 'react';

interface Image {
  id: string;
  url: string;
  title: string;
  author: string;
}

interface ImageGalleryProps {
  images: Image[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative overflow-hidden rounded-lg bg-gray-100"
        >
          <img
            src={image.url}
            alt={image.title}
            className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-semibold text-white">{image.title}</h3>
              <p className="mt-1 text-sm text-gray-300">by {image.author}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery; 