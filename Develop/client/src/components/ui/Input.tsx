import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  children: React.ReactNode;
}

const baseInputClasses =
  'w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 ' +
  'focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-forest-500 ' +
  'placeholder:text-gray-400 transition-colors duration-150';

export function Input({ label, error, wrapperClassName = '', className = '', ...rest }: InputProps) {
  return (
    <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        className={`${baseInputClasses} ${error ? 'border-red-400 focus:ring-red-400' : ''} ${className}`}
        {...rest}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, wrapperClassName = '', className = '', ...rest }: TextareaProps) {
  return (
    <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <textarea
        className={`${baseInputClasses} resize-none ${error ? 'border-red-400 focus:ring-red-400' : ''} ${className}`}
        {...rest}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Select({ label, error, wrapperClassName = '', className = '', children, ...rest }: SelectProps) {
  return (
    <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <select
        className={`${baseInputClasses} ${error ? 'border-red-400 focus:ring-red-400' : ''} ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
