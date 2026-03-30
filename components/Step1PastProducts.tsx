
import React from 'react';
import { RefreshCw, X, CheckIcon } from './Icons';
import Button from './common/Button';

interface Step1PastProductsProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  onReset: () => void;
}

const steps = [
  { id: 1, name: 'Start', description: 'Tell me a bit about yourself!' },
  { id: 2, name: 'Gender', description: 'Select your gender to continue.' },
  { id: 3, name: 'Health Questionnaire', description: 'Complete a health questionnaire.' },
  { id: 4, name: 'Hair & Scalp Analysis', description: 'Upload photos for AI analysis.' },
  { id: 5, name: 'Your Goals', description: 'Select your desired outcomes.' },
  { id: 6, name: 'Your Plan', description: 'Receive your personalized routine.' },
  { id: 7, name: "Doctor's Report", description: 'Review a summary of your results.' },
  { id: 8, name: 'AI Assistant', description: 'Ask questions about your plan.' },
];

const Step1PastProducts: React.FC<Step1PastProductsProps> = ({ isOpen, onClose, currentStep, onReset }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-xs bg-slate-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
            <h2 id="mobile-menu-title" className="text-lg font-bold text-slate-900">
                Progress
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="!p-2 !rounded-full">
              <X className="w-6 h-6" />
            </Button>
          </header>

          <div className="flex-grow overflow-y-auto p-6">
             <ol className="relative">
              {steps.map((step, stepIdx) => {
                const isCurrent = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                let circleClass = 'border-slate-300 bg-white';
                if (isCurrent) circleClass = 'border-brand-primary bg-brand-primary';
                if (isCompleted) circleClass = 'border-green-500 bg-green-500';
                
                let lineClass = 'border-slate-200';
                if (isCompleted) lineClass = 'border-green-500';


                return (
                  <li key={step.name} className="pb-4 last:pb-0 relative">
                    <div className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${circleClass}`}>
                           {isCompleted ? (
                             <CheckIcon className="w-5 h-5 text-white" />
                          ) : isCurrent ? (
                             <div className="w-3 h-3 bg-white rounded-full"></div>
                          ) : null}
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className={`font-bold transition-colors duration-300 ${isCurrent ? 'text-brand-primary' : 'text-slate-800'}`}>{step.name}</p>
                        <p className="text-xs text-slate-500">{step.description}</p>
                        {isCompleted ? (
                          <span className="mt-1 inline-flex items-center rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                            Completed
                          </span>
                        ) : isCurrent ? (
                          <span className="mt-1 inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                            In Progress
                          </span>
                        ) : (
                          <span className="mt-1 inline-flex items-center rounded-md bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                    {stepIdx !== steps.length - 1 && (
                      <div className={`absolute top-10 left-3.5 h-full w-px border-l-2 border-dashed transition-colors duration-300 ${lineClass}`}></div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
           <footer className="p-4 border-t border-slate-200 bg-white">
                <Button onClick={onReset} variant="primary" size="sm" className="w-full gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Start Over
                </Button>
            </footer>
        </div>
      </div>
    </>
  );
};

export default Step1PastProducts;
