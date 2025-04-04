import React from 'react';

interface Image {
  id: string;
  imageUrl: string;
  title: string;
  author: string;
}

interface ImageGalleryProps {
  images: Image[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  if (images.length === 0) {
    return <div className="text-center my-8">No images found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <div key={image.id} className="rounded-lg overflow-hidden shadow-lg">
          <img src={image.imageUrl} alt={image.title} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{image.title}</h3>
            <p className="text-sm text-gray-500">By {image.author}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery; 