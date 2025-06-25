import { useState, useEffect } from 'react';
import { 
  resumeAPI, 
  educationAPI, 
  experienceAPI, 
  skillsAPI, 
  projectsAPI, 
  certificationsAPI, 
  achievementsAPI 
} from '../services/api';
import toast from 'react-hot-toast';

export const useResume = (resumeId) => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const fetchResume = async () => {
    if (!resumeId) return;
    
    try {
      setLoading(true);
      
      // Fetch resume basic data and all sections in parallel
      const [
        resumeData,
        education,
        experience,
        skills,
        projects,
        certifications,
        achievements
      ] = await Promise.all([
        resumeAPI.getResume(resumeId),
        educationAPI.getEducation(resumeId),
        experienceAPI.getExperience(resumeId),
        skillsAPI.getSkills(resumeId),
        projectsAPI.getProjects(resumeId),
        certificationsAPI.getCertifications(resumeId),
        achievementsAPI.getAchievements(resumeId)
      ]);

      // Combine resume data with all sections
      const completeResumeData = {
        ...resumeData,
        education,
        experience,
        skills,
        projects,
        certifications,
        achievements
      };

      setResume(completeResumeData);
      setError(null);
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load resume');
      console.error('Error loading resume:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateResume = async (resumeData) => {
    try {
      const updatedResume = await resumeAPI.updateResume(resumeId, resumeData);
      setResume(updatedResume);
      setHasUnsavedChanges(false);
      toast.success('Resume saved successfully!');
      return updatedResume;
    } catch (err) {
      toast.error('Failed to save resume');
      throw err;
    }
  };

  const updateResumeData = (newData) => {
    setResume(prev => ({ ...prev, ...newData }));
    setHasUnsavedChanges(true);
  };

  const resetChanges = () => {
    fetchResume();
  };

  useEffect(() => {
    fetchResume();
  }, [resumeId]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return {
    resume,
    loading,
    error,
    hasUnsavedChanges,
    updateResume,
    updateResumeData,
    resetChanges,
    refetch: fetchResume,
  };
};
