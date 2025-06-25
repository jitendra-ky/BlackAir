import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const CreateResumeModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Resume title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onCreate({ title: title.trim() });
      setTitle('');
    } catch (error) {
      setError('Failed to create resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Resume">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Resume Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          placeholder="e.g., Software Developer Resume"
          required
          error={error}
        />
        
        <p className="text-sm text-gray-600">
          Give your resume a descriptive name to help you identify it later.
        </p>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading || !title.trim()}
          >
            Create Resume
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateResumeModal;
