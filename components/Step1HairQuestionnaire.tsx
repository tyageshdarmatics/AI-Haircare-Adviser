import React, { useState } from 'react';
import { HairProfileData } from '../types';
import { maleQuestions, femaleQuestions } from './questionnaireData';
import Button from './common/Button';
import { ArrowLeftIcon, ArrowRightIcon, User, CheckIcon } from './Icons';

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
  hairProfileData: Partial<HairProfileData>;
  setHairProfileData: React.Dispatch<React.SetStateAction<Partial<HairProfileData>>>;
}

const Step2HealthQuestionnaire: React.FC<Step2Props> = ({
  onNext,
  onBack,
  hairProfileData,
  setHairProfileData,
}) => {
  const [formData, setFormData] = useState<Partial<HairProfileData>>(hairProfileData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questions = hairProfileData.gender === 'Female' ? femaleQuestions : maleQuestions;
  const currentQuestion = questions[currentQuestionIndex];

  const handleChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setHairProfileData(formData);
      onNext();
    }
  };
  
  const handleSingleChoiceAndProceed = (name: string, value: string) => {
    handleChange(name, value);
    setTimeout(() => {
      handleNextQuestion();
    }, 300);
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const isCurrentOptionSelected = () => {
    if (!currentQuestion) return false;
    const value = formData[currentQuestion.key as keyof HairProfileData];
    if (currentQuestion.type === 'multiple') {
      return Array.isArray(value) && value.length > 0;
    }
    return !!value;
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!hairProfileData.gender) {
     return (
      <div className="animate-fade-in-up flex flex-col w-full h-full items-center justify-center p-8">
          <p className="text-red-600">Gender not selected. Please go back.</p>
          <Button onClick={onBack} variant="primary" size="md" className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up flex flex-col w-full lg:h-full bg-white rounded-2xl border-2 border-slate-300">
      <div className="flex-grow overflow-y-auto p-6 sm:p-8 lg:p-10">
        <div className="mb-8">
            <span className="text-sm font-bold text-slate-700">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        {currentQuestion.key === 'hairlossImageMale' && (
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-800">Hair Health</h3>
            <p className="text-slate-500">Good hair, don’t care — because it’s healthy!</p>
          </div>
        )}

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">{currentQuestion.question}</h2>

        {currentQuestion.type === 'rich-single' && (
          <div className="space-y-3">
            {currentQuestion.richOptions.map((option) => {
              const isSelected = formData[currentQuestion.key as keyof HairProfileData] === option.label;
              return (
                <button
                  key={option.label}
                  onClick={() => handleSingleChoiceAndProceed(currentQuestion.key, option.label)}
                   className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all flex items-center gap-4 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${isSelected ? 'border-blue-600' : 'border-slate-400'}`}>
                    {isSelected && <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>}
                  </span>
                  <img src={option.image} alt={option.label} className="w-12 h-12 rounded-full object-cover bg-white p-1 border border-slate-200" />
                  <span className={`font-medium ${isSelected ? 'text-slate-800' : 'text-slate-700'}`}>{option.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {currentQuestion.type === 'image-radio' && (
          <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 md:space-y-0">
            {currentQuestion.imageOptions.map((option) => {
              const isSelected = formData[currentQuestion.key as keyof HairProfileData] === option.label;
              return (
                <button
                  key={option.label}
                  onClick={() => handleSingleChoiceAndProceed(currentQuestion.key, option.label)}
                  className={`
                    w-full text-left p-3 rounded-xl border-2 transition-all duration-300
                    flex items-center justify-between gap-4 
                    md:flex-col md:justify-center md:items-center md:h-44 md:p-4 md:relative 
                    ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md scale-105' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md hover:-translate-y-1'}
                  `}
                >
                  {/* Div for radio & label. Reordered on desktop. */}
                  <div className="flex items-center gap-4 md:order-2 md:mt-2">
                    {/* Radio button - absolute on desktop */}
                    <span className={`
                      w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all 
                      md:absolute md:top-3 md:left-3 
                      ${isSelected ? 'border-blue-600' : 'border-slate-400'}
                    `}>
                      {isSelected && <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>}
                    </span>
                    <span className={`font-semibold text-sm md:text-base ${isSelected ? 'text-slate-800' : 'text-slate-700'}`}>{option.label}</span>
                  </div>
                  
                  <img 
                    src={option.image} 
                    alt={option.label} 
                    className="
                      h-12 object-contain flex-shrink-0 
                      md:h-20 md:order-1 md:flex-shrink-0
                    " 
                  />
                </button>
              );
            })}
          </div>
        )}


        {currentQuestion.type === 'single' && (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = formData[currentQuestion.key as keyof HairProfileData] === option;
              return (
                <button
                  key={option}
                  onClick={() => handleSingleChoiceAndProceed(currentQuestion.key, option)}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-all flex items-center gap-4 ${isSelected ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-300 bg-white hover:border-slate-400'}`}
                >
                  <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${isSelected ? 'border-blue-600' : 'border-slate-400'}`}>
                    {isSelected && <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>}
                  </span>
                  <span className={`font-medium ${isSelected ? 'text-slate-800' : 'text-slate-700'}`}>{option}</span>
                </button>
              )
            })}
          </div>
        )}

        {currentQuestion.type === 'multiple' && (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const currentSelection = (formData[currentQuestion.key as keyof HairProfileData] as string[]) || [];
              const isSelected = currentSelection.includes(option);
              
              const handleOptionClick = () => {
                const exclusiveOptions = ["None of the above", "None"];
                const isExclusive = exclusiveOptions.includes(option);
                
                if (isExclusive) {
                    const newSelection = isSelected ? [] : [option];
                    handleChange(currentQuestion.key, newSelection);
                } else {
                    let newSelection;
                    if (isSelected) {
                        newSelection = currentSelection.filter((item) => item !== option);
                    } else {
                        const nonExclusiveSelections = currentSelection.filter(item => !exclusiveOptions.includes(item));
                        newSelection = [...nonExclusiveSelections, option];
                    }
                    handleChange(currentQuestion.key, newSelection);
                }
              };

              return (
                <button
                  key={option}
                  onClick={handleOptionClick}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-all flex items-center gap-4 ${isSelected ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-300 bg-white hover:border-slate-400'}`}
                >
                  <span className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-400'}`}>
                    {isSelected && <CheckIcon className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </span>
                  <span className={`font-medium ${isSelected ? 'text-slate-800' : 'text-slate-700'}`}>{option}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 flex justify-between p-6 border-t border-slate-200">
        <Button onClick={handlePrevQuestion} variant="ghost" size="md" className="gap-2">
          <ArrowLeftIcon className="w-4 h-4" />
          Previous
        </Button>
        {currentQuestion.type === 'multiple' && (
            <Button onClick={handleNextQuestion} disabled={!isCurrentOptionSelected()} size="md" className="gap-2 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            Next
            <ArrowRightIcon className="w-4 h-4" />
            </Button>
        )}
      </div>
    </div>
  );
};

export default Step2HealthQuestionnaire;