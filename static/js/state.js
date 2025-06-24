export const appState = {
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  resume: null,
  sections: {
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: []
  }
};
