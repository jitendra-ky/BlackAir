import { apiFetch } from './utils.js';

let resumes = [];
let selectedResumeId = null;

// Initialize dashboard when page loads
$(document).ready(function() {
    loadResumes();
    setupEventListeners();
});

function setupEventListeners() {
    // Create resume button
    $('#create-resume-btn').click(showCreateResumeModal);
    
    // Modal close buttons
    $('#close-create-modal').click(closeCreateResumeModal);
    $('#close-actions-modal').click(closeResumeActionsModal);
    
    // Create resume form submission
    $('#create-resume-form').submit(handleCreateResume);
    
    // Close modal when clicking outside
    $(window).click(function(event) {
        if (event.target.id === 'create-resume-modal') {
            closeCreateResumeModal();
        }
        if (event.target.id === 'resume-actions-modal') {
            closeResumeActionsModal();
        }
    });
}

async function loadResumes() {
    try {
        showLoadingSpinner();
        const data = await apiFetch('/resumes/');
        resumes = data;
        displayResumes();
    } catch (error) {
        console.error('Error loading resumes:', error);
        showError('Failed to load resumes. Please try again.');
        hideLoadingSpinner();
    }
}

function displayResumes() {
    hideLoadingSpinner();
    const resumeList = $('#resume-list');
    
    if (resumes.length === 0) {
        $('#empty-state').show();
        return;
    }
    
    $('#empty-state').hide();
    
    // Clear existing resume cards (except loading and empty state)
    $('.resume-card').remove();
    
    resumes.forEach(resume => {
        const resumeCard = createResumeCard(resume);
        resumeList.append(resumeCard);
    });
}

function createResumeCard(resume) {
    const resumeCard = $(`
        <div class="resume-card clickable" data-resume-id="${resume.id}">
            <div class="resume-card-content">
                <h3 class="resume-title">${escapeHtml(resume.title)}</h3>
                <p class="resume-meta">
                    Created: ${new Date(resume.created_at).toLocaleDateString()}
                </p>
            </div>
        </div>
    `);
      // Add click handler to open the resume
    resumeCard.click(function(e) {
        e.preventDefault();
        editResume(resume.id);
    });
    
    return resumeCard;
}

function showCreateResumeModal() {
    $('#create-resume-modal').show();
    $('#resume-title').focus();
}

function closeCreateResumeModal() {
    $('#create-resume-modal').hide();
    $('#create-resume-form')[0].reset();
}

function showResumeActions(resumeId) {
    selectedResumeId = resumeId;
    $('#resume-actions-modal').show();
}

function closeResumeActionsModal() {
    $('#resume-actions-modal').hide();
    selectedResumeId = null;
}

async function handleCreateResume(event) {
    event.preventDefault();
    
    const title = $('#resume-title').val().trim();
    if (!title) {
        showError('Please enter a resume title');
        return;
    }
    
    try {
        const submitBtn = $('#create-resume-form button[type="submit"]');
        submitBtn.prop('disabled', true).text('Creating...');
        
        const newResume = await apiFetch('/resumes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title })
        });
        
        resumes.unshift(newResume); // Add to beginning of array
        displayResumes();
        closeCreateResumeModal();
        showSuccess(`Resume "${title}" created successfully!`);
        
    } catch (error) {
        console.error('Error creating resume:', error);
        showError('Failed to create resume. Please try again.');
    } finally {
        const submitBtn = $('#create-resume-form button[type="submit"]');
        submitBtn.prop('disabled', false).text('Create Resume');
    }
}

function editResume(resumeId = selectedResumeId) {
    if (!resumeId) return;
    
    // Navigate to the resume editor page
    window.location.href = `/resume/${resumeId}/edit/`;
    closeResumeActionsModal();
}

function viewResume(resumeId = selectedResumeId) {
    if (!resumeId) return;
    
    // For now, just show an alert. In a real app, this would show the resume preview
    const resume = resumes.find(r => r.id === resumeId);
    if (resume) {
        alert(`View functionality for "${resume.title}" would be implemented here.`);
    }
    closeResumeActionsModal();
}

async function duplicateResume(resumeId = selectedResumeId) {
    if (!resumeId) return;
    
    try {
        const originalResume = resumes.find(r => r.id === resumeId);
        if (!originalResume) return;
        
        const duplicatedResume = await apiFetch('/resumes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                title: `${originalResume.title} (Copy)` 
            })
        });
        
        resumes.unshift(duplicatedResume);
        displayResumes();
        showSuccess('Resume duplicated successfully!');
        
    } catch (error) {
        console.error('Error duplicating resume:', error);
        showError('Failed to duplicate resume. Please try again.');
    }
    
    closeResumeActionsModal();
}

async function deleteResume(resumeId = selectedResumeId) {
    if (!resumeId) return;
    
    const resume = resumes.find(r => r.id === resumeId);
    if (!resume) return;
    
    if (!confirm(`Are you sure you want to delete "${resume.title}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        await apiFetch(`/resumes/${resumeId}/`, {
            method: 'DELETE'
        });
        
        resumes = resumes.filter(r => r.id !== resumeId);
        displayResumes();
        showSuccess('Resume deleted successfully!');
        
    } catch (error) {
        console.error('Error deleting resume:', error);
        showError('Failed to delete resume. Please try again.');
    }
    
    closeResumeActionsModal();
}

function showLoadingSpinner() {
    $('#loading-spinner').show();
    $('#empty-state').hide();
    $('.resume-card').remove();
}

function hideLoadingSpinner() {
    $('#loading-spinner').hide();
}

function showError(message) {
    // Remove any existing error messages
    $('.error-message').remove();
    
    const errorDiv = $(`
        <div class="error-message">
            ${escapeHtml(message)}
        </div>
    `);
    
    $('.dashboard-welcome').prepend(errorDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.fadeOut(() => errorDiv.remove());
    }, 5000);
}

function showSuccess(message) {
    // Remove any existing success messages
    $('.success-message').remove();
    
    const successDiv = $(`
        <div class="success-message">
            ${escapeHtml(message)}
        </div>
    `);
    
    $('.dashboard-welcome').prepend(successDiv);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        successDiv.fadeOut(() => successDiv.remove());
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions available globally for onclick handlers
window.showCreateResumeModal = showCreateResumeModal;
window.closeCreateResumeModal = closeCreateResumeModal;
window.showResumeActions = showResumeActions;
window.editResume = editResume;
window.viewResume = viewResume;
window.duplicateResume = duplicateResume;
window.deleteResume = deleteResume;
