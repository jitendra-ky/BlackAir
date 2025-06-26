import React, { useMemo } from "react";

const ResumePreview = ({ resume }) => {
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
      <div
        className="bg-white p-8 shadow-lg"
        style={{ fontFamily: "Times New Roman, serif" }}
      >
        {/* Header Section */}
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {resume.name || "Your Name"}
          </h1>
          {resume.professional_title && (
            <h2 className="text-lg text-gray-700 mb-3">{resume.professional_title}</h2>
          )}
          <div className="text-sm text-gray-700 space-y-1">
            {resume.email && <div>{resume.email}</div>}
            {resume.phone && <div>{resume.phone}</div>}
            {resume.location && <div>{resume.location}</div>}
            <div className="flex justify-center space-x-4 mt-2 flex-wrap">
              {resume.linkedin_url && (
                <span>LinkedIn: {resume.linkedin_url}</span>
              )}
              {resume.github_url && <span>GitHub: {resume.github_url}</span>}
              {resume.website_url && (
                <span>Website: {resume.website_url}</span>
              )}
              {resume.twitter_url && (
                <span>Twitter: {resume.twitter_url}</span>
              )}
            </div>
          </div>
        </div>

        {/* Professional Summary - Note: This field doesn't exist in the backend model yet */}
        {resume.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-400 mb-2">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {resume.summary}
            </p>
          </div>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-400 mb-2">
              EDUCATION
            </h2>
            {resume.education.map((edu, index) => (
              <div key={edu.id || index} className="mb-3 last:mb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}
                    </h3>
                    <p className="text-gray-700">{edu.school}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>{edu.start_date} - {edu.end_date || 'Present'}</div>
                  </div>
                </div>
                {edu.gpa && (
                  <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
                )}
                {edu.description && (
                  <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-400 mb-2">
              PROFESSIONAL EXPERIENCE
            </h2>
            {resume.experience.map((exp, index) => (
              <div key={exp.id || index} className="mb-4 last:mb-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>{exp.start_date} - {exp.end_date || (exp.is_current ? 'Present' : 'Present')}</div>
                    {exp.location && <div>{exp.location}</div>}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-sm text-gray-700 mt-2">
                    {exp.description.split('\n').map((line, lineIndex) => (
                      <div key={lineIndex} className="mb-1">
                        {line.trim().startsWith('•') ? line : `• ${line}`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-400 mb-2">
              PROJECTS
            </h2>
            {resume.projects.map((project, index) => (
              <div key={project.id || index} className="mb-3 last:mb-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <div className="text-sm text-gray-600">
                    {project.start_date} - {project.end_date || 'Present'}
                  </div>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                )}
                {project.technologies && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Technologies:</span> {project.technologies}
                  </p>
                )}
                <div className="text-sm text-gray-600 mt-1 space-x-4">
                  {project.project_url && (
                    <span><span className="font-medium">URL:</span> {project.project_url}</span>
                  )}
                  {project.github_url && (
                    <span><span className="font-medium">GitHub:</span> {project.github_url}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-400 mb-2">
              SKILLS
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {/* Group skills by category */}
              {Object.entries(
                resume.skills.reduce((acc, skill) => {
                  const category = skill.category || 'General';
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(skill);
                  return acc;
                }, {})
              ).map(([category, skills]) => (
                <div key={category} className="text-sm text-gray-700">
                  <span className="font-medium">{category}:</span> {
                    skills.map(skill => skill.name).join(', ')
                  }
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-400 mb-2">
              CERTIFICATIONS
            </h2>
            {resume.certifications.map((cert, index) => (
              <div key={cert.id || index} className="mb-2 last:mb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    <p className="text-gray-700">{cert.issuing_organization}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {cert.issue_date}
                    {cert.expiration_date && ` - ${cert.expiration_date}`}
                  </div>
                </div>
                {cert.credential_id && (
                  <p className="text-sm text-gray-600 mt-1">
                    Credential ID: {cert.credential_id}
                  </p>
                )}
                {cert.credential_url && (
                  <p className="text-sm text-gray-600 mt-1">
                    URL: {cert.credential_url}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {resume.achievements && resume.achievements.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-400 mb-2">
              ACHIEVEMENTS
            </h2>
            <ul className="space-y-1">
              {resume.achievements.map((achievement, index) => (
                <li key={achievement.id || index} className="text-sm text-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">• {achievement.title}</span>
                      {achievement.organization && (
                        <span className="text-gray-600"> - {achievement.organization}</span>
                      )}
                      <p className="text-gray-700 mt-1 ml-3">{achievement.description}</p>
                    </div>
                    {achievement.date_achieved && (
                      <div className="text-sm text-gray-600 ml-2">
                        {achievement.date_achieved}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }, [resume]); // Dependency on resume to trigger re-render when data changes

  return previewContent;
};

export default ResumePreview;
