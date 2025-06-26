import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useResume } from '../../hooks/useResume';
import LoadingSpinner from '../ui/LoadingSpinner';
import Button from '../ui/Button';
import { 
  ArrowLeftIcon, 
  EyeIcon
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
  const { 
    resume, 
    loading, 
    saveResumeHeader,
    saveEducationSection,
    saveExperienceSection,
    saveSkillsSection,
    saveProjectsSection,
    saveCertificationsSection,
    saveAchievementsSection,
    updateResumeData, 
    resetChanges 
  } = useResume(id);

  const handlePreview = () => {
    navigate(`/resume/${id}/preview`);
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
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="flex items-center gap-2"
          >
            <EyeIcon className="h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      {/* Resume Editor Content */}
      <div className="space-y-8">
        {/* Header Information */}
        <ResumeHeaderSection
          resume={resume}
          onUpdate={handleResumeUpdate}
          onSave={saveResumeHeader}
        />

        {/* Education Section */}
        <ResumeEducationSection
          education={resume?.education || []}
          onUpdate={(updatedEducation) => handleResumeUpdate('education', updatedEducation)}
          onSave={saveEducationSection}
        />

        {/* Experience Section */}
        <ResumeExperienceSection
          experience={resume?.experience || []}
          onUpdate={(updatedExperience) => handleResumeUpdate('experience', updatedExperience)}
          onSave={saveExperienceSection}
        />

        {/* Projects Section */}
        <ResumeProjectsSection
          projects={resume?.projects || []}
          onUpdate={(updatedProjects) => handleResumeUpdate('projects', updatedProjects)}
          onSave={saveProjectsSection}
        />

        {/* Skills Section */}
        <ResumeSkillsSection
          skills={resume?.skills || []}
          onUpdate={(updatedSkills) => handleResumeUpdate('skills', updatedSkills)}
          onSave={saveSkillsSection}
        />

        {/* Certifications Section */}
        <ResumeCertificationsSection
          certifications={resume?.certifications || []}
          onUpdate={(updatedCertifications) => handleResumeUpdate('certifications', updatedCertifications)}
          onSave={saveCertificationsSection}
        />

        {/* Achievements Section */}
        <ResumeAchievementsSection
          achievements={resume?.achievements || []}
          onUpdate={(updatedAchievements) => handleResumeUpdate('achievements', updatedAchievements)}
          onSave={saveAchievementsSection}
        />
      </div>
    </div>
  );
};

export default ResumeEditor;
