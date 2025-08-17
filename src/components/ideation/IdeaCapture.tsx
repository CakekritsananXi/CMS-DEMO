import React, { useState } from 'react';
import { X, Save, Lightbulb, Tag, Target } from 'lucide-react';

interface IdeaCaptureProps {
  onClose: () => void;
}

const IdeaCapture: React.FC<IdeaCaptureProps> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [pillar, setPillar] = useState('');
  const [priority, setPriority] = useState('medium');

  const pillars = ['Thought Leadership', 'Product Education', 'Industry Insights', 'Community Building'];

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title for your idea');
      return;
    }
    
    const newIdea = {
      title,
      description,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      pillar,
      priority,
      createdAt: new Date().toISOString(),
    };
    
    console.log('Saving new idea:', newIdea);
    // Here you would typically save to your state management or API
    
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl border border-neutral-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-sage" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900">Capture New Idea</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Idea Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your content idea?"
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your idea in detail..."
              rows={4}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Content Pillar
              </label>
              <select
                value={pillar}
                onChange={(e) => setPillar(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
              >
                <option value="">Select pillar...</option>
                {pillars.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Add tags separated by commas..."
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-neutral-100">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-neutral-200 rounded-xl font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="bg-sage text-white px-6 py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200 flex items-center space-x-2 shadow-soft"
          >
            <Save className="w-4 h-4" />
            <span>Save Idea</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaCapture;