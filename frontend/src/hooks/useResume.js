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
  const [originalResume, setOriginalResume] = useState(null); // Track original state for deletions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setOriginalResume(JSON.parse(JSON.stringify(completeResumeData))); // Deep copy
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load resume');
      console.error('Error loading resume:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save basic resume header/metadata
  const saveResumeHeader = async (headerData) => {
    try {
      const updatedResume = await resumeAPI.updateResume(resumeId, {
        title: headerData.title,
        name: headerData.name,
        email: headerData.email,
        phone: headerData.phone,
        location: headerData.location,
        summary: headerData.summary,
        linkedin_url: headerData.linkedin_url,
        github_url: headerData.github_url,
        website_url: headerData.website_url
      });
      
      // Update local state with the saved data
      setResume(prev => ({ ...prev, ...updatedResume }));
      setOriginalResume(prev => ({ ...prev, ...updatedResume }));
      
      toast.success('Resume header saved successfully!');
      return updatedResume;
    } catch (err) {
      toast.error('Failed to save resume header');
      throw err;
    }
  };

  // Save education section
  const saveEducationSection = async (educationData) => {
    try {
      const originalEducation = originalResume?.education || [];
      
      // Find items to delete
      const itemsToDelete = originalEducation.filter(origItem => 
        origItem.id && !educationData.find(currItem => currItem.id === origItem.id)
      );
      
      // Delete removed items
      for (const item of itemsToDelete) {
        await educationAPI.deleteEducation(item.id);
      }
      
      // Create or update current items
      const updatePromises = educationData.map(item => {
        const itemData = { ...item, resume: resumeId };
        
        if (item.id) {
          return educationAPI.updateEducation(item.id, itemData);
        } else {
          return educationAPI.createEducation(itemData);
        }
      });
      
      const updatedItems = await Promise.all(updatePromises);
      
      // Update local state
      setResume(prev => ({ ...prev, education: updatedItems }));
      setOriginalResume(prev => ({ ...prev, education: [...updatedItems] }));
      
      toast.success('Education section saved successfully!');
      return updatedItems;
    } catch (err) {
      toast.error('Failed to save education section');
      throw err;
    }
  };

  // Save experience section
  const saveExperienceSection = async (experienceData) => {
    try {
      const originalExperience = originalResume?.experience || [];
      
      // Find items to delete
      const itemsToDelete = originalExperience.filter(origItem => 
        origItem.id && !experienceData.find(currItem => currItem.id === origItem.id)
      );
      
      // Delete removed items
      for (const item of itemsToDelete) {
        await experienceAPI.deleteExperience(item.id);
      }
      
      // Create or update current items
      const updatePromises = experienceData.map(item => {
        const itemData = { ...item, resume: resumeId };
        
        if (item.id) {
          return experienceAPI.updateExperience(item.id, itemData);
        } else {
          return experienceAPI.createExperience(itemData);
        }
      });
      
      const updatedItems = await Promise.all(updatePromises);
      
      // Update local state
      setResume(prev => ({ ...prev, experience: updatedItems }));
      setOriginalResume(prev => ({ ...prev, experience: [...updatedItems] }));
      
      toast.success('Experience section saved successfully!');
      return updatedItems;
    } catch (err) {
      toast.error('Failed to save experience section');
      throw err;
    }
  };

  // Save skills section
  const saveSkillsSection = async (skillsData) => {
    try {
      const originalSkills = originalResume?.skills || [];
      
      // Find items to delete
      const itemsToDelete = originalSkills.filter(origItem => 
        origItem.id && !skillsData.find(currItem => currItem.id === origItem.id)
      );
      
      // Delete removed items
      for (const item of itemsToDelete) {
        await skillsAPI.deleteSkill(item.id);
      }
      
      // Create or update current items
      const updatePromises = skillsData.map(item => {
        const itemData = { ...item, resume: resumeId };
        
        if (item.id) {
          return skillsAPI.updateSkill(item.id, itemData);
        } else {
          return skillsAPI.createSkill(itemData);
        }
      });
      
      const updatedItems = await Promise.all(updatePromises);
      
      // Update local state
      setResume(prev => ({ ...prev, skills: updatedItems }));
      setOriginalResume(prev => ({ ...prev, skills: [...updatedItems] }));
      
      toast.success('Skills section saved successfully!');
      return updatedItems;
    } catch (err) {
      toast.error('Failed to save skills section');
      throw err;
    }
  };

  // Save projects section
  const saveProjectsSection = async (projectsData) => {
    try {
      const originalProjects = originalResume?.projects || [];
      
      // Find items to delete
      const itemsToDelete = originalProjects.filter(origItem => 
        origItem.id && !projectsData.find(currItem => currItem.id === origItem.id)
      );
      
      // Delete removed items
      for (const item of itemsToDelete) {
        await projectsAPI.deleteProject(item.id);
      }
      
      // Create or update current items
      const updatePromises = projectsData.map(item => {
        const itemData = { ...item, resume: resumeId };
        
        if (item.id) {
          return projectsAPI.updateProject(item.id, itemData);
        } else {
          return projectsAPI.createProject(itemData);
        }
      });
      
      const updatedItems = await Promise.all(updatePromises);
      
      // Update local state
      setResume(prev => ({ ...prev, projects: updatedItems }));
      setOriginalResume(prev => ({ ...prev, projects: [...updatedItems] }));
      
      toast.success('Projects section saved successfully!');
      return updatedItems;
    } catch (err) {
      toast.error('Failed to save projects section');
      throw err;
    }
  };

  // Save certifications section
  const saveCertificationsSection = async (certificationsData) => {
    try {
      const originalCertifications = originalResume?.certifications || [];
      
      // Find items to delete
      const itemsToDelete = originalCertifications.filter(origItem => 
        origItem.id && !certificationsData.find(currItem => currItem.id === origItem.id)
      );
      
      // Delete removed items
      for (const item of itemsToDelete) {
        await certificationsAPI.deleteCertification(item.id);
      }
      
      // Create or update current items
      const updatePromises = certificationsData.map(item => {
        const itemData = { ...item, resume: resumeId };
        
        if (item.id) {
          return certificationsAPI.updateCertification(item.id, itemData);
        } else {
          return certificationsAPI.createCertification(itemData);
        }
      });
      
      const updatedItems = await Promise.all(updatePromises);
      
      // Update local state
      setResume(prev => ({ ...prev, certifications: updatedItems }));
      setOriginalResume(prev => ({ ...prev, certifications: [...updatedItems] }));
      
      toast.success('Certifications section saved successfully!');
      return updatedItems;
    } catch (err) {
      toast.error('Failed to save certifications section');
      throw err;
    }
  };

  // Save achievements section
  const saveAchievementsSection = async (achievementsData) => {
    try {
      const originalAchievements = originalResume?.achievements || [];
      
      // Find items to delete
      const itemsToDelete = originalAchievements.filter(origItem => 
        origItem.id && !achievementsData.find(currItem => currItem.id === origItem.id)
      );
      
      // Delete removed items
      for (const item of itemsToDelete) {
        await achievementsAPI.deleteAchievement(item.id);
      }
      
      // Create or update current items
      const updatePromises = achievementsData.map(item => {
        const itemData = { ...item, resume: resumeId };
        
        if (item.id) {
          return achievementsAPI.updateAchievement(item.id, itemData);
        } else {
          return achievementsAPI.createAchievement(itemData);
        }
      });
      
      const updatedItems = await Promise.all(updatePromises);
      
      // Update local state
      setResume(prev => ({ ...prev, achievements: updatedItems }));
      setOriginalResume(prev => ({ ...prev, achievements: [...updatedItems] }));
      
      toast.success('Achievements section saved successfully!');
      return updatedItems;
    } catch (err) {
      toast.error('Failed to save achievements section');
      throw err;
    }
  };

  const updateResumeData = (newData) => {
    setResume(prev => ({ ...prev, ...newData }));
  };

  const resetChanges = () => {
    fetchResume();
  };

  useEffect(() => {
    fetchResume();
  }, [resumeId]);

  return {
    resume,
    loading,
    error,
    saveResumeHeader,
    saveEducationSection,
    saveExperienceSection,
    saveSkillsSection,
    saveProjectsSection,
    saveCertificationsSection,
    saveAchievementsSection,
    updateResumeData,
    resetChanges,
    refetch: fetchResume,
  };
};
