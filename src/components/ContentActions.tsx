import React, { useState } from 'react';
import { GalleryImage, BlogPost, AITool } from '../types';
import { EditModal } from './EditModal';

interface ContentActionsProps<T> {
  item: T;
  type: 'gallery' | 'blog' | 'tool';
  onLike: () => void;
  onEdit: (updatedItem: T) => void;
  onDelete: () => void;
  isOwner: boolean;
}

export function ContentActions<T extends GalleryImage | BlogPost | AITool>({
  item,
  type,
  onLike,
  onEdit,
  onDelete,
  isOwner
}: ContentActionsProps<T>) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onLike}
        className="p-2 text-space-light/70 hover:text-space-glow transition-colors"
        title="좋아요"
      >
        <span role="img" aria-label="like">❤️</span>
      </button>
      
      {isOwner && (
        <>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 text-space-light/70 hover:text-space-glow transition-colors"
            title="수정"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-space-light/70 hover:text-space-glow transition-colors"
            title="삭제"
          >
            🗑️
          </button>
        </>
      )}

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={onEdit}
        item={item}
        type={type}
      />
    </div>
  );
} 