
import React from 'react';
import { RefreshCw, CheckIcon } from './Icons';
import Button from './common/Button';

interface SidebarProps {
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

const Sidebar: React.FC<SidebarProps> = ({ currentStep, onReset }) => {
  return (
    <aside className="bg-white p-6 rounded-2xl shadow-lg flex flex-col h-full">
       <div className="flex-1">
        <ol className="relative">
          {steps.map((step, stepIdx) => {
            const isCurrent = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            let circleClass = 'border-slate-300 bg-white';
            if (isCurrent) circleClass = 'border-brand-primary bg-brand-primary';
            if (isCompleted) circleClass = 'border-brand-primary bg-brand-primary';
            
            let lineClass = 'border-slate-200';
            if (isCompleted) lineClass = 'border-brand-primary';


            return (
              <li key={step.name} className="pb-4 last:pb-0 relative">
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${circleClass}`}>
                      {isCompleted ? (
                         <CheckIcon className="w-4 h-4 text-white" />
                      ) : isCurrent ? (
                         <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                      ) : null}
                    </div>
                  </div>
                  <div className="pt-0 -mt-1">
                    <p className={`font-bold text-sm transition-colors duration-300 ${isCurrent ? 'text-brand-primary' : 'text-slate-800'}`}>{step.name}</p>
                    <p className="text-xs text-slate-500">{step.description}</p>
                    {isCompleted ? (
                       <span className="mt-1 inline-flex items-center rounded-md bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-800">
                        Completed
                      </span>
                    ) : isCurrent ? (
                      <span className="mt-1 inline-flex items-center rounded-md bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800">
                        In Progress
                      </span>
                    ) : (
                      <span className="mt-1 inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-500">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
                {stepIdx !== steps.length - 1 && (
                  <div className={`absolute top-8 left-[11px] h-full w-px border-l-2 border-dashed transition-colors duration-300 ${lineClass}`}></div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <div className="mt-auto pt-6">
        <Button onClick={onReset} variant="primary" size="sm" className="w-full gap-2 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            <RefreshCw className="w-4 h-4" />
            Start Over
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
