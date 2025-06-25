import { apiFetch } from './utils.js';

// App state to store resume data
const appState = {
    resume: null,
    resumeId: null,
    hasUnsavedChanges: false,
    originalHeader: null, // Store original header state for cancel functionality
    header: {
        name: '',
        title: '',
        phone: '',
        email: '',
        location: '',
        linkedin: '',
        github: '',
        website: '',
        twitter: ''
    },
    sections: {
        education: [],
        experience: [],
        projects: [],
        skills: [],
        certifications: [],
        achievements: []
    }
};

// Initialize editor when page loads
$(document).ready(function() {
    // Get resume ID from URL
    const pathParts = window.location.pathname.split('/');
    const resumeIdIndex = pathParts.indexOf('resume') + 1;
    appState.resumeId = pathParts[resumeIdIndex];
    
    if (!appState.resumeId) {
        showError('Invalid resume ID');
        return;
    }
    
    initializeEditor();
    setupEventListeners();
});

function setupEventListeners() {
    // Save button
    $('#save-btn').click(saveResume);
    
    // Preview button
    $('#preview-btn').click(previewResume);
    
    // Cancel all changes button
    $('#cancel-all-btn').click(function() {
        if (confirm('Are you sure you want to cancel all unsaved changes? This cannot be undone.')) {
            location.reload(); // Reload the page to reset all changes
        }
    });
    
    // Resume title input
    $('#resume-title-input').on('input', function() {
        const newTitle = $(this).val();
        $('#resume-title-display').text(newTitle);
        appState.resume.title = newTitle;
        markAsChanged();
    });
    
    // Header section event listeners
    $('#edit-header-btn').click(function() {
        // Save current state for cancel functionality
        appState.originalHeader = { ...appState.header };
        $('#header-display').hide();
        $('#header-form').show();
    });
    
    $('#cancel-header-btn').click(function() {
        // Restore original header state
        if (appState.originalHeader) {
            appState.header = { ...appState.originalHeader };
            loadHeaderData(); // Reset form to original state
        }
        $('#header-form').hide();
        $('#header-display').show();
        updateHeaderDisplay();
    });
    
    $('#save-header-btn').click(function() {
        saveHeaderData();
        updateHeaderDisplay();
        $('#header-form').hide();
        $('#header-display').show();
        markAsChanged();
        // Clear backup since changes are now committed
        appState.originalHeader = null;
    });
    
    // Header form input listeners
    $('#header-form input').on('input', function() {
        markAsChanged();
    });
    
    // Add item buttons
    $('.add-item-btn').click(function() {
        const section = $(this).data('section');
        addNewItem(section);
    });
    
    // Delete modal
    $('#close-delete-modal').click(closeDeleteModal);
    
    // Warn about unsaved changes
    window.addEventListener('beforeunload', function(e) {
        if (appState.hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

async function initializeEditor() {
    try {
        showLoading();
        await loadResumeData();
        renderEditor();
        hideLoading();
    } catch (error) {
        console.error('Error initializing editor:', error);
        showError('Failed to load resume data. Please try again.');
        hideLoading();
    }
}

async function loadResumeData() {
    // Load resume basic info
    appState.resume = await apiFetch(`/resumes/${appState.resumeId}/`);
    
    // Load header data from resume
    appState.header = {
        name: appState.resume.name || '',
        title: appState.resume.professional_title || '',
        phone: appState.resume.phone || '',
        email: appState.resume.email || '',
        location: appState.resume.location || '',
        linkedin: appState.resume.linkedin_url || '',
        github: appState.resume.github_url || '',
        website: appState.resume.website_url || '',
        twitter: appState.resume.twitter_url || ''
    };
    
    // Load all sections in parallel
    const [education, experience, projects, skills, certifications, achievements] = await Promise.all([
        apiFetch(`/education/?resume=${appState.resumeId}`),
        apiFetch(`/experience/?resume=${appState.resumeId}`),
        apiFetch(`/projects/?resume=${appState.resumeId}`),
        apiFetch(`/skills/?resume=${appState.resumeId}`),
        apiFetch(`/certifications/?resume=${appState.resumeId}`),
        apiFetch(`/achievements/?resume=${appState.resumeId}`)
    ]);
    
    appState.sections.education = education;
    appState.sections.experience = experience;
    appState.sections.projects = projects;
    appState.sections.skills = skills;
    appState.sections.certifications = certifications;
    appState.sections.achievements = achievements;
}

function renderEditor() {
    // Set resume title
    $('#resume-title-display').text(appState.resume.title);
    $('#resume-title-input').val(appState.resume.title);
    
    // Initialize header
    initializeHeader();
    
    // Render all sections
    renderEducationSection();
    renderExperienceSection();
    renderProjectsSection();
    renderSkillsSection();
    renderCertificationsSection();
    renderAchievementsSection();
}

function renderEducationSection() {
    const container = $('#education-items');
    container.empty();
    
    appState.sections.education.forEach(item => {
        const educationItem = createEducationItem(item);
        container.append(educationItem);
    });
}

function createEducationItem(item = {}) {
    const itemId = item.id || 'new';
    const isNew = !item.id;
    
    return $(`
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow" data-section="education" data-id="${itemId}">
            <div class="flex items-center justify-between p-4 border-b border-gray-100">
                <h4 class="text-base font-medium text-gray-900">${isNew ? 'New Education' : item.degree + ' at ' + item.school}</h4>
                <div class="flex items-center gap-2">
                    <button class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors edit-item-btn" title="Edit">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors delete-item-btn" title="Delete">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="p-4 ${isNew ? '' : 'hidden'}" data-form-container>
                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">School</label>
                            <input type="text" name="school" value="${item.school || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="University name">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                            <input type="text" name="degree" value="${item.degree || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Bachelor's, Master's, etc.">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                            <input type="text" name="field_of_study" value="${item.field_of_study || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Computer Science, Business, etc.">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">GPA (Optional)</label>
                            <input type="number" name="gpa" value="${item.gpa || ''}" step="0.01" max="4.0" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="3.75">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input type="date" name="start_date" value="${item.start_date || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input type="date" name="end_date" value="${item.end_date || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                        <textarea name="description" rows="3" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                            placeholder="Relevant coursework, achievements, honors...">${item.description || ''}</textarea>
                    </div>
                    <div class="flex items-center justify-end gap-3 pt-4">
                        <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors cancel-item-btn">
                            Cancel
                        </button>
                        <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors save-item-btn">
                            Save Education
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).on('click', '.edit-item-btn', function() {
        $(this).closest('.editor-item, [data-section]').find('[data-form-container]').removeClass('hidden');
    }).on('click', '.cancel-item-btn', function() {
        const $item = $(this).closest('.editor-item, [data-section]');
        if ($item.data('id') === 'new') {
            $item.remove();
        } else {
            $item.find('[data-form-container]').addClass('hidden');
        }
    }).on('click', '.save-item-btn', function() {
        saveEducationItem($(this).closest('.editor-item, [data-section]'));
    }).on('click', '.delete-item-btn', function() {
        const $item = $(this).closest('.editor-item, [data-section]');
        showDeleteModal(() => deleteItem('education', $item));
    }).on('input change', 'input, textarea', function() {
        markAsChanged();
    });
}

function renderExperienceSection() {
    const container = $('#experience-items');
    container.empty();
    
    appState.sections.experience.forEach(item => {
        const experienceItem = createExperienceItem(item);
        container.append(experienceItem);
    });
}

function createExperienceItem(item = {}) {
    const itemId = item.id || 'new';
    const isNew = !item.id;
    
    return $(`
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow" data-section="experience" data-id="${itemId}">
            <div class="flex items-center justify-between p-4 border-b border-gray-100">
                <h4 class="text-base font-medium text-gray-900">${isNew ? 'New Experience' : item.position + ' at ' + item.company}</h4>
                <div class="flex items-center gap-2">
                    <button class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors edit-item-btn" title="Edit">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors delete-item-btn" title="Delete">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="p-4 ${isNew ? '' : 'hidden'}" data-form-container>
                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Company</label>
                            <input type="text" name="company" value="${item.company || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Company name">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Position</label>
                            <input type="text" name="position" value="${item.position || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Job title">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input type="text" name="location" value="${item.location || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="City, State">
                        </div>
                        <div class="flex items-center pt-8">
                            <label class="flex items-center text-sm text-gray-700">
                                <input type="checkbox" name="is_current" ${item.is_current ? 'checked' : ''} 
                                    class="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2">
                                Currently working here
                            </label>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input type="date" name="start_date" value="${item.start_date || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input type="date" name="end_date" value="${item.end_date || ''}" ${item.is_current ? 'disabled' : ''}
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                        <textarea name="description" rows="4" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                            placeholder="Describe your responsibilities, achievements, and key contributions...">${item.description || ''}</textarea>
                    </div>
                    <div class="flex items-center justify-end gap-3 pt-4">
                        <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors cancel-item-btn">
                            Cancel
                        </button>
                        <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors save-item-btn">
                            Save Experience
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).on('click', '.edit-item-btn', function() {
        $(this).closest('.editor-item, [data-section]').find('[data-form-container]').removeClass('hidden');
    }).on('click', '.cancel-item-btn', function() {
        const $item = $(this).closest('.editor-item, [data-section]');
        if ($item.data('id') === 'new') {
            $item.remove();
        } else {
            $item.find('[data-form-container]').addClass('hidden');
        }
    }).on('click', '.save-item-btn', function() {
        saveExperienceItem($(this).closest('.editor-item, [data-section]'));
    }).on('click', '.delete-item-btn', function() {
        const $item = $(this).closest('.editor-item, [data-section]');
        showDeleteModal(() => deleteItem('experience', $item));
    }).on('change', 'input[name="is_current"]', function() {
        const $endDate = $(this).closest('.editor-item, [data-section]').find('input[name="end_date"]');
        if ($(this).is(':checked')) {
            $endDate.prop('disabled', true).val('').addClass('bg-gray-100 cursor-not-allowed');
        } else {
            $endDate.prop('disabled', false).removeClass('bg-gray-100 cursor-not-allowed');
        }
    }).on('input change', 'input, textarea', function() {
        markAsChanged();
    });
}

function renderProjectsSection() {
    const container = $('#projects-items');
    container.empty();
    
    appState.sections.projects.forEach(item => {
        const projectItem = createProjectItem(item);
        container.append(projectItem);
    });
}

function createProjectItem(item = {}) {
    const itemId = item.id || 'new';
    const isNew = !item.id;
    
    return $(`
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow" data-section="projects" data-id="${itemId}">
            <div class="flex items-center justify-between p-4 border-b border-gray-100">
                <h4 class="text-base font-medium text-gray-900">${isNew ? 'New Project' : item.name}</h4>
                <div class="flex items-center gap-2">
                    <button class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors edit-item-btn" title="Edit">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors delete-item-btn" title="Delete">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="p-4 ${isNew ? '' : 'hidden'}" data-form-container>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                        <input type="text" name="name" value="${item.name || ''}" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="E-commerce Platform, Mobile App, etc.">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea name="description" rows="3" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                            placeholder="Describe the project, its purpose, key features, and your role...">${item.description || ''}</textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
                        <input type="text" name="technologies" value="${item.technologies || ''}" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="React, Node.js, MongoDB, AWS, etc. (comma-separated)">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input type="date" name="start_date" value="${item.start_date || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input type="date" name="end_date" value="${item.end_date || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Project URL (Optional)</label>
                            <input type="url" name="project_url" value="${item.project_url || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="https://project-demo.com">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">GitHub URL (Optional)</label>
                            <input type="url" name="github_url" value="${item.github_url || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="https://github.com/username/repo">
                        </div>
                    </div>
                    <div class="flex items-center justify-end gap-3 pt-4">
                        <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors cancel-item-btn">
                            Cancel
                        </button>
                        <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors save-item-btn">
                            Save Project
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).on('click', '.edit-item-btn', function() {
        $(this).closest('.editor-item, [data-section]').find('[data-form-container]').removeClass('hidden');
    }).on('click', '.cancel-item-btn', function() {
        const $item = $(this).closest('.editor-item, [data-section]');
        if ($item.data('id') === 'new') {
            $item.remove();
        } else {
            $item.find('[data-form-container]').addClass('hidden');
        }
    }).on('click', '.save-item-btn', function() {
        saveProjectItem($(this).closest('.editor-item, [data-section]'));
    }).on('click', '.delete-item-btn', function() {
        const $item = $(this).closest('.editor-item, [data-section]');
        showDeleteModal(() => deleteItem('projects', $item));
    }).on('input change', 'input, textarea', function() {
        markAsChanged();
    });
}

function renderSkillsSection() {
    const container = $('#skills-items');
    container.empty();
    
    appState.sections.skills.forEach(item => {
        const skillItem = createSkillItem(item);
        container.append(skillItem);
    });
}

function createSkillItem(item = {}) {
    const itemId = item.id || 'new';
    const isNew = !item.id;
    
    return $(`
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow" data-section="skills" data-id="${itemId}">
            <div class="flex items-center justify-between p-4 border-b border-gray-100">
                <h4 class="text-base font-medium text-gray-900">${isNew ? 'New Skill' : item.name + ' (' + (item.level || 'intermediate') + ')'}</h4>
                <div class="flex items-center gap-2">
                    <button class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors edit-item-btn" title="Edit">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors delete-item-btn" title="Delete">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="p-4 ${isNew ? '' : 'hidden'}" data-form-container>
                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
                            <input type="text" name="name" value="${item.name || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="JavaScript, Python, Design, etc.">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <input type="text" name="category" value="${item.category || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Programming, Design, Marketing, etc.">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Proficiency Level</label>
                            <select name="level" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                                <option value="beginner" ${item.level === 'beginner' ? 'selected' : ''}>Beginner</option>
                                <option value="intermediate" ${item.level === 'intermediate' || !item.level ? 'selected' : ''}>Intermediate</option>
                                <option value="advanced" ${item.level === 'advanced' ? 'selected' : ''}>Advanced</option>
                                <option value="expert" ${item.level === 'expert' ? 'selected' : ''}>Expert</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                            <input type="number" name="years_of_experience" value="${item.years_of_experience || ''}" min="0" max="50"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="2">
                        </div>
                    </div>
                    <div class="flex items-center justify-end gap-3 pt-4">
                        <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors cancel-item-btn">
                            Cancel
                        </button>
                        <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors save-item-btn">
                            Save Skill
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).on('click', '.edit-item-btn', function() {
        $(this).closest('.editor-item, [data-section]').find('[data-form-container]').removeClass('hidden');
    }).on('click', '.cancel-item-btn', function() {
        const $item = $(this).closest('.editor-item, [data-section]');
        if ($item.data('id') === 'new') {
            $item.remove();
        } else {
            $item.find('[data-form-container]').addClass('hidden');
        }
    }).on('click', '.save-item-btn', function() {
        saveSkillItem($(this).closest('.editor-item, [data-section]'));
    }).on('click', '.delete-item-btn', function() {
        const $item = $(this).closest('.editor-item, [data-section]');
        showDeleteModal(() => deleteItem('skills', $item));
    }).on('input change', 'input, select', function() {
        markAsChanged();
    });
}

function renderCertificationsSection() {
    const container = $('#certifications-items');
    container.empty();
    
    appState.sections.certifications.forEach(item => {
        const certificationItem = createCertificationItem(item);
        container.append(certificationItem);
    });
}

function createCertificationItem(item = {}) {
    const itemId = item.id || 'new';
    const isNew = !item.id;
    
    return $(`
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow" data-section="certifications" data-id="${itemId}">
            <div class="flex items-center justify-between p-4 border-b border-gray-100">
                <h4 class="text-base font-medium text-gray-900">${isNew ? 'New Certification' : item.name + ' - ' + item.issuing_organization}</h4>
                <div class="flex items-center gap-2">
                    <button class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors edit-item-btn" title="Edit">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors delete-item-btn" title="Delete">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="p-4 ${isNew ? '' : 'hidden'}" data-form-container>
                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Certification Name</label>
                            <input type="text" name="name" value="${item.name || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="AWS Solutions Architect, PMP, etc.">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Issuing Organization</label>
                            <input type="text" name="issuing_organization" value="${item.issuing_organization || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Amazon Web Services, PMI, etc.">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                            <input type="date" name="issue_date" value="${item.issue_date || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Expiration Date (Optional)</label>
                            <input type="date" name="expiration_date" value="${item.expiration_date || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Credential ID (Optional)</label>
                            <input type="text" name="credential_id" value="${item.credential_id || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Certificate ID or number">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Credential URL (Optional)</label>
                            <input type="url" name="credential_url" value="${item.credential_url || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="https://verify.certification.com">
                        </div>
                    </div>
                    <div class="flex items-center justify-end gap-3 pt-4">
                        <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors cancel-item-btn">
                            Cancel
                        </button>
                        <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors save-item-btn">
                            Save Certification
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).on('click', '.edit-item-btn', function() {
        $(this).closest('.editor-item, [data-section]').find('[data-form-container]').removeClass('hidden');
    }).on('click', '.cancel-item-btn', function() {
        const $item = $(this).closest('.editor-item, [data-section]');
        if ($item.data('id') === 'new') {
            $item.remove();
        } else {
            $item.find('[data-form-container]').addClass('hidden');
        }
    }).on('click', '.save-item-btn', function() {
        saveCertificationItem($(this).closest('.editor-item, [data-section]'));
    }).on('click', '.delete-item-btn', function() {
        const $item = $(this).closest('.editor-item, [data-section]');
        showDeleteModal(() => deleteItem('certifications', $item));
    }).on('input change', 'input', function() {
        markAsChanged();
    });
}

function renderAchievementsSection() {
    const container = $('#achievements-items');
    container.empty();
    
    appState.sections.achievements.forEach(item => {
        const achievementItem = createAchievementItem(item);
        container.append(achievementItem);
    });
}

function createAchievementItem(item = {}) {
    const itemId = item.id || 'new';
    const isNew = !item.id;
    
    return $(`
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow" data-section="achievements" data-id="${itemId}">
            <div class="flex items-center justify-between p-4 border-b border-gray-100">
                <h4 class="text-base font-medium text-gray-900">${isNew ? 'New Achievement' : item.title}</h4>
                <div class="flex items-center gap-2">
                    <button class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors edit-item-btn" title="Edit">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors delete-item-btn" title="Delete">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="p-4 ${isNew ? '' : 'hidden'}" data-form-container>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Achievement Title</label>
                        <input type="text" name="title" value="${item.title || ''}" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Employee of the Month, Dean's List, etc.">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea name="description" rows="3" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                            placeholder="Describe the achievement, its significance, and the impact it had...">${item.description || ''}</textarea>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date Achieved</label>
                            <input type="date" name="date_achieved" value="${item.date_achieved || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Organization (Optional)</label>
                            <input type="text" name="organization" value="${item.organization || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Company, University, etc.">
                        </div>
                    </div>
                    <div class="flex items-center justify-end gap-3 pt-4">
                        <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors cancel-item-btn">
                            Cancel
                        </button>
                        <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors save-item-btn">
                            Save Achievement
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).on('click', '.edit-item-btn', function() {
        $(this).closest('.editor-item, [data-section]').find('[data-form-container]').removeClass('hidden');
    }).on('click', '.cancel-item-btn', function() {
        const $item = $(this).closest('.editor-item, [data-section]');
        if ($item.data('id') === 'new') {
            $item.remove();
        } else {
            $item.find('[data-form-container]').addClass('hidden');
        }
    }).on('click', '.save-item-btn', function() {
        saveAchievementItem($(this).closest('.editor-item, [data-section]'));
    }).on('click', '.delete-item-btn', function() {
        const $item = $(this).closest('.editor-item, [data-section]');
        showDeleteModal(() => deleteItem('achievements', $item));
    }).on('input change', 'input, textarea', function() {
        markAsChanged();
    });
}

// Add new item functions
function addNewItem(section) {
    let newItem;
    let container;
    
    switch(section) {
        case 'education':
            newItem = createEducationItem();
            container = $('#education-items');
            break;
        case 'experience':
            newItem = createExperienceItem();
            container = $('#experience-items');
            break;
        case 'projects':
            newItem = createProjectItem();
            container = $('#projects-items');
            break;
        case 'skills':
            newItem = createSkillItem();
            container = $('#skills-items');
            break;
        case 'certifications':
            newItem = createCertificationItem();
            container = $('#certifications-items');
            break;
        case 'achievements':
            newItem = createAchievementItem();
            container = $('#achievements-items');
            break;
    }
    
    if (newItem && container) {
        container.append(newItem);
        newItem.find('input, textarea, select').first().focus();
    }
}

// Save item functions
async function saveEducationItem($item) {
    const formData = getFormData($item);
    const itemId = $item.data('id');
    const isNew = itemId === 'new';
    
    try {
        formData.resume = appState.resumeId;
        
        let savedItem;
        if (isNew) {
            savedItem = await apiFetch('/education/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            appState.sections.education.push(savedItem);
        } else {
            savedItem = await apiFetch(`/education/${itemId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const index = appState.sections.education.findIndex(item => item.id === itemId);
            appState.sections.education[index] = savedItem;
        }
        
        // Update the item display
        $item.data('id', savedItem.id);
        $item.find('.item-header h4, h4').text(`${savedItem.degree} at ${savedItem.school}`);
        $item.find('[data-form-container]').addClass('hidden');
        
        showSuccess('Education item saved successfully');
        markAsSaved();
    } catch (error) {
        console.error('Error saving education item:', error);
        showError('Failed to save education item');
    }
}

async function saveExperienceItem($item) {
    const formData = getFormData($item);
    const itemId = $item.data('id');
    const isNew = itemId === 'new';
    
    try {
        formData.resume = appState.resumeId;
        formData.is_current = formData.is_current === 'on';
        
        let savedItem;
        if (isNew) {
            savedItem = await apiFetch('/experience/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            appState.sections.experience.push(savedItem);
        } else {
            savedItem = await apiFetch(`/experience/${itemId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const index = appState.sections.experience.findIndex(item => item.id === itemId);
            appState.sections.experience[index] = savedItem;
        }
        
        // Update the item display
        $item.data('id', savedItem.id);
        $item.find('.item-header h4, h4').text(`${savedItem.position} at ${savedItem.company}`);
        $item.find('[data-form-container]').addClass('hidden');
        
        showSuccess('Experience item saved successfully');
        markAsSaved();
    } catch (error) {
        console.error('Error saving experience item:', error);
        showError('Failed to save experience item');
    }
}

async function saveProjectItem($item) {
    const formData = getFormData($item);
    const itemId = $item.data('id');
    const isNew = itemId === 'new';
    
    try {
        formData.resume = appState.resumeId;
        
        let savedItem;
        if (isNew) {
            savedItem = await apiFetch('/projects/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            appState.sections.projects.push(savedItem);
        } else {
            savedItem = await apiFetch(`/projects/${itemId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const index = appState.sections.projects.findIndex(item => item.id === itemId);
            appState.sections.projects[index] = savedItem;
        }
        
        // Update the item display
        $item.data('id', savedItem.id);
        $item.find('.item-header h4, h4').text(savedItem.name);
        $item.find('[data-form-container]').addClass('hidden');
        
        showSuccess('Project item saved successfully');
        markAsSaved();
    } catch (error) {
        console.error('Error saving project item:', error);
        showError('Failed to save project item');
    }
}

async function saveSkillItem($item) {
    const formData = getFormData($item);
    const itemId = $item.data('id');
    const isNew = itemId === 'new';
    
    try {
        formData.resume = appState.resumeId;
        
        let savedItem;
        if (isNew) {
            savedItem = await apiFetch('/skills/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            appState.sections.skills.push(savedItem);
        } else {
            savedItem = await apiFetch(`/skills/${itemId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const index = appState.sections.skills.findIndex(item => item.id === itemId);
            appState.sections.skills[index] = savedItem;
        }
        
        // Update the item display
        $item.data('id', savedItem.id);
        $item.find('.item-header h4, h4').text(`${savedItem.name} (${savedItem.level})`);
        $item.find('[data-form-container]').addClass('hidden');
        
        showSuccess('Skill item saved successfully');
        markAsSaved();
    } catch (error) {
        console.error('Error saving skill item:', error);
        showError('Failed to save skill item');
    }
}

async function saveCertificationItem($item) {
    const formData = getFormData($item);
    const itemId = $item.data('id');
    const isNew = itemId === 'new';
    
    try {
        formData.resume = appState.resumeId;
        
        let savedItem;
        if (isNew) {
            savedItem = await apiFetch('/certifications/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            appState.sections.certifications.push(savedItem);
        } else {
            savedItem = await apiFetch(`/certifications/${itemId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const index = appState.sections.certifications.findIndex(item => item.id === itemId);
            appState.sections.certifications[index] = savedItem;
        }
        
        // Update the item display
        $item.data('id', savedItem.id);
        $item.find('.item-header h4, h4').text(`${savedItem.name} - ${savedItem.issuing_organization}`);
        $item.find('[data-form-container]').addClass('hidden');
        
        showSuccess('Certification item saved successfully');
        markAsSaved();
    } catch (error) {
        console.error('Error saving certification item:', error);
        showError('Failed to save certification item');
    }
}

async function saveAchievementItem($item) {
    const formData = getFormData($item);
    const itemId = $item.data('id');
    const isNew = itemId === 'new';
    
    try {
        formData.resume = appState.resumeId;
        
        let savedItem;
        if (isNew) {
            savedItem = await apiFetch('/achievements/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            appState.sections.achievements.push(savedItem);
        } else {
            savedItem = await apiFetch(`/achievements/${itemId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const index = appState.sections.achievements.findIndex(item => item.id === itemId);
            appState.sections.achievements[index] = savedItem;
        }
        
        // Update the item display
        $item.data('id', savedItem.id);
        $item.find('.item-header h4, h4').text(savedItem.title);
        $item.find('[data-form-container]').addClass('hidden');
        
        showSuccess('Achievement item saved successfully');
        markAsSaved();
    } catch (error) {
        console.error('Error saving achievement item:', error);
        showError('Failed to save achievement item');
    }
}

// Delete item function
async function deleteItem(section, $item) {
    const itemId = $item.data('id');
    
    if (itemId === 'new') {
        $item.remove();
        return;
    }
    
    try {
        const endpoints = {
            education: '/education/',
            experience: '/experience/',
            projects: '/projects/',
            skills: '/skills/',
            certifications: '/certifications/',
            achievements: '/achievements/'
        };
        
        await apiFetch(`${endpoints[section]}${itemId}/`, {
            method: 'DELETE'
        });
        
        // Remove from local state
        appState.sections[section] = appState.sections[section].filter(item => item.id !== itemId);
        
        // Remove from DOM
        $item.remove();
        
        showSuccess('Item deleted successfully');
        markAsSaved();
    } catch (error) {
        console.error('Error deleting item:', error);
        showError('Failed to delete item');
    }
}

// Save entire resume
async function saveResume() {
    try {
        $('#save-btn').prop('disabled', true).text('Saving...');
        
        // Prepare resume data including header information
        const resumeData = {
            title: appState.resume.title,
            name: appState.header.name,
            professional_title: appState.header.title,
            phone: appState.header.phone,
            email: appState.header.email,
            location: appState.header.location,
            linkedin_url: appState.header.linkedin,
            github_url: appState.header.github,
            website_url: appState.header.website,
            twitter_url: appState.header.twitter
        };
        
        // Save resume with all header data
        await apiFetch(`/resumes/${appState.resumeId}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resumeData)
        });
        
        showSuccess('Resume saved successfully');
        markAsSaved();
        
        // Update the header display to reflect saved changes
        updateHeaderDisplay();
        
    } catch (error) {
        console.error('Error saving resume:', error);
        showError('Failed to save resume. Please try again.');
    } finally {
        $('#save-btn').prop('disabled', false).text('💾 Save Changes');
    }
}

// Preview resume
function previewResume() {
    // For now, just show an alert. In a real app, this would open a preview modal or page
    showSuccess('Preview functionality will be implemented soon');
}

// Utility functions
function getFormData($item) {
    const formData = {};
    $item.find('input, textarea, select').each(function() {
        const $field = $(this);
        const name = $field.attr('name');
        if (name) {
            if ($field.attr('type') === 'checkbox') {
                formData[name] = $field.is(':checked');
            } else {
                formData[name] = $field.val();
            }
        }
    });
    return formData;
}

function markAsChanged() {
    appState.hasUnsavedChanges = true;
    $('#unsaved-indicator').removeClass('hidden');
    $('#save-btn').removeClass('opacity-50').addClass('bg-blue-600 hover:bg-blue-700');
}

function markAsSaved() {
    appState.hasUnsavedChanges = false;
    $('#unsaved-indicator').addClass('hidden');
    $('#save-btn').addClass('opacity-50').removeClass('bg-blue-600 hover:bg-blue-700');
}

function showLoading() {
    $('#editor-loading').show();
    $('#editor-content').hide();
}

function hideLoading() {
    $('#editor-loading').hide();
    $('#editor-content').show();
}

function showError(message) {
    showMessage(message, 'error');
}

function showSuccess(message) {
    showMessage(message, 'success');
}

function showMessage(message, type) {
    const $container = $('#message-container');
    $container.empty();
    
    const bgColor = type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800';
    const iconColor = type === 'error' ? 'text-red-400' : 'text-green-400';
    const icon = type === 'error' ? 
        '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>' :
        '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>';
    
    const $message = $(`
        <div class="fixed top-4 right-4 z-50 max-w-md w-full">
            <div class="flex items-center p-4 border rounded-lg shadow-lg ${bgColor}">
                <div class="flex-shrink-0 ${iconColor}">
                    ${icon}
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium">${escapeHtml(message)}</p>
                </div>
                <div class="ml-auto pl-3">
                    <button class="inline-flex rounded-md p-1.5 hover:bg-black hover:bg-opacity-10 focus:outline-none">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `);
    
    $container.append($message);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        $message.fadeOut(() => $message.remove());
    }, 5000);
    
    // Manual close
    $message.find('button').click(() => {
        $message.fadeOut(() => $message.remove());
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Delete modal functions
let deleteCallback = null;

function showDeleteModal(callback) {
    deleteCallback = callback;
    $('#delete-modal').show();
}

function closeDeleteModal() {
    $('#delete-modal').hide();
    deleteCallback = null;
}

// Confirm delete
$('#confirm-delete-btn').click(function() {
    if (deleteCallback) {
        deleteCallback();
        closeDeleteModal();
    }
});

// Make functions available globally for onclick handlers
window.closeDeleteModal = closeDeleteModal;

// Header management functions
function loadHeaderData() {
    // Load header data from appState into form fields
    $('#header-name').val(appState.header.name || '');
    $('#header-title').val(appState.header.title || '');
    $('#header-phone').val(appState.header.phone || '');
    $('#header-email').val(appState.header.email || '');
    $('#header-location').val(appState.header.location || '');
    $('#header-linkedin').val(appState.header.linkedin || '');
    $('#header-github').val(appState.header.github || '');
    $('#header-website').val(appState.header.website || '');
    $('#header-twitter').val(appState.header.twitter || '');
}

function saveHeaderData() {
    // Save form data to appState
    appState.header.name = $('#header-name').val();
    appState.header.title = $('#header-title').val();
    appState.header.phone = $('#header-phone').val();
    appState.header.email = $('#header-email').val();
    appState.header.location = $('#header-location').val();
    appState.header.linkedin = $('#header-linkedin').val();
    appState.header.github = $('#header-github').val();
    appState.header.website = $('#header-website').val();
    appState.header.twitter = $('#header-twitter').val();
}

function updateHeaderDisplay() {
    // Update the header display with current data
    const header = appState.header;
    
    // Update name (with title if available)
    const displayName = header.name || 'Your Name';
    $('#header-name-display').text(displayName);
    
    // Update contact information with individual elements
    $('#header-contact-display').empty();
    
    if (header.phone) {
        $('#header-contact-display').append(`<span class="bg-white/70 px-3 py-1 rounded-full font-medium">${escapeHtml(header.phone)}</span>`);
    }
    if (header.email) {
        $('#header-contact-display').append(`<span class="bg-white/70 px-3 py-1 rounded-full font-medium">${escapeHtml(header.email)}</span>`);
    }
    if (header.location) {
        $('#header-contact-display').append(`<span class="bg-white/70 px-3 py-1 rounded-full font-medium">${escapeHtml(header.location)}</span>`);
    }
    
    // Show placeholder if no contact info
    if (!header.phone && !header.email && !header.location) {
        $('#header-contact-display').append('<span class="text-gray-400 text-sm">No contact information added</span>');
    }
    
    // Update social links
    $('#header-links-display').empty();
    const links = [];
    
    if (header.linkedin) {
        links.push({
            url: header.linkedin,
            text: 'LinkedIn',
            icon: '💼'
        });
    }
    if (header.github) {
        links.push({
            url: header.github,
            text: 'GitHub',
            icon: '💻'
        });
    }
    if (header.website) {
        links.push({
            url: header.website,
            text: 'Portfolio',
            icon: '🌐'
        });
    }
    if (header.twitter) {
        links.push({
            url: header.twitter,
            text: 'Twitter',
            icon: '🐦'
        });
    }
    
    if (links.length > 0) {
        links.forEach(link => {
            $('#header-links-display').append(`
                <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" 
                   class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-all duration-200 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full border border-blue-200 hover:border-blue-300 hover:-translate-y-0.5">
                    <span>${link.icon}</span>
                    <span>${escapeHtml(link.text)}</span>
                </a>
            `);
        });
    } else {
        $('#header-links-display').append('<span class="text-gray-400 text-sm">Click "Edit Header" to add professional links</span>');
    }
}

function initializeHeader() {
    // Use placeholder data only if no data exists
    if (!appState.header.name && !appState.header.email && !appState.header.phone) {
        appState.header = {
            name: 'Your Name',
            title: 'Professional Title',
            phone: '+1 (555) 123-4567',
            email: 'your.email@example.com',
            location: 'City, State',
            linkedin: '',
            github: '',
            website: '',
            twitter: ''
        };
    }
    loadHeaderData();
    updateHeaderDisplay();
}
