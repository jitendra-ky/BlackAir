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
    
    // Close dropdowns when clicking outside
    $(document).click(function(event) {
        if (!$(event.target).closest('.resume-menu-btn, .resume-dropdown').length) {
            $('.resume-dropdown').addClass('hidden');
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
    const createdDate = new Date(resume.created_at);
    const lastModified = resume.updated_at ? new Date(resume.updated_at) : createdDate;
    const isRecentlyModified = (Date.now() - lastModified.getTime()) < (7 * 24 * 60 * 60 * 1000); // Within 7 days
    
    const resumeCard = $(`
        <div class="resume-card group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden relative" data-resume-id="${resume.id}">
            <div class="p-6">
                <!-- Header with title and status -->
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            ${escapeHtml(resume.title)}
                        </h3>
                        ${isRecentlyModified ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">Recently updated</span>' : ''}
                    </div>
                    <div class="ml-4 flex-shrink-0 relative">
                        <button class="resume-menu-btn opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all" onclick="event.stopPropagation(); toggleResumeMenu(${resume.id}, this)">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                            </svg>
                        </button>
                        <!-- Dropdown menu -->
                        <div class="resume-dropdown absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48 hidden" data-resume-id="${resume.id}">
                            <div class="py-1">
                                <button class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2" onclick="editResume(${resume.id})">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                    Edit Resume
                                </button>
                                <button class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2" onclick="viewResume(${resume.id})">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                    View Resume
                                </button>
                                <button class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2" onclick="duplicateResume(${resume.id})">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                    </svg>
                                    Duplicate
                                </button>
                                <div class="border-t border-gray-100"></div>
                                <button class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2" onclick="deleteResume(${resume.id})">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Resume info -->
                <div class="space-y-3">
                    <!-- Date information -->
                    <div class="flex items-center text-sm text-gray-500">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Created ${createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    
                    <!-- Last modified if different from created -->
                    ${resume.updated_at && resume.updated_at !== resume.created_at ? `
                        <div class="flex items-center text-sm text-gray-500">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            Modified ${lastModified.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    ` : ''}
                    
                    <!-- Completion status placeholder -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center text-sm text-gray-500">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Resume draft
                        </div>
                        <div class="flex space-x-1">
                            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div class="w-2 h-2 bg-blue-300 rounded-full"></div>
                            <div class="w-2 h-2 bg-gray-200 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer with actions -->
            <div class="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 text-sm">
                        <span class="text-gray-500">ID: ${resume.id}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Draft
                        </span>
                        <svg class="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    `);
    
    // Add click handler to open the resume (but not when clicking the menu)
    resumeCard.click(function(e) {
        // Don't trigger if clicking on the dropdown menu or its button
        if ($(e.target).closest('.resume-menu-btn, .resume-dropdown').length === 0) {
            e.preventDefault();
            editResume(resume.id);
        }
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

function toggleResumeMenu(resumeId, buttonElement) {
    // Close all other dropdowns
    $('.resume-dropdown').not(`[data-resume-id="${resumeId}"]`).addClass('hidden');
    
    // Toggle the current dropdown
    const dropdown = $(buttonElement).siblings('.resume-dropdown');
    dropdown.toggleClass('hidden');
    
    // Set the selected resume ID for actions
    selectedResumeId = resumeId;
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
    
    // Close dropdown
    $('.resume-dropdown').addClass('hidden');
    
    // Navigate to the resume editor page
    window.location.href = `/resume/${resumeId}/edit/`;
}

function viewResume(resumeId = selectedResumeId) {
    if (!resumeId) return;
    
    // Close dropdown
    $('.resume-dropdown').addClass('hidden');
    
    // For now, just show an alert. In a real app, this would show the resume preview
    const resume = resumes.find(r => r.id === resumeId);
    if (resume) {
        alert(`View functionality for "${resume.title}" would be implemented here.`);
    }
}

async function duplicateResume(resumeId = selectedResumeId) {
    if (!resumeId) return;
    
    // Close dropdown
    $('.resume-dropdown').addClass('hidden');
    
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
}

async function deleteResume(resumeId = selectedResumeId) {
    if (!resumeId) return;
    
    // Close dropdown
    $('.resume-dropdown').addClass('hidden');
    
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
    $('.error-message, .success-message').remove();
    
    const errorDiv = $(`
        <div class="error-message fixed top-4 right-4 z-50 max-w-md w-full">
            <div class="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg shadow-lg">
                <div class="flex-shrink-0 text-red-400">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-red-800">${escapeHtml(message)}</p>
                </div>
                <div class="ml-auto pl-3">
                    <button class="inline-flex rounded-md p-1.5 text-red-400 hover:bg-red-100 focus:outline-none" onclick="$(this).closest('.error-message').fadeOut()">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `);
    
    $('body').append(errorDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.fadeOut(() => errorDiv.remove());
    }, 5000);
}

function showSuccess(message) {
    // Remove any existing success messages
    $('.success-message, .error-message').remove();
    
    const successDiv = $(`
        <div class="success-message fixed top-4 right-4 z-50 max-w-md w-full">
            <div class="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg shadow-lg">
                <div class="flex-shrink-0 text-green-400">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-green-800">${escapeHtml(message)}</p>
                </div>
                <div class="ml-auto pl-3">
                    <button class="inline-flex rounded-md p-1.5 text-green-400 hover:bg-green-100 focus:outline-none" onclick="$(this).closest('.success-message').fadeOut()">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `);
    
    $('body').append(successDiv);
    
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
window.toggleResumeMenu = toggleResumeMenu;
window.editResume = editResume;
window.viewResume = viewResume;
window.duplicateResume = duplicateResume;
window.deleteResume = deleteResume;
