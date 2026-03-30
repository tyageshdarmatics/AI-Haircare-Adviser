import React from 'react';
import { CheckIcon } from './Icons';

interface StepIndicatorProps {
  currentStep: number;
}
const steps = [
  { id: 1, name: 'Start', description: 'Tell me a bit about yourself!' },
  { id: 2, name: 'Health Questionnaire', description: 'Complete a health questionnaire.' },
  { id: 3, name: 'Hair & Scalp Analysis', description: 'Upload photos for AI analysis.' },
  { id: 4, name: 'Your Goals', description: 'Select your desired outcomes.' },
  { id: 5, name: 'Your Plan', description: 'Receive your personalized routine.' },
  { id: 6, name: 'AI Doctor\'s Report', description: 'Review a summary of your results.' },
  { id: 7, name: 'AI Assistant', description: 'Ask questions about your plan.' },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
    return (
        <nav aria-label="Progress">
            <ol role="list" className="overflow-hidden">
                {steps.map((step, stepIdx) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;

                    return (
                        <li key={step.name} className="relative pb-10">
                            {stepIdx !== steps.length - 1 ? (
                                <div className={`absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 ${isCompleted ? 'bg-brand-primary' : 'bg-slate-300'}`} />
                            ) : null}
                            <div className="relative flex items-start">
                                <span className="flex h-9 items-center">
                                    <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                                        isCompleted ? 'bg-brand-primary' : isCurrent ? 'border-2 border-brand-primary bg-brand-surface' : 'border-2 border-slate-300 bg-brand-surface'
                                    }`}>
                                        {isCompleted ? (
                                            <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                        ) : isCurrent ? (
                                            <span className="h-2.5 w-2.5 rounded-full bg-brand-primary" />
                                        ) : (
                                            <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                                        )}
                                    </span>
                                </span>
                                <span className="ml-4 flex min-w-0 flex-col">
                                    <span className={`text-sm font-semibold ${isCurrent ? 'text-brand-primary' : 'text-brand-text-main'}`}>{step.name}</span>
                                    <span className="text-xs text-brand-text-muted">{step.description}</span>
                                    {isCurrent && (
                                        <span className="mt-1 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                            In Progress
                                        </span>
                                    )}
                                    {isCompleted && (
                                         <span className="mt-1 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                            Completed
                                        </span>
                                    )}
                                     {!isCurrent && !isCompleted && (
                                         <span className="mt-1 inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
                                            Pending
                                        </span>
                                    )}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default StepIndicator;