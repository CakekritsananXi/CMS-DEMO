import React from 'react';
import { Plus, Calendar, Lightbulb, FileText, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Plus,
      label: 'New Content Idea',
      description: 'Capture inspiration',
      onClick: () => navigate('/ideation'),
      color: 'bg-sage',
    },
    {
      icon: Calendar,
      label: 'Schedule Content',
      description: 'Plan publication',
      onClick: () => navigate('/calendar'),
      color: 'bg-warm-blue',
    },
    {
      icon: FileText,
      label: 'Create Brief',
      description: 'Start new project',
      onClick: () => navigate('/strategy'),
      color: 'bg-dusty-purple',
    },
    {
      icon: BarChart3,
      label: 'View Analytics',
      description: 'Check performance',
      onClick: () => navigate('/analytics'),
      color: 'bg-warm-amber',
    },
  ];

  const handleActionClick = (action: any) => {
    console.log('Quick action clicked:', action.label);
    action.onClick();
  };
  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <h2 className="text-base sm:text-lg font-semibold text-neutral-900 mb-4 sm:mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleActionClick(action)}
            className="group p-3 sm:p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all duration-250 text-left hover:shadow-soft"
          >
            <div className={`w-8 h-8 sm:w-10 sm:h-10 ${action.color} rounded-xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-250`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm sm:text-base font-medium text-neutral-900 mb-1">{action.label}</h3>
            <p className="text-xs sm:text-sm text-neutral-500">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;