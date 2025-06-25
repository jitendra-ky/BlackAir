import { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await resumeAPI.getResumes();
      setResumes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const createResume = async (resumeData) => {
    try {
      const newResume = await resumeAPI.createResume(resumeData);
      setResumes(prev => [...prev, newResume]);
      toast.success('Resume created successfully!');
      return newResume;
    } catch (err) {
      toast.error('Failed to create resume');
      throw err;
    }
  };

  const updateResume = async (id, resumeData) => {
    try {
      const updatedResume = await resumeAPI.updateResume(id, resumeData);
      setResumes(prev =>
        prev.map(resume => (resume.id === id ? updatedResume : resume))
      );
      toast.success('Resume updated successfully!');
      return updatedResume;
    } catch (err) {
      toast.error('Failed to update resume');
      throw err;
    }
  };

  const deleteResume = async (id) => {
    try {
      await resumeAPI.deleteResume(id);
      setResumes(prev => prev.filter(resume => resume.id !== id));
      toast.success('Resume deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete resume');
      throw err;
    }
  };

  const duplicateResume = async (id) => {
    try {
      const duplicatedResume = await resumeAPI.duplicateResume(id);
      setResumes(prev => [...prev, duplicatedResume]);
      toast.success('Resume duplicated successfully!');
      return duplicatedResume;
    } catch (err) {
      toast.error('Failed to duplicate resume');
      throw err;
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return {
    resumes,
    loading,
    error,
    createResume,
    updateResume,
    deleteResume,
    duplicateResume,
    refetch: fetchResumes,
  };
};
