import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const ResumeEditorPage = () => {
  const { id } = useParams();

  return (
    <Layout>
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Resume Editor</h1>
        <p className="text-gray-600">Resume ID: {id}</p>
        <p className="text-sm text-gray-500 mt-2">
          This is a placeholder for the resume editor. The full editor will be implemented next.
        </p>
      </div>
    </Layout>
  );
};

export default ResumeEditorPage;
