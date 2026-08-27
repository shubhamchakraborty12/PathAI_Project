import React, { useState } from 'react';
import { COURSE_CATALOG } from '../data/courseCatalog';
import { ResourceCard } from './ResourceCard';
import { Search, Filter, BookOpen, Sparkles, Layers } from 'lucide-react';

export const CatalogView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const filteredCatalog = COURSE_CATALOG.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesLevel = selectedLevel === 'all' || item.level === selectedLevel;

    return matchesSearch && matchesType && matchesLevel;
  });

  return (
    <div className="catalog-container">
      {/* Header Banner */}
      <div className="catalog-header">
        <div>
          <h2>Explore Course & Project Catalog</h2>
          <p>Browse curated high-quality learning resources, capstone project templates, and official documentation.</p>
        </div>

        <div className="search-box">
          <Search size={18} className="search-icon text-gray-400" />
          <input 
            type="text" 
            placeholder="Search python, langchain, docker, react..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="catalog-filter-bar">
        <div className="filter-group">
          <Filter size={16} className="text-gray-400" />
          <span className="filter-label">Resource Type:</span>
          <button 
            className={`chip-btn ${selectedType === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedType('all')}
          >
            All Types
          </button>
          <button 
            className={`chip-btn ${selectedType === 'Course' ? 'active' : ''}`}
            onClick={() => setSelectedType('Course')}
          >
            Courses
          </button>
          <button 
            className={`chip-btn ${selectedType === 'Project' ? 'active' : ''}`}
            onClick={() => setSelectedType('Project')}
          >
            Projects
          </button>
          <button 
            className={`chip-btn ${selectedType === 'Interactive' ? 'active' : ''}`}
            onClick={() => setSelectedType('Interactive')}
          >
            Interactive Labs
          </button>
        </div>

        <div className="filter-group">
          <span className="filter-label">Level:</span>
          <button 
            className={`chip-btn ${selectedLevel === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedLevel('all')}
          >
            All Levels
          </button>
          <button 
            className={`chip-btn ${selectedLevel === 'Beginner' ? 'active' : ''}`}
            onClick={() => setSelectedLevel('Beginner')}
          >
            Beginner
          </button>
          <button 
            className={`chip-btn ${selectedLevel === 'Intermediate' ? 'active' : ''}`}
            onClick={() => setSelectedLevel('Intermediate')}
          >
            Intermediate
          </button>
          <button 
            className={`chip-btn ${selectedLevel === 'Advanced' ? 'active' : ''}`}
            onClick={() => setSelectedLevel('Advanced')}
          >
            Advanced
          </button>
        </div>
      </div>

      {/* Catalog Results Grid */}
      <div className="catalog-grid">
        {filteredCatalog.map(resource => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
};
