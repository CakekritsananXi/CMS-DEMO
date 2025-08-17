import React, { useState } from 'react';
import { Search, Filter, Grid3X3, List, Plus, FolderOpen } from 'lucide-react';
import AssetGrid from '../components/library/AssetGrid';
import AssetList from '../components/library/AssetList';
import FolderTree from '../components/library/FolderTree';

const Library = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Content Library</h1>
          <p className="text-neutral-600">Organize and manage your content assets, templates, and resources</p>
        </div>
        
        <button className="bg-sage text-white px-6 py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200 flex items-center space-x-2 shadow-soft">
          <Plus className="w-4 h-4" />
          <span>Add Content</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search content, templates, and assets..."
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
              />
            </div>
            
            <button className="px-4 py-3 border border-neutral-200 rounded-xl font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-200 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex bg-neutral-100 rounded-xl p-1 ml-4">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                view === 'grid' ? 'bg-white shadow-soft' : 'hover:bg-neutral-200'
              }`}
            >
              <Grid3X3 className="w-4 h-4 text-neutral-600" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                view === 'list' ? 'bg-white shadow-soft' : 'hover:bg-neutral-200'
              }`}
            >
              <List className="w-4 h-4 text-neutral-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <FolderTree />
        </div>
        
        <div className="lg:col-span-3">
          {view === 'grid' ? <AssetGrid /> : <AssetList />}
        </div>
      </div>
    </div>
  );
};

export default Library;