import React, { useEffect, useState } from 'react';
import { collaborationService } from '../../services/collaboration';

interface Cursor {
  userId: string;
  userName: string;
  color: string;
  cursor: { x: number; y: number };
}

const LiveCursors: React.FC = () => {
  const [cursors, setCursors] = useState<Cursor[]>([]);

  useEffect(() => {
    const handleCursorMove = () => {
      const activeCursors = collaborationService.getActiveCursors();
      setCursors(activeCursors);
    };

    // Update cursors immediately
    handleCursorMove();

    // Listen for cursor updates
    collaborationService.on('cursor_move', handleCursorMove);

    return () => {
      collaborationService.off('cursor_move', handleCursorMove);
    };
  }, []);

  // Track mouse movement for current user
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      collaborationService.updateCursor(e.clientX, e.clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {cursors.map((cursor) => (
        <div
          key={cursor.userId}
          className="absolute transition-all duration-100 ease-out"
          style={{
            left: cursor.cursor.x,
            top: cursor.cursor.y,
            transform: 'translate(-2px, -2px)'
          }}
        >
          {/* Cursor Arrow */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="drop-shadow-lg"
          >
            <path
              d="M2 2L18 8L8 12L2 18V2Z"
              fill={cursor.color}
              stroke="white"
              strokeWidth="1"
            />
          </svg>
          
          {/* User Name Label */}
          <div
            className="absolute top-5 left-2 px-2 py-1 text-xs font-medium text-white rounded-lg shadow-lg whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.userName}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveCursors;
