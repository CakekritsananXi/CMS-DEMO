import React, { useState } from 'react';
import { Plus, Lightbulb, Tag, Filter } from 'lucide-react';
import IdeaBoard from '../components/ideation/IdeaBoard';
import IdeaCapture from '../components/ideation/IdeaCapture';
import TopicClusters from '../components/ideation/TopicClusters';

const Ideation = () => {
  const [showCapture, setShowCapture] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">Content Ideation</h1>
          <p className="text-sm sm:text-base text-neutral-600">Capture, organize, and develop your content ideas</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <button className="px-3 sm:px-4 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-200 flex items-center space-x-2 text-sm sm:text-base">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button 
            onClick={() => setShowCapture(true)}
            className="bg-sage text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200 flex items-center space-x-2 shadow-soft text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Idea</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-soft border border-neutral-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sage/10 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-sage" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-neutral-900">47</div>
              <div className="text-xs sm:text-sm text-neutral-600">Total Ideas</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-soft border border-neutral-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-warm-blue/10 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-warm-blue" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-neutral-900">12</div>
              <div className="text-xs sm:text-sm text-neutral-600">Categories</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-soft border border-neutral-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-dusty-purple/10 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-dusty-purple" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-neutral-900">23</div>
              <div className="text-xs sm:text-sm text-neutral-600">In Development</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-soft border border-neutral-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-soft-emerald/10 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-soft-emerald" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-neutral-900">8</div>
              <div className="text-xs sm:text-sm text-neutral-600">Ready to Publish</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <IdeaBoard />
        </div>
        <div className="mt-6 lg:mt-0">
          <TopicClusters />
        </div>
      </div>

      {/* Idea Capture Modal */}
      {showCapture && (
        <IdeaCapture onClose={() => setShowCapture(false)} />
      )}
    </div>
  );
};

export default Ideation;