import React from "react";

const ResumePreview = ({ resume }) => {
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
          {resume.full_name || "Your Name"}
        </h1>
        <div className="text-sm text-gray-700 space-y-1">
          {resume.email && <div>{resume.email}</div>}
          {resume.phone && <div>{resume.phone}</div>}
          {resume.location && <div>{resume.location}</div>}
          <div className="flex justify-center space-x-4 mt-2">
            {resume.linkedin_url && (
              <span>LinkedIn: {resume.linkedin_url}</span>
            )}
            {resume.github_url && <span>GitHub: {resume.github_url}</span>}
            {resume.portfolio_url && (
              <span>Portfolio: {resume.portfolio_url}</span>
            )}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
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
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree}{" "}
                    {edu.field_of_study && `in ${edu.field_of_study}`}
                  </h3>
                  <p className="text-sm text-gray-700">{edu.institution}</p>
                </div>
                <div className="text-sm text-gray-600">
                  {edu.start_date} - {edu.end_date || "Present"}
                </div>
              </div>
              {edu.gpa && (
                <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
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
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {exp.job_title}
                  </h3>
                  <p className="text-sm text-gray-700">{exp.company}</p>
                </div>
                <div className="text-sm text-gray-600">
                  {exp.start_date} - {exp.end_date || "Present"}
                </div>
              </div>
              {exp.location && (
                <p className="text-sm text-gray-600">{exp.location}</p>
              )}
              {exp.description && (
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                  {exp.description}
                </p>
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
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                <div className="text-sm text-gray-600">
                  {project.start_date} - {project.end_date || "Present"}
                </div>
              </div>
              {project.description && (
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                  {project.description}
                </p>
              )}
              {project.technologies && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Technologies:</span>{" "}
                  {project.technologies}
                </p>
              )}
              {project.url && (
                <p className="text-sm text-blue-600 mt-1">
                  <span className="font-medium">URL:</span> {project.url}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-400 mb-2">
            TECHNICAL SKILLS
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {resume.skills.map((skill, index) => (
              <div key={index} className="text-sm text-gray-700">
                <span className="font-medium">{skill.category}:</span>{" "}
                {skill.skills}
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
            <div key={index} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-sm text-gray-700">
                    {cert.issuing_organization}
                  </p>
                </div>
                <div className="text-sm text-gray-600">{cert.date_earned}</div>
              </div>
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
              <li key={index} className="text-sm text-gray-700">
                • {achievement.title} - {achievement.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
