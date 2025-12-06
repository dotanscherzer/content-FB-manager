import { useState } from 'react';
import './FilterPanel.css';

const FilterPanel = ({ onFilterChange, onSortChange, sortOptions = [], filterFields = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters };
    if (value === '' || value === null) {
      delete newFilters[field];
    } else {
      newFilters[field] = value;
    }
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      setSortOrder(newOrder);
      if (onSortChange) {
        onSortChange(field, newOrder);
      }
    } else {
      setSortBy(field);
      setSortOrder('desc');
      if (onSortChange) {
        onSortChange(field, 'desc');
      }
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSortBy('');
    setSortOrder('desc');
    if (onFilterChange) {
      onFilterChange({});
    }
    if (onSortChange) {
      onSortChange('', 'desc');
    }
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || sortBy !== '';

  return (
    <div className="filter-panel">
      <button 
        className="filter-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>🔍</span> מיון וסינון
        {hasActiveFilters && <span className="active-badge">{Object.keys(filters).length + (sortBy ? 1 : 0)}</span>}
      </button>

      {isOpen && (
        <div className="filter-content">
          {/* Sort Options */}
          {sortOptions.length > 0 && (
            <div className="filter-section">
              <h4>מיון לפי:</h4>
              <div className="sort-options">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`sort-btn ${sortBy === option.value ? 'active' : ''}`}
                    onClick={() => handleSortChange(option.value)}
                  >
                    {option.label}
                    {sortBy === option.value && (
                      <span className="sort-indicator">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filter Fields */}
          {filterFields.length > 0 && (
            <div className="filter-section">
              <h4>סינון:</h4>
              <div className="filter-fields">
                {filterFields.map((field) => (
                  <div key={field.name} className="filter-field">
                    <label>{field.label}</label>
                    {field.type === 'select' ? (
                      <select
                        value={filters[field.name] || ''}
                        onChange={(e) => handleFilterChange(field.name, e.target.value)}
                      >
                        <option value="">כל האפשרויות</option>
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        placeholder={field.placeholder || `חפש ${field.label.toLowerCase()}`}
                        value={filters[field.name] || ''}
                        onChange={(e) => handleFilterChange(field.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              נקה סינון ומיון
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;

