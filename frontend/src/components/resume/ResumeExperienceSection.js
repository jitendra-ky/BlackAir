import React, { useState } from 'react';
import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ResumeExperienceSection = ({ experience = [], onUpdate, onSave }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    setEditingItem({
      id: 'new',
      company: '',
      position: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: ''
    });
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
  };

  const handleSave = async () => {
    if (!editingItem) return;

    setIsSaving(true);
    try {
      let updatedExperience;
      if (editingItem.id === 'new') {
        // Add new item
        const newItem = { ...editingItem };
        delete newItem.id; // Remove temporary ID before sending to backend
        updatedExperience = [...experience, newItem];
      } else {
        // Update existing item
        updatedExperience = experience.map(item => 
          item.id === editingItem.id ? editingItem : item
        );
      }

      // Update local state first for immediate UI feedback
      onUpdate(updatedExperience);
      
      // Save to backend
      await onSave(updatedExperience);
      
      setEditingItem(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to save experience:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleDelete = (itemToDelete) => {
    if (window.confirm('Are you sure you want to delete this work experience?')) {
      const updatedExperience = experience.filter(item => item.id !== itemToDelete.id);
      onUpdate(updatedExperience);
    }
  };

  const handleInputChange = (field, value) => {
    setEditingItem(prev => {
      const updated = { ...prev, [field]: value };
      
      // If "currently working here" is checked, clear end date
      if (field === 'is_current' && value) {
        updated.end_date = '';
      }
      
      return updated;
    });
  };

  return (
    <section className="border-l-4 border-blue-600 pl-4" id="experience-section">
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
          <h2 className="text-lg font-medium text-gray-900">Work Experience</h2>
          {!isExpanded && experience.length > 0 && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {experience.length} item{experience.length !== 1 ? 's' : ''}
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
        {experience.map((item) => (
          <ExperienceItem
            key={item.id}
            item={item}
            isEditing={editingItem?.id === item.id}
            editingItem={editingItem}
            isSaving={isSaving}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item)}
            onSave={handleSave}
            onCancel={handleCancel}
            onInputChange={handleInputChange}
          />
        ))}
        
        {isAdding && (
          <ExperienceItem
            item={editingItem}
            isEditing={true}
            editingItem={editingItem}
            isNew={true}
            isSaving={isSaving}
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

const ExperienceItem = ({ 
  item, 
  isEditing, 
  editingItem, 
  isNew = false,
  isSaving = false,
  onEdit, 
  onDelete, 
  onSave, 
  onCancel, 
  onInputChange 
}) => {
  const displayTitle = isNew ? 'New Experience' : `${item.position} at ${item.company}`;

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company"
                value={editingItem?.company || ''}
                onChange={(e) => onInputChange('company', e.target.value)}
                placeholder="Company name"
              />
              <Input
                label="Position"
                value={editingItem?.position || ''}
                onChange={(e) => onInputChange('position', e.target.value)}
                placeholder="Job title"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Location"
                value={editingItem?.location || ''}
                onChange={(e) => onInputChange('location', e.target.value)}
                placeholder="City, State"
              />
              <div className="flex items-center pt-8">
                <label className="flex items-center text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={editingItem?.is_current || false}
                    onChange={(e) => onInputChange('is_current', e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  Currently working here
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={editingItem?.start_date || ''}
                onChange={(e) => onInputChange('start_date', e.target.value)}
              />
              <Input
                label="End Date"
                type="date"
                value={editingItem?.end_date || ''}
                onChange={(e) => onInputChange('end_date', e.target.value)}
                disabled={editingItem?.is_current}
                className={editingItem?.is_current ? 'bg-gray-100 cursor-not-allowed' : ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                rows="4"
                value={editingItem?.description || ''}
                onChange={(e) => onInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Describe your responsibilities, achievements, and key contributions..."
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={onSave}
                loading={isSaving}
                disabled={isSaving}
              >
                Save Experience
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
          {item.location && (
            <p className="text-sm text-gray-600 mt-1">{item.location}</p>
          )}
          {(item.start_date || item.end_date) && (
            <p className="text-sm text-gray-500 mt-1">
              {item.start_date} - {item.is_current ? 'Present' : item.end_date}
            </p>
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

export default ResumeExperienceSection;
