import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, id, containerClassName = '', className = '', ...props }) => {
  return (
    <div className={containerClassName}>
      {label && <label htmlFor={id} className="block text-sm font-semibold text-brand-text-main mb-2">{label}</label>}
      <input
        id={id}
        className={`block w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-brand-text-main placeholder-slate-400 focus:ring-2 focus:ring-brand-primary-light focus:border-brand-primary-light transition-all shadow-sm hover:border-slate-400 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;