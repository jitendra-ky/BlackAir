import React from 'react';
import { classNames } from '../../utils/helpers';

const Textarea = ({
  label,
  error,
  required = false,
  className = '',
  containerClassName = '',
  rows = 4,
  ...props
}) => {
  const textareaClasses = classNames(
    'w-full px-3 py-2 border rounded-lg text-sm transition-colors resize-vertical',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    error
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300',
    props.disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
    className
  );

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={textareaClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Textarea;
