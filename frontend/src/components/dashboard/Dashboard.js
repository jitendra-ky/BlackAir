import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumes } from '../../hooks/useResumes';
import ResumeCard from './ResumeCard';
import CreateResumeModal from './CreateResumeModal';
import LoadingSpinner from '../ui/LoadingSpinner';
import Button from '../ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const navigate = useNavigate();
  const { resumes, loading, createResume, deleteResume, duplicateResume } = useResumes();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateResume = async (resumeData) => {
    try {
      const newResume = await createResume(resumeData);
      setShowCreateModal(false);
      navigate(`/resume/${newResume.id}/edit`);
    } catch (error) {
      console.error('Failed to create resume:', error);
    }
  };

  const handleEditResume = (resumeId) => {
    navigate(`/resume/${resumeId}/edit`);
  };

  const handleViewResume = (resumeId) => {
    navigate(`/resume/${resumeId}/preview`);
  };

  const handleDuplicateResume = async (resumeId) => {
    try {
      await duplicateResume(resumeId);
    } catch (error) {
      console.error('Failed to duplicate resume:', error);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      try {
        await deleteResume(resumeId);
      } catch (error) {
        console.error('Failed to delete resume:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading your resumes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Dashboard</h1>
        <p className="text-gray-600">Create and manage your professional resumes</p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">My Resumes</h2>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Create New Resume
        </Button>
      </div>

      {/* Resume Grid */}
      {resumes.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-6">
              Start building your professional resume by creating your first one.
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              size="lg"
              className="flex items-center gap-2 mx-auto"
            >
              <PlusIcon className="h-5 w-5" />
              Create Your First Resume
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onEdit={() => handleEditResume(resume.id)}
              onView={() => handleViewResume(resume.id)}
              onDuplicate={() => handleDuplicateResume(resume.id)}
              onDelete={() => handleDeleteResume(resume.id)}
            />
          ))}
        </div>
      )}

      {/* Create Resume Modal */}
      <CreateResumeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateResume}
      />
    </div>
  );
};

export default Dashboard;
