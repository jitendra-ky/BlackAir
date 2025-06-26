import React, { useState } from 'react';
import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ResumeSkillsSection = ({ skills = [], onUpdate, onSave }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    setEditingItem({
      id: 'new',
      name: '',
      category: '',
      proficiency: 'Intermediate'
    });
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
  };

  const handleSave = async () => {
    if (!editingItem) return;

    setIsSaving(true);
    try {
      let updatedSkills;
      if (editingItem.id === 'new') {
        // Add new item
        const newItem = { ...editingItem };
        delete newItem.id; // Remove temporary ID before sending to backend
        updatedSkills = [...skills, newItem];
      } else {
        // Update existing item
        updatedSkills = skills.map(item => 
          item.id === editingItem.id ? editingItem : item
        );
      }

      // Update local state first for immediate UI feedback
      onUpdate(updatedSkills);
      
      // Save to backend
      await onSave(updatedSkills);
      
      setEditingItem(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to save skills:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleDelete = (itemToDelete) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      const updatedSkills = skills.filter(item => item.id !== itemToDelete.id);
      onUpdate(updatedSkills);
    }
  };

  const handleInputChange = (field, value) => {
    setEditingItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const proficiencyLevels = [
    'Beginner',
    'Intermediate', 
    'Advanced',
    'Expert'
  ];

  return (
    <section className="border-l-4 border-blue-600 pl-4" id="skills-section">
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
          <h2 className="text-lg font-medium text-gray-900">Skills</h2>
          {!isExpanded && skills.length > 0 && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {skills.length} item{skills.length !== 1 ? 's' : ''}
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
        {skills.map((item) => (
          <SkillItem
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
            proficiencyLevels={proficiencyLevels}
          />
        ))}
        
        {isAdding && (
          <SkillItem
            item={editingItem}
            isEditing={true}
            editingItem={editingItem}
            isNew={true}
            isSaving={isSaving}
            onSave={handleSave}
            onCancel={handleCancel}
            onInputChange={handleInputChange}
            proficiencyLevels={proficiencyLevels}
          />
        )}
        </div>
      )}
    </section>
  );
};

const SkillItem = ({ 
  item, 
  isEditing, 
  editingItem, 
  isNew = false,
  isSaving = false,
  onEdit, 
  onDelete, 
  onSave, 
  onCancel, 
  onInputChange,
  proficiencyLevels
}) => {
  const displayTitle = isNew ? 'New Skill' : item.name;

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
                label="Skill Name"
                value={editingItem?.name || ''}
                onChange={(e) => onInputChange('name', e.target.value)}
                placeholder="JavaScript, Project Management, etc."
              />
              <Input
                label="Category (Optional)"
                value={editingItem?.category || ''}
                onChange={(e) => onInputChange('category', e.target.value)}
                placeholder="Programming, Design, Marketing, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proficiency Level
              </label>
              <select
                value={editingItem?.proficiency || 'Intermediate'}
                onChange={(e) => onInputChange('proficiency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {proficiencyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
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
                Save Skill
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
          <div className="flex items-center gap-3 mt-1">
            {item.category && (
              <span className="text-sm text-gray-600">{item.category}</span>
            )}
            {item.proficiency && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {item.proficiency}
              </span>
            )}
          </div>
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

export default ResumeSkillsSection;
