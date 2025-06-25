import React, { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ResumeHeaderSection = ({ resume, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: resume?.name || '',
    title: resume?.title || '',
    phone: resume?.phone || '',
    email: resume?.email || '',
    location: resume?.location || '',
    linkedin_url: resume?.linkedin_url || '',
    github_url: resume?.github_url || '',
    website_url: resume?.website_url || '',
    twitter_url: resume?.twitter_url || ''
  });
  const [originalData, setOriginalData] = useState(null);

  const handleEdit = () => {
    setOriginalData({ ...formData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
    }
    setIsEditing(false);
    setOriginalData(null);
  };

  const handleSave = () => {
    // Update the resume with all form data
    Object.keys(formData).forEach(key => {
      onUpdate(key, formData[key]);
    });
    setIsEditing(false);
    setOriginalData(null);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update local state when resume changes
  React.useEffect(() => {
    if (resume) {
      setFormData({
        name: resume.name || '',
        title: resume.title || '',
        phone: resume.phone || '',
        email: resume.email || '',
        location: resume.location || '',
        linkedin_url: resume.linkedin_url || '',
        github_url: resume.github_url || '',
        website_url: resume.website_url || '',
        twitter_url: resume.twitter_url || ''
      });
    }
  }, [resume]);

  return (
    <section className="border-l-4 border-blue-600 pl-4">
      <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Header Information</h2>
        <button
          onClick={handleEdit}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <PencilIcon className="h-4 w-4" />
          Edit Header
        </button>
      </div>

      {!isEditing ? (
        /* Header Display */
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-lg p-6 transition-all duration-300 hover:border-slate-300 hover:shadow-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {formData.name || 'Your Name'}
            </h3>
            {formData.title && (
              <p className="text-lg text-slate-700 mb-3">{formData.title}</p>
            )}
            <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-600 mb-3">
              {formData.phone && (
                <span className="bg-white/70 px-3 py-1 rounded-full font-medium">
                  {formData.phone}
                </span>
              )}
              {formData.email && (
                <span className="bg-white/70 px-3 py-1 rounded-full font-medium">
                  {formData.email}
                </span>
              )}
              {formData.location && (
                <span className="bg-white/70 px-3 py-1 rounded-full font-medium">
                  {formData.location}
                </span>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {formData.linkedin_url && (
                <a 
                  href={formData.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium hover:bg-blue-200 transition-colors"
                >
                  💼 LinkedIn
                </a>
              )}
              {formData.github_url && (
                <a 
                  href={formData.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium hover:bg-gray-200 transition-colors"
                >
                  💻 GitHub
                </a>
              )}
              {formData.website_url && (
                <a 
                  href={formData.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium hover:bg-green-200 transition-colors"
                >
                  🌐 Website
                </a>
              )}
              {formData.twitter_url && (
                <a 
                  href={formData.twitter_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full font-medium hover:bg-sky-200 transition-colors"
                >
                  🐦 Twitter
                </a>
              )}
              {!formData.linkedin_url && !formData.github_url && !formData.website_url && !formData.twitter_url && (
                <span className="text-gray-400 text-sm">Click "Edit Header" to add professional links</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Header Form */
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="John Doe"
                />
                <Input
                  label="Professional Title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., Software Engineer, Marketing Manager"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Phone Number"
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
                <Input
                  label="Email Address"
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="john.doe@example.com"
                />
                <Input
                  label="Location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="City, State or City, Country"
                />
              </div>
            </div>

            {/* Professional Links */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                Professional Links
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={<span className="flex items-center gap-2">💼 LinkedIn Profile</span>}
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => handleChange('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                  <Input
                    label={<span className="flex items-center gap-2">💻 GitHub Profile</span>}
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => handleChange('github_url', e.target.value)}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={<span className="flex items-center gap-2">🌐 Portfolio Website</span>}
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => handleChange('website_url', e.target.value)}
                    placeholder="https://yourportfolio.com"
                  />
                  <Input
                    label={<span className="flex items-center gap-2">🐦 Twitter Profile</span>}
                    type="url"
                    value={formData.twitter_url}
                    onChange={(e) => handleChange('twitter_url', e.target.value)}
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                💾 Save Header
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ResumeHeaderSection;
