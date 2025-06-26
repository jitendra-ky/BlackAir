import React from "react";
import { useParams, Link } from "react-router-dom";
import { useResume } from "../hooks/useResume";
import Layout from "../components/layout/Layout";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ResumePreview from "../components/resume/ResumePreview";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const ResumePreviewPage = () => {
  const { id } = useParams();
  const { resume, loading } = useResume(id);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-16">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Loading resume...</span>
        </div>
      </Layout>
    );
  }

  if (!resume) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Resume not found
          </h2>
          <p className="text-gray-600 mb-4">
            The resume you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to={`/resume/${id}/edit`}
              className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Editor
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {resume.title || "Resume Preview"}
            </h1>
            <div className="w-24"></div> {/* Spacer for center alignment */}
          </div>

          {/* Preview Container */}
          <div
            className="bg-white shadow-lg rounded-lg overflow-hidden mx-auto"
            style={{
              aspectRatio: "210/297", // A4 aspect ratio
              maxWidth: "100%",
              width: "min(100%, 800px)", // Responsive width with max limit
            }}
          >
            <div className="w-full h-full overflow-hidden">
              <ResumePreview resume={resume} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResumePreviewPage;
