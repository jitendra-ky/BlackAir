import { apiFetch } from './utils.js';

// App state to store resume data
const appState = {
    resume: null,
    resumeId: null,
    hasUnsavedChanges: false,
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
    
    // Resume title input
    $('#resume-title-input').on('input', function() {
        const newTitle = $(this).val();
        $('#resume-title-display').text(newTitle);
        appState.resume.title = newTitle;
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
        <div class="editor-item" data-section="education" data-id="${itemId}">
            <div class="item-header">
                <h4>${isNew ? 'New Education' : item.degree + ' at ' + item.school}</h4>
                <div class="item-actions">
                    <button class="btn-icon edit-item-btn" title="Edit">✏️</button>
                    <button class="btn-icon delete-item-btn" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="item-form" style="display: ${isNew ? 'block' : 'none'};">
                <div class="form-row">
                    <div class="form-group">
                        <label>School</label>
                        <input type="text" name="school" value="${item.school || ''}" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Degree</label>
                        <input type="text" name="degree" value="${item.degree || ''}" class="form-control">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Field of Study</label>
                        <input type="text" name="field_of_study" value="${item.field_of_study || ''}" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>GPA</label>
                        <input type="number" name="gpa" value="${item.gpa || ''}" step="0.01" max="4.0" class="form-control">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="date" name="start_date" value="${item.start_date || ''}" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="date" name="end_date" value="${item.end_date || ''}" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" class="form-control" rows="3">${item.description || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button class="btn btn-outline cancel-item-btn">Cancel</button>
                    <button class="btn btn-primary save-item-btn">Save</button>
                </div>
            </div>
        </div>
    `).on('click', '.edit-item-btn', function() {
        $(this).closest('.editor-item').find('.item-form').show();
    }).on('click', '.cancel-item-btn', function() {
        const $item = $(this).closest('.editor-item');
        if ($item.data('id') === 'new') {
            $item.remove();
        } else {
            $item.find('.item-form').hide();
        }
    }).on('click', '.save-item-btn', function() {
        saveEducationItem($(this).closest('.editor-item'));
    }).on('click', '.delete-item-btn', function() {
        const $item = $(this).closest('.editor-item');
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
        <div class="editor-item" data-section="experience" data-id="${itemId}">
            <div class="item-header">
                <h4>${isNew ? 'New Experience' : item.position + ' at ' + item.company}</h4>
                <div class="item-actions">
                    <button class="btn-icon edit-item-btn" title="Edit">✏️</button>
                    <button class="btn-icon delete-item-btn" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="item-form" style="display: ${isNew ? 'block' : 'none'};">
                <div class="form-row">
                    <div class="form-group">
                        <label>Company</label>
                        <input type="text" name="company" value="${item.company || ''}" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Position</label>
                        <input type="text" name="position" value="${item.position || ''}" class="form-control">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" name="location" value="${item.location || ''}" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="is_current" ${item.is_current ? 'checked' : ''}> Current Position
                        </label>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="date" name="start_date" value="${item.start_date || ''}" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="date" name="end_date" value="${item.end_date || ''}" class="form-control" ${item.is_current ? 'disabled' : ''}>
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" class="form-control" rows="4">${item.description || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button class="btn btn-outline cancel-item-btn">Cancel</button>
                    <button class="btn btn-primary save-item-btn">Save</button>
                </div>
            </div>
        </div>
    `).on('click', '.edit-item-btn', function() {
        $(this).closest('.editor-item').find('.item-form').show();
    }).on('click', '.cancel-item-btn', function() {
        const $item = $(this).closest('.editor-item');
        if ($item.data('id') === 'new') {
            $item.remove();
        } else {
            $item.find('.item-form').hide();
        }
    }).on('click', '.save-item-btn', function() {
        saveExperienceItem($(this).closest('.editor-item'));
    }).on('click', '.delete-item-btn', function() {
        const $item = $(this).closest('.editor-item');
        showDeleteModal(() => deleteItem('experience', $item));
    }).on('change', 'input[name="is_current"]', function() {
        const $endDate = $(this).closest('.editor-item').find('input[name="end_date"]');
        if ($(this).is(':checked')) {
            $endDate.prop('disabled', true).val('');
        } else {
            $endDate.prop('disabled', false);
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
        <div class="editor-item" data-section="projects" data-id="${itemId}">
            <div class="item-header">
                <h4>${isNew ? 'New Project' : item.name}</h4>
                <div class="item-actions">
                    <button class="btn-icon edit-item-btn" title="Edit">✏️</button>
                    <button class="btn-icon delete-item-btn" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="item-form" style="display: ${isNew ? 'block' : 'none'};">
                <div class="form-group">
                    <label>Project Name</label>
                    <input type="text" name="name" value="${item.name || ''}" class="form-control">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" class="form-control" rows="3">${item.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Technologies (comma-separated)</label>
                    <input type="text" name="technologies" value="${item.technologies || ''}" class="form-control">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="date" name="start_date" value="${item.start_date || ''}" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="date" name="end_date" value="${item.end_date || ''}" class="form-control">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Project URL</label>
                        <input type="url" name="project_url" value="${item.project_url || ''}" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>GitHub URL</label>
                        <input type="url" name="github_url" value="${item.github_url || ''}" class="form-control">
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn btn-outline cancel-item-btn">Cancel</button>
                    <button class="btn btn-primary save-item-btn">Save</button>
                </div>
            </div>
        </div>
    `).on('click', '.edit-item-btn', function() {
        $(this).closest('.editor-item').find('.item-form').show();
    }).on('click', '.cancel-item-btn', function() {
        const $item = $(this).closest('.editor-item');
        if ($item.data('id') === 'new') {
            $item.remove();
        } else {
            $item.find('.item-form').hide();
        }
    }).on('click', '.save-item-btn', function() {
        saveProjectItem($(this).closest('.editor-item'));
    }).on('click', '.delete-item-btn', function() {
        const $item = $(this).closest('.editor-item');
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
        <div class="editor-item" data-section="skills" data-id="${itemId}">
            <div class="item-header">
                <h4>${isNew ? 'New Skill' : item.name + ' (' + (item.level || 'intermediate') + ')'}</h4>
                <div class="item-actions">
                    <button class="btn-icon edit-item-btn" title="Edit">✏️</button>
                    <button class="btn-icon delete-item-btn" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="item-form" style="display: ${isNew ? 'block' : 'none'};">
                <div class="form-row">
                    <div class="form-group">
                        <label>Skill Name</label>
                        <input type="text" name="name" value="${item.name || ''}" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <input type="text" name="category" value="${item.category || ''}" class="form-control">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Level</label>
                        <select name="level" class="form-control">
                            <option value="beginner" ${item.level === 'beginner' ? 'selected' : ''}>Beginner</option>
                            <option value="intermediate" ${item.level === 'intermediate' || !item.level ? 'selected' : ''}>Intermediate</option>
                            <option value="advanced" ${item.level === 'advanced' ? 'selected' : ''}>Advanced</option>
                            <option value="expert" ${item.level === 'expert' ? 'selected' : ''}>Expert</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Years of Experience</label>
                        <input type="number" name="years_of_experience" value="${item.years_of_experience || ''}" min="0" class="form-control">
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn btn-outline cancel-item-btn">Cancel</button>
                    <button class="btn btn-primary save-item-btn">Save</button>
                </div>
            </div>
        </div>
    `).on('click', '.edit-item-btn', function() {
        $(this).closest('.editor-item').find('.item-form').show();
    }).on('click', '.cancel-item-btn', function() {
        const $item = $(this).closest('.editor-item');
        if ($item.data('id') === 'new') {
            $item.remove();
        } else {
            $item.find('.item-form').hide();
        }
    }).on('click', '.save-item-btn', function() {
        saveSkillItem($(this).closest('.editor-item'));
    }).on('click', '.delete-item-btn', function() {
        const $item = $(this).closest('.editor-item');
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
        <div class="editor-item" data-section="certifications" data-id="${itemId}">
            <div class="item-header">
                <h4>${isNew ? 'New Certification' : item.name + ' - ' + item.issuing_organization}</h4>
                <div class="item-actions">
                    <button class="btn-icon edit-item-btn" title="Edit">✏️</button>
                    <button class="btn-icon delete-item-btn" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="item-form" style="display: ${isNew ? 'block' : 'none'};">
                <div class="form-row">
                    <div class="form-group">
                        <label>Certification Name</label>
                        <input type="text" name="name" value="${item.name || ''}" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Issuing Organization</label>
                        <input type="text" name="issuing_organization" value="${item.issuing_organization || ''}" class="form-control">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Issue Date</label>
                        <input type="date" name="issue_date" value="${item.issue_date || ''}" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Expiration Date</label>
                        <input type="date" name="expiration_date" value="${item.expiration_date || ''}" class="form-control">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Credential ID</label>
                        <input type="text" name="credential_id" value="${item.credential_id || ''}" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Credential URL</label>
                        <input type="url" name="credential_url" value="${item.credential_url || ''}" class="form-control">
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn btn-outline cancel-item-btn">Cancel</button>
                    <button class="btn btn-primary save-item-btn">Save</button>
                </div>
            </div>
        </div>
    `).on('click', '.edit-item-btn', function() {
        $(this).closest('.editor-item').find('.item-form').show();
    }).on('click', '.cancel-item-btn', function() {
        const $item = $(this).closest('.editor-item');
        if ($item.data('id') === 'new') {
            $item.remove();
        } else {
            $item.find('.item-form').hide();
        }
    }).on('click', '.save-item-btn', function() {
        saveCertificationItem($(this).closest('.editor-item'));
    }).on('click', '.delete-item-btn', function() {
        const $item = $(this).closest('.editor-item');
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
        <div class="editor-item" data-section="achievements" data-id="${itemId}">
            <div class="item-header">
                <h4>${isNew ? 'New Achievement' : item.title}</h4>
                <div class="item-actions">
                    <button class="btn-icon edit-item-btn" title="Edit">✏️</button>
                    <button class="btn-icon delete-item-btn" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="item-form" style="display: ${isNew ? 'block' : 'none'};">
                <div class="form-group">
                    <label>Achievement Title</label>
                    <input type="text" name="title" value="${item.title || ''}" class="form-control">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" class="form-control" rows="3">${item.description || ''}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Date Achieved</label>
                        <input type="date" name="date_achieved" value="${item.date_achieved || ''}" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Organization</label>
                        <input type="text" name="organization" value="${item.organization || ''}" class="form-control">
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn btn-outline cancel-item-btn">Cancel</button>
                    <button class="btn btn-primary save-item-btn">Save</button>
                </div>
            </div>
        </div>
    `).on('click', '.edit-item-btn', function() {
        $(this).closest('.editor-item').find('.item-form').show();
    }).on('click', '.cancel-item-btn', function() {
        const $item = $(this).closest('.editor-item');
        if ($item.data('id') === 'new') {
            $item.remove();
        } else {
            $item.find('.item-form').hide();
        }
    }).on('click', '.save-item-btn', function() {
        saveAchievementItem($(this).closest('.editor-item'));
    }).on('click', '.delete-item-btn', function() {
        const $item = $(this).closest('.editor-item');
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
        $item.find('.item-header h4').text(`${savedItem.degree} at ${savedItem.school}`);
        $item.find('.item-form').hide();
        
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
        $item.find('.item-header h4').text(`${savedItem.position} at ${savedItem.company}`);
        $item.find('.item-form').hide();
        
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
        $item.find('.item-header h4').text(savedItem.name);
        $item.find('.item-form').hide();
        
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
        $item.find('.item-header h4').text(`${savedItem.name} (${savedItem.level})`);
        $item.find('.item-form').hide();
        
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
        $item.find('.item-header h4').text(`${savedItem.name} - ${savedItem.issuing_organization}`);
        $item.find('.item-form').hide();
        
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
        $item.find('.item-header h4').text(savedItem.title);
        $item.find('.item-form').hide();
        
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
        
        // Save resume title if changed
        await apiFetch(`/resumes/${appState.resumeId}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: appState.resume.title })
        });
        
        showSuccess('Resume saved successfully');
        markAsSaved();
    } catch (error) {
        console.error('Error saving resume:', error);
        showError('Failed to save resume');
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
    $('#save-btn').addClass('btn-warning').text('💾 Save Changes*');
}

function markAsSaved() {
    appState.hasUnsavedChanges = false;
    $('#save-btn').removeClass('btn-warning').text('💾 Save Changes');
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
    
    const $message = $(`
        <div class="message ${type}-message">
            ${escapeHtml(message)}
        </div>
    `);
    
    $container.append($message);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        $message.fadeOut(() => $message.remove());
    }, 5000);
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
