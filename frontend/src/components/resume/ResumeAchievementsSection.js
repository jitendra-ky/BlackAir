import React, { useState } from 'react';
import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ResumeAchievementsSection = ({ achievements = [], onUpdate }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAdd = () => {
    setIsAdding(true);
    setEditingItem({
      id: 'new',
      title: '',
      description: '',
      date: '',
      organization: ''
    });
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
  };

  const handleSave = () => {
    if (!editingItem) return;

    let updatedAchievements;
    if (editingItem.id === 'new') {
      // Add new item
      const newItem = { ...editingItem };
      delete newItem.id; // Remove temporary ID before sending to backend
      updatedAchievements = [...achievements, newItem];
    } else {
      // Update existing item
      updatedAchievements = achievements.map(item => 
        item.id === editingItem.id ? editingItem : item
      );
    }

    onUpdate(updatedAchievements);
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleDelete = (itemToDelete) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      const updatedAchievements = achievements.filter(item => item.id !== itemToDelete.id);
      onUpdate(updatedAchievements);
    }
  };

  const handleInputChange = (field, value) => {
    setEditingItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section className="border-l-4 border-blue-600 pl-4" id="achievements-section">
      <div 
        className="flex justify-between items-center mb-3 cursor-pointer hover:bg-gray-50 -ml-4 pl-4 pr-2 py-2 rounded-r-lg transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRightIcon className="w-5 h-5 text-gray-500" />
          )}
          <h2 className="text-lg font-medium text-gray-900">Achievements</h2>
          {!isExpanded && achievements.length > 0 && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {achievements.length} item{achievements.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {isExpanded && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
            className="text-blue-600 hover:text-blue-700"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add
          </Button>
        )}
      </div>
      
      {isExpanded && (
        <div className="space-y-3">
        {achievements.map((item) => (
          <AchievementItem
            key={item.id}
            item={item}
            isEditing={editingItem?.id === item.id}
            editingItem={editingItem}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item)}
            onSave={handleSave}
            onCancel={handleCancel}
            onInputChange={handleInputChange}
          />
        ))}
        
        {isAdding && (
          <AchievementItem
            item={editingItem}
            isEditing={true}
            editingItem={editingItem}
            isNew={true}
            onSave={handleSave}
            onCancel={handleCancel}
            onInputChange={handleInputChange}
          />
        )}
        </div>
      )}
    </section>
  );
};

const AchievementItem = ({ 
  item, 
  isEditing, 
  editingItem, 
  isNew = false,
  onEdit, 
  onDelete, 
  onSave, 
  onCancel, 
  onInputChange 
}) => {
  const displayTitle = isNew ? 'New Achievement' : item.title;

  const handleItemClick = (e) => {
    // Only trigger edit if we're not already editing and it's not a delete button click
    if (!isEditing && !e.target.closest('[data-action="delete"]')) {
      onEdit();
    }
  };

  // If editing, show edit form directly
  if (isEditing) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h4 className="text-base font-medium text-gray-900">{displayTitle}</h4>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <Input
              label="Achievement Title"
              value={editingItem?.title || ''}
              onChange={(e) => onInputChange('title', e.target.value)}
              placeholder="Employee of the Month, Dean's List, Competition Winner, etc."
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows="3"
                value={editingItem?.description || ''}
                onChange={(e) => onInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Describe the achievement and its significance..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date (Optional)"
                type="date"
                value={editingItem?.date || ''}
                onChange={(e) => onInputChange('date', e.target.value)}
              />
              <Input
                label="Organization (Optional)"
                value={editingItem?.organization || ''}
                onChange={(e) => onInputChange('organization', e.target.value)}
                placeholder="Company, University, Competition organizer, etc."
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={onSave}>
                Save Achievement
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show preview/summary mode - click anywhere to edit
  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 cursor-pointer transition-all"
      onClick={handleItemClick}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex-1">
          <h4 className="text-base font-medium text-gray-900">{displayTitle}</h4>
          {item.organization && (
            <p className="text-sm text-gray-600 mt-1">{item.organization}</p>
          )}
          {item.date && (
            <p className="text-sm text-gray-500 mt-1">{item.date}</p>
          )}
          {item.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 mr-2">Click to edit</span>
          <button
            data-action="delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeAchievementsSection;
