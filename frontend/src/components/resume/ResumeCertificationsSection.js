import React, { useState } from 'react';
import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ResumeCertificationsSection = ({ certifications = [], onUpdate }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAdd = () => {
    setIsAdding(true);
    setEditingItem({
      id: 'new',
      name: '',
      issuing_organization: '',
      issue_date: '',
      expiry_date: '',
      credential_id: '',
      credential_url: ''
    });
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
  };

  const handleSave = () => {
    if (!editingItem) return;

    let updatedCertifications;
    if (editingItem.id === 'new') {
      // Add new item
      const newItem = { ...editingItem };
      delete newItem.id; // Remove temporary ID before sending to backend
      updatedCertifications = [...certifications, newItem];
    } else {
      // Update existing item
      updatedCertifications = certifications.map(item => 
        item.id === editingItem.id ? editingItem : item
      );
    }

    onUpdate(updatedCertifications);
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleDelete = (itemToDelete) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      const updatedCertifications = certifications.filter(item => item.id !== itemToDelete.id);
      onUpdate(updatedCertifications);
    }
  };

  const handleInputChange = (field, value) => {
    setEditingItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section className="border-l-4 border-blue-600 pl-4" id="certifications-section">
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
          <h2 className="text-lg font-medium text-gray-900">Certifications</h2>
          {!isExpanded && certifications.length > 0 && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {certifications.length} item{certifications.length !== 1 ? 's' : ''}
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
        {certifications.map((item) => (
          <CertificationItem
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
          <CertificationItem
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

const CertificationItem = ({ 
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
  const displayTitle = isNew ? 'New Certification' : `${item.name} - ${item.issuing_organization}`;

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
              label="Certification Name"
              value={editingItem?.name || ''}
              onChange={(e) => onInputChange('name', e.target.value)}
              placeholder="AWS Certified Solutions Architect, PMP, etc."
            />
            <Input
              label="Issuing Organization"
              value={editingItem?.issuing_organization || ''}
              onChange={(e) => onInputChange('issuing_organization', e.target.value)}
              placeholder="Amazon Web Services, PMI, Microsoft, etc."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Issue Date"
                type="date"
                value={editingItem?.issue_date || ''}
                onChange={(e) => onInputChange('issue_date', e.target.value)}
              />
              <Input
                label="Expiry Date (Optional)"
                type="date"
                value={editingItem?.expiry_date || ''}
                onChange={(e) => onInputChange('expiry_date', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Credential ID (Optional)"
                value={editingItem?.credential_id || ''}
                onChange={(e) => onInputChange('credential_id', e.target.value)}
                placeholder="Certificate ID or badge number"
              />
              <Input
                label="Credential URL (Optional)"
                type="url"
                value={editingItem?.credential_url || ''}
                onChange={(e) => onInputChange('credential_url', e.target.value)}
                placeholder="https://certification-verify-url.com"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={onSave}>
                Save Certification
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
          <h4 className="text-base font-medium text-gray-900">{item.name}</h4>
          {item.issuing_organization && (
            <p className="text-sm text-gray-600 mt-1">{item.issuing_organization}</p>
          )}
          {(item.issue_date || item.expiry_date) && (
            <p className="text-sm text-gray-500 mt-1">
              {item.issue_date && `Issued: ${item.issue_date}`}
              {item.issue_date && item.expiry_date && ' • '}
              {item.expiry_date && `Expires: ${item.expiry_date}`}
            </p>
          )}
          {item.credential_id && (
            <p className="text-sm text-gray-500 mt-1">ID: {item.credential_id}</p>
          )}
          {item.credential_url && (
            <a 
              href={item.credential_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
              onClick={(e) => e.stopPropagation()}
            >
              View Certificate
            </a>
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

export default ResumeCertificationsSection;
