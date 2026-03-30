import React from 'react';
import { ChevronDownIcon } from '../Icons';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, children, id, className, ...props }) => {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-semibold text-brand-text-main mb-2">{label}</label>}
       <div className="relative">
        <select
          id={id}
          className={`
            custom-select-options block w-full appearance-none bg-white text-brand-text-main border border-slate-300 
            rounded-lg py-2.5 px-4 pr-10 focus:ring-2 focus:ring-brand-primary-light focus:border-brand-primary-light 
            transition-all shadow-sm hover:border-slate-400 ${props.value ? '' : 'text-slate-400'} ${className || ''}
          `}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default Select;