import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useResume } from "../../hooks/useResume";
import LoadingSpinner from "../ui/LoadingSpinner";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { ArrowLeftIcon, EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ResumeHeaderSection from "./ResumeHeaderSection";
import ResumeEducationSection from "./ResumeEducationSection";
import ResumeExperienceSection from "./ResumeExperienceSection";
import ResumeProjectsSection from "./ResumeProjectsSection";
import ResumeSkillsSection from "./ResumeSkillsSection";
import ResumeCertificationsSection from "./ResumeCertificationsSection";
import ResumeAchievementsSection from "./ResumeAchievementsSection";
import ResumePreview from "./ResumePreview";

/**
 * ResumeEditor Component
 *
 * This component provides a resume editing interface with live preview functionality.
 * Key features:
 *
 * 1. Real-time Preview Updates:
 *    - When any section is saved, the preview updates immediately
 *    - Enhanced save functions wrap original save methods with visual indicators
 *    - Preview shows a green "Updated" indicator and subtle ring animation when changes are saved
 *
 * 2. Responsive Preview:
 *    - Side panel preview for large screens (lg and above)
 *    - Modal preview for smaller screens
 *    - Automatically hides side preview on smaller screens
 *
 * 3. Visual Feedback:
 *    - Update indicator appears for 500ms after each save
 *    - Smooth transitions and animations
 *    - Clear visual distinction between preview and editor
 */

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSidePreview, setShowSidePreview] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [previewUpdateIndicator, setPreviewUpdateIndicator] = useState(false);
  const previewRef = useRef(null);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const largScreen = window.innerWidth >= 1024;
      setIsLargeScreen(largScreen);
      // Auto-hide side preview on smaller screens
      if (!largScreen) {
        setShowSidePreview(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    resume,
    loading,
    saveResumeHeader,
    saveEducationSection,
    saveExperienceSection,
    saveSkillsSection,
    saveProjectsSection,
    saveCertificationsSection,
    saveAchievementsSection,
    updateResumeData,
    resetChanges,
  } = useResume(id);

  const handlePreview = () => {
    // For small screens, show modal; for large screens, toggle side preview
    if (!isLargeScreen) {
      setShowPreviewModal(true);
    } else {
      setShowSidePreview(!showSidePreview);
    }
  };

  const handleResumeUpdate = (field, value) => {
    updateResumeData({ [field]: value });
  };

  // Enhanced save functions with preview update indication
  const createEnhancedSaveFunction = (originalSaveFunction, sectionName) => {
    return async (...args) => {
      try {
        setPreviewUpdateIndicator(true);
        const result = await originalSaveFunction(...args);

        // Brief visual indication that preview updated
        setTimeout(() => {
          setPreviewUpdateIndicator(false);
        }, 500);

        return result;
      } catch (error) {
        setPreviewUpdateIndicator(false);
        throw error;
      }
    };
  };

  // Create enhanced save functions
  const enhancedSaveResumeHeader = createEnhancedSaveFunction(
    saveResumeHeader,
    "Header"
  );
  const enhancedSaveEducationSection = createEnhancedSaveFunction(
    saveEducationSection,
    "Education"
  );
  const enhancedSaveExperienceSection = createEnhancedSaveFunction(
    saveExperienceSection,
    "Experience"
  );
  const enhancedSaveSkillsSection = createEnhancedSaveFunction(
    saveSkillsSection,
    "Skills"
  );
  const enhancedSaveProjectsSection = createEnhancedSaveFunction(
    saveProjectsSection,
    "Projects"
  );
  const enhancedSaveCertificationsSection = createEnhancedSaveFunction(
    saveCertificationsSection,
    "Certifications"
  );
  const enhancedSaveAchievementsSection = createEnhancedSaveFunction(
    saveAchievementsSection,
    "Achievements"
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading resume...</span>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Resume not found
        </h2>
        <p className="text-gray-600 mb-4">
          The resume you're looking for doesn't exist.
        </p>
        <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Container with A4-like proportions for dual panel layout */}
        <div
          className={`mx-auto ${
            showSidePreview ? "max-w-[1680px]" : "max-w-[840px]"
          } transition-all duration-300`}
        >
          <div
            className={`flex ${
              showSidePreview ? "lg:grid lg:grid-cols-2 lg:gap-0" : ""
            }`}
          >
            {/* Editor Section */}
            <div
              className={`${
                showSidePreview ? "lg:w-full" : "w-full"
              } bg-white min-h-screen`}
            >
              <div className="p-6 max-w-[840px] mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center border-b pb-4 mb-8">
                  <div className="flex-1">
                    <Link
                      to="/"
                      className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-2 transition-colors"
                    >
                      <ArrowLeftIcon className="h-4 w-4 mr-1" />
                      Dashboard
                    </Link>

                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        value={resume.title || ""}
                        onChange={(e) =>
                          handleResumeUpdate("title", e.target.value)
                        }
                        className="text-2xl font-semibold text-gray-900 bg-transparent border-0 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="Resume Title"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreview}
                      className="flex items-center gap-2 transition-all"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span className="lg:hidden">Preview</span>
                      <span className="hidden lg:inline">
                        {showSidePreview ? "Hide Preview" : "Show Preview"}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Resume Editor Content */}
                <div className="space-y-8">
                  {/* Header Information */}
                  <ResumeHeaderSection
                    resume={resume}
                    onUpdate={handleResumeUpdate}
                    onSave={enhancedSaveResumeHeader}
                  />

                  {/* Education Section */}
                  <ResumeEducationSection
                    education={resume?.education || []}
                    onUpdate={(updatedEducation) =>
                      handleResumeUpdate("education", updatedEducation)
                    }
                    onSave={enhancedSaveEducationSection}
                  />

                  {/* Experience Section */}
                  <ResumeExperienceSection
                    experience={resume?.experience || []}
                    onUpdate={(updatedExperience) =>
                      handleResumeUpdate("experience", updatedExperience)
                    }
                    onSave={enhancedSaveExperienceSection}
                  />

                  {/* Projects Section */}
                  <ResumeProjectsSection
                    projects={resume?.projects || []}
                    onUpdate={(updatedProjects) =>
                      handleResumeUpdate("projects", updatedProjects)
                    }
                    onSave={enhancedSaveProjectsSection}
                  />

                  {/* Skills Section */}
                  <ResumeSkillsSection
                    skills={resume?.skills || []}
                    onUpdate={(updatedSkills) =>
                      handleResumeUpdate("skills", updatedSkills)
                    }
                    onSave={enhancedSaveSkillsSection}
                  />

                  {/* Certifications Section */}
                  <ResumeCertificationsSection
                    certifications={resume?.certifications || []}
                    onUpdate={(updatedCertifications) =>
                      handleResumeUpdate(
                        "certifications",
                        updatedCertifications
                      )
                    }
                    onSave={enhancedSaveCertificationsSection}
                  />

                  {/* Achievements Section */}
                  <ResumeAchievementsSection
                    achievements={resume?.achievements || []}
                    onUpdate={(updatedAchievements) =>
                      handleResumeUpdate("achievements", updatedAchievements)
                    }
                    onSave={enhancedSaveAchievementsSection}
                  />
                </div>
              </div>
            </div>

            {/* Preview Section - Side Panel for Large Screens */}
            {showSidePreview && isLargeScreen && (
              <div className="hidden lg:block bg-gray-100 border-l border-gray-200 min-h-screen">
                <div className="sticky top-0 h-screen overflow-y-auto">
                  <div className="p-4 xl:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Live Preview
                        </h3>
                        {previewUpdateIndicator && (
                          <div className="flex items-center gap-1 text-sm text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Updated</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setShowSidePreview(false)}
                        className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                    {/* Preview content scaled to fit the available space */}
                    <div
                      ref={previewRef}
                      className={`bg-white shadow-lg mx-auto rounded-lg overflow-hidden transition-all duration-300 ${
                        previewUpdateIndicator ? "ring-2 ring-green-200" : ""
                      }`}
                      style={{
                        aspectRatio: "210/297", // A4 aspect ratio
                        maxWidth: "100%",
                        width: "min(100%, 600px)", // Responsive width with max limit
                      }}
                    >
                      <div className="w-full h-full overflow-hidden">
                        <div
                          className="transform origin-top-left"
                          style={{
                            transform: "scale(0.75)",
                            width: "133.33%", // Compensate for 0.75 scale
                            height: "133.33%",
                          }}
                        >
                          <ResumePreview resume={resume} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal for Small Screens */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title={
          <div className="flex items-center gap-2">
            <span>Resume Preview</span>
            {previewUpdateIndicator && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Updated</span>
              </div>
            )}
          </div>
        }
        size="full"
        className="h-full"
      >
        <div className="overflow-y-auto max-h-[80vh]">
          <div
            className={`transition-all duration-300 ${
              previewUpdateIndicator ? "ring-2 ring-green-200 rounded-lg" : ""
            }`}
          >
            <ResumePreview resume={resume} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ResumeEditor;
