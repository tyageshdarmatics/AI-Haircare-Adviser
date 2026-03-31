import React, { useState } from 'react';
import { HairProfileData } from '../types';
import Button from './common/Button';
import { ArrowLeftIcon, ArrowRightIcon } from './Icons';

interface Step2GenderProps {
  onNext: () => void;
  onBack: () => void;
  setHairProfileData: React.Dispatch<React.SetStateAction<Partial<HairProfileData>>>;
  hairProfileData: Partial<HairProfileData>;
}

const Step2UserInfo: React.FC<Step2GenderProps> = ({ onNext, onBack, setHairProfileData, hairProfileData }) => {
  const [gender, setGender] = useState<string | null>(hairProfileData.gender || null);

  const handleNext = () => {
    if (gender) {
      setHairProfileData(prev => ({ ...prev, gender }));
      onNext();
    }
  };

  return (
    <div className="animate-fade-in-up flex flex-col w-full lg:h-full bg-white rounded-2xl border-2 border-slate-300">
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-xl mx-auto">
          <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Please select a concern to begin.</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div
                  onClick={() => setGender('Male')}
                  className={`
                  rounded-2xl p-4 cursor-pointer transition-all duration-300 w-full sm:w-64
                  border-2 
                  ${gender === 'Male'
                      ? 'border-blue-500 bg-white shadow-interactive-hover scale-105'
                      : 'border-slate-300 bg-white hover:border-blue-400 hover:shadow-lifted'
                  }
                  `}
              >
                  <div className="relative flex flex-col items-center">
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                      ${gender === 'Male' ? 'border-blue-500 bg-white' : 'border-slate-400 bg-white'}
                  ">
                      {gender === 'Male' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                  </div>
                  <div className="w-28 h-28 sm:w-32 sm:h-32 my-2">
                      <img src="/male-illustration.png" alt="Male illustration" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">Male</h3>
                  </div>
              </div>

              <div
                  onClick={() => setGender('Female')}
                  className={`
                  rounded-2xl p-4 cursor-pointer transition-all duration-300 w-full sm:w-64
                  border-2 
                  ${gender === 'Female'
                      ? 'border-blue-500 bg-white shadow-interactive-hover scale-105'
                      : 'border-slate-300 bg-white hover:border-blue-400 hover:shadow-lifted'
                  }
                  `}
              >
                  <div className="relative flex flex-col items-center">
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                      ${gender === 'Female' ? 'border-blue-500 bg-white' : 'border-slate-400 bg-white'}
                  ">
                      {gender === 'Female' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                  </div>
                  <div className="w-28 h-28 sm:w-32 sm:h-32 my-2">
                      <img src="/female-illustration.png" alt="Female illustration" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">Female</h3>
                  </div>
              </div>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 flex justify-between p-6 border-t border-slate-200">
        <Button onClick={onBack} variant="ghost" size="md" className="gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            Previous
        </Button>
        <Button
            onClick={handleNext}
            disabled={!gender}
            size="md"
            className="gap-2 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
            Next
            <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step2UserInfo;