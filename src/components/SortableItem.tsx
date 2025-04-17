'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import { cn } from '@/lib/utils'; // Optional helper for merging classes
import { GripVertical } from 'lucide-react';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      {/* Only this is draggable */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab p-1"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Everything else is static, not draggable */}
      <div className="flex-1">{children}</div>
    </div>
  );
};
