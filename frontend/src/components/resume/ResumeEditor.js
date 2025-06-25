import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useResume } from '../../hooks/useResume';
import LoadingSpinner from '../ui/LoadingSpinner';
import Button from '../ui/Button';
import { 
  ArrowLeftIcon, 
  EyeIcon, 
  ArrowPathIcon,
  BookmarkIcon 
} from '@heroicons/react/24/outline';
import ResumeHeaderSection from './ResumeHeaderSection';
import ResumeEducationSection from './ResumeEducationSection';
import ResumeExperienceSection from './ResumeExperienceSection';
import ResumeProjectsSection from './ResumeProjectsSection';
import ResumeSkillsSection from './ResumeSkillsSection';
import ResumeCertificationsSection from './ResumeCertificationsSection';
import ResumeAchievementsSection from './ResumeAchievementsSection';

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { resume, loading, hasUnsavedChanges, updateResume, updateResumeData, resetChanges } = useResume(id);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!resume) return;
    
    setIsSaving(true);
    try {
      await updateResume(resume);
    } catch (error) {
      console.error('Failed to save resume:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    navigate(`/resume/${id}/preview`);
  };

  const handleCancelChanges = () => {
    if (window.confirm('Are you sure you want to cancel all unsaved changes? This cannot be undone.')) {
      resetChanges();
    }
  };

  const handleResumeUpdate = (field, value) => {
    updateResumeData({ [field]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading resume...</span>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Resume not found</h2>
        <p className="text-gray-600 mb-4">The resume you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b pb-4 mb-8">
        <div className="flex-1">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-2 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Dashboard
          </Link>
          
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={resume.title || ''}
              onChange={(e) => handleResumeUpdate('title', e.target.value)}
              className="text-2xl font-semibold text-gray-900 bg-transparent border-0 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Resume Title"
            />
          </div>
          
          {hasUnsavedChanges && (
            <div className="flex items-center text-xs text-amber-600 font-medium mt-1">
              <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
              Unsaved changes
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelChanges}
              className="flex items-center gap-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Cancel Changes
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="flex items-center gap-2"
          >
            <EyeIcon className="h-4 w-4" />
            Preview
          </Button>
          
          <Button
            size="sm"
            onClick={handleSave}
            loading={isSaving}
            disabled={isSaving || !hasUnsavedChanges}
            className="flex items-center gap-2"
          >
            <BookmarkIcon className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Resume Editor Content */}
      <div className="space-y-8">
        {/* Header Information */}
        <ResumeHeaderSection
          resume={resume}
          onUpdate={handleResumeUpdate}
        />

        {/* Education Section */}
        <ResumeEducationSection
          education={resume?.education || []}
          onUpdate={(updatedEducation) => handleResumeUpdate('education', updatedEducation)}
        />

        {/* Experience Section */}
        <ResumeExperienceSection
          experience={resume?.experience || []}
          onUpdate={(updatedExperience) => handleResumeUpdate('experience', updatedExperience)}
        />

        {/* Projects Section */}
        <ResumeProjectsSection
          projects={resume?.projects || []}
          onUpdate={(updatedProjects) => handleResumeUpdate('projects', updatedProjects)}
        />

        {/* Skills Section */}
        <ResumeSkillsSection
          skills={resume?.skills || []}
          onUpdate={(updatedSkills) => handleResumeUpdate('skills', updatedSkills)}
        />

        {/* Certifications Section */}
        <ResumeCertificationsSection
          certifications={resume?.certifications || []}
          onUpdate={(updatedCertifications) => handleResumeUpdate('certifications', updatedCertifications)}
        />

        {/* Achievements Section */}
        <ResumeAchievementsSection
          achievements={resume?.achievements || []}
          onUpdate={(updatedAchievements) => handleResumeUpdate('achievements', updatedAchievements)}
        />
      </div>
    </div>
  );
};

export default ResumeEditor;
