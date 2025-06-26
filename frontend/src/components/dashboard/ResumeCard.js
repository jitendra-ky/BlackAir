import React from 'react';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
import { 
  EllipsisVerticalIcon,
  PencilIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/helpers';

const ResumeCard = ({ resume, onEdit, onView, onDuplicate, onDelete }) => {
  const handleCardClick = (e) => {
    // Don't trigger card click if clicking on dropdown, buttons, or interactive elements
    if (e.target.closest('button, [role="button"], .dropdown-trigger')) {
      return;
    }
    onEdit();
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {resume.title || 'Untitled Resume'}
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>Updated {formatDate(resume.updated_at)}</span>
          </div>
        </div>
        
        <Dropdown
          trigger={
            <button className="dropdown-trigger p-1 text-gray-400 hover:text-gray-600 rounded">
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
          }
        >
          <DropdownItem onClick={onEdit}>
            <div className="flex items-center gap-2">
              <PencilIcon className="h-4 w-4" />
              Edit Resume
            </div>
          </DropdownItem>
          <DropdownItem onClick={onView}>
            <div className="flex items-center gap-2">
              <EyeIcon className="h-4 w-4" />
              View Resume
            </div>
          </DropdownItem>
          <DropdownItem onClick={onDuplicate}>
            <div className="flex items-center gap-2">
              <DocumentDuplicateIcon className="h-4 w-4" />
              Duplicate Resume
            </div>
          </DropdownItem>
          <DropdownItem onClick={onDelete} danger>
            <div className="flex items-center gap-2">
              <TrashIcon className="h-4 w-4" />
              Delete Resume
            </div>
          </DropdownItem>
        </Dropdown>
      </div>

      {/* Resume Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-4 min-h-[120px]">
        <div className="text-center">
          <h4 className="font-semibold text-gray-900 mb-1">
            {resume.name || 'Your Name'}
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
            {resume.email && <div>{resume.email}</div>}
            {resume.phone && <div>{resume.phone}</div>}
            {(resume.city || resume.location) && (
              <div>{resume.city || resume.location}</div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onEdit}
          className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onView}
          className="px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
        >
          Preview
        </button>
      </div>
    </div>
  );
};

export default ResumeCard;
