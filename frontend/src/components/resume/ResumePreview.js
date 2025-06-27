import React, { useMemo } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import { resumeAPI } from "../../services/api";
import toast from "react-hot-toast";

const ResumePreview = ({ resume, showHeader = false }) => {
  const handleDownloadPDF = async () => {
    if (!resume?.id) {
      toast.error("Resume not found");
      return;
    }

    try {
      const response = await resumeAPI.downloadPDF(resume.id);
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename from resume title or use default
      const filename = resume.title 
        ? `resume_${resume.title.replace(/\s+/g, '_')}_${resume.id}.pdf`
        : `resume_${resume.id}.pdf`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error("Failed to download PDF. Please try again.");
    }
  };
  // Memoize the preview content to ensure it updates when resume data changes
  const previewContent = useMemo(() => {
    if (!resume) {
      return (
        <div className="text-center py-8 text-gray-500">
          No resume data to preview
        </div>
      );
    }

    return (
      <div className="bg-white">
        {/* Preview Header with Download Button */}
        {showHeader && (
          <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Resume Preview</h3>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        )}
        
        {/* Resume Content */}
        <div
          className="p-8 shadow-lg text-black"
          style={{ 
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "10pt",
            lineHeight: "1.2"
          }}
        >
        {/* Header Section */}
        <div className="text-center pb-2 mb-3" style={{ borderBottom: "2px solid #2563eb" }}>
          <h1 className="font-bold mb-1 text-black" style={{ fontSize: "18pt", margin: "0 0 4px 0" }}>
            {resume.name || "Your Name"}
          </h1>
          {resume.professional_title && (
            <h2 className="font-normal mb-1.5" style={{ fontSize: "11pt", color: "#1e40af", margin: "0 0 6px 0" }}>{resume.professional_title}</h2>
          )}
          <div className="text-black" style={{ fontSize: "9pt" }}>
            <div className="flex justify-center items-center flex-wrap gap-2">
              {resume.email && <span>{resume.email}</span>}
              {resume.email && (resume.phone || resume.location) && <span>•</span>}
              {resume.phone && <span>{resume.phone}</span>}
              {resume.phone && resume.location && <span>•</span>}
              {resume.location && <span>{resume.location}</span>}
            </div>
            <div className="flex justify-center space-x-2 mt-1 flex-wrap" style={{ fontSize: "8pt" }}>
              {resume.linkedin_url && (
                <span>{resume.linkedin_url}</span>
              )}
              {resume.github_url && <span>{resume.github_url}</span>}
              {resume.website_url && (
                <span>{resume.website_url}</span>
              )}
              {resume.twitter_url && (
                <span>{resume.twitter_url}</span>
              )}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        {resume.summary && (
          <div className="mb-3" style={{ pageBreakInside: "avoid" }}>
            <h2 className="font-bold pb-0.5 mb-1.5" style={{ 
              fontSize: "11pt", 
              color: "#1e40af", 
              borderBottom: "1px solid #3b82f6",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Professional Summary
            </h2>
            <p style={{ fontSize: "9pt", marginTop: "2px", lineHeight: "1.2" }}>
              {resume.summary}
            </p>
          </div>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <div className="mb-3" style={{ pageBreakInside: "avoid" }}>
            <h2 className="font-bold pb-0.5 mb-1.5" style={{ 
              fontSize: "11pt", 
              color: "#1e40af", 
              borderBottom: "1px solid #3b82f6",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Education
            </h2>
            {resume.education.map((edu, index) => (
              <div key={edu.id || index} className="mb-2" style={{ pageBreakInside: "avoid" }}>
                <div className="flex justify-between items-start mb-0.5">
                  <div>
                    <h3 className="font-bold text-black" style={{ fontSize: "10pt" }}>
                      {edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}
                    </h3>
                    <p style={{ color: "#1e40af", fontSize: "9pt" }}>{edu.school}</p>
                  </div>
                  <div className="text-right" style={{ fontSize: "8pt", color: "#6b7280", flexShrink: 0 }}>
                    <div>{edu.start_date} - {edu.end_date || 'Present'}</div>
                  </div>
                </div>
                {edu.gpa && (
                  <p style={{ fontSize: "9pt", marginTop: "2px", lineHeight: "1.2" }}>GPA: {edu.gpa}</p>
                )}
                {edu.description && (
                  <p style={{ fontSize: "9pt", marginTop: "2px", lineHeight: "1.2" }}>{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <div className="mb-3" style={{ pageBreakInside: "avoid" }}>
            <h2 className="font-bold pb-0.5 mb-1.5" style={{ 
              fontSize: "11pt", 
              color: "#1e40af", 
              borderBottom: "1px solid #3b82f6",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Professional Experience
            </h2>
            {resume.experience.map((exp, index) => (
              <div key={exp.id || index} className="mb-2" style={{ pageBreakInside: "avoid" }}>
                <div className="flex justify-between items-start mb-0.5">
                  <div>
                    <h3 className="font-bold text-black" style={{ fontSize: "10pt" }}>{exp.position}</h3>
                    <p style={{ color: "#1e40af", fontSize: "9pt" }}>{exp.company}</p>
                  </div>
                  <div className="text-right" style={{ fontSize: "8pt", color: "#6b7280", flexShrink: 0 }}>
                    <div>{exp.start_date} - {exp.end_date || (exp.is_current ? 'Present' : 'Present')}</div>
                    {exp.location && <div>{exp.location}</div>}
                  </div>
                </div>
                {exp.description && (
                  <div style={{ fontSize: "9pt", marginTop: "2px", lineHeight: "1.2" }}>
                    <ul style={{ margin: 0, paddingLeft: "12px" }}>
                      {exp.description.split('\n').map((line, lineIndex) => (
                        <li key={lineIndex} style={{ marginBottom: "1px" }}>
                          {line.trim().startsWith('•') ? line.substring(1).trim() : line}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <div className="mb-3" style={{ pageBreakInside: "avoid" }}>
            <h2 className="font-bold pb-0.5 mb-1.5" style={{ 
              fontSize: "11pt", 
              color: "#1e40af", 
              borderBottom: "1px solid #3b82f6",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Projects
            </h2>
            {resume.projects.map((project, index) => (
              <div key={project.id || index} className="mb-2" style={{ pageBreakInside: "avoid" }}>
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-bold text-black" style={{ fontSize: "10pt" }}>{project.name}</h3>
                  <div style={{ fontSize: "8pt", color: "#6b7280", flexShrink: 0 }}>
                    {project.start_date} - {project.end_date || 'Present'}
                  </div>
                </div>
                {project.description && (
                  <p style={{ fontSize: "9pt", marginTop: "2px", lineHeight: "1.2" }}>{project.description}</p>
                )}
                {project.technologies && (
                  <p style={{ fontSize: "9pt", marginTop: "2px", lineHeight: "1.2" }}>
                    <span className="font-bold">Technologies:</span> {project.technologies}
                  </p>
                )}
                <div style={{ fontSize: "9pt", marginTop: "2px", lineHeight: "1.2" }}>
                  {project.project_url && (
                    <span><span className="font-bold">URL:</span> {project.project_url} </span>
                  )}
                  {project.github_url && (
                    <span><span className="font-bold">GitHub:</span> {project.github_url}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <div className="mb-3" style={{ pageBreakInside: "avoid" }}>
            <h2 className="font-bold pb-0.5 mb-1.5" style={{ 
              fontSize: "11pt", 
              color: "#1e40af", 
              borderBottom: "1px solid #3b82f6",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Skills
            </h2>
            <div className="grid grid-cols-2 gap-0.5">
              {/* Group skills by category */}
              {Object.entries(
                resume.skills.reduce((acc, skill) => {
                  const category = skill.category || 'General';
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(skill);
                  return acc;
                }, {})
              ).map(([category, skills]) => (
                <div key={category} style={{ fontSize: "9pt" }}>
                  <span className="font-bold" style={{ color: "#1e40af" }}>{category}:</span> {
                    skills.map(skill => skill.name).join(', ')
                  }
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <div className="mb-3" style={{ pageBreakInside: "avoid" }}>
            <h2 className="font-bold pb-0.5 mb-1.5" style={{ 
              fontSize: "11pt", 
              color: "#1e40af", 
              borderBottom: "1px solid #3b82f6",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Certifications
            </h2>
            {resume.certifications.map((cert, index) => (
              <div key={cert.id || index} className="mb-2" style={{ pageBreakInside: "avoid" }}>
                <div className="flex justify-between items-start mb-0.5">
                  <div>
                    <h3 className="font-bold text-black" style={{ fontSize: "10pt" }}>{cert.name}</h3>
                    <p style={{ color: "#1e40af", fontSize: "9pt" }}>{cert.issuing_organization}</p>
                  </div>
                  <div style={{ fontSize: "8pt", color: "#6b7280", flexShrink: 0 }}>
                    {cert.issue_date}
                    {cert.expiration_date && ` - ${cert.expiration_date}`}
                  </div>
                </div>
                {cert.credential_id && (
                  <p style={{ fontSize: "9pt", marginTop: "2px", lineHeight: "1.2" }}>
                    Credential ID: {cert.credential_id}
                  </p>
                )}
                {cert.credential_url && (
                  <p style={{ fontSize: "9pt", marginTop: "2px", lineHeight: "1.2" }}>
                    URL: {cert.credential_url}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {resume.achievements && resume.achievements.length > 0 && (
          <div className="mb-3" style={{ pageBreakInside: "avoid" }}>
            <h2 className="font-bold pb-0.5 mb-1.5" style={{ 
              fontSize: "11pt", 
              color: "#1e40af", 
              borderBottom: "1px solid #3b82f6",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Achievements
            </h2>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
              {resume.achievements.map((achievement, index) => (
                <li key={achievement.id || index} style={{ marginBottom: "6px", fontSize: "9pt" }}>
                  <div className="flex justify-between items-start">
                    <div>
                      {achievement.date_achieved && (
                        <span className="float-right" style={{ color: "#6b7280", fontSize: "8pt" }}>
                          {achievement.date_achieved}
                        </span>
                      )}
                      <span className="font-bold text-black">{achievement.title}</span>
                      {achievement.organization && (
                        <span style={{ color: "#1e40af" }}> - {achievement.organization}</span>
                      )}
                      {achievement.description && (
                        <div style={{ marginTop: "1px", marginLeft: "10px" }}>{achievement.description}</div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      </div>
    );
  }, [resume]); // Dependency on resume to trigger re-render when data changes

  return previewContent;
};

export default ResumePreview;
