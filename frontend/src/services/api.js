import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('accessToken', access);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/token/', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/user/', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/user/');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/profile/', profileData);
    return response.data;
  },
};

// Resume endpoints
export const resumeAPI = {
  getResumes: async () => {
    const response = await api.get('/resumes/');
    return response.data;
  },

  getResume: async (id) => {
    const response = await api.get(`/resumes/${id}/`);
    return response.data;
  },

  createResume: async (resumeData) => {
    const response = await api.post('/resumes/', resumeData);
    return response.data;
  },

  updateResume: async (id, resumeData) => {
    const response = await api.put(`/resumes/${id}/`, resumeData);
    return response.data;
  },

  deleteResume: async (id) => {
    const response = await api.delete(`/resumes/${id}/`);
    return response.data;
  },

  duplicateResume: async (id) => {
    const response = await api.post(`/resumes/${id}/duplicate/`);
    return response.data;
  },

  downloadPDF: async (id) => {
    const response = await api.get(`/resumes/${id}/download-pdf/`, {
      responseType: 'blob', // Important for PDF download
    });
    return response;
  },
};

// Education endpoints
export const educationAPI = {
  getEducation: async (resumeId) => {
    const response = await api.get(`/education/?resume=${resumeId}`);
    return response.data;
  },

  createEducation: async (educationData) => {
    const response = await api.post('/education/', educationData);
    return response.data;
  },

  updateEducation: async (id, educationData) => {
    const response = await api.put(`/education/${id}/`, educationData);
    return response.data;
  },

  deleteEducation: async (id) => {
    const response = await api.delete(`/education/${id}/`);
    return response.data;
  },
};

// Experience endpoints
export const experienceAPI = {
  getExperience: async (resumeId) => {
    const response = await api.get(`/experience/?resume=${resumeId}`);
    return response.data;
  },

  createExperience: async (experienceData) => {
    const response = await api.post('/experience/', experienceData);
    return response.data;
  },

  updateExperience: async (id, experienceData) => {
    const response = await api.put(`/experience/${id}/`, experienceData);
    return response.data;
  },

  deleteExperience: async (id) => {
    const response = await api.delete(`/experience/${id}/`);
    return response.data;
  },
};

// Skills endpoints
export const skillsAPI = {
  getSkills: async (resumeId) => {
    const response = await api.get(`/skills/?resume=${resumeId}`);
    return response.data;
  },

  createSkill: async (skillData) => {
    const response = await api.post('/skills/', skillData);
    return response.data;
  },

  updateSkill: async (id, skillData) => {
    const response = await api.put(`/skills/${id}/`, skillData);
    return response.data;
  },

  deleteSkill: async (id) => {
    const response = await api.delete(`/skills/${id}/`);
    return response.data;
  },
};

// Projects endpoints
export const projectsAPI = {
  getProjects: async (resumeId) => {
    const response = await api.get(`/projects/?resume=${resumeId}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects/', projectData);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}/`, projectData);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}/`);
    return response.data;
  },
};

// Certifications endpoints
export const certificationsAPI = {
  getCertifications: async (resumeId) => {
    const response = await api.get(`/certifications/?resume=${resumeId}`);
    return response.data;
  },

  createCertification: async (certificationData) => {
    const response = await api.post('/certifications/', certificationData);
    return response.data;
  },

  updateCertification: async (id, certificationData) => {
    const response = await api.put(`/certifications/${id}/`, certificationData);
    return response.data;
  },

  deleteCertification: async (id) => {
    const response = await api.delete(`/certifications/${id}/`);
    return response.data;
  },
};

// Achievements endpoints
export const achievementsAPI = {
  getAchievements: async (resumeId) => {
    const response = await api.get(`/achievements/?resume=${resumeId}`);
    return response.data;
  },

  createAchievement: async (achievementData) => {
    const response = await api.post('/achievements/', achievementData);
    return response.data;
  },

  updateAchievement: async (id, achievementData) => {
    const response = await api.put(`/achievements/${id}/`, achievementData);
    return response.data;
  },

  deleteAchievement: async (id) => {
    const response = await api.delete(`/achievements/${id}/`);
    return response.data;
  },
};

export default api;
