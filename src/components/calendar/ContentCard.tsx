import React from 'react';
import { useDrag } from 'react-dnd';
import { FileText, Instagram, Mail, Clock, Edit2, Trash2, Video, Mic, Copy } from 'lucide-react';

interface ContentCardProps {
  id: string;
  title: string;
  type: 'blog' | 'social' | 'email' | 'video' | 'podcast';
  status: 'draft' | 'scheduled' | 'review' | 'in-progress' | 'approved' | 'published';
  dueDate: string;
  pillar: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ id, title, type, status, dueDate, pillar, onEdit, onDelete, onDuplicate }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'content-card',
    item: { id, title, type, status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getTypeIcon = () => {
    switch (type) {
      case 'blog':
        return <FileText className="w-4 h-4" />;
      case 'social':
        return <Instagram className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'podcast':
        return <Mic className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'draft':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'scheduled':
        return 'bg-sage/10 text-sage border-sage/20';
      case 'review':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'published':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div
      ref={drag}
      className={`bg-white rounded-xl p-4 shadow-soft border border-neutral-100 cursor-move transition-all duration-250 hover:shadow-medium group ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
            {getTypeIcon()}
          </div>
          <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor()}`}>
            {status}
          </span>
        </div>
      </div>

      <h3 className="font-medium text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-600 mb-3">{pillar}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-xs text-neutral-500">
          <Clock className="w-3 h-3 mr-1" />
          Due {dueDate}
        </div>

        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 hover:bg-neutral-200 rounded transition-colors"
              title="Edit"
            >
              <Edit2 className="w-3 h-3 text-neutral-500" />
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              className="p-1 hover:bg-blue-100 rounded transition-colors"
              title="Duplicate"
            >
              <Copy className="w-3 h-3 text-blue-500" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 hover:bg-red-100 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
